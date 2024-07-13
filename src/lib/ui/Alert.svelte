<script lang="ts">
	import Icon from '@iconify/svelte';
	import clsx from 'clsx';
	import type { Snippet } from 'svelte';

	let {
		children,
		type = 'info',
		class: className
	}: { children: Snippet; type: 'info' | 'error' | 'success'; class?: string } = $props();

	const icons = {
		error: 'material-symbols:error',
		success: 'material-symbols:check',
		info: 'material-symbols:info'
	};
</script>

<div
	role="alert"
	class="alert {clsx({
		'alert-error': type === 'error',
		'alert-success': type === 'success',
		'alert-info': type === 'info'
	})} {className} mb-4 mt-1"
>
	<Icon icon={icons[type]} />

	{@render children()}
</div>
