<script lang="ts">
	import { xpStore } from '$lib/store.svelte.js';
	import Quiz from '$lib/ui/Quiz.svelte';
	import { XP } from '$lib/util.js';
	import { onMount } from 'svelte';

	let { data } = $props();

	onMount(() => {
		xpStore.addXP(XP.QUIZ);
	});
</script>

<Quiz data={data.quiz.data as any} />
