import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.session || !locals.user) throw redirect(303, '/signin');
};

export const ssr = false;
