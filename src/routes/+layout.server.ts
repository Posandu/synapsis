export const load = async ({ locals: { user }, url }) => {
	return {
		user,
		url: url.pathname
	};
};
