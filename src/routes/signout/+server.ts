import { lucia } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const GET = async ({ locals, cookies }) => {
	if (!locals.user || !locals.session) throw redirect(303, '/');

	await lucia.invalidateSession(locals.session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});

	throw redirect(302, '/signin');
};
