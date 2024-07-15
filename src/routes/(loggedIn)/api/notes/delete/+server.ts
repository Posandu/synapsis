import { Notes } from '$lib/controllers/Notes';
import { getErrorIfString, type APIReturnType } from '$lib/util';
import { error, json } from '@sveltejs/kit';

export const DELETE = async ({ locals, request }) => {
	const { id } = await request.json();

	if (!id) return error(400);

	try {
		await Notes.delete({ id, userID: locals.user!.id });

		return json({
			success: true,
			data: 'Note deleted'
		} satisfies APIReturnType<string>);
	} catch (e) {
		return json({
			success: false,
			message: getErrorIfString(e, 'An error occurred while deleting the note')
		} satisfies APIReturnType<string>);
	}
};
