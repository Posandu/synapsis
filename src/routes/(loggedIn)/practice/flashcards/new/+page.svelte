<script lang="ts">
	import { newFlashcardInitialStore } from '$lib/store.svelte';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Note from '$lib/ui/Note.svelte';
	import Typography from '$lib/ui/Typography.svelte';
	import { fetcher, goBack } from '$lib/util';
	import Icon from '@iconify/svelte';
	import Confetti from 'svelte-confetti';
	import toast from 'svelte-french-toast';
	import { Stretch } from 'svelte-loading-spinners';

	let loading = $state(false);
	let everythingDone = $state(false);
	let flashcardPromises = $state<ReturnType<typeof createSingleFlashCardObject>[]>([]);

	type PromiseState = 'pending' | 'fulfilled' | 'rejected';

	const createSingleFlashCardObject = (noteID: string) => {
		let status = $state<PromiseState>('pending');
		let flashcardID = $state<string>('');

		const createPromise = async () => {
			status = 'pending';

			const resp = await fetcher<string>('/api/flashcard', {
				method: 'POST',
				body: JSON.stringify({ noteID })
			});

			if (!resp.success) {
				toast.error(resp.message || 'Something went wrong.');

				status = 'rejected';

				return;
			}

			status = 'fulfilled';
			flashcardID = resp.data;
		};

		return {
			get status() {
				return status;
			},
			get flashcardID() {
				return flashcardID;
			},
			noteID,
			promise: createPromise
		};
	};

	const create = async () => {
		flashcardPromises = [];
		loading = true;
		everythingDone = false;

		if (!newFlashcardInitialStore?.notes) {
			toast.error('No notes selected.');

			return;
		}

		for (const note of newFlashcardInitialStore.notes) {
			flashcardPromises = [...flashcardPromises, createSingleFlashCardObject(note.id)];
		}

		const forEachSeries = async (iterable: typeof flashcardPromises) => {
			for (const item of iterable) {
				await item.promise();
			}
		};

		await forEachSeries(flashcardPromises);

		loading = false;
		everythingDone = true;
	};

	$effect(() => {
		return () => {
			newFlashcardInitialStore.reset();
		};
	});
</script>

<div class="mb-4 flex w-full gap-4 align-baseline">
	<div class="flex items-baseline align-baseline">
		<Button
			onclick={() => {
				goBack('/practice/flashcards');
			}}
			icon="mdi:arrow-left"
		></Button>
	</div>

	<div class="flex-1">
		<Typography variant="h1" class="mb-2">New Flashcard</Typography>

		<Typography variant="subtitle" class="mb-4 max-w-xl">
			Create a new flashcard by selecting notes from the notes page.
		</Typography>
	</div>
</div>

{#if typeof newFlashcardInitialStore.notes === 'undefined' || newFlashcardInitialStore.notes?.length === 0}
	<Alert type="info">
		<span>
			Select some notes in the <a href="/notes" class="btn btn-secondary btn-xs">notes page</a> to create
			a flashcard.
		</span>
	</Alert>
{:else}
	<Typography variant="h3" class="mb-4">Selected Notes</Typography>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each newFlashcardInitialStore.notes as note}
			{@const promiseForThis = flashcardPromises.find((promise) => promise.noteID === note.id)}

			<div class="relative">
				<Note {note} withLink={false}>
					<div class="h-4"></div>

					<div class="mt-auto flex gap-2">
						{#if promiseForThis?.flashcardID}
							<Button
								variant="primary"
								link="/practice/flashcards/{promiseForThis.flashcardID}"
								openLinkInNewTab
							>
								View Flashcard
							</Button>
						{:else}
							<Button
								onclick={() => {
									newFlashcardInitialStore.removeItem(note.id);
								}}
							>
								Remove
							</Button>
						{/if}
					</div>
				</Note>

				{#if promiseForThis?.status === 'rejected'}
					<div
						class="absolute inset-0 flex size-full flex-col items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-100/90"
					>
						<Icon icon="material-symbols:error" class="text-6xl text-red-600" />

						<Typography variant="h5" class="mt-2 text-red-900"
							>Failed to create flashcard</Typography
						>
					</div>
				{/if}

				{#if promiseForThis?.status === 'pending'}
					<div
						class="absolute inset-0 grid size-full place-items-center rounded-lg border bg-white/80"
					>
						<Stretch />
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<div class="mt-4 flex gap-2">
		{#if !everythingDone}
			<Button
				variant="primary"
				{loading}
				onclick={() => {
					create();
				}}
				disabled={loading}
			>
				Create Flashcard{newFlashcardInitialStore.notes.length > 1 ? 's' : ''}
			</Button>

			<Button
				onclick={() => {
					goBack('/practice/flashcards');

					newFlashcardInitialStore.reset();
				}}
				disabled={loading}
			>
				Cancel
			</Button>
		{/if}

		{#if everythingDone}
			<Confetti />
		{/if}
	</div>
{/if}
