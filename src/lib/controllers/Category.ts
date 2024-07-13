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

	static async getAll(userID: string) {
		const categories = await prisma.category.findMany({
			where: {
				user: {
					id: userID
				}
			}
		});

		return categories;
	}
}

export { Category };
export type { CreateCategoryParams };
