import {writable} from 'svelte/store'

export const now = writable(Date.now())

setInterval(() => {
	now.set(Date.now())
}, 1000)
