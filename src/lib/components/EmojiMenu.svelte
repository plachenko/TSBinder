<script>
    import {fly} from 'svelte/transition';
    
    let {handleClose, handleSubmit} = $props();

    let emojiSets = $state([
		{ type: "faces", minVal:128512, maxVal: 128580 },
		{ type: "faces2", minVal:129296, maxVal: 129327},
		{ type: "body", minVal:128066, maxVal: 128080},
		{ type: "animals", minVal:129408, maxVal: 129442},
		{ type: "transport", minVal:128640, maxVal: 128676},
		{ type: "misc", minVal:129494, maxVal: 129535},
			
	]);
	
	let selectedSet = 0;
	// $: console.log(selectedSet)
    $effect(() => {
        let min = emojiSets[selectedSet].minVal;
	    let max = emojiSets[selectedSet].maxVal;
	    
        for (let i = min; i <= max; i++) {
		    //console.log(String.fromCharCode(i))
		    emojis = [...emojis, String.fromCodePoint(i)]
	    }
	
    });
	
	// storage of emojis to make emoji keyboard
	let emojis = $state([]);
	
	
	const clearEmojiMenu = () => emojis = []; 
	
	const chooseEmojiSet = (e) => {	
		selectedSet = Number(e.target.dataset.id);
		clearEmojiMenu()
	}

	// Header on emoji keyboard to select different emoji sets
	let setIcons = $state([128512, 129313, 128074, 129417, 128664, 129504]);
	
	// Emoji icon to open modal of emojis
	let emojiIcon = String.fromCodePoint(128571);
	
	const addEmoji = (e) => {
		// message += e.target.textContent
	}
	

</script>

<div id="emoji-cont" class="bg-slate-200 flex w-full" transition:fly={{ y: -30 }}>
    <header class="bg-slate-300 sticky top-0 flex justify-between">
        {#each setIcons as icon, i}
            <div data-id={i} onclick={chooseEmojiSet}>{String.fromCodePoint(icon)}</div>		
        {/each}
        <div id="closer-icon" onclick={() => modalOpen = false}>X</div>
    </header>

    <div class=" p-1 w-full flex gap-1 h-full flex-row flex-wrap">
        
    {#each emojis as emoji}
        <button class="text-3xl bg-slate-300 hover:bg-slate-500" onclick={addEmoji}>{emoji}</button>
    {/each}
    </div>
</div>

<style>
  * {box-sizing: border-box;}

	section {
		margin: 0 auto;
	}
	
	/* Add styles to the form container */
	.form-container {
		padding: 10px;
		background-color: white;
	}

	/* Full-width textarea */
	.form-container textarea {
		width: 100%;
		padding: 15px;
		margin: 5px 0 22px 0;
		font-size: 1.5rem;
		border: none;
		background: #ddd;
		resize: none;
		min-height: 200px;
	}

	/* When the textarea gets focus, do something */
	.form-container textarea:focus {
		background-color: #ddd;
		outline: none;
	}

	/* Set a style for the submit/login button */
	.form-container .btn {
		background-color: #4CAF50;
		color: white;
		padding: 16px 20px;
		border: none;
		cursor: pointer;
		width: 80%;
		margin-bottom:10px;
		opacity: 0.8;
	}
	
	.form-container .btn:hover {
		opacity: 1;
	}
	
	#btn-emoji-icon-cont {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	#emoji-opener-icon {
		font-size: 2rem;
		cursor: pointer;
		transition: all .1s;
	}
	
	#emoji-opener-icon:active {
		font-size: 2.3rem;
		transform: rotate(10deg);
		cursor: pointer;
	}
	
	#emoji-cont {
		max-height: 248px;
		overflow-y: scroll;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
/* 		border: 1px solid gray;
		background: #ddd; */
	}
	
	#emoji-cont header {
		width: 98%;
		display: flex;
		align-items: center;
		justify-content: space-around;
	}
	
	#emoji-cont header div {
		cursor: pointer;
	}
	
	span {
		font-size: 1.5rem;
		padding: .3rem;
		border: 1px solid gray;
		background: #eee;
		cursor: pointer;
	}
	
	span:active {
		background: #fff;
	}
	
	#closer-icon {
		font-size: 1.5rem;
		font-weight: bold;
		text-align: right;
	}
</style>