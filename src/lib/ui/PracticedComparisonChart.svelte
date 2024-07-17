<script lang="ts">
	import { PieController, ArcElement, Legend, Title, Tooltip, Chart } from 'chart.js';
	import { onMount } from 'svelte';
	import BlankState from './BlankState.svelte';

	let {
		practiced,
		notPracticed
	}: {
		practiced: number;
		notPracticed: number;
	} = $props();

	let practicedData = {
		labels: ['Practiced', 'Not Practiced'],
		datasets: [
			{
				data: [practiced, notPracticed],
				backgroundColor: ['#FF6384', '#36A2EB'],
				hoverBackgroundColor: ['#FF6384', '#36A2EB']
			}
		]
	};

	let practicedChart = $state<HTMLCanvasElement | null>(null);

	onMount(() => {
		Chart.register(PieController, ArcElement, Legend, Title, Tooltip);

		if (practicedChart) {
			const ctx = practicedChart.getContext('2d');

			if (ctx) {
				new Chart(ctx, {
					type: 'pie',
					data: practicedData
				});
			}
		}
	});
</script>

<canvas bind:this={practicedChart}></canvas>
