<script lang="ts">
	import type { Category } from '@prisma/client';
	import { Stretch } from 'svelte-loading-spinners';
	import { onMount } from 'svelte';
	import { fetcher, wait } from '$lib/util';
	import { Popover } from 'bits-ui';
	import { scale } from 'svelte/transition';
	import Input from './Input.svelte';
	import Typography from './Typography.svelte';
	import Button from './Button.svelte';
	import toast from 'svelte-french-toast';
	import clsx from 'clsx';

	let searchVal = $state('');
	let loading = $state(true);
	let categories: Category[] = $state([]);
	let catogoriesToShow: Category[] = $derived(
		categories.filter((category) => category.name.toLowerCase().includes(searchVal.toLowerCase()))
	);

	let createCategoryOpen = $state(false);
	let categoryVal = $state('');
	let categoryCreateLoading = $state(false);

	let {
		selectedCategory = $bindable(null)
	}: {
		selectedCategory: Category | null;
	} = $props();

	const loadCategories = async () => {
		loading = true;

		await wait(400); // prevent that ugly layout shift

		categories = (await fetcher<Category[]>('/api/categories')).data;

		loading = false;
	};

	const createCategory = async () => {
		categoryCreateLoading = true;

		const { success, message: errMsg } = await fetcher('/api/categories', {
			method: 'POST',
			body: JSON.stringify({ name: categoryVal })
		});

		if (success) {
			categoryVal = '';
			createCategoryOpen = false;
			categoryCreateLoading = false;
			toast.success('Category created successfully');

			await loadCategories();
		} else {
			categoryCreateLoading = false;

			toast.error(errMsg || 'Failed to create category');
		}
	};

	onMount(loadCategories);
</script>

<div class="flex flex-col rounded-box p-4">
	<div class="mb-2 flex items-baseline justify-between">
		<Typography variant="h5" class="mb-3">Categories</Typography>

		<Popover.Root
			bind:open={createCategoryOpen}
			closeFocus={!categoryCreateLoading}
			closeOnOutsideClick={!categoryCreateLoading}
		>
			<Popover.Trigger class="btn btn-primary btn-sm" disabled={categoryCreateLoading}>
				Create Category
			</Popover.Trigger>

			<Popover.Content
				class="mt-2 w-72 origin-top rounded-box border bg-white p-5 shadow-lg"
				transition={scale}
				transitionConfig={{
					start: 0.9,
					opacity: 0,
					duration: 200
				}}
			>
				<Typography variant="h5" class="mb-3">Create Category</Typography>

				<Input placeholder="Category name" class="mb-3" bind:value={categoryVal} />

				<Button
					variant="primary"
					disabled={categoryCreateLoading}
					loading={categoryCreateLoading}
					onclick={() => {
						createCategory();
					}}
				>
					Create
				</Button>
			</Popover.Content>
		</Popover.Root>
	</div>

	<Input placeholder="Search categories" class="mb-4" bind:value={searchVal} />

	{#if loading}
		<div class="flex min-h-60 flex-1 flex-col items-center justify-center gap-4">
			<Stretch color="currentColor" size={40} />

			<Typography variant="subtitle" class="ml-2">Loading categories...</Typography>
		</div>
	{:else if catogoriesToShow.length === 0}
		<div class="flex min-h-60 flex-1 flex-col items-center justify-center gap-4">
			<Typography variant="h6" class="text-center">Oof!</Typography>
			<Typography variant="subtitle" class="text-center">No categories found</Typography>
		</div>
	{/if}

	{#if catogoriesToShow.length > 0}
		<div class="flex flex-col space-y-1">
			{#each catogoriesToShow as category}
				<button
					class={clsx(
						'rounded-btn px-4 py-2 text-left hover:bg-opacity-90',
						selectedCategory?.id === category.id ? 'bg-primary text-white' : 'bg-base-300'
					)}
					onclick={() =>
						(selectedCategory = category.id === selectedCategory?.id ? null : category)}
				>
					{category.name}
				</button>
			{/each}
		</div>
	{/if}
</div>
