<script lang="ts">
	import Icon from '@iconify/svelte';
	import clsx from 'clsx';
	import { ripple } from 'svelte-ripple-action';
	import { page } from '$app/stores';
	import { DropdownMenu } from 'bits-ui';
	import { scale } from 'svelte/transition';
	import type { Snippet } from 'svelte';
	import { xpStore } from '$lib/store.svelte';

	let { children }: { children: Snippet } = $props();

	const menuItems: {
		name: string;
		icon: string;
		link: string;
	}[] = [
		{
			name: 'Home',
			icon: 'material-symbols:home-outline',
			link: '/'
		},
		{
			name: 'Notes',
			icon: 'tabler:notes',
			link: '/notes'
		},
		{
			name: 'Practice',
			icon: 'clarity:bullseye-line',
			link: '/practice'
		}
	];

	let active = $derived('/' + $page.route.id?.split('/').at(-1));
	let actionsMenuOpen = $state(false);
	let actionsMenu = $state<HTMLButtonElement | undefined>(undefined);

	$effect(() => {
		if (!actionsMenu) return;

		const { destroy } = ripple(actionsMenu);

		return destroy;
	});
</script>

<div class="flex min-h-screen">
	<div class="sticky top-0 flex max-h-screen w-[5.4rem] min-w-[5.4rem] flex-col bg-base-200">
		{#each menuItems as item}
			<a
				href={item.link}
				class="flex flex-col items-center justify-center gap-4 py-3 text-sm transition-all {clsx(
					active === item.link
						? 'bg-primary text-white hover:brightness-90'
						: 'text-black/60 hover:bg-black/5'
				)}"
				use:ripple
			>
				<Icon icon={item.icon} class="text-2xl" />
				<span>{item.name}</span>
			</a>
		{/each}

		<div class="flex-1"></div>

		<div
			class="tooltip tooltip-right flex flex-col items-center justify-center gap-2 text-lg font-semibold"
			data-tip="XP earned today"
		>
			<Icon icon="material-symbols:star" class="text-2xl text-yellow-400" />

			<span>{xpStore.xp || 0}</span>
		</div>

		<DropdownMenu.Root bind:open={actionsMenuOpen}>
			<DropdownMenu.Content
				align="start"
				side="left"
				transition={scale}
				transitionConfig={{
					start: 0.8,
					opacity: 0,
					duration: 200
				}}
				class="origin-bottom-left"
			>
				<ul class="menu menu-md ml-2 w-56 rounded-box bg-white shadow-md">
					<DropdownMenu.Item>
						<li><a href="/settings">Settings</a></li>
					</DropdownMenu.Item>

					<DropdownMenu.Item>
						<li><a href="/signout">Sign Out</a></li>
					</DropdownMenu.Item>
				</ul>
			</DropdownMenu.Content>

			<DropdownMenu.Trigger
				class="mt-auto flex flex-col items-center justify-center gap-4 py-4 text-sm text-black/60 transition-all hover:bg-black/5"
				bind:el={actionsMenu}
			>
				<Icon icon="material-symbols:settings-outline" class="text-2xl" />
				<span> Actions </span>
			</DropdownMenu.Trigger>

			<DropdownMenu.Trigger></DropdownMenu.Trigger>
		</DropdownMenu.Root>
	</div>

	<div class="mx-auto w-full max-w-5xl flex-1 overflow-hidden pt-12 md:px-6 lg:px-8">
		{@render children()}

		<div class="h-8"></div>
	</div>
</div>
