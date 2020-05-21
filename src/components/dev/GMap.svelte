<script>
	import { onMount } from 'svelte'
	import GMapInit from '../../components/common/GMapInit.svelte'

	let container
	function initMap() {
		// console.debug('component initMap')
		// Basic options for a simple Google Map
		// For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
		const mapOptions = {
			// How zoomed in you want the map to start at (always required)
			zoom: 11,

			// The latitude and longitude to center the map (always required)
			center: new google.maps.LatLng(40.6700, -73.9400), // New York

			zoomControl: false,
			mapTypeControl: false,
			streetViewControl: false,
			fullscreenControl: false,
			scaleControl: false,
			rotateControl: false,

			// draggable: false,
			// scaleControl: false,
			// scrollwheel: false,
			// navigationControl: false,
			// streetViewControl: false,
			// mapTypeId: google.maps.MapTypeId.ROADMAP,

			// How you would like to style the map.
			// This is where you would paste any style found on Snazzy Maps.
			styles: [
				{
					"featureType": "all",
					"elementType": "labels.text.fill",
					"stylers": [
						{
							"saturation": 36
						},
						{
							"color": "#000000"
						},
						{
							"lightness": 40
						}
					]
				},
				{
					"featureType": "all",
					"elementType": "labels.text.stroke",
					"stylers": [
						{
							"visibility": "on"
						},
						{
							"color": "#000000"
						},
						{
							"lightness": 16
						}
					]
				},
				{
					"featureType": "all",
					"elementType": "labels.icon",
					"stylers": [
						{
							"visibility": "off"
						}
					]
				},
				{
					"featureType": "administrative",
					"elementType": "geometry.fill",
					"stylers": [
						{
							"color": "#000000"
						},
						{
							"lightness": 20
						}
					]
				},
				{
					"featureType": "administrative",
					"elementType": "geometry.stroke",
					"stylers": [
						{
							"color": "#000000"
						},
						{
							"lightness": 17
						},
						{
							"weight": 1.2
						}
					]
				},
				{
					"featureType": "landscape",
					"elementType": "geometry",
					"stylers": [
						{
							"color": "#000000"
						},
						{
							"lightness": 20
						}
					]
				},
				{
					"featureType": "poi",
					"elementType": "geometry",
					"stylers": [
						{
							"color": "#000000"
						},
						{
							"lightness": 21
						}
					]
				},
				{
					"featureType": "road.highway",
					"elementType": "geometry.fill",
					"stylers": [
						{
							"color": "#000000"
						},
						{
							"lightness": 17
						}
					]
				},
				{
					"featureType": "road.highway",
					"elementType": "geometry.stroke",
					"stylers": [
						{
							"color": "#000000"
						},
						{
							"lightness": 29
						},
						{
							"weight": 0.2
						}
					]
				},
				{
					"featureType": "road.arterial",
					"elementType": "geometry",
					"stylers": [
						{
							"color": "#000000"
						},
						{
							"lightness": 18
						}
					]
				},
				{
					"featureType": "road.local",
					"elementType": "geometry",
					"stylers": [
						{
							"color": "#000000"
						},
						{
							"lightness": 16
						}
					]
				},
				{
					"featureType": "transit",
					"elementType": "geometry",
					"stylers": [
						{
							"color": "#000000"
						},
						{
							"lightness": 19
						}
					]
				},
				{
					"featureType": "water",
					"elementType": "geometry",
					"stylers": [
						{
							"color": "#000000"
						},
						{
							"lightness": 9
						}
					]
				}
			]
		}

		// Create the Google Map using our element and options defined above
		const map = new google.maps.Map(container, mapOptions)

		// Let's also add a marker while we're at it
		const marker = new google.maps.Marker({
			position: new google.maps.LatLng(40.6700, -73.9400),
			map: map,
			title: 'Snazzy!'
		})
	}

	onMount(() => {

	})
</script>

<GMapInit on:initialized="{initMap}" />
<div bind:this="{container}" class="gmap-container fill" debug_id="loader-text">Loading...</div>

<style-js>
	import templates from '../../styles/helpers/templates';

    module.exports = ({
		':global(.gmap-container)': {
			...templates.contentCenter,
			...templates.contentCenterVertical,
			// delete map default background
			'& > div': {
				 'background-color': `transparent !important`,
			},
			// hide google links and logo
			'.gm-style-cc, [rel=noopener]': {
				display: `none !important`,
			},
		},
    })
</style-js>