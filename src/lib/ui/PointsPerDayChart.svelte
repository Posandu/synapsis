<script lang="ts">
	import {
		BarController,
		CategoryScale,
		LinearScale,
		BarElement,
		Legend,
		Title,
		Tooltip,
		Chart
	} from 'chart.js';
	import { onMount } from 'svelte';

	let {
		data
	}: {
		data: [number, number, number, number, number];
	} = $props();

	let pointsPerDayChart = $state<HTMLCanvasElement | null>(null);

	function getLast5Days(): string[] {
		const days = ['', '', '', '', '', '', ''];
		const today = new Date();
		const last5Days = [];

		for (let i = 4; i >= 0; i--) {
			const date = new Date(today);
			date.setDate(today.getDate() - i);
			last5Days.push(days[date.getDay()]);
		}

		return last5Days;
	}

	onMount(() => {
		Chart.register(BarController, CategoryScale, LinearScale, BarElement, Legend, Title, Tooltip);

		if (pointsPerDayChart) {
			const ctx = pointsPerDayChart.getContext('2d');

			if (ctx) {
				new Chart(ctx, {
					type: 'bar',
					data: {
						labels: getLast5Days(),
						datasets: [
							{
								label: 'Points',
								data: data,
								backgroundColor: 'rgba(54, 162, 235, 0.2)',
								borderColor: 'rgba(54, 162, 235, 1)',
								borderWidth: 1
							}
						]
					},
					options: {
						scales: {
							y: {
								beginAtZero: true
							}
						},
						responsive: true,
						plugins: {
							legend: {
								position: 'top'
							},
							title: {
								display: true,
								text: 'Points for the Last 5 Days'
							}
						}
					}
				});
			}
		}
	});
</script>

<canvas bind:this={pointsPerDayChart} height="300px"></canvas>
