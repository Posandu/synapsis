import { AI } from '$lib/controllers/AI';
import { PLACEHOLDER, wait, type APIReturnType } from '$lib/util';
import { json } from '@sveltejs/kit';

const DEV = true;

export const POST = async ({ request }) => {
	const {
		text
	}: {
		text?: string;
	} = await request.json();

	if (!text) return json({ success: false, message: 'No text' } satisfies APIReturnType<string>);

	const MAXIMUM_TEXT_LENGTH = 1000;

	if (text.length > MAXIMUM_TEXT_LENGTH) {
		return json({
			success: false,
			message: `Text is too long. Maximum length is ${MAXIMUM_TEXT_LENGTH} characters.`
		} satisfies APIReturnType<string>);
	}

	if (DEV) {
		await wait(4000);

		return json({
			success: true,
			data: PLACEHOLDER + "\n Ayo, fixed da errors"
		} satisfies APIReturnType<string>);
	}

	const fixed = await AI.fixErrors(text);

	return json({
		success: true,
		data: fixed
	});
};
