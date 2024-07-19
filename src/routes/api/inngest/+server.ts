import { inngest, sendMsg } from '$lib/server/inngest';
import { serve } from 'inngest/sveltekit';

export const { GET, POST, PUT } = serve({ client: inngest, functions: [sendMsg] });
