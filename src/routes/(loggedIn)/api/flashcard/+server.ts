import { FlashCard } from '$lib/controllers/Flashcard.js';
import { Points } from '$lib/controllers/Points.js';
import { PracticeHistory } from '$lib/controllers/PracticeHistory.js';
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

export const DELETE = async ({ request, locals: { user } }) => {
	const inp = await request.json();

	if (!inp.id)
		return json({
			success: false,
			message: 'id is required'
		} satisfies APIReturnType<string>);

	try {
		await FlashCard.deleteFlashCard({
			userID: user!.id,
			flashCardID: inp.id
		});

		return json({
			success: true,
			data: undefined
		} satisfies APIReturnType<undefined>);
	} catch (error) {
		console.error(error);

		return json({
			success: false,
			message: getErrorIfString(error, 'An error occurred while deleting the flashcard')
		} satisfies APIReturnType<string>);
	}
};

export const PATCH = async ({ request, locals: { user } }) => {
	const data = await request.json();

	const id = data.id;

	if (!id) {
		return json({
			success: false,
			message: 'id required'
		} satisfies APIReturnType<string>);
	}

	await PracticeHistory.addFlashCard({
		userID: user!.id,
		flashCardID: id
	});

	await Points.addPointsPerDay({
		points: 1,
		userID: user!.id
	});

	return json({
		success: true,
		data: undefined
	} satisfies APIReturnType<undefined>);
};
