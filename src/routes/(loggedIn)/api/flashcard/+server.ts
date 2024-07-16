import { FlashCard } from '$lib/controllers/Flashcard.js';
import { getErrorIfString, type APIReturnType } from '$lib/util';
import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals: { user } }) => {
	const inp = await request.json();

	if (!inp.noteID)
		return json({
			success: false,
			message: 'noteID is required'
		} satisfies APIReturnType<string>);

	try {
		const flashcard = await FlashCard.generateFlashCard({
			noteID: inp.noteID,
			userID: user!.id
		});

		return json({
			success: true,
			data: flashcard.id
		} satisfies APIReturnType<string>);
	} catch (error) {
		console.error(error);

		return json({
			success: false,
			message: getErrorIfString(error, 'An error occurred while generating the flashcard')
		} satisfies APIReturnType<string>);
	}
};
