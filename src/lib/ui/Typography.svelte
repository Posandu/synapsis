<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		variant = 'body',
		class: className = '',
		children
	}: {
		variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle' | 'body' | 'caption';
		class?: string;
		children: Snippet;
	} = $props();
</script>

{#if variant === 'h1'}
	<h1 class="text-4xl font-bold {className}">{@render children()}</h1>
{:else if variant === 'h2'}
	<h2 class="text-3xl font-bold {className}">{@render children()}</h2>
{:else if variant === 'h3'}
	<h3 class="text-2xl font-bold {className}">{@render children()}</h3>
{:else if variant === 'h4'}
	<h4 class="text-xl font-bold {className}">{@render children()}</h4>
{:else if variant === 'h5'}
	<h5 class="text-lg font-bold {className}">{@render children()}</h5>
{:else if variant === 'h6'}
	<h6 class="text-base font-bold {className}">{@render children()}</h6>
{:else if variant === 'subtitle'}
	<p class="text-sm opacity-80 {className}">{@render children()}</p>
{:else if variant === 'caption'}
	<p class="text-xs opacity-70 {className}">{@render children()}</p>
{:else}
	<p class="text-base font-normal {className}">{@render children()}</p>
{/if}
