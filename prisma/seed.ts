import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
	console.log(`Start seeding ...`);

	const USER_ID = 'jmwukhh6pygm6f7r';

	/**
	 * Generate random categories
	 */
	const cats = [
		'Biology',
		'Chemistry',
		'Physics',
		'Economics',
		'Business Studies',
		'Computer Science'
	];

	const CAT_IDs: string[] = [];

	const promises = cats.map(async (cat) => {
		const item = await prisma.category.create({
			data: {
				name: cat,
				user: { connect: { id: USER_ID } }
			}
		});

		CAT_IDs.push(item.id);
	});

	await Promise.all(promises);

	/**
	 * Generate notes
	 */
	for (let i = 0; i < 100; i++) {
		const note = await prisma.note.create({
			data: {
				title: faker.lorem.sentence(),
				content: faker.lorem.paragraphs(),
				category: { connect: { id: CAT_IDs[Math.floor(Math.random() * CAT_IDs.length)] } },
				user: { connect: { id: USER_ID } }
			}
		});

		console.log(`Created note with id: ${note.id}`);
	}

	console.log(`Seeding finished.`);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
	});
