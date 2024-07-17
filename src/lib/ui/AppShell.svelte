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

	let { children }: { children: Snippet } = $props();

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

	<div class="mx-auto w-full max-w-5xl flex-1 px-4 overflow-hidden pt-4 md:pt-12 md:px-6 lg:px-8">
		{@render children()}

		<div class="h-20 md:h-8"></div>
	</div>

	<div class="btm-nav border-t md:hidden">
		{#each menuItems as item}
			<button
				onclick={() => goto(item.realLink || item.link)}
				class={clsx(
					{
						'active border-t-black bg-primary text-white': active === item.link
					},
					'transition-all'
				)}
				use:ripple
			>
				<Icon icon={item.icon} class="text-xl" />
				<span>{item.name}</span>
			</button>
		{/each}
	</div>
</div>
