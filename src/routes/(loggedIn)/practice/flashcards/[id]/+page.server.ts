import { FlashCard } from '$lib/controllers/Flashcard.js';
import { PracticeHistory } from '$lib/controllers/PracticeHistory.js';
import { error } from '@sveltejs/kit';

export const load = async ({ params, locals: { user } }) => {
	if (!params.id) return error(404);

	const flashcard = await FlashCard.getFlashCard({
		userID: user!.id,
		flashCardID: params.id
	});

	if (!flashcard) return error(404);

	const history = await PracticeHistory.getHistory({
		userID: user!.id,
		flashCardID: params.id
	});

	return {
		flashcard,
		history
	};
};
