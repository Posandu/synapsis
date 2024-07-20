import prisma from '$lib/server/prisma.js';
import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals: { user } }) => {
	const { id } = await request.json();

	if (!id) return json({});

	await prisma.user.update({
		data: {
			introGivenItems: {
				push: id
			}
		},
		where: {
			id: user!.id
		}
	});

	return json({});
};
