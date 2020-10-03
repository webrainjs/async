/* eslint-disable no-shadow,global-require,object-property-newline,no-process-env */
const path = require('path')
const {build} = require('../common/build')
const rollupPlugins = require('../rollup/plugins')
const {writeTextFile} = require('../common/helpers')

if (!process.env.APP_CONFIG) {
	console.error('Environment variable APP_CONFIG is not defined', __filename)
	throw new Error('Environment variable APP_CONFIG is not defined')
}

const appConfig = require(`../../configs/${process.env.APP_CONFIG}`)

// region create postinstall script for mac

writeTextFile(`dist/${process.env.APP_CONFIG}/electron/build/pkg-scripts/postinstall`, 'postinstall.sh')
writeTextFile(`dist/${process.env.APP_CONFIG}/electron/build/pkg-scripts/postinstall.sh`,
// eslint-disable-next-line indent
`#!/bin/bash

installerPath=$1
installationPath=$2
installationAppPath="$installationPath/${appConfig.appName}.app"

echo "Installer path is: $installerPath"
echo "Username is: $USER"
echo "Installation app path is: $installationAppPath"

# echo run ${appConfig.appId} ...
# open -b '${appConfig.appId}'

exit 0
`)

// endregion

build(
	{
		fileInput : path.resolve(`src/main/node/electron/run/pack${process.env.DEBUG_PACK ? '-debug' : ''}/app.ts`),
		fileOutput: `dist/${process.env.APP_CONFIG}/electron/build/index.js`,
	},
	{
		plugins: rollupPlugins.electron({dev: false, legacy: true}),
		output : {
			format   : 'cjs',
			sourcemap: false,
			exports  : 'named',
		},
	},
)
	.then(() => {
		console.log('electron build completed')
	})
