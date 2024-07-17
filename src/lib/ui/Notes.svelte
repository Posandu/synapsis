<script lang="ts">
	import { fetcher } from '$lib/util';
	import clsx from 'clsx';
	import { onMount, tick } from 'svelte';
	import toast from 'svelte-french-toast';
	import { Diamonds } from 'svelte-loading-spinners';

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
	{:else if data.length === 0}
		<p class="text-gray-500">No notes found</p>
	{:else}
		<div class="w-full">
			{#each data as note}
				<button
					class="w-full rounded-md p-2 text-left hover:bg-gray-100 {clsx({
						'bg-gray-100': selected === note.id
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
