import prisma from '$lib/server/prisma';
import type { QuizItem } from '$lib/util';
import { AI } from './AI';
import { Notes } from './Notes';

type QuizCreateAPIInput = {
	noteID: string;
};

type QuizCreateAPIOutput = {
	quizID: string;
};

class Quiz {
	static async createQuiz({
		noteID,
		quizData,
		userID,
		quizTitle
	}: {
		noteID: string;
		quizData: QuizItem;
		userID: string;
		quizTitle: string;
	}) {
		const quiz = await prisma.quiz.create({
			data: {
				data: quizData,
				title: quizTitle,
				note: { connect: { id: noteID } },
				user: { connect: { id: userID } }
			}
		});

		return quiz;
	}

	static async generateQuizFromNote({ noteID, userID }: { noteID: string; userID: string }) {
		const existing = await prisma.quiz.findFirst({
			where: {
				note: {
					id: noteID
				},
				user: {
					id: userID
				}
			}
		});

		if (existing) return existing;

		const note = await Notes.find({ id: noteID, userID });

		if (!note) throw new Error('Note not found');

		if (note.content.length > 3500)
			throw new Error(
				'Note too long, please shorten it to less than 3500 characters. Current length: ' +
					note.content.length
			);

		const formattedData = await AI.cleanData(note.content);
		const quizData = await AI.generateQuiz(formattedData);

		const quiz = await Quiz.createQuiz({
			noteID,
			quizData,
			userID,
			quizTitle: note.title
		});

		return quiz;
	}

	static async getQuiz({ quizID, userID }: { quizID: string; userID: string }) {
		const quiz = await prisma.quiz.findUnique({
			where: { id: quizID, user: { id: userID } }
		});

		return quiz;
	}

	static async getQuizzes(userID: string) {
		const quizzes = await prisma.quiz.findMany({
			where: { userId: userID },
			select: {
				note: { select: { title: true, id: true } },
				title: true,
				id: true
			}
		});

		return quizzes;
	}

	static async deleteQuiz({ quizID, userID }: { quizID: string; userID: string }) {
		const quiz = await prisma.quiz.delete({
			where: { id: quizID, userId: userID }
		});

		return quiz;
	}
}

export { Quiz };
export type { QuizCreateAPIInput, QuizCreateAPIOutput };
