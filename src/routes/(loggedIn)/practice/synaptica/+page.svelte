<script lang="ts">
	import Button from '$lib/ui/Button.svelte';
	import Typography from '$lib/ui/Typography.svelte';
	import { fetcher, goBack } from '$lib/util';
	import type { CoreMessage } from 'ai';
	import type { SynapTicaResponse } from './+server';
	import MdRender from '$lib/ui/MDRender.svelte';
	import { newFlashcardInitialStore, newQuizInitialStore } from '$lib/store.svelte';
	import { goto } from '$app/navigation';
	import { onMount, tick } from 'svelte';
	import { Diamonds } from 'svelte-loading-spinners';
	import Categories from '$lib/ui/Categories.svelte';
	import toast from 'svelte-french-toast';
	import Notes from '$lib/ui/Notes.svelte';
	import { ripple } from 'svelte-ripple-action';
	import { queryParam } from 'sveltekit-search-params';
	import BlankState from '$lib/ui/BlankState.svelte';

	let chatContainer = $state<HTMLDivElement | null>(null);
	let inputElement = $state<HTMLInputElement | null>(null);

	let messages: CoreMessage[] = $state([]);

	let input = $state('');
	let loading = $state(false);

	let { data } = $props();

	let activeChatID = queryParam('c');
	let startChatLoading = $state(false);

	const scrollToBottom = () =>
		chatContainer && (chatContainer.scrollTop = chatContainer?.scrollHeight);

	const PROMPTS = {
		recallNotes: 'Hey! I want to recall a note',
		makeStudyPlan: 'Hey! my exams are coming up next month, I need to make a study plan',
		practiceNotes: 'Hey! I need to practice some notes'
	};

	$effect(() => {
		if ($activeChatID && data.chat) {
			console.log(data.chat.data);
			if (data.chat.data) {
				messages = data.chat.data as any;
			}
		}
	});

	$effect(() => {
		const lastMessage = messages.at(-1);

		if (!lastMessage) return;

		let foundToolCall = false;
		let toolCalls: {
			id: string;
			name: string;
		}[] = [];

		if (lastMessage.role == 'assistant') {
			for (const messageItem of lastMessage.content) {
				if (
					typeof messageItem !== 'string' &&
					messageItem['type'] == 'tool-call' &&
					(messageItem['toolName'] == 'makeQuiz' || messageItem['toolName'] == 'makeFlashcard')
				) {
					foundToolCall = true;

					toolCalls.push({
						id: messageItem['toolCallId'],
						name: messageItem['toolName']
					});
				}
			}
		}

		if (foundToolCall && toolCalls.length > 0) {
			messages = [
				...messages,
				{
					role: 'tool',
					content: toolCalls.map((item) => ({
						result: '',
						toolCallId: item.id,
						toolName: item.name,
						type: 'tool-result'
					}))
				}
			];
		}
	});

	$effect(() => {
		const lastMessage = messages.at(-1);

		if (!lastMessage) return;

		let foundToolCallRequiresInput = false;

		if (lastMessage.role == 'assistant') {
			for (const messageItem of lastMessage.content) {
				if (
					typeof messageItem !== 'string' &&
					messageItem['type'] == 'tool-call' &&
					(messageItem['toolName'] == 'showCategorySelect' ||
						messageItem['toolName'] == 'showNoteSelect')
				) {
					foundToolCallRequiresInput = true;
				}
			}
		}

		if (foundToolCallRequiresInput) {
			loading = true;
		}
	});

	const hasToolCallResult = (toolCallId: string) => {
		for (const message of messages) {
			if (message.role == 'tool') {
				for (const messageItem of message.content) {
					if (messageItem['toolCallId'] == toolCallId) {
						return true;
					}
				}
			}
		}

		return false;
	};

	const handleSubmit = async (event?: Event, ignoreBlankUserInput = true) => {
		event?.preventDefault();

		if (input.trim()) {
			messages = [
				...messages,
				{
					role: 'user',
					content: input
				}
			];
		} else if (ignoreBlankUserInput) {
			return;
		}

		input = '';

		loading = true;

		await tick();

		scrollToBottom();

		const response = await fetch(`/practice/synaptica`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ messages, chatID: $activeChatID })
		});

		const data: SynapTicaResponse = await response.json();

		messages = [...messages, ...data];

		loading = false;

		await tick();

		inputElement?.focus();
	};

	onMount(() => {
		scrollToBottom();
	});

	$inspect(messages);
