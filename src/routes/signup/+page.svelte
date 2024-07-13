<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	export let data;

	// Client API:
	const { form, message, errors } = superForm(data.form);
</script>

{#if $message}<h3>{$message}</h3>{/if}

<form method="POST" class="flex flex-col mt-96 max-w-4xl bg-primary p-4 text-primary-content mx-auto">
	<label for="username">Username</label>
	<input type="text" name="username" bind:value={$form.username} />
	{#if $errors.username}<p>{$errors.username}</p>{/if}

	<label for="password">Password</label>
	<input type="password" name="password" bind:value={$form.password} />
	{#if $errors.password}<p>{$errors.password}</p>{/if}

	<button class="btn mt-4">Submit</button>
</form>
