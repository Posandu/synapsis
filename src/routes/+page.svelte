<script lang="ts">
	export let data;
</script>

{#if data.user}
	<div class="">
		<h1>Welcome, {data.user.username}</h1>

		<a href="/signout" class="btn"> Sign out </a>
	</div>
{:else}
	<a href="/signup" class="btn"> Sign up </a>
	<a href="/signin" class="btn"> Sign in </a>
{/if}
