<script>
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	export let disabled = false
	export let type = 'checkbox'
	export let checked = false
	export let group = ''
	export let value = void 0
	export let valueChecked = void 0
	export let valueUnchecked = void 0

	$: type === 'radio' && updateRadio(group, value)

	$: type === 'checkbox' && group && updateCheckbox(group, value)
	$: type === 'checkbox' && group && updateGroup(checked, value)
	$: type === 'checkbox' && !group && typeof valueChecked !== 'undefined' && updateCheckboxFromValue(value, valueChecked)
	$: type === 'checkbox' && !group && typeof valueChecked !== 'undefined' && updateValue(checked, valueChecked, valueUnchecked)

	function updateRadio(group, value) {
		checked = group === value
	}

	function updateCheckbox(group, value) {
		checked = group.indexOf(value) >= 0
	}

	function updateGroup(checked, value) {
		const index = group.indexOf(value)
		if (checked) {
			if (index < 0) {
				group.push(value)
				group = group
			}
		} else {
			if (index >= 0) {
				group.splice(index, 1)
				group = group
			}
		}
	}

	function updateValue(checked, valueChecked, valueUnchecked) {
		const newValue = checked ? valueChecked : valueUnchecked
		if (newValue !== value) {
			value = newValue
		}
	}

	function updateCheckboxFromValue(value, valueChecked) {
		const newValue = value === valueChecked
		if (newValue !== checked) {
			checked = newValue
		}
	}

	function change(event) {
		setTimeout(() => {
			dispatch('change', event)
		})
	}
</script>

<label disabled="{disabled}">
	{#if type === 'radio'}
		<input
			type="radio"
			class="collapsed"
			on:click
			on:change="{change}"
			bind:group={group}
			value={value}
		/>
	{:else}
		<input
			type="checkbox"
			class="collapsed"
			on:click
			on:change="{change}"
			bind:checked={checked}
			value={value}
		/>
	{/if}
	<slot checked="{checked}"></slot>
</label>

<style-js>
	import templates from '../../styles/helpers/templates';

	module.exports = [
        {
			label: {
				...templates.noSelect,
				...templates.noDrag,
				display: `inline-block`,
				'align-items': `center`,
				'-webkit-box-align': `inherit`,
			},
			input: {
				display: `none`,
			},
		},
	]
</style-js>