import { Quiz } from '$lib/controllers/Quiz.js';

export const load = async ({ locals: { user } }) => {
	return {
		quizzes: await Quiz.getQuizzes(user!.id)
	};
};
