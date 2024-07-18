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
		const el = document.querySelector('#loading');

		setTimeout(() => {
			el?.remove();
		}, 500);
	});
</script>

<Toaster />

<slot></slot>