</script>

{#if !$activeChatID}
	<div class="mb-8 w-full gap-4 align-baseline md:flex">
		<div class="flex items-baseline align-baseline">
			<Button
				onclick={() => {
					goBack('/practice/');
				}}
				icon="mdi:arrow-left"
			></Button>
		</div>

		<div class="flex-1 pt-4 md:pt-0">
			<Typography variant="h1">{$activeChatID ? data.chat?.title : 'Synaptica'}</Typography>

			<Typography variant="subtitle" class="mt-3 max-w-xl">
				Your personalized learning assistant! Just tell me what you need to learn, and I'll help
				you. 🧠
			</Typography>
		</div>

		<div class="mt-4 flex items-baseline md:mt-0 md:justify-end">
			<Button
				variant="primary"
				disabled={startChatLoading}
				loading={startChatLoading}
				onclick={async () => {
					startChatLoading = true;

					const resp = await fetcher<string>('/practice/synaptica', {
						method: 'POST',
						body: JSON.stringify({
							action: 'startChat'
						})
					});

					if (resp.success) {
						$activeChatID = resp.data;
					} else {
						toast.error('Failed to start chat');
					}

					startChatLoading = false;
				}}
			>
				Start a chat
			</Button>
		</div>
	</div>
{/if}

{#if $activeChatID}
	<div
		class="mx-auto flex max-h-[calc(100vh-170px)] min-h-[calc(100vh-170px)] w-full flex-col gap-4 overflow-auto rounded-t-xl md:border bg-base-200/20 p-4"
		bind:this={chatContainer}
	>
		<div class="mx-auto mt-4 max-w-3xl text-center">
			<Typography variant="h4">Hey there! 👋</Typography>

			<Typography variant="subtitle" class="mx-auto mt-2 max-w-xl">
				You can ask me to recall notes, make quizzes, or flashcards for you. Just type your message
				below and hit send!
			</Typography>

			<div class="mt-4 grid gap-4 md:grid-cols-3">
				<button
					class="rounded-xl bg-base-200 p-4 text-center hover:bg-base-300"
					onclick={() => {
						input = PROMPTS.recallNotes;
						inputElement?.focus();
					}}
					use:ripple
				>
					<p class="text-sm opacity-80">Hey! I want to recall a note</p>

					<span class="mt-4 block text-sm font-semibold">Recall notes</span>
				</button>

				<button
					class="rounded-xl bg-base-200 p-4 text-center hover:bg-base-300"
					onclick={() => {
						input = PROMPTS.makeStudyPlan;
						inputElement?.focus();
					}}
					use:ripple
				>
					<p class="text-sm opacity-80">
						Hey! my exams are coming up next month, I need to make a study plan
					</p>

					<span class="mt-4 block text-sm font-semibold">Make a study plan</span>
				</button>

				<button
					class="rounded-xl bg-base-200 p-4 text-center hover:bg-base-300"
					onclick={() => {
						input = PROMPTS.practiceNotes;
						inputElement?.focus();
					}}
					use:ripple
				>
					<p class="text-sm opacity-80">Hey! I need to practice some notes</p>

					<span class="mt-4 block text-sm font-semibold">Practice</span>
				</button>
			</div>
		</div>

		{#each messages as message}
			{#if message.role == 'assistant'}
				{#each message.content as messageItem}
					{#if typeof messageItem !== 'string'}
						{#if messageItem['type'] == 'text' && messageItem['text']}
							<div class="prose prose-sm max-w-xs rounded-xl bg-base-200 px-4">
								<MdRender value={messageItem['text']} />
							</div>
						{:else if messageItem['type'] == 'tool-call'}
							{#if messageItem['toolName'] == 'makeQuiz'}
								<div class="max-w-xs rounded-xl border bg-white p-4 shadow">
									<Typography variant="h4" class="mb-4">New Quiz</Typography>

									<Button
										onclick={() => {
											newQuizInitialStore.addItem({
												title: 'Synaptica Quiz',
												id: (messageItem['args'] as any)['noteID']
											});

											goto('/practice/quizzes/new');
										}}
									>
										Make quiz
									</Button>

									<p class="mt-2">Good luck!</p>
								</div>
							{:else if messageItem['toolName'] == 'makeFlashcard'}
								<div class="box">
									<Typography variant="h4" class="mb-4">Make Flashcards</Typography>

									<Button
										onclick={() => {
											newFlashcardInitialStore.addItem({
												title: 'Synaptica Flashcards',
												id: (messageItem['args'] as any)['noteID']
											});

											goto('/practice/flashcards/new');
										}}
									>
										Make flashcards
									</Button>

									<p class="mt-2">Good luck!</p>
								</div>
							{:else if messageItem['toolName'] == 'showCategorySelect'}
								<div class="box">
									<Typography variant="h4" class="mb-4">Select category</Typography>

									<Categories
										removePadding
										hideHeader
										selectedCategory={(messageItem['args'] as any)['categoryID']}
										onSelect={(cat) => {
											if (hasToolCallResult(messageItem['toolCallId'])) {
												toast.error('You already did that!');

												return;
											}

											messages = [
												...messages,
												{
													role: 'tool',
													content: [
														{
															toolCallId: messageItem['toolCallId'],
															result: cat,
															toolName: 'showCategorySelect',
															type: 'tool-result',
															isError: false
														}
													]
												}
											];

											handleSubmit(undefined, false);
										}}
										onLoad={scrollToBottom}
									/>
								</div>
							{:else if messageItem['toolName'] == 'showNoteSelect'}
								<div class="box">
									<Typography variant="h4" class="mb-4">Select note</Typography>

									<Notes
										categoryID={(messageItem['args'] as any)['categoryID']}
										onLoad={scrollToBottom}
										onSelect={(note) => {
											if (hasToolCallResult(messageItem['toolCallId'])) {
												toast.error('You already did that!');

												return;
											}

											messages = [
												...messages,
												{
													role: 'tool',
													content: [
														{
															toolCallId: messageItem['toolCallId'],
															result: note,
															toolName: 'showNoteSelect',
															type: 'tool-result',
															isError: false
														}
													]
												}
											];

											handleSubmit(undefined, false);
										}}
									/>
								</div>
							{/if}
						{/if}
					{/if}
				{/each}
			{:else if message.role == 'user' && typeof message.content == 'string'}
				<div class="prose prose-sm ml-auto max-w-xs rounded-xl bg-primary px-4 text-white">
					<MdRender value={message.content} />
				</div>
			{/if}
		{/each}

		{#if loading}
			<div class="my-4 px-4">
				<Diamonds color="#0069FF" />
			</div>
		{/if}

		<div class="h-10"></div>
	</div>

	<form onsubmit={handleSubmit} class="join flex w-full rounded-t-none">
		<input
			bind:value={input}
			class="input join-item input-bordered flex-1"
			type="text"
			autocomplete="off"
			disabled={loading}
			placeholder="Type your message here"
			bind:this={inputElement}
		/>
		<button type="submit" class="btn btn-primary join-item" disabled={loading}>Send</button>
	</form>
{:else if data.chats.length === 0}
	<BlankState desc="Start a chat maybe?" />
{:else}
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each data.chats as chat}
			<a href="?c={chat.id}" class="rounded-xl border p-5 shadow transition-all hover:shadow-lg">
				<Typography variant="h4" class="font-medium">{chat.title}</Typography>

				<Typography variant="subtitle" class="mt-2">{chat.createdAt.toLocaleString()}</Typography>

				<Button variant="danger" class="mt-4 block w-full">Delete</Button>
			</a>
		{/each}
	</div>
{/if}

<style>
	.box {
		@apply mb-4 max-w-xs rounded-xl border bg-white p-4 shadow-lg;
	}
</style>
