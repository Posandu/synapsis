<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		type = 'text',
		before = undefined,
		after = undefined,
		value = $bindable<string>(),
		otherProps = {},
		error = undefined,
		name = undefined,
		placeholder = undefined,
		autocomplete = undefined
	}: {
		value: string;
		type?: 'text' | 'password';
		before?: Snippet;
		after?: Snippet;
		otherProps?: Record<string, any>;
		error?: string;
		name?: string;
		placeholder?: string;
		autocomplete?: AutoFill;
	} = $props();
</script>

<label class="w-full">
	<label class="input input-bordered flex items-center justify-center gap-2">
		{#if before}
			{@render before()}
		{/if}

		<input {type} class="grow" {name} {placeholder} {autocomplete} bind:value {...otherProps} />

		{#if after}
			{@render after()}
		{/if}
	</label>

	{#if error}
		<div class="label">
			<span class="label-text-alt text-error">{error}</span>
		</div>
	{/if}
</label>
