<script lang="ts">
	import NotePage from '$lib/ui/NotePage.svelte';

	let { data } = $props();
</script>

<NotePage
	{data}
	initialValues={{
		title: data.note.title,
		content: data.note.content,
		category: data.note.category,
		id: data.note.id
	}}
/>
