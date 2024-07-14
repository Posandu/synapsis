<script lang="ts">
	import { invalidate, invalidateAll } from '$app/navigation';
	import Button from '$lib/ui/Button.svelte';
	import Categories from '$lib/ui/Categories.svelte';
	import Typography from '$lib/ui/Typography.svelte';
	import { screamToTheVoid, stringToColour } from '$lib/util';
	import { Dialog } from 'bits-ui';
	import { fade, scale } from 'svelte/transition';

	let { data } = $props();

	let viewCategoriesDialogOpen = $state(false);

	$effect(() => {
		invalidateAll();

		screamToTheVoid(viewCategoriesDialogOpen);
	});
</script>

<div class="flex w-full align-baseline">
	<div class="flex-1">
		<Typography variant="h1" class="mb-3">Notes</Typography>
		<Typography variant="subtitle" class="mb-4 max-w-xl">
			Scribble, jot, doodle, and scrawl – your notes are the secret treasure map to the land of
			knowledge!
		</Typography>
	</div>

	<div class="flex items-baseline gap-2 align-baseline">
		<Button
			variant="primary"
			onclick={() => {
				viewCategoriesDialogOpen = true;
			}}
		>
			Manage Categories
		</Button>
		<Button link="/notes/new" variant="primary">New Note</Button>
	</div>
</div>

<Typography variant="h4" class="mb-4 mt-4">Select a category</Typography>

{#snippet ViewCategoriesDialog()}
	<Dialog.Root bind:open={viewCategoriesDialogOpen}>
		<Dialog.Portal class="flex items-center justify-center">
			<Dialog.Overlay
				transition={fade}
				transitionConfig={{ duration: 150 }}
				class="fixed inset-0 z-50 bg-black/80"
			/>

			<Dialog.Content
				transition={scale}
				transitionConfig={{ duration: 200, start: 0.9 }}
				class="fixed left-1/2 top-1/2 z-50 w-full max-w-[94%] -translate-x-1/2 -translate-y-1/2 rounded-box bg-base-100 p-5 shadow-lg outline-none sm:max-w-[490px] md:w-full"
			>
				<Categories />

				<div class="mt-4 flex justify-end gap-2">
					<Button
						variant="ghost"
						onclick={() => {
							viewCategoriesDialogOpen = false;
						}}
					>
						Cancel
					</Button>
				</div>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
{/snippet}

{#if data.categories.length == 0}
	<Typography variant="subtitle" class="mt-4">You don't have any notes yet.</Typography>
{:else}
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
		{#each data.categories as category}
			{@const color = stringToColour(category.id)}

			<a
				class="item rounded-lg p-5 transition-all hover:bg-gray-200 active:scale-95 active:bg-gray-200"
				href="/notes/category/{category.id}"
				style="--c: {color}"
			>
				<Typography variant="h5" class="relative">{category.name}</Typography>
				<Typography variant="subtitle" class="relative mt-4">
					{category._count.notes} notes
				</Typography>
			</a>
		{/each}
	</div>
{/if}

{@render ViewCategoriesDialog()}

<style>
	.item {
		box-shadow: inset 0 0 100px color-mix(in srgb, var(--c), white 80%);
	}
</style>
