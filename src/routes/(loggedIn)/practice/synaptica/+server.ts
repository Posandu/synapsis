import { generateText, tool } from 'ai';
import { OPENAI_API_KEY } from '$env/static/private';
import { z } from 'zod';
import { json } from '@sveltejs/kit';
import type { RequestEvent } from './$types.js';
import { createOpenAI } from '@ai-sdk/openai';
import { Notes } from '$lib/controllers/Notes.js';

if (!OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY');

const gen = async (request: Request, locals: RequestEvent['locals']) => {
	const userID = locals.user!.id;

	const { messages } = await request.json();

	const result = await generateText({
		model: createOpenAI({
			apiKey: OPENAI_API_KEY // Let's burn some money here
		})('gpt-4o-2024-05-13'),
		maxTokens: 1024,
		messages,
		tools: {
			showCategorySelect: tool({
				parameters: z.object({
					title: z
						.string()
						.optional()
						.describe(
							'The title of the category to show the selection UI for. If not provided, show all categories.'
						)
				}),
				description: 'Show the category selection UI to the user.'
			}),
			showNoteSelect: tool({
				parameters: z.object({
					categoryID: z
						.string()
						.describe('The ID of the category to show the note selection UI for.')
				}),
				description: 'Shows the note selection UI to the user.'
			}),
			getNoteContent: tool({
				parameters: z.object({
					noteID: z.string().describe('The ID of the note to retrieve the content for.')
				}),
				description: 'Retrieve the content of the specified note.',
				execute: async ({ noteID }) => {
					const note = await Notes.find({ id: noteID, userID });

					return note!.content;
				}
			}),
			makeQuiz: tool({
				parameters: z.object({
					noteID: z.string().describe('The ID of the note to generate a quiz from.')
				}),
				description:
					'An UI to generate a quiz from the specified note. Explain the user that the UI is shown to generate a quiz.'
			}),
			makeFlashcard: tool({
				parameters: z.object({
					noteID: z.string().describe('The ID of the note to generate flashcards from.')
				}),
				description:
					'An UI to generate flashcards from the specified note. Explain the user that the UI is shown to generate flashcards.'
			})
		},
		toolChoice: 'auto',
		system: `
            
            You're Synapsis, a friendly virtual assistant that helps students study. Keep your responses short and sweet. A category is the same as a subject or topic that the user uses to organize their notes.
            
            Don't be afraid to decline a request if you can't fulfill it. If you need help, ask the user for more information. If you're unsure about something, ask the user for clarification. Don't ask for technical details like IDs, the only thing that the user knows is categories and notes.

            Priortize the user's notes over the generated content. You need a category ID to get the notes from a category which can be found above. You need to show the UI when possible.

            You can help the user with the following tasks:
            - Show an UI to select a category
            - Show an UI to select a note
            - Generate a quiz from a note
            - Generate flashcards from a note
            - Explain a note thoroughly
            - Generate a summary of a note
            - Create study plans
            - Help with exam preparation and revision
            - Recall a note means that the user wants to explain the note in their own words, and you should provide feedback on that. DO NOT provide the original note content.
            `.trim(),
		maxToolRoundtrips: 5
	});

	return result.responseMessages;
};

export type SynapTicaResponse = Awaited<ReturnType<typeof gen>>;

export const POST = async ({ request, locals }) => {
	return json(await gen(request, locals));
};
