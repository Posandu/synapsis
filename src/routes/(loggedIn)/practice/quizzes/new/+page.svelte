<script lang="ts">
	import type { QuizCreateAPIInput, QuizCreateAPIOutput } from '$lib/controllers/Quiz';
	import { newQuizInitialStore } from '$lib/store.svelte';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Note from '$lib/ui/Note.svelte';
	import Typography from '$lib/ui/Typography.svelte';
	import { fetcher, goBack, wait } from '$lib/util';
	import Confetti from 'svelte-confetti';
	import toast from 'svelte-french-toast';
	import { Stretch } from 'svelte-loading-spinners';

	let loading = $state(false);
	let everythingDone = $state(false);
	let createQuizPromises = $state<ReturnType<typeof createSingleQuizObject>[]>([]);

	type PromiseState = 'pending' | 'fulfilled' | 'rejected';

	const createSingleQuizObject = (noteID: string) => {
		let status = $state<PromiseState>('pending');
		let quizID = $state<string>('');

		const createPromise = async () => {
			status = 'pending';

			const resp = await fetcher<QuizCreateAPIOutput>('/api/quiz', {
				method: 'POST',
				body: JSON.stringify({ noteID } satisfies QuizCreateAPIInput)
			});

			if (!resp.success) {
				toast.error(resp.message || 'Something went wrong.');

				status = 'rejected';

				return;
			}

			status = 'fulfilled';
			quizID = resp.data.quizID;
		};

		return {
			get status() {
				return status;
			},
			get quizID() {
				return quizID;
			},
			noteID,
			promise: createPromise
		};
	};

	const create = async () => {
		createQuizPromises = [];
		loading = true;
		everythingDone = false;

		if (!newQuizInitialStore?.notes) {
			toast.error('No notes selected.');

			return;
		}

		for (const note of newQuizInitialStore.notes) {
			createQuizPromises = [...createQuizPromises, createSingleQuizObject(note.id)];
		}

		const forEachSeries = async (iterable: typeof createQuizPromises) => {
			for (const item of iterable) {
				await item.promise();
			}
		};

		await forEachSeries(createQuizPromises);

		loading = false;
		everythingDone = true;
	};
</script>

<div class="mb-4 flex w-full gap-4 align-baseline">
	<div class="flex items-baseline align-baseline">
		<Button
			onclick={() => {
				goBack('/practice/quizzes');
			}}
			icon="mdi:arrow-left"
		></Button>
	</div>

	<div class="flex-1">
		<Typography variant="h1" class="mb-2">New Quiz</Typography>

		<Typography variant="subtitle" class="mb-4 max-w-xl">
			Create a new quiz by selecting notes from the notes page.
		</Typography>
	</div>
</div>

{#if !newQuizInitialStore.notes || newQuizInitialStore.notes.length === 0}
	<Alert type="info">
		<span>
			Select some notes in the <a href="/notes" class="btn btn-secondary btn-xs">notes page</a> to create
			a quiz.
		</span>
	</Alert>
{:else}
	<Typography variant="h3" class="mb-4">Selected Notes</Typography>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each newQuizInitialStore.notes as note}
			{@const promiseForThis = createQuizPromises.find((promise) => promise.noteID === note.id)}

			<div class="relative">
				<Note {note} onclick={(e) => e.preventDefault()} withLink={false}>
					<div class="h-4"></div>

					<div class="mt-auto flex gap-2">
						{#if promiseForThis?.quizID}
							<Button
								variant="primary"
								link="/practice/quizzes/{promiseForThis.quizID}"
								openLinkInNewTab
							>
								View Quiz
							</Button>
						{:else}
							<Button
								onclick={() => {
									newQuizInitialStore.removeItem(note.id);
								}}
							>
								Remove
							</Button>
						{/if}
					</div>
				</Note>

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

	<div class="mt-8 flex gap-2">
		{#if !everythingDone}
			<Button
				variant="primary"
				{loading}
				onclick={() => {
					create();
				}}
				disabled={loading}
			>
				Create Quiz{newQuizInitialStore.notes.length > 1 ? 'zes' : ''}
			</Button>
		{:else}
			<Confetti />
		{/if}

		<Button
			onclick={() => {
				goBack('/practice/quizzes');

				newQuizInitialStore.reset();
			}}
			disabled={loading}
		>
			Cancel
		</Button>
	</div>
{/if}
