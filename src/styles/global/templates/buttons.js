import templates from '../../helpers/templates'
import Color from 'color'

const background = ({color}) => ({
	'background-color': color,
})

const border = ({
	color = 'transparent',
	width = `1.5px`,
}) => ({
	...templates.bordersInnerShadow({
		color,
		width,
	}),
})

const text = ({color}) => ({
	...color && templates.anchorColor({
		all: color,
	}),
	'&__icon': {
		'background-color': color,
	},
})

const base = ({
	noWrap = true,
	colorBackground = 'transparent',
	colorBorder = 'transparent',
	borderWidth = `1.5px`,
	hover = {
		opacity        : 0.75,
		colorBackground: void 0,
		colorBorder    : void 0,
		borderWidth    : void 0,
	},
	disabled = {
		opacity        : 0.5,
		colorBackground: void 0,
		colorBorder    : void 0,
		borderWidth    : void 0,
	},
	active = {
		opacity        : 0.5,
		colorBackground: void 0,
		colorBorder    : void 0,
		borderWidth    : void 0,
	},
} = {}) => [
	templates.anchorAsDiv,
	templates.buttonAsDiv,
	{
		...templates.contentCenter,
		...(noWrap && templates.noWrap()),
		display: `inline-flex`,
		width  : `auto`,

		// 'text-transform': `uppercase`,
		// 'font-weight'   : `bold`,

		...background({color: colorBackground}),
		...border({
			color: colorBorder,
			width: borderWidth,
		}),

		'&:disabled': {
			...background({color: disabled.colorBackground}),
			...(disabled.colorBorder || disabled.borderWidth) && border({
				color: disabled.colorBorder || colorBorder,
				width: disabled.borderWidth || borderWidth,
			}),
			opacity         : disabled.opacity,
			'pointer-events': `none`,
		},
		'&:hover': {
			...background({color: hover.colorBackground}),
			...(hover.colorBorder || hover.borderWidth) && border({
				color: hover.colorBorder || colorBorder,
				width: hover.borderWidth || borderWidth,
			}),
			opacity: hover.opacity,
		},
		'&:active': {
			...background({color: active.colorBackground}),
			...(active.colorBorder || active.borderWidth) && border({
				color: active.colorBorder || colorBorder,
				width: active.borderWidth || borderWidth,
			}),
			opacity: active.opacity,
		},

		'user-select': `none`,
		cursor       : `pointer`,

		'&, &:before, &:after': {
			...templates.transition(0.5),
		},

		'& > *': {
			'pointer-events': `none`,
		}
	}
]

const withText = ({
	noWrap = true,
	colorBackground = 'transparent',
	colorText = Color(colorBackground).hsl().color[2] > 0.5 ? `#000` : `#fff`,
	colorBorder = 'transparent',
	borderWidth = `1.5px`,
	hover = {
		opacity        : 0.75,
		colorText      : void 0,
		colorBackground: void 0,
		colorBorder    : void 0,
		borderWidth    : void 0,
	},
	disabled = {
		opacity        : 0.5,
		colorText      : void 0,
		colorBackground: void 0,
		colorBorder    : void 0,
		borderWidth    : void 0,
	},
	active = {
		opacity        : 0.5,
		colorText      : void 0,
		colorBackground: void 0,
		colorBorder    : void 0,
		borderWidth    : void 0,
	},
} = {}) => [
	base({
		noWrap,
		colorBackground,
		colorBorder,
		borderWidth,
		hover,
		disabled,
		active,
	}),
	{
		...text({color: colorText}),
	},
	{
		'padding-left' : `0.3em`,
		'padding-right': `0.3em`,

		'&:disabled': {
			...text({color: disabled.colorText}),
		},
		'&:hover': {
			...text({color: hover.colorText}),
		},
		'&:active': {
			...text({color: active.colorText}),
		},
	}
]

module.exports = {
	background,
	border,
	text,
	base,
	withText,
}
