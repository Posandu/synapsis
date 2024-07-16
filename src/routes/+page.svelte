<script lang="ts">
	import { goto } from '$app/navigation';

	let { data } = $props();

	$effect(() => {
		if (data.user) goto('/home');
	});
</script>

{#if !data.user}
	<a href="/signup" class="btn"> Sign up </a>
	<a href="/signin" class="btn"> Sign in </a>
{/if}
