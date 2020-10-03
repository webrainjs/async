import templates from '../../helpers/templates'

module.exports = [{
	'.flex': [
		{
			...templates.layout.flex.base,

			'&--vertical': {
				...templates.layout.flex.vertical,
			},

			'&--inline': {
				...templates.layout.flex.inline,
			},

			'&__item': [
				{
					'&--fit': {
						...templates.layout.flex.item.fit,
					},
					'&--fill': {
						...templates.layout.flex.item.fill,
					},
				},
				templates.important({
					'&--align': {
						'&-start': {
							'place-self': 'flex-start',
						},
						'&-center': {
							'align-self': 'center',
						},
						'&-stretch': {
							'align-self': 'stretch',
						},
						'&-end': {
							'align-self': 'flex-end',
						},
					},
				}),
			],
		},
		templates.important({
			'&--center': {
				'align-items'      : 'center',
				'-webkit-box-align': 'inherit',
				'justify-content'  : 'center',
			},

			'&--align': {
				'&-start': {
					'align-items': 'flex-start',
				},
				'&-center': {
					'align-items'      : 'center',
					'-webkit-box-align': 'inherit',
				},
				'&-stretch': {
					'align-items': 'stretch',
				},
				'&-end': {
					'align-items': 'flex-end',
				},
			},

			'&--justify': {
				// left / top
				'&-start': {
					'justify-content': 'flex-start',
				},
				'&-center': {
					'justify-content': 'center',
				},
				'&-stretch': {
					'justify-content': 'stretch',
				},
				// right / bottom
				'&-end': {
					'justify-content': 'flex-end',
				},
			},

			'&--inline': {
				display: 'inline-flex',
			},

			'&--1': {
				flex: '1',
			},

			'&--2': {
				flex: '2',
			},

			'&--3': {
				flex: '3',
			},

			'&--4': {
				flex: '4',
			},
			// '&__scroll': {
			// 	...templates.fill,
			// 	overflow    : `scroll`,
			// 	'&-vertical': {
			// 		...templates.fill,
			// 		'overflow-y'           : `scroll`,
			// 		'overflow-x'           : `hidden`,
			// 		'.flex-layout__content': {
			// 			...templates.fill,
			// 			bottom: `auto`,
			// 		},
			// 	},
			// 	'&-horizontal': {
			// 		...templates.fill,
			// 		'overflow-y'           : `hidden`,
			// 		'overflow-x'           : `scroll`,
			// 		'.flex-layout__content': {
			// 			...templates.fill,
			// 			right: `auto`,
			// 		},
			// 	},
			// },
		}),
	],
}]
