// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorIfString = (value: any, fallback: string) => {
	const msg = value?.message;
	return typeof msg === 'string' ? msg : fallback;
};

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
