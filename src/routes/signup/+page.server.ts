import { User } from '$lib/controllers/User';
import { lucia } from '$lib/server/auth';
import { getErrorIfString } from '$lib/util';
import { createUserSchema } from '$lib/zodSchemas';
import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ locals }) => {
	if (locals.user) throw redirect(303, '/home');

	const form = await superValidate(zod(createUserSchema));

	return { form };
};

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(createUserSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const { id } = await User.create(form.data);

			const session = await lucia.createSession(id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);

			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} catch (error) {
			console.error(error);

			return message(form, {
				text: getErrorIfString(error, 'An unexpected error occurred. Please try again later.'),
				type: 'error'
			});
		}

		throw redirect(302, '/?loggedIn=true');
	}
};
