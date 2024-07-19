import { generateText, tool } from 'ai';
import { OPENAI_API_KEY } from '$env/static/private';
import { z } from 'zod';
import { error, json } from '@sveltejs/kit';
import type { RequestEvent } from './$types.js';
import { createOpenAI } from '@ai-sdk/openai';
import { Notes } from '$lib/controllers/Notes.js';
import type { APIReturnType } from '$lib/util.js';
import { Chat } from '$lib/controllers/Chat.js';

if (!OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY');

const gen = async (request: Request, locals: RequestEvent['locals']) => {
	const userID = locals.user!.id;

	const { messages, chatID } = await request.json();

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

					return note!.content;
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
			})
		},
		toolChoice: 'auto',
		system: `
            
            You're Synapsis, a friendly virtual assistant that helps students study. Keep your responses short and sweet. A category is the same as a subject or topic that the user uses to organize their notes. \n Make use of tools when asking the user for the category name and the note. \n Recall is a feture where  the user wants to explain the note in their own words, and you should provide feedback on that. DO NOT provide the original note content. 

            `.trim(),
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

export type SynapTicaResponse = Awaited<ReturnType<typeof gen>>;

export const POST = async ({ request, locals }) => {
	const data = await request.clone().json(); // https://stackoverflow.com/questions/75071352/reading-the-body-of-a-request-in-hooks-server-in-sveltekit

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

		return error(400, 'Invalid action');
	}

	return json(await gen(request, locals));
};
