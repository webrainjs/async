"use strict";

describe('browser > css > selectors', function () {
  this.timeout(600000);
  before(function () {
    this.timeout(600000);
    var container = window.document.createElement('div');
    container.className = 'container';

    for (var i = 0; i < 10000; i++) {
      var component = window.document.createElement('div');
      component.className = 'component';
      component.innerHTML = "<table class=\"table\">\n\t<tbody class=\"tbody\">\n\t<tr class=\"row\">\n\t\t<td class=\"cell\"><a class=\"a\"></a></td>\n\t\t<td class=\"cell\"></td>\n\t\t<td class=\"cell\"></td>\n\t\t<td class=\"cell\"></td>\n\t\t<td class=\"cell\"></td>\n\t</tr>\n\t<tr class=\"row\">\n\t\t<td class=\"cell\"></td>\n\t\t<td class=\"cell\"></td>\n\t\t<td class=\"cell\"></td>\n\t\t<td class=\"cell\"></td>\n\t\t<td class=\"cell\"></td>\n\t</tr>\n\t<tr class=\"row\">\n\t\t<td class=\"cell\"></td>\n\t\t<td class=\"cell\"></td>\n\t\t<td class=\"cell\"></td>\n\t\t<td class=\"cell\"></td>\n\t\t<td class=\"cell\"></td>\n\t</tr>\n\t<tr class=\"row\">\n\t\t<td class=\"cell\"></td>\n\t\t<td class=\"cell\"></td>\n\t\t<td class=\"cell\"></td>\n\t\t<td class=\"cell\"></td>\n\t\t<td class=\"cell\"></td>\n\t</tr>\n\t<tr class=\"row\">\n\t\t<td class=\"cell\"></td>\n\t\t<td class=\"cell\"></td>\n\t\t<td class=\"cell\"></td>\n\t\t<td class=\"cell\"></td>\n\t\t<td class=\"cell\"></td>\n\t</tr>\n\t</tbody>\n</table>";
      container.appendChild(component);
    }

    var uniqueComponent = window.document.createElement('div');
    uniqueComponent.className = 'unique-component';
    uniqueComponent.innerHTML = "<table class=\"unique-table\">\n\t<tbody class=\"unique-tbody\">\n\t<tr class=\"unique-row\">\n\t\t<td id=\"unique-cell\" class=cell \"unique-cell\"><a class=\"a unique-a\"></a></td>\n\t\t<td id=\"unique-cell\" class=\"cell unique-cell\"></td>\n\t\t<td id=\"unique-cell\" class=\"cell unique-cell\"></td>\n\t\t<td id=\"unique-cell\" class=\"cell unique-cell\"></td>\n\t\t<td id=\"unique-cell\" class=\"cell unique-cell\"></td>\n\t</tr>\n\t</tbody>\n</table>";
    container.appendChild(uniqueComponent);
    window.document.body.appendChild(container);
  });

  function calcPerformance(func, minTestTime) {
    if (minTestTime === void 0) {
      minTestTime = 10;
    }

    var start = performance.now();
    var count = 0;

    while (true) {
      func();
      count++;
      var duration = performance.now() - start;

      if (duration >= minTestTime) {
        return duration / count;
      }
    }
  }

  function calcMinPerformance(func, count, minTestTime) {
    if (count === void 0) {
      count = 10;
    }

    if (minTestTime === void 0) {
      minTestTime = 10;
    }

    var minTime;

    for (var i = 0; i < count; i++) {
      var time = calcPerformance(func, minTestTime);

      if (minTime == null || time < minTime) {
        minTime = time;
      }
    }

    return minTime;
  }

  function testSelector(selector) {
    var time = calcPerformance(function () {
      return document.body.querySelectorAll(selector);
    }, 0);
    console.log(selector + '\t' + time);
  }

  it('isBrowser', function () {
    this.timeout(600000);
    assert.strictEqual(document.body.querySelectorAll('#unique-cell').length, 5); // testSelector('td')
    // testSelector('.cell')
    // testSelector('.unique-cell')
    // testSelector('.unique-row td')
    // testSelector('.unique-row > td')
    // testSelector('.unique-row .cell')
    // testSelector('.unique-row .unique-cell')
    // testSelector('.unique-row td.cell')
    // testSelector('.unique-row td.unique-cell')

    document.body.querySelectorAll('.unique-table a');
    testSelector('.qweqweqwe');
    testSelector('h6');
    testSelector('#unique-cell');
    testSelector('.unique-cell');
    testSelector('.unique-row td.unique-cell');
    testSelector('.unique-row td');
    testSelector('.unique-row td.cell');
    testSelector('.unique-row td.cell.unique-cell');
    testSelector('.unique-row td.unique-cell.cell');
    testSelector('td.cell.unique-cell');
    testSelector('td.unique-cell.cell');
    testSelector('.unique-row .unique-cell');
    testSelector('.unique-row td.unique-cell');
    testSelector('tr.unique-row td.unique-cell');
    testSelector('tr.unique-row .unique-cell');
    testSelector('.unique-row .cell');
    testSelector('.unique-row .cell.unique-cell');
    testSelector('.unique-row .unique-cell.cell');
    testSelector('.cell.unique-cell');
    testSelector('.unique-cell.cell');
    testSelector('td.unique-cell');
    testSelector('tr.unique-row td.unique-cell');
    testSelector('tr.unique-row td');
    testSelector('tr.unique-row td');
    testSelector('tr.unique-row td'); // const result = calcPerformance(
    // 	1000,
    // 	() => {
    //
    // 	},
    // 	() => {
    // 		Object.keys(Math)
    // 	}
    // )
  });
});