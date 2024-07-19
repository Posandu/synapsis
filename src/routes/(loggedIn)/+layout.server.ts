import { Chat } from '$lib/controllers/Chat.js';
import { Points } from '$lib/controllers/Points.js';
import { PracticeHistory } from '$lib/controllers/PracticeHistory.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, depends }) => {
	if (!locals.session || !locals.user) throw redirect(303, '/signin');

	const xp = await Points.getTodayPoints({ userID: locals.user.id });
	const unreadChatCount = await Chat.getUnreadChatCount({ userID: locals.user.id });

	await PracticeHistory.checkInformUserOfStats({
		userID: locals.user.id,
		lastSummaryDate: locals.user.lastOverviewGiven || new Date(0)
	});

	depends('chat:data');

	return { xp, user: locals.user!, unreadChatCount };
};

export const prerender = false;
export const ssr = false;
