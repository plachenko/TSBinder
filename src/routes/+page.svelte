<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import Logo from '$lib/assets/logo.jpg';
	import SpeechRecognition from '$lib/components/SpeechRecognition.svelte';

	// export let data: PageData;

	let currentRecipe = $state(null);
	let showAdd = $state(false);

	let recipes = $state([
		{
			title: 'Steak Avocado',
			ingredients: [
				{ name: 'Baby Gem Lettuce', qty: '1/2 head', station: 1 },
				{ name: 'Romaine Lettuce', qty: '2 oz', station: 1 },
				{ name: 'Black Beans', qty: '1', station: 1 },
				{ name: 'Cut Corn', qty: '1/4 cup', station: 2 },
				{ name: 'Grape Tomatoes', qty: '1/4', station: 2 },
				{ name: 'Jalapeno Ranch Dressing', qty: '1/4', station: 2 },
				{ name: 'Avocado', qty: '1/2', station: 2 },
				{ name: 'Sirloin Steak', qty: '1 ea', station: 2 },
				{ name: 'Tortilla Strips', qty: '1.5 oz', station: 2 },
				{ name: 'Maldon Salt', qty: '.5 tsp', station: 2 },
				{ name: 'Micro Babes', qty: '.1 oz', station: 2 }
			],
			plating: [
				{ instruction: 'Slice steak against the grain', station: 2 },
				{ instruction: 'Arrange avocado slices around plate', station: 1 },
				{ instruction: 'Top with thinly sliced red onion', station: 2 },
				{ instruction: 'Garnish with cilantro leaves', station: 2 },
				{ instruction: 'Drizzle with lime juice', station: 2 }
			],
			created: '2023-05-15'
		},
		{
			title: 'Ceasar Salad',
			ingredients: [
				{ name: 'romaine lettuce', qty: '9 oz', station: 1 },
				{ name: 'Parmesan cheese', qty: 'yellow scoop', station: 1 },
				{ name: 'croutons', qty: '10 ea', station: 1 },
				{ name: 'Caesar dressing', qty: '2 oz', station: 1 }
			],
			plating: [
				{ instruction: 'Chop romaine into bite-sized pieces', station: 1 },
				{ instruction: 'Toss with dressing in a large bowl', station: 1 },
				{ instruction: 'Transfer to serving plate', station: 1 },
				{ instruction: 'Top with croutons and shaved Parmesan', station: 1 },
				{ instruction: 'Finish with lemon wedge on side', station: 1 }
			],
			created: '2023-02-10'
		},
		{
			title: 'Garden Crunch',
			ingredients: [
				{ name: 'mixed greens', qty: '4 cups', station: 1 },
				{ name: 'cucumber', qty: '1', station: 1 },
				{ name: 'cherry tomatoes', qty: '1 cup', station: 1 },
				{ name: 'carrots', qty: '2', station: 1 },
				{ name: 'balsamic vinaigrette', qty: '3 tbsp', station: 1 }
			],
			plating: [
				{ instruction: 'Create a base with mixed greens', station: 2 },
				{ instruction: 'Arrange cucumber ribbons around edges', station: 2 },
				{ instruction: 'Place halved cherry tomatoes in center', station: 2 },
				{ instruction: 'Add carrot ribbons on top', station: 2 },
				{ instruction: 'Drizzle vinaigrette in zigzag pattern', station: 2 }
			],
			created: '2023-04-22'
		},
		{
			title: 'Thai Chicken',
			ingredients: [
				{ name: 'chicken breast', qty: '1 lb', station: 4 }, // grill
				{ name: 'peanut sauce', qty: '1/2 cup', station: 1 }, // pantry
				{ name: 'bell peppers', qty: '2', station: 1 }, // pantry
				{ name: 'basil', qty: '1/4 cup', station: 1 }, // pantry
				{ name: 'rice', qty: '2 cups cooked', station: 3 } // oven
			],
			plating: [
				{ instruction: 'Scoop rice into bowl as base', station: 2 }, // prep
				{ instruction: 'Arrange sliced chicken on one side', station: 2 }, // prep
				{ instruction: 'Place bell pepper strips on other side', station: 2 }, // prep
				{ instruction: 'Drizzle peanut sauce over everything', station: 2 }, // prep
				{ instruction: 'Garnish with fresh basil leaves', station: 2 } // prep
			],
			created: '2023-06-18'
		},
		{
			title: 'Creamy Burrata',
			ingredients: [
				{ name: 'burrata cheese', qty: '8 oz', station: 1 }, // pantry
				{ name: 'heirloom tomatoes', qty: '2', station: 1 }, // pantry
				{ name: 'basil', qty: '1/4 cup', station: 1 }, // pantry
				{ name: 'olive oil', qty: '2 tbsp', station: 1 }, // pantry
				{ name: 'balsamic glaze', qty: '1 tbsp', station: 1 } // pantry
			],
			plating: [
				{ instruction: 'Arrange tomato slices in circular pattern', station: 2 }, // prep
				{ instruction: 'Place whole burrata in center', station: 2 }, // prep
				{ instruction: 'Drizzle with olive oil and balsamic', station: 2 }, // prep
				{ instruction: 'Scatter fresh basil leaves', station: 2 }, // prep
				{ instruction: 'Add cracked black pepper on top', station: 2 } // prep
			],
			created: '2023-03-05'
		},
		{
			title: 'Simple Salad',
			ingredients: [
				{ name: 'mixed greens', qty: '4 cups', station: 1 }, // pantry
				{ name: 'cucumber', qty: '1/2', station: 1 }, // pantry
				{ name: 'red wine vinaigrette', qty: '2 tbsp', station: 1 }, // pantry
				{ name: 'salt', qty: 'to taste', station: 1 }, // pantry
				{ name: 'pepper', qty: 'to taste', station: 1 } // pantry
			],
			plating: [
				{ instruction: 'Pile greens high in center of plate', station: 2 }, // prep
				{ instruction: 'Arrange cucumber slices around edges', station: 2 }, // prep
				{ instruction: 'Lightly dress with vinaigrette', station: 2 }, // prep
				{ instruction: 'Season with salt and pepper', station: 2 }, // prep
				{ instruction: 'Serve immediately', station: 2 } // prep
			],
			created: '2023-01-12'
		},
		{
			title: 'Chopped Greek',
			ingredients: [
				{ name: 'romaine lettuce', qty: '4 cups', station: 1 }, // pantry
				{ name: 'feta cheese', qty: '1/2 cup', station: 1 }, // pantry
				{ name: 'kalamata olives', qty: '1/4 cup', station: 1 }, // pantry
				{ name: 'red onion', qty: '1/4', station: 1 }, // pantry
				{ name: 'Greek dressing', qty: '3 tbsp', station: 1 } // pantry
			],
			plating: [
				{ instruction: 'Chop all ingredients uniformly', station: 2 }, // prep
				{ instruction: 'Mix in large bowl with dressing', station: 2 }, // prep
				{ instruction: 'Pack into small bowl then invert onto plate', station: 2 }, // prep
				{ instruction: 'Sprinkle extra feta on top', station: 2 }, // prep
				{ instruction: 'Add whole olives as garnish', station: 2 } // prep
			],
			created: '2023-07-30'
		},
		{
			title: 'Whipped Feta Dip',
			ingredients: [
				{ name: 'feta cheese', qty: '8 oz', station: 1 }, // pantry
				{ name: 'cream cheese', qty: '4 oz', station: 1 }, // pantry
				{ name: 'olive oil', qty: '1 tbsp', station: 1 }, // pantry
				{ name: 'lemon juice', qty: '1 tbsp', station: 1 }, // pantry
				{ name: 'garlic', qty: '1 clove', station: 1 } // pantry
			],
			plating: [
				{ instruction: 'Spoon dip into shallow serving bowl', station: 2 }, // prep
				{ instruction: 'Use back of spoon to create swirls', station: 2 }, // prep
				{ instruction: 'Drizzle with olive oil', station: 2 }, // prep
				{ instruction: 'Sprinkle with chili flakes or herbs', station: 2 }, // prep
				{ instruction: 'Serve with pita chips or vegetables', station: 2 } // prep
			],
			created: '2023-08-14'
		},
		{
			title: 'Ahi Tuna Bowl',
			ingredients: [
				{ name: 'ahi tuna', qty: '1 lb', station: 2 }, // prep
				{ name: 'sushi rice', qty: '2 cups cooked', station: 3 }, // oven
				{ name: 'avocado', qty: '1', station: 1 }, // pantry
				{ name: 'cucumber', qty: '1/2', station: 1 }, // pantry
				{ name: 'sesame seeds', qty: '1 tbsp', station: 1 } // pantry
			],
			plating: [
				{ instruction: 'Press rice into bottom of bowl', station: 2 }, // prep
				{ instruction: 'Arrange sliced tuna in fan pattern', station: 2 }, // prep
				{ instruction: 'Add avocado and cucumber slices', station: 2 }, // prep
				{ instruction: 'Sprinkle with sesame seeds', station: 2 }, // prep
				{ instruction: 'Serve with soy sauce and wasabi', station: 2 } // prep
			],
			created: '2023-09-05'
		},
		{
			title: 'Guacamole',
			ingredients: [
				{ name: 'avocado', qty: '3', station: 1 }, // pantry
				{ name: 'lime', qty: '1', station: 1 }, // pantry
				{ name: 'red onion', qty: '1/4 cup', station: 1 }, // pantry
				{ name: 'cilantro', qty: '2 tbsp', station: 1 }, // pantry
				{ name: 'salt', qty: 'to taste', station: 1 } // pantry
			],
			plating: [
				{ instruction: 'Scoop guacamole into stone mortar', station: 2 }, // prep
				{ instruction: 'Create small well in center', station: 2 }, // prep
				{ instruction: 'Add lime wedge to side', station: 2 }, // prep
				{ instruction: 'Garnish with cilantro sprig', station: 2 }, // prep
				{ instruction: 'Serve with tortilla chips', station: 2 } // prep
			],
			created: '2023-10-22'
		},
		{
			title: 'Birthday Cake Donuts',
			sizes: ['regular', 'Large'],
			ingredients: [
				{ name: 'Birthday Cake Donut', qty: '12 ea', station: 2 },
				{ name: 'Unsalted Butter Solids Cabot 620', qty: '2 oz', comment: 'Melted', station: 2 },
				{ name: 'Lemon Sugar Prep', qty: '4 Tbsp', station: 2 },
				{ name: 'White chocolate glaze prep', qty: '3 Oz', station: 0 },
				{ name: 'Sprinkles, Rainbow', qty: '.1 oz', comment: 'pinch', station: 0 }
			],
			plating: [
				{
					instruction:
						'Reheat the Birthday Cake Donuts in the oven at 350F until warm. ~2 minutes.',
					station: 2
				},
				{
					instruction:
						'Take donuts out of the oven then immediately toss for 1 second into warm melted butter. *Toss only 1 second, too long will make them soggy.',
					station: 2
				},
				{ instruction: 'Toss donuts immediately in Lemon Sugar using mixing bowl.', station: 2 },
				{
					instruction:
						'Put coated donutes in the branded bag and place on small green plate, logo side up. Donuts should tumble out of bag.',
					station: 2
				},
				{
					instruction:
						'Add black napkin to the other side of the plate. Fill a ramekin with white chocolate glaze and place on the plate, on the top of the napkin.',
					station: 0
				},
				{ instruction: 'Sprinkle white chocolate glaze with rainbow sprinkles.', station: 0 }
			],
			created: '2025-1-14',
			Edited: '2025-1-19'
		},
		{
			title: 'Flourless Chocolate Cake',
			ingredients: [
				{ name: 'dark chocolate', qty: '8 oz', station: 1 }, // pantry
				{ name: 'butter', qty: '1/2 cup', station: 1 }, // pantry
				{ name: 'eggs', qty: '4', station: 1 }, // pantry
				{ name: 'sugar', qty: '3/4 cup', station: 1 }, // pantry
				{ name: 'cocoa powder', qty: '1/4 cup', station: 1 } // pantry
			],
			plating: [
				{ instruction: 'Dust plate with cocoa powder first', station: 2 }, // prep
				{ instruction: 'Place cake slice slightly off-center', station: 2 }, // prep
				{ instruction: 'Add fresh berries alongside', station: 2 }, // prep
				{ instruction: 'Drizzle chocolate sauce decoratively', station: 2 }, // prep
				{ instruction: 'Top with quenelle of whipped cream', station: 2 } // prep
			],
			created: '2023-12-25'
		},
		{
			title: 'Birthday Cake',
			ingredients: [
				{ name: 'flour', qty: '2 1/2 cups', station: 1 }, // pantry
				{ name: 'sugar', qty: '1 1/2 cups', station: 1 }, // pantry
				{ name: 'eggs', qty: '3', station: 1 }, // pantry
				{ name: 'butter', qty: '1 cup', station: 1 }, // pantry
				{ name: 'vanilla extract', qty: '1 tbsp', station: 1 } // pantry
			],
			plating: [
				{ instruction: 'Place on decorative cake stand', station: 2 }, // prep
				{ instruction: 'Arrange candles as desired', station: 2 }, // prep
				{ instruction: 'Add fresh flowers around base', station: 2 }, // prep
				{ instruction: 'Use piping for message', station: 2 }, // prep
				{ instruction: 'Serve with ice cream', station: 2 } // prep
			],
			created: '2023-01-01'
		},
		{
			title: 'Cookie skillet',
			ingredients: [
				{ name: 'flour', qty: '1 1/2 cups', station: 1 }, // pantry
				{ name: 'chocolate chips', qty: '1 cup', station: 1 }, // pantry
				{ name: 'butter', qty: '1/2 cup', station: 1 }, // pantry
				{ name: 'brown sugar', qty: '1/2 cup', station: 1 }, // pantry
				{ name: 'egg', qty: '1', station: 1 } // pantry
			],
			plating: [
				{ instruction: 'Serve warm in skillet', station: 2 }, // prep
				{ instruction: 'Top with scoop of vanilla ice cream', station: 2 }, // prep
				{ instruction: 'Drizzle with caramel sauce', station: 2 }, // prep
				{ instruction: 'Sprinkle with sea salt', station: 2 }, // prep
				{ instruction: 'Provide small spoons for sharing', station: 2 } // prep
			],
			created: '2023-02-14'
		}
	]);
	let shownRecipes = $state([]);
	let searchRecipe = $state('');
	let stations = $state([
		{
			name: 'pantry',
			color: '#8D6E63', // Warm brown (like wood shelves)
			textColor: '#FFFFFF' // White text for contrast
		},
		{
			name: 'prep',
			color: '#4CAF50', // Fresh green (like cutting boards)
			textColor: '#000000' // Black text for contrast
		},
		{
			name: 'oven',
			color: '#F44336', // Alert red (for heat warning)
			textColor: '#FFFFFF' // White text
		},
		{
			name: 'stove',
			color: '#FF9800', // Orange (burner flames)
			textColor: '#000000' // Black text
		},
		{
			name: 'grill',
			color: '#795548', // Dark brown (grill marks)
			textColor: '#FFFFFF' // White text
		},
		{
			name: 'fryer',
			color: '#FFC107', // Golden yellow (fried food)
			textColor: '#000000' // Black text
		},
		{
			name: 'saute',
			color: '#9C27B0', // Purple (distinct from other stations)
			textColor: '#FFFFFF' // White text
		}
	]);
	let speechComp = $state(null);

	function handleSpeech(transcript) {
		console.log('test', transcript);
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
				recipe.ingredients.some((ingredient) => ingredient.name.toLowerCase().includes(searchTerm))
			);
		});
	});

	onMount(() => {
		shownRecipes = recipes;
	});
