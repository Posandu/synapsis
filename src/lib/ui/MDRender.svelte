<script lang="ts">
	import { Carta, Markdown } from 'carta-md';
	import DOMPurify from 'isomorphic-dompurify';

	let {
		value
	}: {
		value: string;
	} = $props();

	const carta = new Carta({
		sanitizer: DOMPurify.sanitize
	});
</script>

<Markdown {carta} {value} />
