import { Category } from '$lib/controllers/Category';
import { createCategorySchema } from '$lib/zodSchemas';
import { error, json } from '@sveltejs/kit';

export const GET = async ({ locals: { user } }) => {
	if (!user) return error(400);

	const userId = user.id;

	const categories = await Category.getAll(userId);

	return json({
		success: true,
		data: categories
	});
};

export const POST = async ({ request, locals: { user } }) => {
	if (!user) return error(400);

	const data = await request.json();

	try {
		const parsedData = createCategorySchema.parse(data);

		const category = await Category.create({
			name: parsedData.name,
			userID: user.id
		});

		return json({
			success: true,
			data: category
		});
	} catch (err) {
		console.log(err);

		return json({
			success: false,
			message: "Category name can't be empty"
		});
	}
};

export const DELETE = async ({ request, locals: { user } }) => {
	if (!user) return error(400);

	const data = await request.json();

	const categoryID = data.id;

	if (!categoryID) return json({ success: false, message: 'Category ID is required' });

	try {
		const deleted = await Category.delete({
			categoryID,
			userID: user.id
		});

		return json({
			success: true,
			data: deleted
		});
	} catch (err) {
		console.log(err);

		return json({
			success: false,
			message: 'Category not found'
		});
	}
};
