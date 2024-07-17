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

	static async update({
		id,
		title,
		content,
		categoryID,
		userID
	}: {
		id: string;
		title: string;
		content: string;
		categoryID: string;
		userID: string;
	}) {
		const existingNote = await Notes.find({ id, userID });

		if (!existingNote) {
			throw new Error('Note not found');
		}

		const note = await prisma.note.update({
			where: {
				id,
				user: {
					id: userID
				}
			},
			data: {
				title,
				content,
				category: {
					connect: {
						id: categoryID
					}
				}
			}
		});

		return note;
	}

	static async delete({ id, userID }: { id: string; userID: string }) {
		const existingNote = await Notes.find({ id, userID });

		if (!existingNote) {
			throw new Error('Note not found');
		}

		const note = await prisma.note.delete({
			where: {
				id
			}
		});

		return note;
	}

	static async getNoteTitles({ userID, catID }: { userID: string; catID: string }) {
		const notes = await prisma.note.findMany({
			where: {
				user: {
					id: userID
				},
				category: {
					id: catID
				}
			},
			select: {
				title: true
			}
		});

		return notes;
	}

	static async find({ userID, id }: { userID: string; id: string }) {
		const note = await prisma.note.findUnique({
			where: {
				id,
				user: {
					id: userID
				}
			},
			include: {
				category: true,
				quiz: { select: { data: false, id: true, title: true } },
				flashCard: { select: { data: false, id: true, title: true } }
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
			},
			select: {
				category: {
					select: {
						name: true,
						notes: false,
						user: false,
						userId: false,
						id: true
					}
				},
				categoryId: false,
				content: false,
				createdAt: true,
				user: false,
				id: true,
				title: true,
				updatedAt: true,
				userId: false
			}
		});

		return notes;
	}
}

export { Notes };
