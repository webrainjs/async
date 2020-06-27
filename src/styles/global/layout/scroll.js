import templates from '../../helpers/templates'

module.exports = [{
	'.scroll': {
		position              : `relative`,
		overflow              : `auto`,
		'& > .scroll__content': {
			...templates.fill,
			right : `auto`,
			bottom: `auto`,
		},
		'&--smooth': {
			'scroll-behavior'           : `smooth`,
			'-webkit-overflow-scrolling': `touch`,
		},
		'&-vertical': {
			position              : `relative`,
			'overflow-y'          : `auto`,
			'overflow-x'          : `hidden`,
			'& > .scroll__content': {
				...templates.fill,
				bottom: `auto`,
			},
			'&--force': {
				'overflow-y': `scroll`,
			},
		},
		'&-horizontal': {
			position              : `relative`,
			'overflow-y'          : `hidden`,
			'overflow-x'          : `auto`,
			'& > .scroll__content': {
				...templates.fill,
				right: `auto`,
			},
			'&--force': {
				'overflow-x': `scroll`,
			},
		},
		'&--force': {
			overflow: `scroll`,
		},
	},
	'.scrollbar': templates.important({
		'&--collapsed': {
			'scrollbar-width'     : `none`, // Firefox
			'-ms-overflow-style'  : `none`, // IE 10+
			'&::-webkit-scrollbar': { // Safari and Chrome
				display: `none`,
				width  : `0`,
				height : `0`,
			},
			'&::-webkit-scrollbar-corner': {
				display: `none`,
			},
		},
	}),
}]
