<script lang="ts">
	import { fetcher } from '$lib/util';
	import clsx from 'clsx';
	import { onMount, tick } from 'svelte';
	import toast from 'svelte-french-toast';
	import { Diamonds } from 'svelte-loading-spinners';
	import BlankState from './BlankState.svelte';
	import Typography from './Typography.svelte';

	let {
		categoryID,
		onSelect = (id: string) => {},
		onLoad = () => {}
	}: {
		categoryID: string;
		onSelect?: (id: string) => void;
		onLoad?: () => void;
	} = $props();

	let loading = $state(false);
	let data = $state<{ title: string; id: string }[]>([]);
	let selected = $state<string | undefined>();

	onMount(async () => {
		loading = true;

		const res = await fetcher<{ title: string; id: string }[]>(`/api/notes`, {
			method: 'POST',
			body: JSON.stringify({ categoryID })
		});

		if (!res.success) return toast.error(res.message || 'Failed to fetch notes');

		data = res.data;

		loading = false;

		await tick();

		onLoad();
	});
</script>

<div class="flex flex-col items-center">
	{#if loading}
		<Diamonds />
	{:else if data.length == 0}
		<Typography variant="h6" class="text-center">No notes found</Typography>
	{:else}
		<div class="w-full space-y-1">
			{#each data as note}
				<button
					class="w-full rounded-md bg-base-300 p-2 px-4 text-left {clsx({
						'bg-primary text-white': selected === note.id
					})}"
					onclick={() => {
						onSelect(note.id);

						selected = note.id;
					}}>{note.title}</button
				>
			{/each}
		</div>
	{/if}
</div>
