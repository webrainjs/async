import fonts from '../../templates/fonts'
import borders from '../../templates/borders'
import buttons from '../../../global/templates/buttons'
import colors from '../../templates/colors'
import constants from '../../templates/constants'
import templates from '../../../helpers/templates'

module.exports = [
	{
		'.button': [
			buttons.base({
				noWrap : false,
				display: null,
			}),
			{
				'&-window': {
					'&-mac': {
						position       : 'relative',
						'border-radius': '100%',
						width          : '1.74em',
						height         : '1.74em',

						'& > .icon': {
							margin            : '0.35em',
							'background-color': '#97040c',
						},
						'&--close': {
							'background-color': '#fc5753',
						},
						'&--minimize': {
							'background-color': '#fdbc40',
						},
						'&--plus': {
							'background-color': '#33c748',
						},
						'&--fullscreen': {
							'&-enter': {
								'background-color': '#33c748',
								'& > .icon'       : {
									margin: '0.4em',
								},
							},
							'&-exit': {
								'background-color': '#33c748',
								'& > .icon'       : {
									margin: '0.25em',
								},
							},
						},
					},
				},
			},
		],
	},
]
