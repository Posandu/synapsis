<script lang="ts">
	import type { FlashCardData } from '$lib/controllers/Flashcard';
	import Flashcard from '$lib/ui/Flashcard.svelte';

	let { data } = $props();
</script>

<Flashcard
	flashcards={(data.flashcard.data as FlashCardData)!.cards}
	noteID={data.flashcard.noteID}
	title={(data.flashcard.data as FlashCardData).title}
	history={data.history}
/>
