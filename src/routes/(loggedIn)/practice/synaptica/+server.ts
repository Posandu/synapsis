import { generateText, tool, type CoreMessage } from 'ai';
import { OPENAI_API_KEY } from '$env/static/private';
import { z } from 'zod';
import { error, json } from '@sveltejs/kit';
import { createOpenAI } from '@ai-sdk/openai';
import { Notes } from '$lib/controllers/Notes.js';
import type { APIReturnType } from '$lib/util.js';
import { Chat } from '$lib/controllers/Chat.js';
import { Points } from '$lib/controllers/Points.js';
import { ACTION_PROMPTS } from '$lib/controllers/AI.js';

if (!OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY');

export const _gen = async (
	json: {
		messages: CoreMessage[];
		chatID?: string;
	},
	userID: string
) => {
	const { messages, chatID } = json;

	if (!chatID) return error(400, 'Invalid chat ID');

	const result = await generateText({
		model: createOpenAI({
			apiKey: OPENAI_API_KEY // Let's burn some money here
		})('gpt-4o-mini'),
		maxTokens: 1024,
		messages,
		tools: {
			showCategorySelect: tool({
				parameters: z.object({
					title: z.string().optional()
				})
			}),
			showNoteSelect: tool({
				parameters: z.object({
					categoryID: z.string()
				})
			}),
			getNoteContent: tool({
				parameters: z.object({
					noteID: z.string()
				}),
				description: 'Retrieve the content of the specified note.',
				execute: async ({ noteID }) => {
					const note = await Notes.find({ id: noteID, userID });

					return {
						title: note!.title,
						content: note!.content
					};
				}
			}),
			checkQuizMarks: tool({
				parameters: z.object({
					noteID: z.string()
				}),
				execute: async ({ noteID }) => {
					const note = await Notes.find({ id: noteID, userID });

					if (!note?.quiz) return 'No quiz found for this note.';

					const quiz = note.quiz;

					if (quiz.points === 0) return "Created a quiz but haven't attempted it yet.";

					return `Scored ${quiz.points}/100 in the quiz.`;
				}
			}),
			makeQuiz: tool({
				parameters: z.object({
					noteID: z.string()
				})
			}),
			makeFlashcard: tool({
				parameters: z.object({
					noteID: z.string()
				})
			}),
			addPoints: tool({
				parameters: z.object({
					points: z.number()
				}),
				execute: async ({ points }) => {
					points = Math.min(points, 2); // Cap points to 2

					Points.addPointsPerDay({ userID, points });

					return `You earned ${points} points! Keep up the good work!`;
				}
			})
		},
		toolChoice: 'auto',
		system: ACTION_PROMPTS.SYNAPTICA,
		maxToolRoundtrips: 5
	});

	const messagesResp = result.responseMessages;

	await Chat.updateChat({
		chatID,
		userID,
		data: [...messages, ...messagesResp]
	});

	return messagesResp;
};

export type SynapTicaResponse = Awaited<ReturnType<typeof _gen>>;

export const POST = async ({ request, locals }) => {
	const data = await request.json(); // https://stackoverflow.com/questions/75071352/reading-the-body-of-a-request-in-hooks-server-in-sveltekit

	const action = data.action;

	if (action) {
		if (action === 'startChat') {
			const newChat = await Chat.createChat({
				userID: locals.user!.id,
				data: []
			});

			return json({
				success: true,
				data: newChat.id
			} satisfies APIReturnType<string>);
		}

		if (action === 'deleteChat') {
			const { chatID } = data;

			await Chat.deleteChat({
				chatID,
				userID: locals.user!.id
			});

			return json({
				success: true
			});
		}

		return error(400, 'Invalid action');
	}

	return json(await _gen(data, locals.user!.id));
};
