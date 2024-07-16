import prisma from '$lib/server/prisma';

class Points {
	static getDate() {
		return new Date().toISOString();
	}

	static async addPointsPerDay({ userID, points }: { userID: string; points: number }) {
		const today = Points.getDate();

		await prisma.userXP.upsert({
			create: {
				date: today,
				points: points,
				user: { connect: { id: userID } }
			},
			update: {
				points: {
					increment: points
				}
			},
			where: {
				userId_date: {
					date: today,
					userId: userID
				}
			}
		});
	}

	static async getTodayPoints({ userID }: { userID: string }) {
		const today = Points.getDate();

		const todayPoints = await prisma.userXP.findFirst({
			where: {
				date: today,
				user: { id: userID }
			}
		});

		return todayPoints;
	}

	static async getLast5DaysPoints({ userID }: { userID: string }) {
		const last5Days = new Date(new Date().setDate(new Date().getDate() - 5)).toISOString();

		const last5DaysPoints = await prisma.userXP.findMany({
			where: {
				date: {
					gte: last5Days
				},
				user: { id: userID }
			},
			orderBy: {
				date: 'desc'
			}
		});

		return last5DaysPoints;
	}
}

export { Points };
