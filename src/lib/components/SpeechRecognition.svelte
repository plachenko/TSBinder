<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let { handleSpeech, setListen } = $props();

	let recognition;
	let isListening = $state(false);
	let transcript = '';

	onMount(() => {
		if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
			alert('Your browser does not support Speech Recognition API');
			return;
		}

		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		recognition = new SpeechRecognition();
		recognition.continuous = false;
		recognition.interimResults = true;
		recognition.lang = 'en-US';

		recognition.onresult = (event) => {
			transcript = event.results[event.results.length - 1][0].transcript.trim();
			handleSpeech(transcript);
		};

		recognition.onstart = () => {
			transcript = '';
		};

		recognition.onend = () => {
			handleSpeech(transcript);
			isListening = false;
		};
	});

	onDestroy(() => {
		if (recognition) {
			recognition.stop();
			recognition = null;
		}
	});

	export function toggleListening() {
		if (isListening) {
			recognition.stop();
		} else {
			recognition.start();
		}
		isListening = !isListening;
	}
</script>

<button class="relative w-[95px] rounded bg-blue-500 py-2 text-white" onclick={toggleListening}>
	{#if isListening}
		<div class="absolute top-1 right-1 size-[8px] rounded-full bg-red-600"></div>
		<div class="absolute top-1 right-1 size-[8px] animate-ping rounded-full bg-red-400"></div>
		🔇
	{:else}
		🎙️
	{/if}
</button>

<style>
</style>
