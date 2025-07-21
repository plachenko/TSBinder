import { PantryChecklist } from "./pantry";

export let stations = [
		{
			name: 'expo',
			emoji: '🎉',
			color: 'rgba(0, 0, 0, .7)',
			textColor: '#FFFFFF' // Black text for contrast
		},
		{
			name: 'pantry',
			emoji: '🥗',
			color: 'rgba(98, 160, 82, .5)',
			textColor: '#FFF',
			checklist: PantryChecklist
		},
		{
			name: 'oven',
			emoji: '🔥',
			color: 'rgba(180, 28, 28, 0.5)', // Alert red (for heat warning)
			textColor: '#FFFFFF' // White text
		},
		{
			name: 'grill',
			emoji: '♨️',
			color: 'rgba(121, 85, 72, 1)', // Dark brown (grill marks)
			textColor: '#FFFFFF' // White text
		},
		{
			name: 'fryer',
			emoji: '🍟',
			color: 'rgba(255, 193, 7, 1)', // Golden yellow (fried food)
			textColor: '#000000' // Black text
		},
		{
			name: 'saute',
			emoji: '🍳',
			color: 'rgba(156, 39, 176, 1)', // Purple (distinct from other stations)
			textColor: '#FFFFFF' // White text
		}
	];
