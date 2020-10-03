import colors from '../../templates/colors'
import fonts from '../../templates/fonts'
import constants from '../../../helpers/constants'

module.exports = [
	{
		// default font
		'.text': fonts.sourceSansPro['.text'],
		'.font': fonts.sourceSansPro['.font'],
	},
	{
		'.font': {
			'&-base': {
				'font-family'            : constants.fonts.base,
				'font-size'              : constants.fontSizeBase,
				color                    : colors.base[16],
				'letter-spacing'         : 'normal',
				'line-height'            : 'normal',
				'font-weight'            : 'normal',
				'-webkit-font-smoothing' : 'antialiased',
				'-moz-osx-font-smoothing': 'grayscale',
				'text-rendering'         : 'geometricPrecision',
				'text-transform'         : 'none',
			},
			'&-primary': {
				'font-size': '140%',
				'&-bold'   : {
					'font-size'     : '140%',
					'letter-spacing': '0.0113em',
					'font-weight'   : '600',
				},
			},
		},
	},
]
