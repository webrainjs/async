import constants from '../helpers/constants.js'

module.exports = [
	{
		body: {
			'font-size'  : constants.fontSizeBase,
			'font-family': constants.fonts.regular
		},
		td: {
			'vertical-align': `middle`,
			'padding-left'  : `0`,
			'padding-right' : `0`,
			'padding-top'   : `0`,
			'padding-bottom': `0`,
		},
		th: {
			'text-align': `left`,
		},
		ul: {
			margin: `initial`,
		},
		button: {
			position   : `relative`,
			'font-size': `inherit`,
		},
		[constants.selectors.all]: {
			'background-repeat'  : `no-repeat`,
			'background-position': `center`,
			'background-size'    : `contain`,
			'mask-repeat'        : `no-repeat`,
			'mask-position'      : `center`,
			'mask-size'          : `contain`,
			'box-sizing'         : `border-box`,
		}
	}
]
