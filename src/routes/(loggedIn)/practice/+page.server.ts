import { PracticeHistory } from '$lib/controllers/PracticeHistory.js';

export const load = async ({ locals: { user } }) => {
	return {
		history: await PracticeHistory.getHistory({ userID: user!.id })
	};
};
