function scrollbars({
	width = '0.5em',
	padding = '0.5em',
	minWidth = '2px',
	backgroundColor = 'transparent',
	thumbColor = 'rgba(255, 255, 255, .2)',
} = {}) {
	return {
		'&::-webkit-scrollbar': {
			'-webkit-appearance': 'none',
			width               : `calc(${width} + ${padding} * 2)`,
			height              : `calc(${width} + ${padding} * 2)`,
			'min-width'         : `calc(${minWidth} + ${padding} * 2)`,
			'min-height'        : `calc(${minWidth} + ${padding} * 2)`,
		},
		'&::-webkit-scrollbar:vertical': {

		},
		'&::-webkit-scrollbar:horizontal': {

		},
		'&::-webkit-scrollbar-thumb': {
			'border-radius'   : `calc(${width} + ${padding} * 2)`,
			'background-color': thumbColor,
			'border-color'    : 'transparent',
			'border-style'    : 'solid',
			'border-width'    : `${padding}`,
			'background-clip' : 'padding-box',
		},
		'&::-webkit-scrollbar-track': {
			'background-color': backgroundColor,
			margin            : `calc(0 - ${padding})`,
		},
		'&::-webkit-scrollbar-corner': {
			display   : 'none',
			background: 'transparent',
		},
	}
}

module.exports = {
	base: scrollbars,
}
