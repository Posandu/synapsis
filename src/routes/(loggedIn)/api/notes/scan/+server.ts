import { AI } from '$lib/controllers/AI';
import { PLACEHOLDER, wait, type APIReturnType } from '$lib/util';
import { json } from '@sveltejs/kit';

const DEV = true;

export const POST = async ({ request }) => {
	const formdata = await request.formData();

	const image = formdata.get('image')?.toString();

	if (!image)
		return json({
			success: false,
			message: 'No image field. Stop trying to hack me.'
		} satisfies APIReturnType<string>);

	if (DEV) {
		await wait(4000);

		return json({
			success: true,
			data: PLACEHOLDER
		} satisfies APIReturnType<string>);
	}

	const text = await AI.getTextFromImage(image);

	return json({
		success: true,
		data: text
	});
};
