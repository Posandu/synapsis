<script lang="ts">
	import Icon from '@iconify/svelte';
	import Typography from './Typography.svelte';
	import { onMount } from 'svelte';

	const items = [
		'Recalling notes enhances long-term memory by reinforcing neural connections.',
		'Recalling notes regularly can help in identifying knowledge gaps and areas needing more focus.',
		'Regular quizzes can improve academic performance by up to 20%.',
		'Quizzes can reduce test anxiety by familiarizing students with the format and content.',
		'Quizzing enhances retrieval practice, which strengthens memory.',
		'Immediate feedback during quizzes helps in correcting misconceptions early.',
		'Flashcards utilize spaced repetition, a technique proven to improve memory retention.',
		'Flashcards are versatile and can be used for various subjects and languages.',
		'Creating flashcards engages active learning, making it more effective than passive reading.'
	];

	let alreadySaid = $state<string[]>([]);

	let shown = $state('');

	const randomItem = () => {
		const possibleItems = items.filter((item) => !alreadySaid.includes(item));
		const randomIndex = Math.floor(Math.random() * possibleItems.length);

		shown = possibleItems[randomIndex];

		alreadySaid = [...alreadySaid, shown];

		if (alreadySaid.length === items.length) {
			alreadySaid = [];
		}
	};

	onMount(() => {
		randomItem();
	});
</script>

<div class="flex w-full items-center justify-between">
	<Typography class="w-max font-semibold">Did you know?</Typography>

	<button
		class="flex items-center justify-center"
		onclick={() => {
			randomItem();
		}}
	>
		<Icon icon="system-uicons:reset" class="ml-1 size-4 text-gray-500" />
	</button>
</div>

<Typography class="mt-4 text-2xl opacity-75">
	{shown}
</Typography>
