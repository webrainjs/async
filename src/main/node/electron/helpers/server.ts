/* tslint:disable:no-var-requires no-duplicate-string */
// @ts-ignore
import {App} from 'electron'
import {logger} from '@flemist/web-logger/node/js'

const { protocol, BrowserWindow, remote } = require('electron')
const path = require('path')
const mime = require('mime')
const fs = require('fs')

export function getResourcesPath(app: App) {
	const appPath = app.getAppPath()
	console.log('appPath = ' + appPath)
	if (/([/\\]resources[/\\]app([/\\]|.asar)?)$/.test(appPath)) {
		return appPath
	}
	return path.resolve('.')
}

export function getRootPath(app: App) {
	const resPath = getResourcesPath(app)
	console.log('resPath = ' + resPath)
	if (/([/\\]resources[/\\]app([/\\]|.asar)?)$/.test(resPath)) {
		return path.resolve(resPath, '../../')
	}

	return resPath
}

const errorHandler = error => {
	if (error) {
		logger.error(error)
	}
}

class ServeStatic {
	public rootDirs: string[]
	public protocol: string
	public host: string
	public relativeRootDir: string

	constructor({
		protocol: protocolName,
		host,
		relativeRootDir,
	}: {
		protocol: string,
		host: string,
		relativeRootDir: string,
	}) {
		this.protocol = protocolName
		this.host = host
		this.relativeRootDir = relativeRootDir
	}

	public start(app: App) {
		this.rootDirs = [
			path.normalize(path.join(
				getResourcesPath(app),
				this.relativeRootDir,
			)),
			path.normalize(path.join(process.cwd(), this.relativeRootDir)),
		]

		protocol.registerSchemesAsPrivileged([{
			scheme    : this.protocol,
			privileges: {
				standard           : true,
				secure             : true,
				allowServiceWorkers: true, // is not worked: https://github.com/electron/electron/issues/9663
				supportFetchAPI    : true,
				// bypassCSP: true,
				corsEnabled        : true,
			},
		}])

		app.on('ready', () => { this.registerAppProtocol() })
	}

	public getFilePath(urlInfo: URL): string {
		const relativePath = urlInfo.pathname.substr(1)

		for (let i = 0, len = this.rootDirs.length; i < len; i++) {
			const dir = this.rootDirs[i]
			let filePath = path.join(dir, relativePath)
			filePath = path.normalize(filePath)
			if (!filePath.startsWith(dir)) {
				continue
			}

			if (!fs.existsSync(filePath)) {
				continue
			}

			if (fs.lstatSync(filePath).isFile()) {
				return filePath
			}

			let indexFilePath = path.join(filePath, 'index.htm')
			if (fs.existsSync(indexFilePath) && fs.lstatSync(indexFilePath).isFile()) {
				return indexFilePath
			}

			indexFilePath = path.join(filePath, 'index.html')
			if (fs.existsSync(indexFilePath) && fs.lstatSync(indexFilePath).isFile()) {
				return indexFilePath
			}
		}

		return null
	}

	public toAppUrl(url: string): string {
		if (!url) {
			return null
		}

		const urlInfo = new URL(url)
		if (urlInfo.protocol !== 'https:' || urlInfo.hostname !== this.host) {
			return null
		}

		const filePath = this.getFilePath(urlInfo)
		if (!filePath) {
			return null
		}

		return this.protocol + '://' + urlInfo.host + urlInfo.pathname + urlInfo.search + urlInfo.hash
	}

	public tryConvertToFileUrl(url: string): string {
		if (url) {
			const filePath = this.getFilePath(new URL(url))

			if (filePath) {
				const fileUrlInfo = new URL('file://')
				fileUrlInfo.pathname = filePath
				return fileUrlInfo.href
			}
		}

		return url
	}

	private registerAppProtocol() {
		// const doIntercept = () => {
		// 	const interceptHttpProtocolHandler = (request, callback) => {
		// 		try {
		// 			const appUrl = this.toAppUrl(request.url)
		// 			const appReferrer = this.toAppUrl(request.referrer)
		// 			if (appUrl || appReferrer) {
		// 				// request.url = appUrl || request.url
		// 				// request.referrer = appReferrer || request.referrer
		// 				request = {
		// 					...request,
		// 					url: appUrl || request.url,
		// 					referrer: appReferrer || request.referrer,
		// 				}
		// 				logger.debug(request)
		// 				callback(request)
		// 				return
		// 			}
		// 		} catch (error) {
		// 			logger.error('interceptHttpProtocol', error)
		// 		}
		//
		// 		protocol.uninterceptProtocol('https', err => {
		// 			if (err) {
		// 				errorHandler(err)
		// 			}
		//
		// 			doIntercept()
		// 		})
		// 	}
		//
		// 	protocol.interceptHttpProtocol('https', interceptHttpProtocolHandler, errorHandler)
		// }

		protocol.registerFileProtocol(this.protocol, (request, callback) => {
			const urlInfo = new URL(request.url)
			const filePath = this.getFilePath(urlInfo)
			if (!filePath) {
				logger.error(`File not found by URL: ${request.url}\r\nRootDirs: ${this.rootDirs.join('\r\n')}`)
				callback(null)
				return
			}

			callback({
				path   : filePath,
				headers: {
					'Content-Type'           : mime.getType(path.extname(filePath)) + '; charset=utf-8',
					'Content-Security-Policy': "default-src * 'unsafe-inline' 'unsafe-eval' blob: data:",
						// 'unsafe-eval' - for webrain optimizations (createFunction(...))
				},
			})
		})
	}
}

export function serveStatic(
	app: App,
	protocolName: string,
	host: string,
	relativeRootDir: string,
) {
	new ServeStatic({
		protocol: protocolName,
		host,
		relativeRootDir,
	}).start(app)
}
