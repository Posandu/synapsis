import { Quiz } from '$lib/controllers/Quiz.js';
import { error } from '@sveltejs/kit';

export const load = async ({ params: { id }, locals: { user } }) => {
	const quiz = await Quiz.getQuiz({ quizID: id, userID: user!.id });

	if (!quiz) return error(404, 'Quiz not found');

	return { quiz };
};
