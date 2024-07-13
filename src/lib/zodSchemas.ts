import { z } from 'zod';

export const createUserSchema = z.object({
	username: z.string().regex(/^[a-zA-Z0-9_-]{3,15}$/),
	password: z.string().min(8).max(255)
});

export const createCategorySchema = z.object({
	name: z.string().trim().min(1).max(60)
});

export const createNoteSchema = z.object({
	title: z.string().trim().min(1).max(255),
	content: z.string().trim().min(1),
	categoryID: z.string().uuid()
});
