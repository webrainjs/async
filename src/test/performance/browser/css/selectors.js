describe('browser > css > selectors', function () {
	this.timeout(600000)

	before(function () {
		this.timeout(600000)
		const container = window.document.createElement('div')
		container.className = 'container'
		for (let i = 0; i < 10000; i++) {
			const component = window.document.createElement('div')
			component.className = 'component'
			component.innerHTML = `<table class="table">
	<tbody class="tbody">
	<tr class="row">
		<td class="cell"><a class="a"></a></td>
		<td class="cell"></td>
		<td class="cell"></td>
		<td class="cell"></td>
		<td class="cell"></td>
	</tr>
	<tr class="row">
		<td class="cell"></td>
		<td class="cell"></td>
		<td class="cell"></td>
		<td class="cell"></td>
		<td class="cell"></td>
	</tr>
	<tr class="row">
		<td class="cell"></td>
		<td class="cell"></td>
		<td class="cell"></td>
		<td class="cell"></td>
		<td class="cell"></td>
	</tr>
	<tr class="row">
		<td class="cell"></td>
		<td class="cell"></td>
		<td class="cell"></td>
		<td class="cell"></td>
		<td class="cell"></td>
	</tr>
	<tr class="row">
		<td class="cell"></td>
		<td class="cell"></td>
		<td class="cell"></td>
		<td class="cell"></td>
		<td class="cell"></td>
	</tr>
	</tbody>
</table>`

			container.appendChild(component)
		}

		const uniqueComponent = window.document.createElement('div')
		uniqueComponent.className = 'unique-component'
		uniqueComponent.innerHTML = `<table class="unique-table">
	<tbody class="unique-tbody">
	<tr class="unique-row">
		<td id="unique-cell" class=cell "unique-cell"><a class="a unique-a"></a></td>
		<td id="unique-cell" class="cell unique-cell"></td>
		<td id="unique-cell" class="cell unique-cell"></td>
		<td id="unique-cell" class="cell unique-cell"></td>
		<td id="unique-cell" class="cell unique-cell"></td>
	</tr>
	</tbody>
</table>`

		container.appendChild(uniqueComponent)

		window.document.body.appendChild(container)
	})

	function calcPerformance(func, minTestTime = 10) {
		const start = performance.now()
		let count = 0
		while (true) {
			func()
			count++
			const duration = performance.now() - start

			if (duration >= minTestTime) {
				return duration / count
			}
		}
	}

	function calcMinPerformance(func, count = 10, minTestTime = 10) {
		let minTime
		for (let i = 0; i < count; i++) {
			const time = calcPerformance(func, minTestTime)
			if (minTime == null || time < minTime) {
				minTime = time
			}
		}

		return minTime
	}

	function testSelector(selector) {
		const time = calcPerformance(() => document.body.querySelectorAll(selector), 0)
		console.log(selector + '\t' + time)
	}

	it('isBrowser', function () {
		this.timeout(600000)

		assert.strictEqual(document.body.querySelectorAll('#unique-cell').length, 5)

		// testSelector('td')
		// testSelector('.cell')
		// testSelector('.unique-cell')
		// testSelector('.unique-row td')
		// testSelector('.unique-row > td')
		// testSelector('.unique-row .cell')
		// testSelector('.unique-row .unique-cell')
		// testSelector('.unique-row td.cell')
		// testSelector('.unique-row td.unique-cell')

		document.body.querySelectorAll('.unique-table a')
		testSelector('.qweqweqwe')
		testSelector('h6')

		testSelector('#unique-cell')
		testSelector('.unique-cell')
		testSelector('.unique-row td.unique-cell')
		testSelector('.unique-row td')

		testSelector('.unique-row td.cell')
		testSelector('.unique-row td.cell.unique-cell')
		testSelector('.unique-row td.unique-cell.cell')
		testSelector('td.cell.unique-cell')
		testSelector('td.unique-cell.cell')

		testSelector('.unique-row .unique-cell')
		testSelector('.unique-row td.unique-cell')
		testSelector('tr.unique-row td.unique-cell')
		testSelector('tr.unique-row .unique-cell')

		testSelector('.unique-row .cell')
		testSelector('.unique-row .cell.unique-cell')
		testSelector('.unique-row .unique-cell.cell')
		testSelector('.cell.unique-cell')
		testSelector('.unique-cell.cell')

		testSelector('td.unique-cell')
		testSelector('tr.unique-row td.unique-cell')
		testSelector('tr.unique-row td')
		testSelector('tr.unique-row td')
		testSelector('tr.unique-row td')

		// const result = calcPerformance(
		// 	1000,
		// 	() => {
		//
		// 	},
		// 	() => {
		// 		Object.keys(Math)
		// 	}
		// )
	})
})
