import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
// import { hash } from '@node-rs/argon2';
import { generateIdFromEntropySize } from 'lucia';
import { bsNotes } from '../src/lib/demo';

const prisma = new PrismaClient();

async function main() {
	console.log(`Start seeding ...`);

	const USER_ID = generateIdFromEntropySize(10);
	// const USER_PASSWORD = 'password';

	// const passwordHash = await hash(USER_PASSWORD, {
	// 	memoryCost: 19456,
	// 	timeCost: 2,
	// 	outputLen: 32,
	// 	parallelism: 1
	// });

	const passwordHash =
		'$argon2id$v=19$m=19456,t=2,p=1$TYZ1GG90B8wXXdUSoU1UFQ$DjqvTNIK7gNSD3o+IpPPHOPC6Sch2tOh16hFcqnM5uM'; // Have fun figuring out the password :)

	await prisma.user.create({
		data: {
			id: USER_ID,
			password_hash: passwordHash,
			username: 'posandu'
		}
	});

	/**
	 * Generate random categories
	 */
	const cats = ['Biology', 'Chemistry', 'Physics', 'Economics', 'Computer Science'];

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
	for (let i = 0; i < 40; i++) {
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

	/**
	 * The real one for testing: business studies
	 */
	const bsCat = await prisma.category.create({
		data: {
			name: 'Business Studies',
			user: { connect: { id: USER_ID } }
		}
	});

	// Credits to https://drtayeb.wordpress.com/wp-content/uploads/2011/12/business-studies-notes.pdf for the notes

	bsNotes.forEach(async (note) => {
		const createdNote = await prisma.note.create({
			data: {
				title: note.title,
				content: note.content,
				category: { connect: { id: bsCat.id } },
				user: { connect: { id: USER_ID } }
			}
		});

		console.log(`Created note with id: ${createdNote.id}`);
	});

	console.log(`Seeding completed.`);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
	});
