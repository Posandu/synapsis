import { Points } from '$lib/controllers/Points.js';
import { Quiz } from '$lib/controllers/Quiz.js';
import { XP } from '$lib/util.js';
import { error } from '@sveltejs/kit';

export const load = async ({ params: { id }, locals: { user } }) => {
	const quiz = await Quiz.getQuiz({ quizID: id, userID: user!.id });

	if (!quiz) return error(404, 'Quiz not found');

	await Points.addPointsPerDay({
		points: XP.QUIZ,
		userID: user!.id
	});

	return { quiz };
};
