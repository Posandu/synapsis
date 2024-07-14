import { Notes } from '$lib/controllers/Notes';
import { wait } from '$lib/util';
import { createNoteSchema } from '$lib/zodSchemas';
import { error } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params, locals: { user } }) => {
	if (!params.id) return error(404);

	const note = await Notes.find({
		id: params.id,
		userID: user!.id
	});

	if (!note) return error(404);

	const form = await superValidate(zod(createNoteSchema));

	return { form, note };
};

export const actions = {
	default: async ({ request, locals: { user }, params }) => {
		const form = await superValidate(request, zod(createNoteSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		await Notes.update({
			categoryID: form.data.categoryID,
			content: form.data.content,
			title: form.data.title,
			userID: user!.id,
			id: params.id
		});

		await wait(1000);

		return message(form, {
			text: 'Note updated',
			type: 'success'
		});
	}
};
