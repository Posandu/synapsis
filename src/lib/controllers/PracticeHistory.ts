import { inngest } from '$lib/server/inngest';
import prisma from '$lib/server/prisma';
import { _gen } from '../../routes/(loggedIn)/practice/synaptica/+server';

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
			take: 48
		});
	}

	static async checkInformUserOfStats({
		userID,
		lastSummaryDate
	}: {
		userID: string;
		lastSummaryDate: Date;
	}) {
		// if the date is the same as the last summary date, don't send a notification
		if (new Date().toDateString() === (lastSummaryDate || new Date(0)).toDateString()) return;

		// if the last summary date is not today, inform the user of their stats
		inngest.send({
			name: 'app/sendDailyMessage',
			data: { userID, lastSummaryDate: lastSummaryDate.toUTCString() }
		});

		return true;
	}

	static async informUserOfStats({ userID }: { userID: string }) {
		// get the 5 most recently created notes
		const notes = await prisma.note.findMany({
			where: { user: { id: userID } },
			select: {
				title: true,
				id: true,
				quiz: { select: { practiceHistory: { select: { points: true, date: true } } } },
				flashCard: { select: { practiceHistory: { select: { date: true } } } }
			},
			orderBy: { createdAt: 'desc' },
			take: 5
		});

		let message = "Here's a summary of the user's practice history:\n";

		notes.forEach((note) => {
			message += `\nNote: "${note.title}" - id: "${note.id}"\n`;
			if (note.quiz) {
				if (note.quiz.practiceHistory) {
					note.quiz.practiceHistory.forEach((history) => {
						message += `- - Completed quiz with ${history.points} points on ${new Date(history.date).toDateString()}\n`;
					});
				} else {
					message += `- - Created quiz but hasn't attempted it yet\n`;
				}
			} else {
				message += `- - No quiz created for this note\n`;
			}

			if (note.flashCard) {
				if (note.flashCard.practiceHistory) {
					note.flashCard.practiceHistory.forEach((history) => {
						message += `- - Viewed flashcard on ${new Date(history.date).toDateString()}\n`;
					});
				} else {
					message += `- - Created flashcard but hasn't viewed it yet\n`;
				}
			} else {
				message += `- - No flashcard created for this note\n`;
			}
		});

		if (notes.length === 0)
			message += 'No practice history to show yet! User has not created any notes.';

		message +=
			'\n\nCreate a message to send to the student which contains suggestions on what they can do to improve their practice history, and encourage them to keep going!';

		const chat = await prisma.chat.create({
			data: {
				data: {},
				user: { connect: { id: userID } },
				title: `Synaptica Summary - ${new Date().toDateString()}`
			}
		});

		await _gen(
			{
				chatID: chat.id,
				messages: [
					{
						role: 'system',
						content: message
					}
				]
			},
			userID
		);

		await prisma.user.update({
			where: { id: userID },
			data: { lastOverviewGiven: new Date() }
		});
	}
}

export { PracticeHistory };

type PracticeHistoryItem = Awaited<ReturnType<typeof PracticeHistory.getHistory>>[0];

export type { PracticeHistoryItem };
