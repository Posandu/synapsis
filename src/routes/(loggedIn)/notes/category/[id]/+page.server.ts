import { Category } from '$lib/controllers/Category.js';
import { error } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
	try {
		const data = await Category.getNotes({
			categoryID: params.id,
			userID: locals.user!.id
		});

		if(!data) return error(404, 'Category not found');

		return {
			...data
		};
	} catch (_) {
		console.error(_);

		return error(404, 'Category not found');
	}
};
