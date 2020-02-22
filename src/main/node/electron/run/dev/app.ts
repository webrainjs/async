/* tslint:disable:no-var-requires */
import {init} from '../init'
const { app } = require('electron')
import appConfig from '../../../../../../configs/debug'

init(app, appConfig, () => `http://localhost:${appConfig.sapper.port}/app/`)
