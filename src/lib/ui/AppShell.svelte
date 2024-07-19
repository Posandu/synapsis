<script lang="ts">
	import Icon from '@iconify/svelte';
	import clsx from 'clsx';
	import { ripple } from 'svelte-ripple-action';
	import { page } from '$app/stores';
	import { DropdownMenu } from 'bits-ui';
	import { scale } from 'svelte/transition';
	import type { Snippet } from 'svelte';
	import { xpStore } from '$lib/store.svelte';
	import { goto } from '$app/navigation';

	let { children, unreadChatCount }: { children: Snippet; unreadChatCount: number } = $props();

	const menuItems: {
		name: string;
		icon: string;
		link: string;
		realLink?: string;
	}[] = [
		{
			name: 'Home',
			icon: 'material-symbols:home-outline',
			link: '/home'
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
		},
		{
			name: 'Synaptica',
			icon: 'hugeicons:bot',
			link: '/synaptica',
			realLink: '/practice/synaptica'
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

<div class="flex min-h-screen" data-sveltekit-preload-data="false">
	<div
		class="sticky top-0 hidden max-h-screen w-[5.4rem] min-w-[5.4rem] flex-col bg-base-200 md:flex"
	>
		{#each menuItems as item}
			<a
				href={item.realLink || item.link}
				class="flex flex-col items-center justify-center gap-4 py-3 text-sm transition-all {clsx(
					active === item.link
						? 'bg-primary text-white hover:brightness-90'
						: 'text-black/60 hover:bg-black/5'
				)}"
				use:ripple
			>
				<Icon icon={item.icon} class="text-2xl" />
				<span>{item.name}</span>

				{#if unreadChatCount > 0 && item.realLink === '/practice/synaptica'}
					<div
						class="absolute right-2 top-2 inline-flex size-6 items-center justify-center rounded-full bg-red-600 text-xs font-semibold text-white"
					>
						{unreadChatCount}
					</div>
				{/if}
			</a>
		{/each}

		<div class="flex-1"></div>

		<a
			class="tooltip tooltip-right flex flex-col items-center justify-center gap-2 text-lg font-semibold"
			data-tip="XP earned today"
			href="/leaderboard"
		>
			<Icon icon="material-symbols:star" class="text-2xl text-yellow-400" />

			<span>{xpStore.xp || 0}</span>
		</a>

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

	<div class="mx-auto w-full max-w-5xl flex-1 overflow-hidden px-4 pt-0 md:px-6 md:pt-12 lg:px-8">
		<a class="absolute left-0 flex w-full border-b px-4 py-2 md:hidden" href="/leaderboard">
			<Icon icon="material-symbols:star" class="text-2xl text-yellow-400" />

			<span class="ml-4 font-semibold text-black">{xpStore.xp || 0}</span>

			<div class="flex-1"></div>

			<Icon icon="akar-icons:chevron-right" class="text-xl text-black/60" />
		</a>

		<div class="h-12 md:hidden"></div>

		{@render children()}

		<div class="h-20 md:h-8"></div>
	</div>

	<div class="btm-nav border-t shadow md:hidden">
		{#each menuItems as item}
			<button
				onclick={() => goto(item.realLink || item.link)}
				class={clsx(
					{
						'bg-primary text-white': active === item.link
					},
					'transition-all'
				)}
				use:ripple
			>
				<Icon icon={item.icon} class="text-xl" />
				<span>{item.name}</span>

				{#if unreadChatCount > 0 && item.realLink === '/practice/synaptica'}
					<div
						class="absolute right-2 top-2 inline-flex size-6 items-center justify-center rounded-full bg-red-600 text-xs font-semibold text-white"
					>
						{unreadChatCount}
					</div>
				{/if}
			</button>
		{/each}
	</div>
</div>
