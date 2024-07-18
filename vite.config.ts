import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			injectRegister: 'auto',
			devOptions: {
				enabled: true
			},
			manifest: {
				name: 'Synapsis',
				short_name: 'Synapsis',
				description: 'AI learning platform',
				theme_color: '#0069FF',
				icons: [
					{
						src: '/favicon.png',
						sizes: '180x180',
						type: 'image/png'
					},
					{
						src: '/favicon.svg',
						sizes: '180x180',
						type: 'image/svg'
					}
				]
			}
		})
	],
	optimizeDeps: {
		exclude: ['svelte']
	}
});
