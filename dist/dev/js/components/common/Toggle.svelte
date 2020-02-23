<script>
	export let type = 'checkbox'
	export let checked = false
	export let group = ''
	export let value = void 0

	$: type === 'radio' && updateRadio(group, value)

	$: type === 'checkbox' && group && updateCheckbox(group, value)
	$: type === 'checkbox' && group && updateGroup(checked, value)

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
</script>

<label>
	{#if type === 'radio'}
		<input
			type="radio"
			class="collapsed"
			on:click
			on:change
			bind:group={group}
			value={value}
		/>
	{:else}
		<input
			type="checkbox"
			class="collapsed"
			on:click
			on:change
			bind:checked={checked}
			value={value}
		/>
	{/if}
	<slot {checked}></slot>
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