import { Points } from '$lib/controllers/Points.js';
import prisma from '$lib/server/prisma.js';

export const load = async ({ locals: { user } }) => {
	const practicedItems = await prisma.note.findMany({
		select: {
			id: true
		},
		where: {
			quiz: {
				isNot: null
			},
			user: { id: user!.id }
		}
	});

	const nonPracticedItems = await prisma.note.findMany({
		select: {
			id: true
		},
		where: {
			NOT: {
				quiz: {
					isNot: null
				}
			},
			user: { id: user!.id }
		}
	});

	const pointsHistory = await Points.getLast5DaysPoints({
		userID: user!.id
	});

	return {
		practicedCount: practicedItems.length,
		nonPracticedCount: nonPracticedItems.length,
		pointsHistory
	};
};
