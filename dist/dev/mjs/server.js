/* eslint-disable no-process-env */
// noinspection NpmUsedModulesInstalled
import * as sapper from 'SAPPER_MODULE/server'; // noinspection NpmUsedModulesInstalled

import appConfig from 'APP_CONFIG_PATH';
import compression from 'compression'; // import polka from 'polka'

import express from 'express';
import sirv from 'sirv';
import path from 'path';
import { LogLevel } from './main/common/log/contracts';
import { logger } from './main/node/log/LoggerNode';
import './styles/index.jss';

try {
  logger.init({
    appName: appConfig.appName,
    appVersion: appConfig.appVersion,
    logUrls: appConfig.logUrls,
    logDir: path.resolve('tmp/logs'),
    logFileName: 'server.log',
    appState: { ...appConfig
    },
    writeToFileLevels: LogLevel.Any
  });
} catch (ex) {
  console.log(ex);
  throw ex;
}

const dev = appConfig.sapper.buildMode === 'development'; // const isExport = process.env.npm_lifecycle_event === 'build:sapper:export'
// if (isExport) {
// 	console.log('Export mode')
// }

console.log('PORT=', process.env.PORT);
console.log('NODE_ENV=', process.env.NODE_ENV);
const server = express();
server.disable('x-powered-by');
server.use('/app', compression({
  threshold: 0
}), sirv('static', {
  dev
}), // Fix sapper template.html for Chrome App
function (req, res, next) {
  const {
    end
  } = res;

  res.end = function (body, ...rest) {
    if (typeof body === 'string' && body.startsWith('<!doctype')) {
      body = body.replace(/navigator\.serviceWorker\.register\(['"][\w/]+\/service-worker\.js['"]\);?/g, ' { try { $& } catch (ex) { console.log(ex.message) } } ');
    }

    return end.call(this, body, ...rest);
  };

  next();
}, sapper.middleware()).listen(appConfig.sapper.port, err => {
  if (err) {
    console.log('error', err);
  }
});