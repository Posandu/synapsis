import { Quiz } from '$lib/controllers/Quiz.js';

export const load = async ({ locals: { user }, depends }) => {
	depends('quiz:items');

	return {
		quizzes: await Quiz.getQuizzes(user!.id)
	};
};