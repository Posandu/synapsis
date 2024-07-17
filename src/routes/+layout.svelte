<script lang="ts">
	import '@fontsource-variable/inter';
	import '../app.css';
	import 'nprogress/nprogress.css';
	import NProgress from 'nprogress';
	import { navigating } from '$app/stores';
	import { Toaster } from 'svelte-french-toast';

	NProgress.configure({ showSpinner: false });

	$: {
		if ($navigating) {
			NProgress.start();
		} else NProgress.done();
	}
</script>

<Toaster />

<slot></slot>
