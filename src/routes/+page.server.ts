import { redirect } from '@sveltejs/kit';

export const load = async ({ locals: { user } }) => {
	if (user) throw redirect(303, '/home');
};
