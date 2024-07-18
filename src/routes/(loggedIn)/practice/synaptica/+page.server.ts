import { Chat as ChatController } from '$lib/controllers/Chat';
import type { Chat } from '@prisma/client';
import { error } from '@sveltejs/kit';

export const load = async ({ locals: { user }, url }) => {
	const params = url.searchParams;

	const outData: {
		chats: Awaited<ReturnType<typeof ChatController.getChats>>;
		chat?: Chat;
	} = {
		chats: await ChatController.getChats({ userID: user!.id }),
		chat: undefined
	};

	const chatID = params.get('c');

	if (chatID) {
		const chat = await ChatController.getChat({ userID: user!.id, chatID });

		if (!chat) {
			return error(404);
		}

		outData.chat = chat;
	}

	return outData;
};
