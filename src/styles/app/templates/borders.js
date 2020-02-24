import templates from '../../helpers/templates'
import colors from "./colors"

const base = ({
	all,
	left,
	right,
	top,
	bottom,
	color = colors.border.base,
	width = '1.5px',
	style = 'solid',
} = {}) => templates.borders({
	all,
	left,
	right,
	top,
	bottom,
	color,
	width,
	style,
})

const template = ({
	color = colors.border.base,
	width = '1.5px',
	style = 'solid',
} = {}) => ({
	'&-all'   : base({all: true, color, width, style}),
	'&-left'  : base({left: true, color, width, style}),
	'&-right' : base({right: true, color, width, style}),
	'&-top'   : base({top: true, color, width, style}),
	'&-bottom': base({bottom: true, color, width, style}),
})

const innerShadow = ({
	color = colors.border.base,
	width = '1.5px',
} = {}) => templates.bordersInnerShadow({
	color,
	width,
})

module.exports = {
	base,
	innerShadow,
	template,
}
