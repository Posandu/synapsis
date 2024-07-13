import { z } from 'zod';

export const createUserSchema = z.object({
	username: z.string().regex(/^[a-zA-Z0-9_-]{3,15}$/),
	password: z.string().min(8).max(255)
});
