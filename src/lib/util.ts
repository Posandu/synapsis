// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorIfString = (value: any, fallback: string) => {
	const msg = value?.message;
	return typeof msg === 'string' ? msg : fallback;
};

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type QuizQuestion =
	| {
			type: 'multiple-choice';
			question: string;
			options: string[];
			optionAnswer: string;
	  }
	| {
			type: 'written';
			question: string;
			answerKeywords: string[];
	  };

export type QuizItem = {
	title: string;
	questions: QuizQuestion[];
};

export type APIReturnType<T> =
	| {
			success: false;
			message: string;
	  }
	| {
			success: true;
			data: T;
	  };

export const fetcher = async <T>(url: string, init?: RequestInit): Promise<APIReturnType<T>> => {
	const response = await fetch(url, init);
	if (!response.ok) {
		throw new Error(`Failed to fetch: ${response.statusText}`);
	}

	return response.json();
};

export const PLACEHOLDER = `What the devil. Isn't that fantastic? Just go back and put one little more happy tree in there. Fluff that up.

Fluff it up a little and hypnotize it. Let your heart take you to wherever you want to be. You have to make those little noises or it won't work. Work that paint. Tree trunks grow however makes them happy.
`;

export const stringToColor = (str: string) => {
	let hash = 0;
	str.split('').forEach((char) => {
		hash = char.charCodeAt(0) + ((hash << 5) - hash);
	});
	let colour = '#';
	for (let i = 0; i < 3; i++) {
		const value = (hash >> (i * 8)) & 0xff;
		colour += value.toString(16).padStart(2, '0');
	}
	return colour;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const screamToTheVoid = (stuff: any) => {
	const a = typeof stuff;
	document.createElement('div').innerHTML = a + '';
};

function historyBackWFallback(fallbackUrl?: string) {
	fallbackUrl = fallbackUrl || '/';
	const prevPage = window.location.href;

	window.history.go(-1);

	setTimeout(function () {
		if (window.location.href == prevPage) {
			window.location.href = fallbackUrl;
		}
	}, 500);
}

export const goBack = (initial?: string) => {
	historyBackWFallback(initial);
};

const feedbackMessages = [
	{
		range: [90, 100],
		message: "Outstanding performance! You've demonstrated excellent knowledge."
	},
	{
		range: [80, 89],
		message: 'Great job! You have a strong understanding of the material.'
	},
	{
		range: [70, 79],
		message: "Good effort! You have a good grasp of the content but there's room for improvement."
	},
	{
		range: [60, 69],
		message: 'Fair performance. Consider reviewing the material to strengthen your understanding.'
	},
	{
		range: [50, 59],
		message: "You passed, but there's significant room for improvement. Keep studying!"
	},
	{
		range: [0, 49],
		message:
			"Unfortunately, you did not pass. Don't be discouraged! Review the material and try again."
	}
];

export function getFeedbackMessage(score: number) {
	for (let i = 0; i < feedbackMessages.length; i++) {
		const [min, max] = feedbackMessages[i].range;
		if (score >= min && score <= max) {
			return feedbackMessages[i].message;
		}
	}
	return 'Invalid score.';
}

export function validateWrittenAnswer(userAnswer: string, correctAnswerKeywords: string[]) {
	const userWords = userAnswer.toLowerCase().split(/\W+/);
	const keywords = correctAnswerKeywords.map((keyword) => keyword.toLowerCase());

	let score = 0;
	keywords.forEach((keyword) => {
		if (userWords.includes(keyword)) {
			score += 1;
		}
	});

	const threshold = keywords.length * 0.7; // 70% match threshold
	return score >= threshold;
}
