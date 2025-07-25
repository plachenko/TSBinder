<script lang="ts">
  import { onMount } from "svelte";
  import Logo from "$lib/assets/logo.jpg";
  import SpeechRecognition from "$lib/components/SpeechRecognition.svelte";
  import { stations } from "$lib/assets/stations";
  import { fly } from "svelte/transition";
  import AddForm from "$lib/components/AddForm.svelte";

  import { PantryChecklist } from "$lib/assets/pantry";

  import { recipes } from "$lib/assets/recipes.js";
  import HighlightText from "$lib/components/HighlightText.svelte";

  let currentRecipe = $state(null);
  let showAdd = $state(false);
  let searchRecipe = $state("");
  let setBinder = $state(false);
  let showAllStationIng = $state(false);

  let checklistArr = $state(["opening", "prep", "closing"]);
  let checklistIdx = $state(0);

  let showChecklist = $state(false);

  let shownRecipes = $state([]);
  let speechComp = $state(null);
  let resultFound = $state(false);
  let searchType = $state(0);

  let addOption = $state("");

  let searchTypes = [
    { name: "Recipe" },
    // { name: "Station"},
    { name: "Ingredient" },
  ];

  let ingredientsArr = $state([]);
  let recipeStationsArr = $state([]);

  let stationBinderInt = $state(-1);

  function handleSpeech(transcript) {
    searchRecipe = "";
    searchRecipe = transcript
      ? transcript.toLowerCase().replace(/[\p{P}$+<=>^`|~]/gu, "")
      : "";
  }

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  $effect(() => {
    if (!showAdd) {
      addOption = "";
    }

    if (currentRecipe !== null) {
      recipeStationsArr = currentRecipe.ingredients
        .map((ing) => stations[ing.station].name)
        .filter(onlyUnique);
    } else {
      recipeStationsArr = [];
    }

    shownRecipes = recipes.filter((recipe) => {
      const searchTerm = searchRecipe;

      return (
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some((ingredient) =>
          ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      );
    });
  });

  onMount(() => {
    console.log("hi");
    shownRecipes = recipes;
    ingredientsArr = recipes
      .flatMap((recipe) => recipe.ingredients)
      .map((ingredient) => {
        return {
          name: ingredient.name.toLowerCase(),
          station: ingredient.station,
        };
      })
      .filter((item, idx, self) => {
        return self.findIndex((e) => e.name === item.name) === idx;
      });
    window.addEventListener("keyup", (e) => {
      console.log(e.key);
      if (e.key == "Backspace") {
        if (currentRecipe) {
          currentRecipe = null;
          searchRecipe = "";
        }
      }
    });
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
            onclick={() => {
              currentRecipe = null;
              setBinder = false;
              searchRecipe = "";
              stationBinderInt = -1;
              showAdd = false;
              showChecklist = false;
            }}
            class="flex items-center bg-[rgba(41,40,40,0.99)]"
          >
            <img src={Logo} alt="Logo" class="m-1 h-12 w-12 rounded-md" />
          </button>
        </div>
        <h1 class="flex-1 relative text-center text-2xl font-bold">
          {#if currentRecipe && !showChecklist}
            <div
              class="flex absolute w-full left-0 top-[-15px] justify-center"
              transition:fly={{ y: -20 }}
            >
              <div class="h-full flex gap-2 relative w-full justify-center">
                <button
                  style={`background-color: ${stations[stationBinderInt]?.color};`}
                  onclick={() => {
                    setBinder = !setBinder;
                  }}
                  class="p-1 absolute top-[-11px] gap-2 items-center flex border-2 border-white/70 flex"
                >
                  {#if stationBinderInt >= 0}
                    {stations[stationBinderInt]?.emoji}
                  {:else}
                    <img src={Logo} alt="Logo" class="size-7 rounded-md" />
                  {/if}
                  <div
                    style={`background-color: ${stations[stationBinderInt]?.color || "rgba(250,250,250,.2)"};`}
                    class="p-1 rounded-md flex-1"
                  >
                    {currentRecipe.title}
                  </div>
                </button>
              </div>
            </div>
          {:else}
            <span
              class="absolute w-full left-0 top-[-26px]"
              transition:fly={{ y: 20 }}
            >
              <button
                style={`
                  background-color: ${stationBinderInt >= 0 ? stations[stationBinderInt].color : "#971B2F"}; 
                  color: ${stationBinderInt >= 0 ? stations[stationBinderInt].textColor : "#FFF"}; 
                  `}
                onclick={() => {
                  setBinder = !setBinder;
                  showAdd = false;
                }}
                class="p-2 border-2 border-white/70 bg-[#971B2F] text-white rounded"
              >
                {#if stationBinderInt == -1}
                  <div class="flex items-center gap-2">
                    <img src={Logo} alt="Logo" class="size-7 rounded-md" />
                    <span>TSQ Salem Binder</span>
                  </div>
                {:else}
                  <div class="flex">
                    <div class="border-r-2 pr-2 mr-2">
                      {stations[stationBinderInt].emoji}
                    </div>
                    <span class="underline mr-1 capitalize"
                      >{stations[stationBinderInt].name}</span
                    >
                    {#if showChecklist}
                      <span>Checklist</span>
                    {:else}
                      Binder
                    {/if}
                  </div>
                {/if}
              </button>
            </span>
          {/if}
        </h1>
        {#if stationBinderInt >= 0 && !setBinder && !showChecklist}
          <button
            class={` ${showAllStationIng ? "border-2 border-white" : ""} p-2 mr-2`}
            onclick={() => {
              showAllStationIng = !showAllStationIng;
            }}
          >
            {#if showAllStationIng}
              👁️
            {:else}
              👁️‍🗨️
            {/if}
          </button>
        {/if}
        {#if !showAdd && stationBinderInt >= 0 && stations[stationBinderInt].checklist}
          <button
            style={`background-color: ${stationBinderInt >= 0 ? stations[stationBinderInt].color : "#971B2F"}`}
            class={`mr-1 rounded ${showChecklist ? "border-2 border-white" : ""} bg-[#971B2F] p-2 text-white`}
            onclick={() => {
              // showAdd = true;
              showChecklist = !showChecklist;
            }}>📝</button
          >
        {/if}
        <button
          onclick={() => (showAdd = !showAdd)}
          class={`p-1 text-3xl mr-1 flex items-center justify-center ${showAdd ? "border-2 border-white" : ""}`}
        >
          +
        </button>
      </div>
      <div>
        {#if !setBinder}
          {#if currentRecipe && !showChecklist}
            <div class="flex gap-2 border-t-2 border-white py-1">
              <button
                style={`border-color: #971B2F; background-color: ${stations[stationBinderInt]?.color || "#971B2F"};`}
                class="flex-1 cursor-pointer rounded bg-red-500 p-2 text-white hover:bg-red-600"
                onclick={() => {
                  currentRecipe = null;
                  searchRecipe = "";
                }}
                >Back to {stations[stationBinderInt]?.name || ""} Recipes</button
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
                    {#if showChecklist}
                      <div class="flex w-full gap-2">
                        {#each checklistArr as item, idx}
                          <button
                            style={`background-color: ${stations[stationBinderInt]?.color};`}
                            class={`${checklistIdx == idx ? "border-2 border-white" : ""} flex-1 p-1`}
                            onclick={() => {
                              checklistIdx = idx;
                            }}>{item}</button
                          >
                        {/each}
                      </div>
                    {:else if !showAdd}
                      <button
                        onclick={() => {
                          searchType = (searchType + 1) % searchTypes.length;
                        }}
                        class="p-2">{searchTypes[searchType].name}</button
                      >
                      <input
                        bind:value={searchRecipe}
                        type="text"
                        autofocus
                        onkeydown={(e) => {
                          if (e.key === "Enter") {
                            searchRecipe = searchRecipe.trim();
                            if (searchRecipe !== "") {
                              if (searchTypes[searchType].name == "Recipe") {
                                currentRecipe = shownRecipes[0];
                              } else if (
                                searchTypes[searchType].name == "Ingredient"
                              ) {
                                console.log("hehe");
                              }
                            }
                          }
                        }}
                        placeholder={`Search ${searchTypes[searchType].name}s...`}
                        class="w-full rounded border bg-[#CCC] p-2 text-black"
                      />
                      {#if searchRecipe !== ""}
                        <button
                          class="absolute top-1 right-1 size-8 bg-[#CCC]"
                          onclick={() => (searchRecipe = "")}
                          ><div
                            class="text-2xl flex h-full w-full items-center justify-center rounded-full bg-slate-300/30 text-black/50 hover:text-black"
                          >
                            X
                          </div>
                        </button>
                      {/if}
                    {/if}
                  </div>

                  {#if !showChecklist && !showAdd}
                    <SpeechRecognition
                      bind:this={speechComp}
                      {handleSpeech}
                      {resultFound}
                    />
                  {/if}
                </div>

                <!-- <button class="rounded-md p-2 text-white">Search</button> -->
              </div>
            </div>
          {/if}
        {/if}
      </div>
    </div>
  </div>
  <div class="relative h-full w-full overflow-y-auto bg-slate-500">
    {#if setBinder}
      <div
        class="flex flex-col min-h-full bg-slate-800 absolute w-full"
        transition:fly={{ y: -70 }}
      >
        <div class="w-full h-full flex flex-col">
          <div class="flex-1 items-center p-1">
            <button
              onclick={() => {
                stationBinderInt = -1;
                setBinder = false;
              }}
              class={`${stationBinderInt == -1 ? "border-2 border-white/60" : "hover:border-2 border-white/60"} w-full h-full`}
            >
              <div>
                <div class="px-6 text-3xl border-r-2 flex justify-center py-2">
                  <div class="flex items-center gap-2 pr-1 mr-1">
                    <img src={Logo} alt="Logo" class="size-7 rounded-md" />
                  </div>
                  <span
                    >TSQ Salem
                    {#if currentRecipe}
                      <span class="bg-white/20 rounded-md text-white px-2 py-0"
                        >{currentRecipe.title}</span
                      >
                    {:else}
                      Binder
                    {/if}</span
                  >
                </div>
              </div>
            </button>
          </div>

          {#each stations as station, idx}
            <div class="flex-1 items-center p-2">
              <button
                onclick={() => {
                  stationBinderInt = idx;
                  setBinder = false;

                  if (!recipeStationsArr.includes(station.name)) {
                    currentRecipe = null;
                    // searchRecipe = "";
                  }
                }}
                style={`background-color: ${station.color}; color: ${station.textColor};`}
                class={`p-1 ${recipeStationsArr.includes(station.name) || currentRecipe == null ? "" : "opacity-30"} ${idx == stationBinderInt ? "border-2 border-white/60" : ""} ${currentRecipe == null || recipeStationsArr.includes(station.name) ? "" : ""} box-border w-full h-full items-center flex flex-row`}
              >
                <div class="px-6 text-3xl border-r-2">
                  {station.emoji}
                </div>
                <div class="flex-1">
                  {station.name.toUpperCase()}
                  {#if currentRecipe && recipeStationsArr.includes(station.name)}
                    <span class="bg-white/20 rounded-md text-white px-2 py-0"
                      >{currentRecipe.title}</span
                    >
                  {:else}
                    Binder
                  {/if}
                </div>
              </button>
            </div>
          {/each}
        </div>
      </div>
    {:else if searchTypes[searchType].name == "Ingredient" && ingredientsArr
        .map((ing) => ing.name)
        .some((ing) => ing.toLowerCase().includes(searchRecipe.toLowerCase()))}
      <div
        class="absolute bg-slate-200 w-full p-2 flex flex-col gap-2"
        transition:fly={{ y: -70 }}
      >
        {#each ingredientsArr as ingredient, idx}
          {#if ingredient.name
            .toLowerCase()
            .includes(searchRecipe.toLowerCase())}
            {#if stationBinderInt < 0 || (ingredient.station == stationBinderInt && !showAllStationIng) || showAllStationIng}
              <button
                class="p-2 flex-1 w-full text-left flex items-center rounded hover:opacity-60"
                style={`background-color: ${stations[ingredient.station].color}`}
              >
                <span class="border-r-2 pr-2 mr-2 float-left text-2xl">
                  {stations[ingredient.station].emoji}
                </span>
                <HighlightText text={ingredient.name} search={searchRecipe} />
              </button>
            {/if}
          {/if}
        {/each}
      </div>
    {:else if showChecklist}
      <div class="relative w-full h-full overflow-y-auto">
        <div class="bg-slate-200 w-full absolute flex flex-col gap-2 p-2">
          <form>
            {#each Object.keys(PantryChecklist) as checkItem, checkItemIdx}
              <fieldset
                class={`border-2 ${checklistIdx !== checkItemIdx ? "hidden" : ""}`}
              >
                {#if checklistIdx !== checkItemIdx}
                  <button
                    class="text-lg font-bold text-slate-600 hover:text-slate-800"
                    onclick={() => {
                      checklistIdx = checkItemIdx;
                    }}
                  >
                    {checkItem} Checklist
                  </button>
                {/if}
                <legend class="text-lg font-bold ml-2 capitalize">
                  {checkItem} Checklist
                </legend>
                {#each PantryChecklist[checkItem] as item, idx}
                  <div class="flex p-4 bg-slate border-b-2 border-slate-300">
                    {#if checkItemIdx == 1}
                      <input
                        type="checkbox"
                        style="width: 20px; margin-right: 10px;"
                        id={checklistArr[checklistIdx] + "checkItem_" + idx}
                        name={checklistArr[checklistIdx] + "checkItem_" + idx}
                        value={checkItem}
                      />
                      <label
                        class="flex-1"
                        for={checklistArr[checklistIdx] + "checkItem_" + idx}
                        >{item.item}</label
                      >
                      <input
                        type="range"
                        min="0"
                        max="5"
                        value={item.qty}
                        class="flex-1"
                        id={checklistArr[checklistIdx] + "checkItem_qty_" + idx}
                        name={checklistArr[checklistIdx] +
                          "checkItem_qty_" +
                          idx}
                      />
                    {:else}
                      <input
                        type="checkbox"
                        style="width: 20px; margin-right: 10px;"
                        id={checklistArr[checklistIdx] + "checkItem_" + idx}
                        name={checklistArr[checklistIdx] + "checkItem_" + idx}
                        value={checkItem}
                      />
                      <label
                        class="flex-1"
                        for={checklistArr[checklistIdx] + "checkItem_" + idx}
                        >{item}</label
                      >
                    {/if}
                  </div>
                {/each}
              </fieldset>
            {/each}
          </form>
        </div>
      </div>
    {:else if showAdd}
      {#if addOption == "station"}
        <div class="bg-red-300 absolute w-full">
          <AddForm />
        </div>
      {:else}
        <div
          transition:fly={{ y: 20 }}
          class="absolute w-full flex flex-col p-3 gap-2 h-full justify-center"
        >
          {#each ["station", "recipe", "ingredient"] as option, idx}
            <button
              class="hover:opacity-60 py-2 flex-1"
              onclick={() => (addOption = option)}
              >Add a{idx == 2 ? "n" : ""} {option}</button
            >
          {/each}
        </div>
      {/if}
    {:else if currentRecipe}
      <div class="absolute flex bg-slate-400 px-3 py-1 text-sm w-full">
        <div class="flex flex-1 justify-center">
          Created: {currentRecipe.created}
        </div>
        {#if currentRecipe.edited}
          <div class="flex-1">Edited: {currentRecipe?.edited}</div>
        {/if}
      </div>
      <div class="p-2 flex gap-2 absolute overflow-hidden w-full mt-[30px]">
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
        <div
          transition:fly={{ x: 20 }}
          class="bg-slate-600 flex-1 rounded-md border-2 font-bold text-white justify-center items-center flex"
        >
          No Image
        </div>
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
          {#if stationBinderInt < 0 || recipe.ingredients.filter((ing) => ing.station == stationBinderInt).length > 0}
            <button
              class="flex cursor-pointer flex-col items-start rounded bg-slate-200 p-4 text-left hover:bg-slate-300"
              onclick={() => {
                currentRecipe = recipe;
              }}
            >
              <div
                class="mb-3 justify-center flex text-slate-600/80 tracking-wider font-medium w-full text-center text-2xl uppercase"
              >
                {#if searchRecipe}
                  <HighlightText text={recipe.title} search={searchRecipe} />
                {:else}
                  {recipe.title}
                {/if}
              </div>
              <div class="flex h-full w-full">
                <div class="flex w-full flex-1 flex-row">
                  <div class="flex flex-1 flex-col items-start w-full mr-1">
                    <ul class="w-full">
                      {#each recipe.ingredients as ingredient, idx}
                        {#if stationBinderInt < 0 || ingredient.station == stationBinderInt || showAllStationIng}
                          <li
                            transition:fly={{ x: -20, delay: idx * 20 }}
                            class="flex gap-1 my-1 border-b-2 ml-[20px] items-center border-slate-300 relative"
                          >
                            <div
                              class="bg-red-400 rounded-md absolute left-[-20px] p-1"
                            >
                              3
                            </div>
                            <div
                              style={`color: ${stations[ingredient.station].textColor}; background-color: ${stations[ingredient.station].color};`}
                              class={`text-xs p-1 rounded mb-1 flex w-full`}
                            >
                              <div class="flex-1">
                                <strong class="flex-1 tracking-smaller">
                                  {#if ingredient.name
                                    .toLowerCase()
                                    .includes(searchRecipe.toLowerCase())}
                                    <HighlightText
                                      text={ingredient.name}
                                      search={searchRecipe}
                                    />
                                  {:else}
                                    {ingredient.name}
                                  {/if}
                                </strong>
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
                        {/if}
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
          {/if}
        {/each}
      </div>
    {/if}
  </div>
</div>
