module.exports = [
	{
		// For loading animation: https://stackoverflow.com/a/16771693/5221762
		'@keyframes spin': {
			'100%': {
				transform: `rotate(360deg)`,
			},
		},
		'@keyframes sync-fade': {
			from: {
				opacity: `1.0`,
			},
			to: {
				opacity: `0.5`,
			},
		},
	}
]
