import borders from '../../templates/borders'
import templates from '../../../helpers/templates'

module.exports = [
	{
		'.border': templates.important({
			...borders.template(),
		}),
	},
]
