<script>
	import '@fontsource-variable/inter';
	import '../app.css';
	import { themeChange } from 'theme-change';
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-french-toast';

	onMount(() => {
		themeChange(false);
	});
</script>

<button data-toggle-theme="dark,light" data-act-class="ACTIVECLASS"> Custom Theme Button </button>

<Toaster />

<slot></slot>
