import { Points } from '$lib/controllers/Points.js';
import { PracticeHistory } from '$lib/controllers/PracticeHistory.js';
import { Quiz, type QuizCreateAPIInput, type QuizCreateAPIOutput } from '$lib/controllers/Quiz';
import { getErrorIfString, XP, type APIReturnType } from '$lib/util';
import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals: { user } }) => {
	const inp: QuizCreateAPIInput = await request.json();

	if (!inp.noteID)
		return json({
			success: false,
			message: 'noteID is required'
		} satisfies APIReturnType<string>);

	try {
		const quizID = await Quiz.generateQuizFromNote({
			noteID: inp.noteID,
			userID: user!.id
		});

		return json({
			success: true,
			data: {
				quizID: quizID.id
			}
		} satisfies APIReturnType<QuizCreateAPIOutput>);
	} catch (error) {
		console.error(error);

		return json({
			success: false,
			message: getErrorIfString(error, 'An error occurred while generating the quiz')
		} satisfies APIReturnType<string>);
	}
};

export const DELETE = async ({ request, locals: { user } }) => {
	const data = await request.json();

	const quizID = data.id;

	if (!quizID)
		return json({
			success: false,
			message: 'id is required'
		} satisfies APIReturnType<string>);

	try {
		await Quiz.deleteQuiz({
			quizID,
			userID: user!.id
		});

		return json({
			success: true,
			data: undefined
		} satisfies APIReturnType<undefined>);
	} catch (error) {
		console.error(error);

		return json({
			success: false,
			message: getErrorIfString(error, 'An error occurred while deleting the quiz')
		} satisfies APIReturnType<string>);
	}
};

export const PATCH = async ({ request, locals: { user } }) => {
	const data = await request.json();

	const quizID = data.id;
	const score = parseInt(data.score);

	if (!quizID || typeof score !== 'number') {
		return json({
			success: false,
			message: 'id and score are required'
		} satisfies APIReturnType<string>);
	}

	await PracticeHistory.addQuiz({
		userID: user!.id,
		quizID,
		score
	});

	await Points.addPointsPerDay({
		points: score > 50 ? XP.QUIZ_COMPLETED : 0,
		userID: user!.id
	});

	await Quiz.setPoints({
		quizID,
		points: score,
		userID: user!.id
	});

	return json({
		success: true,
		data: undefined
	} satisfies APIReturnType<undefined>);
};
