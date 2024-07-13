<script lang="ts">
	import clsx from 'clsx';
	import type { Snippet } from 'svelte';
	import { Stretch } from 'svelte-loading-spinners';

	let {
		loading = false,
		disabled = false,
		link = undefined,
		class: className = '',
		variant = undefined,
		children
	}: {
		loading?: boolean;
		disabled?: boolean;
		link?: string;
		class?: string;
		variant?:
			| 'primary'
			| 'secondary'
			| 'neutral'
			| 'accent'
			| 'danger'
			| 'warning'
			| 'success'
			| undefined;
		children: Snippet;
	} = $props();

	let dynamicProps = $derived.by(() => {
		let obj: Record<string, unknown> = {};

		if (disabled) obj.disabled = true;
		if (link) obj.href = link;

		return obj;
	});

	let classes = $derived<string>(`"
        btn relative overflow-hidden
        
        ${clsx(
					disabled && 'btn-disabled',
					loading && 'text-transparent',
					className,

					variant === 'primary' && 'btn-primary',
					variant === 'secondary' && 'btn-secondary',
					variant === 'neutral' && 'btn-neutral',
					variant === 'accent' && 'btn-accent',
					variant === 'danger' && 'btn-danger',
					variant === 'warning' && 'btn-warning',
					variant === 'success' && 'btn-success'
				)}
    "`);
</script>

{#snippet c()}
	<div class:opacity-0={loading}>
		{@render children()}
	</div>

	<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
		{#if loading}
			<Stretch color="currentColor" size={40} />
		{/if}
	</div>
{/snippet}

{#if !link}
	<button class={classes} {...dynamicProps}>
		{@render c()}
	</button>
{:else}
	<a class={classes} {...dynamicProps}>
		{@render c()}
	</a>
{/if}
