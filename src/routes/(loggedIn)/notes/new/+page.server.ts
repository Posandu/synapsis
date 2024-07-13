import { Notes } from '$lib/controllers/Notes';
import { wait } from '$lib/util';
import { createNoteSchema } from '$lib/zodSchemas';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const form = await superValidate(zod(createNoteSchema));

	return { form };
};

export const actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(createNoteSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const note = await Notes.create({
			categoryID: form.data.categoryID,
			content: form.data.content,
			title: form.data.title,
			userID: locals.user!.id
		});

		await wait(1000);

		return message(form, {
			text: 'Note created successfully',
			type: 'success',
			data: note
		});
	}
};
