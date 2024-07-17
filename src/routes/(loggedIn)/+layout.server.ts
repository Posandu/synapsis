import { Points } from '$lib/controllers/Points.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.session || !locals.user) throw redirect(303, '/signin');

	const xp = await Points.getTodayPoints({ userID: locals.user.id });

	return { xp, user: locals.user! };
};

export const prerender = false;
export const ssr = false;
