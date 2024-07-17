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

	static async addFlashCard({ userID, flashCardID }: { userID: string; flashCardID: string }) {
		return await prisma.practiceHistory.create({
			data: {
				points: 0,
				flashCard: { connect: { id: flashCardID } },
				user: { connect: { id: userID } }
			}
		});
	}

	static async getHistory({
		userID,
		quizID,
		flashCardID
	}: {
		userID: string;
		quizID?: string;
		flashCardID?: string;
	}) {
		return await prisma.practiceHistory.findMany({
			where: { user: { id: userID }, quiz: { id: quizID }, flashCard: { id: flashCardID } },
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
				flashCard: {
					select: {
						data: false,
						id: true,
						note: {
							select: { title: true, id: true }
						},
						title: true
					}
				}
			},
			orderBy: { date: 'desc' },
			take: 100
		});
	}
}

export { PracticeHistory };

type PracticeHistoryItem = Awaited<ReturnType<typeof PracticeHistory.getHistory>>[0];

export type { PracticeHistoryItem };
