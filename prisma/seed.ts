import { PrismaClient, type Note } from '@prisma/client';
import { faker } from '@faker-js/faker';
// import { hash } from '@node-rs/argon2';
import { generateIdFromEntropySize } from 'lucia';
import { bsNotes } from '../src/lib/demo';

const prisma = new PrismaClient();

async function main() {
	console.log(`Start seeding ...`);

	const existsUser = await prisma.user.findFirst({
		where: {
			username: 'demoguy'
		}
	});

	if (existsUser) {
		await prisma.user.delete({
			where: {
				id: existsUser.id
			}
		});

		console.log(`Deleted existing user with id: ${existsUser.id}`);
	}

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
			username: 'demoguy'
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
	for (let i = 0; i < 200; i++) {
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

	/**
	 * Random quizzes for random notes
	 */
	async function pickRandomNote(filter: number): Promise<Note> {
		const tot = 200;
		const skip = Math.max(0, Math.floor(Math.random() * tot) - 1);
		const randOrder = Math.random() > 0.5 ? 'asc' : 'desc';

		const found = await prisma.note.findFirst({
			skip: skip,
			orderBy: { id: randOrder },
			where: filter == 1 ? { quiz: { is: null } } : { flashCard: { is: null } }
		});

		if (!found) {
			return await pickRandomNote(filter);
		}

		return found;
	}

	const quizIDs: string[] = [];

	for (let index = 0; index < 75; index++) {
		const randNote = await pickRandomNote(1);

		const id = await prisma.quiz.create({
			data: {
				data: {},
				points: Math.floor(Math.random() * 10),
				title: faker.lorem.sentence(),
				note: { connect: { id: randNote!.id } },
				user: { connect: { id: USER_ID } }
			}
		});

		quizIDs.push(id.id);

		console.log(`Created quiz for note with id: ${randNote!.id}`);
	}

	/**
	 * Random quiz attempts
	 */
	for (let index = 0; index < 100; index++) {
		const quiz = quizIDs[Math.floor(Math.random() * quizIDs.length)];

		const quizAtt = await prisma.practiceHistory.create({
			data: {
				quiz: { connect: { id: quiz } },
				user: { connect: { id: USER_ID } },
				points: Math.floor(Math.random() * 100)
			}
		});

		console.log(`Created quiz attempt for quiz with id: ${quizAtt.id}`);
	}

	/**
	 * Flashcards
	 */
	const flashcardids: string[] = [];

	for (let index = 0; index < 100; index++) {
		const note = await pickRandomNote(2);

		const flashcard = await prisma.flashCard.create({
			data: {
				data: {},
				note: { connect: { id: note!.id } },
				user: { connect: { id: USER_ID } },
				title: faker.lorem.sentence()
			}
		});

		flashcardids.push(flashcard.id);

		console.log(`Created flashcard for note with id: ${flashcard!.id}`);
	}

	/**
	 * Flashcard attempts
	 */
	for (let index = 0; index < 200; index++) {
		const flashcard = flashcardids[Math.floor(Math.random() * flashcardids.length)];

		const flashcardAtt = await prisma.practiceHistory.create({
			data: {
				flashCard: { connect: { id: flashcard } },
				user: { connect: { id: USER_ID } },
				points: 1
			}
		});

		console.log(`Created flashcard attempt for flashcard with id: ${flashcardAtt.id}`);
	}

	console.log(`Seeding completed.`);

	process.exit(0);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
	});
