<script lang="ts">
  import { onMount } from "svelte";
  import Logo from "$lib/assets/logo.jpg";
  import SpeechRecognition from "$lib/components/SpeechRecognition.svelte";
  import { stations } from "$lib/assets/stations";
  import { fly } from "svelte/transition";

  import { recipes } from "$lib/assets/recipes.js";

  let currentRecipe = $state(null);
  let showAdd = $state(false);
  let searchRecipe = $state("");

  let shownRecipes = $state([]);
  let speechComp = $state(null);
  let searchType = $state(0);

  let searchTypes = [
    { name: "Recipe"},
    // { name: "Station"},
    { name: "Ingredient"},
  ];

  function handleSpeech(transcript) {
    searchRecipe = transcript.toLowerCase();

    if (shownRecipes?.length) {
      currentRecipe = shownRecipes[0];
    }
  }

  $effect(() => {
    shownRecipes = recipes.filter((recipe) => {
      const searchTerm = searchRecipe;
      return (
        recipe.title.toLowerCase().includes(searchTerm) ||
        recipe.ingredients.some((ingredient) =>
          ingredient.name.toLowerCase().includes(searchTerm),
        )
      );
    });
  });

  onMount(() => {
    shownRecipes = recipes;
  });
</script>

<!-- Body -->
<div class="flex h-full flex-col bg-[rgba(41,40,40,0.99)]">
  <!-- Header -->
  <div
    class="flex w-full flex-row items-center justify-center rounded text-white shadow-lg"
  >
    <div class="flex w-full flex-col px-1">
      <div class=" align-center flex w-full flex-1 items-center">
        <div class="border-r-2 border-[#971B2F] pr-1">
          <button
            onclick={() => (currentRecipe = null)}
            class="flex items-center bg-[rgba(41,40,40,0.99)]"
          >
            <img src={Logo} alt="Logo" class="m-1 h-12 w-12 rounded-md" />
          </button>
        </div>
        <h1 class="flex-1 relative text-center text-2xl font-bold">
          {#if currentRecipe}
            <span
              class="absolute w-full left-0 top-[-15px] "
              transition:fly={{ y: -20 }}
            >
              {currentRecipe.title}
            </span>
          {:else}
            <span
              class="absolute w-full left-0 top-[-15px]"
              transition:fly={{ y: 20 }}
            >
              Recipe Book
            </span>
          {/if}
        </h1>
        {#if !showAdd}
          <button
            class="mr-1 rounded border-2 border-white bg-[#971B2F] p-2 text-white"
            onclick={() => {
              showAdd = true;
            }}>+ Add</button
          >
        {/if}
      </div>
      <div>
        {#if showAdd}
          <div class="flex flex-col gap-2">
            {#each ["recipe", "station", "ingredient"] as option}
              <button class="py-2">Add a {option}</button>
            {/each}
          </div>
        {/if}
        {#if currentRecipe}
          <div class="flex gap-2 border-t-2 border-white py-1">
            <button
              style="border-color: #971B2F; background-color: #971B2F;"
              class="flex-1 cursor-pointer rounded bg-red-500 p-2 text-white hover:bg-red-600"
              onclick={() => {
                currentRecipe = null;
                searchRecipe = "";
              }}>Back to Recipes</button
            >
            <button
              class="flex-1 cursor-pointer rounded bg-green-500 p-2 text-white hover:bg-green-600"
              >Edit Recipe</button
            >
          </div>
        {:else}
          <div class="flex gap-1 border-t-2 border-white">
            <div
              class="bg-grey-100 flex w-full flex-row items-center justify-between gap-2 rounded p-1 shadow-md"
            >
              <div class="relative flex flex-1 gap-1">
                <div class="relative gap-1 flex w-full items-center">
                  <button onclick={() => {
                      searchRecipe = "";
                      searchType = (searchType + 1) % searchTypes.length;
                    }}
                    class="p-2">{searchTypes[searchType].name}</button>
                  <input
                    bind:value={searchRecipe}
                    type="text"
                    placeholder={`Search ${searchTypes[searchType].name}s...`}
                    class="w-full rounded border bg-[#CCC] p-2 text-black"
                  />
                  {#if searchRecipe !== ""}
                    <button
                      class="absolute top-1 right-1 size-8 bg-[#CCC]"
                      onclick={() => (searchRecipe = "")}
                      ><div
                        class="flex h-full w-full items-center justify-center rounded-full bg-slate-300/30 text-black"
                      >
                        x
                      </div></button
                    >
                  {/if}
                </div>
                <SpeechRecognition bind:this={speechComp} {handleSpeech} />
              </div>

              <!-- <button class="rounded-md p-2 text-white">Search</button> -->
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
  <div class="relative h-full w-full overflow-y-auto bg-slate-500">
    {#if currentRecipe}
      <div class="flex bg-slate-400 px-3 py-1 text-sm">
        <div class="flex flex-1 justify-center">
          Created: {currentRecipe.created}
        </div>
        {#if currentRecipe.edited}
          <div class="flex-1">Edited: {currentRecipe?.edited}</div>
        {/if}
      </div>
      <div class="p-2 flex gap-2 relative overflow-hidden">
        <div
          transition:fly={{ x: -20 }}
          class="flex flex-1 w-full flex-col rounded bg-slate-300 p-4 shadow-md"
        >
          <div class="mb-4">
            <strong>Ingredients:</strong>
            <ul class="pl-3">
              {#each currentRecipe.ingredients as ingredient}
                <li class="list-disc">{ingredient.name} - {ingredient.qty}</li>
              {/each}
            </ul>
          </div>
          <div>
            <strong>Plating Instructions:</strong>
            <ol class="list-decimal pl-4">
              {#each currentRecipe.plating as step}
                <li style={`color: ${stations[step.station - 1].color};`}>
                  {step.instruction}
                </li>
              {/each}
            </ol>
          </div>
        </div>
        <div transition:fly={{ x: 20 }} class="bg-slate-600 flex-1 rounded-md border-2 font-bold text-white justify-center items-center flex">No Image</div>
      </div>
    {:else if shownRecipes.length == 0}
      <div
        class="place-center flex h-full w-full items-center justify-center text-white"
      >
        <div class="user-select-none rounded-md bg-slate-400/40 p-2">
          No {searchTypes[searchType].name} found.
        </div>
      </div>
    {:else}
      <div
        transition:fly={{ y: -20 }}
        class="absolute top-0 grid w-full grid-cols-1 gap-1 p-2 px-2 sm:grid-cols-2 md:grid-cols-3"
      >
        {#each shownRecipes as recipe}
          <button
            class="flex cursor-pointer flex-col items-start rounded bg-slate-200 p-4 text-left hover:bg-slate-300"
            onclick={() => {
              currentRecipe = recipe;
            }}
          >
            <div class="mb-3 text-slate-600/80 tracking-wider font-medium w-full text-center text-2xl uppercase">
              {recipe.title}
            </div>
            <div class="flex h-full w-full">
              <div class="flex w-full flex-1 flex-row">
                <div class="flex flex-1 flex-col items-start w-full mr-1">
                  <ul class="w-full">
                    {#each recipe.ingredients as ingredient}
                      <li class="flex gap-1 my-1 border-b-2 ml-[20px] items-center border-slate-300 relative">
                          <div class="bg-red-400 rounded-md absolute left-[-20px] p-1">3</div>
                        <div
                          style={`color: ${stations[ingredient.station].textColor}; background-color: ${stations[ingredient.station].color};`}
                          class={`text-xs p-1 rounded mb-1 flex w-full`}
                        >
                          <div class="flex-1">
                            <strong class="flex-1">{ingredient.name}</strong>
                          </div>
                          <div
                            class="flex items-center rounded-[3px] px-1 bg-white/20"
                          >
                            <span>
                              {ingredient.qty}
                            </span>
                          </div>
                        </div>
                      </li>
                    {/each}
                  </ul>
                </div>
              </div>
              <div
                class="flex h-full flex-1 items-center justify-center bg-slate-500"
              >
                no image
              </div>
            </div>
          </button>
        {/each}
      </div>
    {/if}
  </div>
</div>
