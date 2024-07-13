import prisma from '$lib/server/prisma';

type CreateNote = {
	title: string;
	content: string;
	categoryID: string;
	userID: string;
};

class Notes {
	static async create({ title, content, categoryID, userID }: CreateNote) {
		const note = await prisma.note.create({
			data: {
				title,
				content,
				category: {
					connect: {
						id: categoryID
					}
				},
				user: {
					connect: {
						id: userID
					}
				}
			}
		});

		return note;
	}

	static async find({ userID, id }: { userID: string; id: string }) {
		const note = await prisma.note.findUnique({
			where: {
				id,
				user: {
					id: userID
				}
			}
		});

		return note;
	}

	static async findByUser({
		userID,
		categoryID = undefined
	}: {
		userID: string;
		categoryID?: string;
	}) {
		const notes = await prisma.note.findMany({
			where: {
				user: {
					id: userID
				},
				category: {
					id: categoryID
				}
			}
		});

		return notes;
	}
}

export { Notes };
