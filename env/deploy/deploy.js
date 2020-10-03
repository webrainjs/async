const path = require('path')
const needle = require('needle')
const zipdir = require('zip-dir')
const config = require('./deploy-config')

async function deploy() {
	const zipBuffer = await new Promise((resolve, reject) => {
		zipdir(config.dir, function (err, buffer) {
			if (err) {
				reject(err)
				return
			}

			resolve(buffer)
		})
	})

	const data = {
		zip_file: {
			buffer      : zipBuffer,
			filename    : 'deploy.zip',
			content_type: 'application/octet-stream',
		},
	}

	const result = await new Promise((resolve, reject) => {
		needle.post(
			config.url,
			data,
			{
				multipart: true,
				username : config.username,
				password : config.password,
				// auth: 'basic'
			},
			(err, response, body) => {
				if (err) {
					reject(err)
					return
				}

				resolve({
					response,
					body,
				})
			},
		)
	})

	if (result.response.statusCode !== 200) {
		throw new Error(`Deploy error:\r\n${result.response}\r\n------\r\n${result.body}`)
	}

	console.log('Deploy successful!')
	console.log(`${path.dirname(config.url)}/page`)
}

deploy()
