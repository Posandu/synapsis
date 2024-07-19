<script lang="ts">
	import '@fontsource-variable/inter';
	import '../app.css';
	import 'nprogress/nprogress.css';
	import NProgress from 'nprogress';
	import { navigating } from '$app/stores';
	import { Toaster } from 'svelte-french-toast';
	import { onMount } from 'svelte';

	NProgress.configure({ showSpinner: false });

	$: {
		if ($navigating) {
			NProgress.start();
		} else NProgress.done();
	}

	onMount(() => {
		// @ts-ignore
		const START = window!.START;

		const el = document.querySelector('#loading');

		const delay = Math.max(500, START + 500 - Date.now());

		setTimeout(() => {
			el?.remove();
		}, delay);
	});
</script>

<Toaster />

<slot></slot>
