<script lang="ts">
	import { invalidate } from '$app/navigation';
	import BlankState from '$lib/ui/BlankState.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Categories from '$lib/ui/Categories.svelte';
	import Typography from '$lib/ui/Typography.svelte';
	import { fetcher, stringToColor } from '$lib/util';
	import { Dialog } from 'bits-ui';
	import { fade, scale } from 'svelte/transition';

	let { data } = $props();

	let viewCategoriesDialogOpen = $state(false);

	let demoLoading = $state(false);
</script>

<div class="w-full align-baseline md:flex">
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
				<Categories
					refreshFn={() => {
						invalidate('notes:page');
					}}
				/>

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
	<BlankState>
		<Button
			variant="primary"
			loading={demoLoading}
			disabled={demoLoading}
			onclick={() => {
				demoLoading = true;

				fetcher('/api/demo', {
					method: 'POST'
				}).then(() => {
					demoLoading = false;
					invalidate('notes:page');
				});
			}}>Create a few demo notes</Button
		>
	</BlankState>
{:else}
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
		{#each data.categories as category}
			{@const color = stringToColor(category.id)}

			<a
				class="item group relative rounded-lg border p-5 transition-all hover:bg-base-200 focus-visible:ring-4 active:bg-base-200 active:shadow"
				href="/notes/category/{category.id}"
			>
				<Typography variant="h4" class="relative">{category.name}</Typography>
				<Typography variant="subtitle" class="relative mt-4">
					{category._count.notes} notes
				</Typography>

				<div
					class="absolute right-5 top-5 size-4 rounded-full opacity-0 group-hover:opacity-60"
					style="background-color: {color}"
				></div>
			</a>
		{/each}
	</div>
{/if}

{@render ViewCategoriesDialog()}
