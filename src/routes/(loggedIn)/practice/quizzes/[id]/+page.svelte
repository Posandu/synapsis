<script lang="ts">
	import Quiz from '$lib/ui/Quiz.svelte';

	let { data } = $props();
</script>

<Quiz data={data.quiz.data as any} />
