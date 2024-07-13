<script lang="ts">
	import Button from '$lib/ui/Button.svelte';
	import Typography from '$lib/ui/Typography.svelte';
</script>

<div class="flex w-full align-baseline">
	<div class="flex-1">
		<Typography variant="h1" class="mb-3">Notes</Typography>
		<Typography variant="subtitle" class="mb-4 max-w-xl">
			Scribble, jot, doodle, and scrawl – your notes are the secret treasure map to the land of
			knowledge!
		</Typography>
	</div>

	<div class="flex items-baseline align-baseline">
		<Button link="/notes/new" variant="primary">New Note</Button>
	</div>
</div>
