import prisma from '$lib/server/prisma';

interface CreateCategoryParams {
	name: string;
	userID: string;
}

class Category {
	static async create({ name, userID }: CreateCategoryParams) {
		const created = await prisma.category.create({
			data: {
				name,
				user: {
					connect: {
						id: userID
					}
				}
			}
		});

		return created;
	}

	static async getNotes({ categoryID, userID }: { categoryID: string; userID: string }) {
		const category = await prisma.category.findFirst({
			where: {
				id: categoryID,
				user: {
					id: userID
				}
			}
		});

		if (!category) throw new Error('Category not found');

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
				id: true,
				title: true,
				createdAt: true,
				updatedAt: true,
				quiz: {
					select: {
						id: true
					}
				},
				flashCard: {
					select: {
						id: true
					}
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		});

		return {
			notes,
			category
		};
	}

	static async delete({ categoryID, userID }: { categoryID: string; userID: string }) {
		const deleted = await prisma.category.deleteMany({
			where: {
				id: categoryID,
				user: {
					id: userID
				}
			}
		});

		return deleted;
	}

	static async update({
		categoryID,
		userID,
		name
	}: {
		categoryID: string;
		userID: string;
		name: string;
	}) {
		const updated = await prisma.category.updateMany({
			where: {
				id: categoryID,
				user: {
					id: userID
				}
			},
			data: {
				name
			}
		});

		return updated;
	}

	static async getAll(userID: string) {
		const categories = await prisma.category.findMany({
			where: {
				user: {
					id: userID
				}
			},
			select: {
				id: true,
				name: true,
				_count: {
					select: {
						notes: true
					}
				}
			},
			orderBy: {
				notes: {
					_count: 'desc'
				}
			}
		});

		return categories;
	}
}

export { Category };
export type { CreateCategoryParams };
