<script lang="ts">
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import Typography from './Typography.svelte';
	import Button from './Button.svelte';
	import Alert from './Alert.svelte';
	import clsx from 'clsx';
	import { fetcher, wait } from '$lib/util';
	import { Carta, Markdown } from 'carta-md';
	import DOMPurify from 'isomorphic-dompurify';

	const carta = new Carta({
		sanitizer: DOMPurify.sanitize
	});

	type state =
		| 'loadingCamera'
		| 'loadedCamera'
		| 'loadCameraError'
		| 'imageProcessing'
		| 'imageProcessError'
		| 'imageProcessDone';

	let currentState = $state<state>('loadingCamera');

	let { content = $bindable(''), loading = $bindable() }: { content: string; loading: boolean } =
		$props();

	$effect(() => {
		loading = ![
			'loadedCamera',
			'loadCameraError',
			'imageProcessDone',
			'imageProcessError'
		].includes(currentState);
	});

	let canvas = $state<HTMLCanvasElement>();
	let video = $state<HTMLVideoElement>();

	const startCamera = async () => {
		content = '';

		await wait(500); // Wait for the UI to render

		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: { exact: 'environment' } // This requests the back camera specifically
				}
			});

			requestAnimationFrame(() => {
				if (video) {
					video.srcObject = stream;

					currentState = 'loadedCamera';
				}
			});
		} catch (err) {
			toast.error('Could not start the webcam');

			currentState = 'loadCameraError';
		}
	};

	const getText = async () => {
		currentState = 'imageProcessing';

		const formData = new FormData();
		formData.append('image', canvas!.toDataURL('image/png'));

		const res = await fetcher<string>('/api/notes/scan', {
			method: 'POST',
			body: formData
		});

		if (res.success) {
			currentState = 'imageProcessDone';

			toast.success("Image processed and ready to go! We've just fast-tracked your workflow.", {
				duration: 6000
			});

			content = res.data;
		} else {
			currentState = 'imageProcessError';

			toast.error(res.message || 'Something went wrong');
		}
	};

	const scan = async () => {
		if (!canvas || !video) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return toast.error('Something went wrong');

		const { videoWidth, videoHeight } = video;

		canvas.width = videoWidth;
		canvas.height = videoHeight;

		ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

		const img = new Image();
		img.src = canvas.toDataURL('image/png');

		img.onload = () => {
			const { width, height } = img;
			const aspectRatio = width / height;

			const targetWidth = 500;
			const targetHeight = targetWidth / aspectRatio;

			canvas!.width = targetWidth;
			canvas!.height = targetHeight;

			ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

			getText();
		};
	};

	onMount(startCamera);
</script>

<div
	class="floating relative mx-auto w-full overflow-hidden rounded-box {!(
		currentState == 'imageProcessing'
	) && 'hidden'}"
>
	<canvas id="canvas" bind:this={canvas} class="w-full"></canvas>

	<div class="shimmer"></div>
</div>

{#if currentState == 'imageProcessDone'}
	<div class="w-full">
		<Markdown {carta} value={content} />
	</div>
{/if}

{#if currentState == 'imageProcessError'}
	<Alert type="error" class="mx-auto mb-4 max-w-sm">Could not process the image</Alert>
{/if}

<!-- svelte-ignore a11y_media_has_caption -->
<video
	id="video"
	autoplay
	bind:this={video}
	class="mx-auto mb-4 max-h-96 w-full {clsx(currentState !== 'loadedCamera' && 'hidden')}"
></video>

{#if currentState == 'loadingCamera'}
	<div class="w-full text-center">
		<Typography variant="subtitle" class="mx-auto max-w-sm">Loading camera...</Typography>
	</div>
{/if}

{#if currentState == 'loadCameraError'}
	<Alert type="error" class="mx-auto max-w-sm">Could not start the webcam</Alert>
{/if}

{#if currentState == 'loadedCamera'}
	<div class="mt-4 w-full text-center">
		<Typography variant="subtitle" class="mx-auto mb-4 max-w-sm">
			Position your camera to frame the note. Once it's clear and in focus, tap the scan button.
		</Typography>

		<Button onclick={scan} class="mx-auto" variant="primary">Scan</Button>
	</div>
{/if}

<style>
	.floating {
		box-shadow: rgba(0, 0, 0, 0.2) 0px 60px 40px -7px;
	}

	.shimmer {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: linear-gradient(
			to right,
			transparent 0%,
			#f0f0f08a 20%,
			#f0f0f0a2 40%,
			transparent 100%
		);
		background-repeat: no-repeat;
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite linear;
	}

	@keyframes shimmer {
		0% {
			background-position: -200% 0;
		}
		100% {
			background-position: 200% 0;
		}
	}
</style>
