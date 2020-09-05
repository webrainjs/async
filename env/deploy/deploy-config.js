const path = require('path')

if (!process.env.APP_CONFIG) {
	console.error('Environment variable APP_CONFIG is not defined', __filename)
	throw new Error('Environment variable APP_CONFIG is not defined')
}

const appConfig = require(`../../configs/${process.env.APP_CONFIG}`)

module.exports = {
	username: 'username',
	password: 'password',
	url     : 'https://my.site.com/app/upload.php',
	dir     : path.resolve(`dist/${appConfig.type}/sapper/export`)
}
