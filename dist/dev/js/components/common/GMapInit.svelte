<script context="module">
	if (typeof window !== 'undefined') {
		// console.log('window.initMap = ...')

		let initMaps = []

		window.registerInitMap = (initMap) => {
			if (initMaps) {
				initMaps.push(initMap)
			} else {
				initMap()
			}
		}

		window.initMap = () => {
			// console.log('initMap()')
			const _initMaps = initMaps.slice()
			initMaps = null
			for (let i = 0; i < _initMaps.length; i++) {
				_initMaps[i]()
			}
		}

		// const API_KEY = 'AIzaSyBNQ0tqGFzZac7UJ8bKqv4wCnknbi1gzoQ'
		const API_KEY = 'AIzaSyD6iJ2TTl1FmJs3ch2MTLPnIbbhBfuI5yo'
		const script = document.createElement('script')
		script.type = 'text/javascript'
		script.async = true
		script.defer = true
		script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap`
		document.getElementsByTagName('head')[0].appendChild(script)
	}
</script>

<script>
	import { onMount, createEventDispatcher } from 'svelte'

	let initialized

	const dispatch = createEventDispatcher()

	onMount(() => {
		window.registerInitMap(() => {
			dispatch('initialized')
			initialized = true
		})
	})
</script>

