/* tslint:disable:quotemark no-duplicate-string */
import constants from '../helpers/constants'

function fontFamily({
	family,
	size = 1,
	offsetY = 0.016,
	lineHeight = null,
	lineHeightNormalize = 1 / size,
}) {
	const lineHeightCalc = lineHeightNormalize == null
		? lineHeight
		: (lineHeight || 1) * lineHeightNormalize

	return {
		'.text': {
			'font-family': family,
			'font-size': `${size * 100}%`,
			'line-height': lineHeightCalc, // > 1 ? lineHeightCalc : null,
			'vertical-align': `${-offsetY / size}em`,
		},
		'.font': {
			'font-family': family,
		},
		'&.font': {
			'font-family': family,
			// 'font-size': `${size * 100}%`,
			// 'line-height': lineHeightCalc, // > 1 ? lineHeightCalc : null,
			// 'vertical-align': `${-offsetY}em`,
			// 'margin-top': `${offsetY}em`,
			// 'margin-bottom': `${-offsetY}em`,
		},
	}
}

const arial = fontFamily({
	family: 'Arial',
	size: 0.948,
})

const tahoma = fontFamily({
	family: 'Tahoma',
	size: 0.933,
	lineHeightNormalize: null,
})

const timesNewRoman = fontFamily({
	family: 'Times New Roman',
	size: 1,
	offsetY: 0,
})

const clear = {
	'font-size': `100%`,
	'font-family': constants.fonts.base,
	'color': `rgba(0, 0, 0, 0)`,
	'text-transform': `none`,
	'text-rendering': `initial`,
	'text-size-adjust': `initial`,
	'letter-spacing': `initial`,
	'font-weight': `initial`,
	'-webkit-box-direction': `initial`,
	'-webkit-font-smoothing': `initial`,
}

module.exports = {
	fontFamily,
	fonts: {
		arial,
		tahoma,
		timesNewRoman,
		clear,
	},
}
