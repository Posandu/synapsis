import prisma from '$lib/server/prisma';

class PracticeHistory {
	static async addQuiz({
		userID,
		quizID,
		score
	}: {
		userID: string;
		quizID: string;
		score: number;
	}) {
		return await prisma.practiceHistory.create({
			data: {
				points: score,
				quiz: { connect: { id: quizID } },
				user: { connect: { id: userID } }
			}
		});
	}

	static async getHistory({ userID, quizID }: { userID: string; quizID?: string }) {
		return await prisma.practiceHistory.findMany({
			where: { user: { id: userID }, quiz: { id: quizID } },
			include: {
				quiz: {
					select: {
						data: false,
						id: true,
						note: {
							select: { title: true, id: true }
						},
						title: true
					}
				},
				flashCard: true
			},
			orderBy: { date: 'desc' }
		});
	}
}

export { PracticeHistory };

type PracticeHistoryItem = Awaited<ReturnType<typeof PracticeHistory.getHistory>>[0];

export type { PracticeHistoryItem };
