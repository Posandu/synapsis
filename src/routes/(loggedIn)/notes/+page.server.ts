import { Category } from '$lib/controllers/Category';

export const load = async ({ locals: { user }, depends }) => {
	depends('notes:page');

	return {
		categories: await Category.getAll(user!.id)
	};
};
