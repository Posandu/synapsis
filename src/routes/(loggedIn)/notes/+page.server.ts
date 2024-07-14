import { Category } from '$lib/controllers/Category';

export const load = async ({ locals: { user } }) => {
	return {
		categories: await Category.getAll(user!.id)
	};
};
