/* tslint:disable:no-var-requires no-duplicate-string */
// @ts-ignore
import { logger } from '../../log/LoggerNode';

const {
  protocol,
  BrowserWindow,
  remote
} = require('electron');

const path = require('path');

const mime = require('mime');

const fs = require('fs');

export function getResourcesPath(app) {
  const resPath = app.getAppPath();

  if (resPath.endsWith('.asar')) {
    return resPath;
  }

  return path.resolve('.');
}
export function getRootPath(app) {
  const resPath = getResourcesPath(app);
  return resPath.endsWith('.asar') ? path.resolve(resPath, '../../') : resPath;
}

const errorHandler = error => {
  if (error) {
    logger.error(error);
  }
};

class ServeStatic {
  constructor({
    protocol: protocolName,
    host,
    relativeRootDir
  }) {
    this.protocol = protocolName;
    this.host = host;
    this.relativeRootDir = relativeRootDir;
  }

  start(app) {
    this.rootDirs = [path.normalize(path.join(getResourcesPath(app), this.relativeRootDir)), path.normalize(path.join(process.cwd(), this.relativeRootDir))];
    protocol.registerSchemesAsPrivileged([{
      scheme: this.protocol,
      privileges: {
        standard: true,
        secure: true,
        allowServiceWorkers: true,
        // is not worked: https://github.com/electron/electron/issues/9663
        supportFetchAPI: true,
        // bypassCSP: true,
        corsEnabled: true
      }
    }]);
    app.on('ready', () => {
      this.registerAppProtocol();
    });
  }

  getFilePath(urlInfo) {
    const relativePath = urlInfo.pathname.substr(1);

    for (let i = 0, len = this.rootDirs.length; i < len; i++) {
      const dir = this.rootDirs[i];
      let filePath = path.join(dir, relativePath);
      filePath = path.normalize(filePath);

      if (!filePath.startsWith(dir)) {
        continue;
      }

      if (!fs.existsSync(filePath)) {
        continue;
      }

      if (fs.lstatSync(filePath).isFile()) {
        return filePath;
      }

      let indexFilePath = path.join(filePath, 'index.htm');

      if (fs.existsSync(indexFilePath) && fs.lstatSync(indexFilePath).isFile()) {
        return indexFilePath;
      }

      indexFilePath = path.join(filePath, 'index.html');

      if (fs.existsSync(indexFilePath) && fs.lstatSync(indexFilePath).isFile()) {
        return indexFilePath;
      }
    }

    return null;
  }

  toAppUrl(url) {
    if (!url) {
      return null;
    }

    const urlInfo = new URL(url);

    if (urlInfo.protocol !== 'https:' || urlInfo.hostname !== this.host) {
      return null;
    }

    const filePath = this.getFilePath(urlInfo);

    if (!filePath) {
      return null;
    }

    return this.protocol + '://' + urlInfo.host + urlInfo.pathname + urlInfo.search + urlInfo.hash;
  }

  tryConvertToFileUrl(url) {
    if (url) {
      const filePath = this.getFilePath(new URL(url));

      if (filePath) {
        const fileUrlInfo = new URL('file://');
        fileUrlInfo.pathname = filePath;
        return fileUrlInfo.href;
      }
    }

    return url;
  }

  registerAppProtocol() {
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
      const urlInfo = new URL(request.url);
      const filePath = this.getFilePath(urlInfo);

      if (!filePath) {
        logger.error(`File not found by URL: ${request.url}\r\nRootDirs: ${this.rootDirs.join('\r\n')}`);
        callback(null);
        return;
      }

      callback({
        path: filePath,
        headers: {
          'Content-Type': mime.getType(path.extname(filePath)) + '; charset=utf-8',
          'Content-Security-Policy': "default-src * 'unsafe-inline' 'unsafe-eval' blob: data:" // 'unsafe-eval' - for webrain optimizations (createFunction(...))

        }
      });
    }, errorHandler);
  }

}

export function serveStatic(app, protocolName, host, relativeRootDir) {
  new ServeStatic({
    protocol: protocolName,
    host,
    relativeRootDir
  }).start(app);
}