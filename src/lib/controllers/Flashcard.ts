import prisma from '$lib/server/prisma';
import { MAX_TEXT_LENGTH_FOR_AI } from '$lib/util';
import { AI } from './AI';
import { Notes } from './Notes';

type FlashCardData = {
	cards: {
		front: string;
		back: string;
	}[];
	title: string;
};

class FlashCard {
	static async createFlashcard({
		userID,
		data,
		noteID
	}: {
		userID: string;
		data: FlashCardData;
		noteID: string;
	}) {
		return await prisma.flashCard.create({
			data: {
				data,
				title: data.title,
				note: { connect: { id: noteID } },
				user: { connect: { id: userID } }
			}
		});
	}

	static async getFlashCard({ userID, flashCardID }: { userID: string; flashCardID: string }) {
		return await prisma.flashCard.findFirst({
			where: {
				id: flashCardID,
				user: {
					id: userID
				}
			},
			include: {
				note: true
			}
		});
	}

	static async deleteFlashCard({ userID, flashCardID }: { userID: string; flashCardID: string }) {
		return await prisma.flashCard.deleteMany({
			where: {
				id: flashCardID,
				user: {
					id: userID
				}
			}
		});
	}

	static async getFlashCards({ userID }: { userID: string }) {
		return await prisma.flashCard.findMany({
			where: {
				user: {
					id: userID
				}
			},
			include: {
				note: true
			}
		});
	}

	static async generateFlashCard({ userID, noteID }: { userID: string; noteID: string }) {
		const existing = await prisma.flashCard.findFirst({
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

		if (note.content.length > MAX_TEXT_LENGTH_FOR_AI)
			throw new Error(
				'Note too long, please shorten it to less than ' +
					MAX_TEXT_LENGTH_FOR_AI +
					' characters. Current length: ' +
					note.content.length +
					' characters. (' +
					(note.content.length - MAX_TEXT_LENGTH_FOR_AI) +
					' characters over)'
			);

		const formattedData = await AI.cleanData(note.content);
		const flashCardData = await AI.generateFlashCard(formattedData);

		const flashCard = await FlashCard.createFlashcard({
			userID,
			noteID,
			data: flashCardData
		});

		return flashCard;
	}
}

export { FlashCard };
export type { FlashCardData };
