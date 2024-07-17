import { Category } from '$lib/controllers/Category.js';
import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals: { user } }) => {
	const data = await request.json();

	if (!data.categoryID) {
		return json({});
	}

	const notes = await Category.getNotes({
		categoryID: data.categoryID,
		userID: user!.id
	});

	return json({
		success: true,
		data: notes.notes.map((i) => ({ title: i.title, id: i.id }))
	});
};
