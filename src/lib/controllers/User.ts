import prisma from '$lib/server/prisma';
import { generateIdFromEntropySize } from 'lucia';
import { hash } from '@node-rs/argon2';

interface CreateUserParams {
	username: string;
	password: string;
}

class User {
	static async create({ username, password }: CreateUserParams) {
		username = username.trim().toLowerCase();

		const existingUser = await prisma.user.findUnique({
			where: {
				username
			}
		});

		if (existingUser) {
			throw new Error('Username already exists');
		}

		const userId = generateIdFromEntropySize(10);
		const passwordHash = await hash(password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		const createdUser = await prisma.user.create({
			data: {
				id: userId,
				username: username,
				password_hash: passwordHash
			}
		});

		return createdUser;
	}

	static async find({ username }: { username: string }) {
		const user = await prisma.user.findUnique({
			where: {
				username
			}
		});

		return user;
	}
}

export { User };
export type { CreateUserParams };
