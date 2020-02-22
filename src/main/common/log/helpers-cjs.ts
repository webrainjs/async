/* tslint:disable:no-var-requires */
// @ts-ignore
const SparkMD5 = require('spark-md5')
// @ts-ignore
const html = require('html-escaper')

// don't mix require and import/export; see: https://github.com/rollup/rollup/issues/1058#issuecomment-254187433
module.exports = {
	SparkMD5,
	html,
}