</script>

<div class="flex h-full flex-col bg-[rgba(41,40,40,0.99)]">
	<div class="flex w-full flex-row items-center justify-center rounded text-white shadow-lg">
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
				<h1 class="flex-1 text-center text-2xl font-bold">
					{#if currentRecipe}
						{currentRecipe.title}
					{:else}
						Recipe Book
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
						{#each ['recipe', 'station', 'ingredient'] as option}
							<button class="py-2">Add a {option}</button>
						{/each}
					</div>
				{/if}
				{#if currentRecipe}
					<div class="flex gap-2 border-t-2 border-white py-1">
						<button
							class="flex-1 cursor-pointer rounded bg-red-500 p-2 text-white hover:bg-red-600"
							onclick={() => {
								currentRecipe = null;
								searchRecipe = '';
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
								<input
									bind:value={searchRecipe}
									type="text"
									placeholder="Search recipes..."
									class="w-full rounded border bg-[#CCC] p-2 text-black"
								/>
								{#if searchRecipe !== ''}
									<button
										class="absolute top-1 right-1 size-8 bg-[#CCC]"
										onclick={() => (searchRecipe = '')}
										><div
											class="flex h-full w-full items-center justify-center rounded-full bg-slate-300/30 text-black"
										>
											x
										</div></button
									>
								{/if}
								<SpeechRecognition bind:this={speechComp} {handleSpeech} />
							</div>

							<!-- <button class="rounded-md p-2 text-white">Search</button> -->
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
	<!--
	<div class="px-2">
		<div class="flex w-full flex-row items-center justify-between bg-[#971B2F] mb-2 px-2 py-1 text-white">
			<div class="flex items-center gap-2">
				<span class="text-lg font-semibold">Stations:</span>
				{#each stations as station}
					<button
						class="flex h-8 w-8 items-center justify-center rounded-full"
						style={`background-color: ${station.color}; color: ${station.textColor};`}
					>
						{station.name.charAt(0).toUpperCase()}
					</button>
				{/each}
			</div>
		</div>
	</div>
-->
	<div class="relative h-full w-full overflow-y-auto bg-slate-500">
		{#if currentRecipe}
			<div class="flex bg-slate-400 px-3 py-1 text-sm">
				<div class="flex flex-1 justify-center">Created: {currentRecipe.created}</div>
				<div class="flex flex-1 justify-center border-l-2">Created: {currentRecipe.created}</div>
				{#if currentRecipe.edited}
					<div class="flex-1">Edited: {currentRecipe?.edited}</div>
				{/if}
			</div>
			<div class="p-2">
				<div class="mb-4 flex w-full flex-col rounded bg-slate-300 p-4 shadow-md">
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
								<li style={`color: ${stations[step.station].color};`}>{step.instruction}</li>
							{/each}
						</ol>
					</div>
				</div>
			</div>
		{:else if shownRecipes.length == 0}
			<div class="place-center flex h-full w-full items-center justify-center text-white">
				<div class="user-select-none rounded-md bg-slate-400/40 p-2">No Recipes</div>
			</div>
		{:else}
			<div
				class="absolute top-0 grid w-full grid-cols-1 gap-1 border-t-2 p-2 px-2 sm:grid-cols-2 md:grid-cols-3"
			>
				{#each shownRecipes as recipe}
					<button
						class="flex cursor-pointer flex-col items-start rounded bg-slate-200 p-4 text-left hover:bg-slate-300"
						onclick={() => {
							currentRecipe = recipe;
						}}
					>
						<div class="mb-3 w-full border-b text-center text-lg font-semibold text-black">
							{recipe.title}
						</div>
						<div class="flex h-full w-full">
							<div class="flex w-full flex-1 flex-row">
								<div class="justify-left flex flex-1 flex-col items-start p-2">
									{#each recipe.ingredients as ingredient}
										<div style={`color: ${stations[ingredient.station].color};`} class={`text-sm`}>
											<strong>{ingredient.name}</strong> &ndash;{ingredient.qty}
										</div>
									{/each}
								</div>
							</div>
							<div class="flex h-full flex-1 items-center justify-center bg-slate-500">
								no image
							</div>
						</div>
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>
