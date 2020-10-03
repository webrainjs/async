module.exports = {
	layout: {
		flex: {
			base: {
				display : 'flex !important',
				position: 'relative',
				overflow: 'hidden',
			},
			vertical: {
				'flex-direction': 'column !important',
			},
			inline: {
				display: 'inline-flex !important',
			},
			item: {
				fit: {
					flex: 'none !important',
				},
				fill: {
					flex       : 'auto !important',
					'flex-grow': '1 !important',
					overflow   : 'hidden',
				},
			},
		},
	},
}
