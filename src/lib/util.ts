// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorIfString = (value: any, fallback: string) => {
	const msg = value?.message;
	return typeof msg === 'string' ? msg : fallback;
};

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
