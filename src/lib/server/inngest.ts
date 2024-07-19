import { INNGEST } from '$env/static/private';
import { PracticeHistory } from '$lib/controllers/PracticeHistory';
import { Inngest } from 'inngest';

const inngest = new Inngest({
	eventKey: INNGEST,
	id: 'synapsis'
});

const sendMsg = inngest.createFunction(
	{
		id: 'sendDailyMessage',
		rateLimit: {
			limit: 1,
			period: '1d'
		}
	},
	{ event: 'app/sendDailyMessage' },
	async ({ event, step }) => {
		await step.run(
			{
				id: 'sendMessage'
			},
			async () => {
				const data = event.data;

				console.log('data', data);

				if (!data.userID || typeof data.userID !== 'string') {
					throw new Error('No userID provided');
				}

				await PracticeHistory.informUserOfStats({
					userID: data.userID
				});
			}
		);
	}
);

export { inngest, sendMsg };
