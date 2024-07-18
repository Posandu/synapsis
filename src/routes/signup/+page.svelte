<script lang="ts">
	import Icon from '@iconify/svelte';
	import Logo from '$lib/logo.svg';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import { fade } from 'svelte/transition';
	import Button from '$lib/ui/Button.svelte';
	import Input from '$lib/ui/Input.svelte';
	import Typography from '$lib/ui/Typography.svelte';
	import Alert from '$lib/ui/Alert.svelte';

	let {
		data
	}: {
		data: PageData;
	} = $props();

	let passwordShown = $state(false);

	const { form, message, errors, delayed, enhance, constraints } = superForm(data.form, {
		resetForm: false,
		delayMs: 0
	});
</script>

<div class="relative flex min-h-svh items-center justify-center">
	<div class="relative w-full max-w-xs text-center">
		<div class="flex-1">
			<img src={Logo} alt="Logo" class="mx-auto mb-8 size-24 overflow-hidden rounded-xl" />

			<Typography variant="h2" class="mb-4">Sign Up</Typography>
			<Typography variant="subtitle" class="mb-8">Ready to ace your exams?</Typography>

			{#if $message && $message.type == 'error'}
				<Alert type="error" class="mb-4 mt-1">{$message.text}</Alert>
			{/if}
		</div>

		<form method="POST" class="flex flex-col gap-4" use:enhance>
			{#snippet UsernameBefore()}
				<Icon icon="mdi:account" class="opacity-70" />
			{/snippet}

			{#snippet PasswordIconBefore()}
				<Icon icon="mdi:lock" class="opacity-70" />
			{/snippet}

			{#snippet PasswordIconAfter()}
				<button
					class="btn btn-circle btn-ghost btn-xs text-lg opacity-70"
					type="button"
					onclick={() => (passwordShown = !passwordShown)}
				>
					{#if passwordShown}
						<span transition:fade={{ duration: 100 }} class="absolute">
							<Icon icon="mdi:eye" />
						</span>
					{:else}
						<span transition:fade={{ duration: 100 }} class="absolute">
							<Icon icon="mdi:eye-off" />
						</span>
					{/if}
				</button>
			{/snippet}

			<Input
				before={UsernameBefore}
				bind:value={$form.username}
				error={$errors.username?.join('')}
				otherProps={$constraints.username}
				autocomplete="username"
				name="username"
				placeholder="Username"
			/>

			<Input
				type={passwordShown ? 'text' : 'password'}
				before={PasswordIconBefore}
				after={PasswordIconAfter}
				bind:value={$form.password}
				error={$errors.password?.join('')}
				otherProps={$constraints.password}
				autocomplete="current-password"
				name="password"
				placeholder="Password"
			/>

			<Button type="submit" disabled={$delayed} loading={$delayed} variant="primary">Sign Up</Button
			>
		</form>

		<Typography variant="subtitle" class="mt-4">Already have an account?</Typography>

		<Button link="/signin" variant="neutral" class="mt-4 flex">Sign In</Button>
	</div>
</div>
