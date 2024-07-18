import { MAX_TEXT_LENGTH_FOR_AI, PLACEHOLDER, wait, type APIReturnType } from '$lib/util';
import { AI } from '$lib/controllers/AI';
import { json } from '@sveltejs/kit';

const DEV = false;

export const POST = async ({ request }) => {
	const {
		text
	}: {
		text?: string;
	} = await request.json();

	if (!text) return json({ success: false, message: 'No text' } satisfies APIReturnType<string>);

	if (text.length > MAX_TEXT_LENGTH_FOR_AI) {
		return json({
			success: false,
			message: `Text is too long. Maximum length is ${MAX_TEXT_LENGTH_FOR_AI} characters.`
		} satisfies APIReturnType<string>);
	}

	if (DEV) {
		await wait(4000);

		return json({
			success: true,
			data: PLACEHOLDER + '\n Ayo, fixed da errors'
		} satisfies APIReturnType<string>);
	}

	const fixed = await AI.fixErrors(text);

	return json({
		success: true,
		data: fixed
	});
};
