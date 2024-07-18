import { createDemo } from '$lib/demo.js';
import { json } from '@sveltejs/kit';

export const POST = async ({ locals }) => {
	await createDemo(locals.user!.id);

	return json({});
};
