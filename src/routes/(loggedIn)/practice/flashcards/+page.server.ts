import { FlashCard } from '$lib/controllers/Flashcard.js';

export const load = async ({ locals: { user }, depends }) => {
	depends('flashcard:items');

	return {
		flashcards: await FlashCard.getFlashCards({
			userID: user!.id
		})
	};
};
