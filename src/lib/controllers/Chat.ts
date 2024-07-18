import prisma from '$lib/server/prisma';

class Chat {
	static async createChat({
		userID,
		data
	}: {
		userID: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		data: any;
	}) {
		return await prisma.chat.create({
			data: {
				data,
				user: { connect: { id: userID } },
				title: 'Untitled Chat'
			}
		});
	}

	static async getChat({ chatID, userID }: { chatID: string; userID: string }) {
		return await prisma.chat.findFirst({
			where: {
				id: chatID,
				user: { id: userID }
			}
		});
	}

	static async getChats({ userID }: { userID: string }) {
		return await prisma.chat.findMany({
			where: {
				user: { id: userID }
			},
			select: {
				id: true,
				createdAt: true,
				title: true
			},
			orderBy: {
				createdAt: 'desc'
			}
		});
	}

	static async updateChat({
		chatID,
		userID,
		data
	}: {
		chatID: string;
		userID: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		data: any;
	}) {
		return await prisma.chat.update({
			where: {
				id: chatID,
				user: { id: userID }
			},
			data: {
				data
			}
		});
	}

	static async deleteChat({ chatID, userID }: { chatID: string; userID: string }) {
		return await prisma.chat.delete({
			where: {
				id: chatID,
				user: { id: userID }
			}
		});
	}
}

export { Chat };
