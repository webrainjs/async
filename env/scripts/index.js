const {singleCall} = require('./helpers/helpers')
const common = require('./common')
const specific = require('./specific')

// region Specific

const test = singleCall(async appConfigType => {
	await specific.tests.testIntern(appConfigType)
	await Promise.all([
		common.lint(),
		specific.tests.coverage(appConfigType),
	])
})

const pack = singleCall(async (packType, appConfigType) => {
	switch (packType) {
		case 'electron':
			await specific.packs.packElectron(appConfigType)
			await specific.packs.runElectron(appConfigType)
			break
		case 'chrome':
			await specific.packs.packChrome(appConfigType)
			await specific.packs.runChrome(appConfigType)
			break
		default:
			throw new Error(`Unknown pack type: ${packType}`)
	}
})

// const testAndPack = singleCall(async appConfigType => {
// 	await specific.tests.testIntern(appConfigType)
// 	await Promise.all([
// 		common.lint(),
// 		specific.tests.coverage(appConfigType),
// 		specific.packs.packElectron(appConfigType)
// 			.then(() => specific.packs.runElectron(appConfigType)),
// 	])
// })

// endregion

// region All

const buildAll = singleCall((...appConfigTypes) => Promise.all(
	appConfigTypes.map(appConfigType => specific.builds.build(appConfigType, {intern: false}))
))

const testInternAll = singleCall((...appConfigTypes) => Promise.all(
	appConfigTypes.map(appConfigType => specific.tests.testIntern(appConfigType))
))

const testAll = singleCall(async (...appConfigTypes) => {
	await Promise.all([
		common.lint(),
		buildAll(...appConfigTypes),
	])
	await testInternAll(...appConfigTypes)

	await Promise.all(
		appConfigTypes.map(appConfigType => test(appConfigType))
	)
})

const testCI = singleCall(async (...appConfigTypes) => {
	await Promise.all([
		common.lint(),
		buildAll(...appConfigTypes),
	])

	await Promise.all(
		appConfigTypes.map(appConfigType => test(appConfigType))
	)
})

const packAll = singleCall((packTypes, appConfigTypes) => Promise.all(
	appConfigTypes
		.map(
			appConfigType => packTypes
				.map(packType => pack(packType, appConfigType))
		)
		.reduce((a, o) => {
			a.push(...o)
			return a
		}, [])
))

const buildAndPackAll = singleCall(async (packTypes, appConfigTypes) => {
	await Promise.all([
		common.lint(),
		buildAll(...appConfigTypes),
	])

	await packAll(packTypes, appConfigTypes)
})

const testAndPackAll = singleCall(async (packTypes, appConfigTypes) => {
	await Promise.all([
		common.lint(),
		buildAll(...appConfigTypes),
	])
	await testInternAll(...appConfigTypes)

	await packAll(packTypes, appConfigTypes)
})

// endregion

module.exports = {
	testAll,
	packAll,
	testAndPackAll,
	buildAndPackAll,
	testCI,
}
