import prisma from '$lib/server/prisma';

export const load = async () => {
	const top10 = await prisma.userXP.findMany({
		select: {
			points: true,
			user: {
				select: {
					username: true
				}
			}
		},
		orderBy: {
			points: 'desc'
		},
		where: {
			date: {
				gte: new Date(new Date().toDateString())
			}
		},
		take: 10
	});

	return {
		top10
	};
};
