import { User } from '$lib/controllers/User';
import { lucia } from '$lib/server/auth';
import { createUserSchema } from '$lib/zodSchemas';
import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { verify } from '@node-rs/argon2';
import { wait } from '$lib/util.js';

export const load = async ({ locals }) => {
	if (locals.user) throw redirect(302, '/');

	const form = await superValidate(zod(createUserSchema));

	return { form };
};

export const actions = {
	default: async ({ request, cookies }) => {
		await wait(1000);

		const form = await superValidate(request, zod(createUserSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const existingUser = await User.find({ username: form.data.username });

		if (!existingUser) {
			return message(form, { type: 'error', text: 'Incorrect username or password' });
		}

		const validPassword = await verify(existingUser.password_hash, form.data.password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		if (!validPassword) {
			return message(form, { type: 'error', text: 'Incorrect username or password' });
		}

		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		return message(form, { type: 'success', text: '' });
	}
};
