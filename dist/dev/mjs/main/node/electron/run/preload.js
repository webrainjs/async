/* eslint-disable */
'use strict';

const {
  remote,
  ipcRenderer,
  BrowserWindow
} = require('electron');

const remoteWindow = remote.getCurrentWindow();
const appConfig = ipcRenderer.sendSync('app-config');
console.log('preload');

function delay(timeMilliseconds) {
  return new Promise(resolve => setTimeout(resolve, timeMilliseconds));
}

function initWindow(window, remoteWindow) {
  // region appConfig
  Object.defineProperty(window, 'appConfig', {
    writable: false,
    enumerable: true,
    configurable: false,
    value: Object.freeze(Object.assign({}, appConfig))
  });
  window.isElectron = true; // region remote logger

  window.remoteLogger = (() => ({
    setFileName(value) {
      ipcRenderer.send('logger_setFileName', value);
    },

    writeToFile(...logEvents) {
      ipcRenderer.send('logger_writeToFile', logEvents);
    }

  }))(); //endregion
  // region window actions


  remoteWindow.wid;
  const open = window.open.bind(window);

  window.open = function (...args) {
    const childWindow = open(...args);
    const allWindows = remote.BrowserWindow.getAllWindows();
    const remoteChildWindow = allWindows[allWindows.length - 1];
    const featuresStr = args[2];
    const features = featuresStr.split(',').map(o => o.split('=').map(o2 => o2.trim())).reduce((a, o) => {
      let value = o[1];
      a[o[0]] = !(value === '0' || value === 'no');
      return a;
    }, {});
    remoteChildWindow.setAlwaysOnTop(!!features.alwaysOnTop);
    remoteChildWindow.setResizable(!!features.resizable);
    remoteChildWindow.setMovable(!!features.movable);
    remoteChildWindow.setFullScreenable(!!features.fullscreenable); // not needed:
    // initWindow(childWindow, remoteChildWindow)
    // fix electron bug with close about:blank windows
    // see: https://github.com/electron/electron/issues/20086

    childWindow.close = async () => {
      if (remoteChildWindow.isDestroyed()) {
        return;
      }

      const href = childWindow.location.href;
      childWindow.location.href = 'http://0.0.0.0/';
      remoteChildWindow.hide();

      try {
        while (href === childWindow.location.href) {
          // eslint-disable-next-line no-await-in-loop
          await delay(50);
        }
      } catch {}

      if (remoteChildWindow.isDestroyed()) {
        return;
      }

      remoteChildWindow.close();
    };

    return childWindow;
  };

  let windowRect;

  window.saveRect = function () {
    if (windowRect == null && !remoteWindow.isMinimized() && !remoteWindow.isMaximized() && !window.document.fullscreenElement && !window.document.webkitFullscreenElement) {
      windowRect = {
        x: window.screenLeft,
        y: window.screenTop,
        width: window.outerWidth,
        height: window.outerHeight
      };
    }
  };

  window.restoreRect = function () {
    if (windowRect != null && !remoteWindow.isMinimized() && !remoteWindow.isMaximized() && !window.document.fullscreenElement && !window.document.webkitFullscreenElement) {
      window.resizeTo(windowRect.width, windowRect.height);
      window.moveTo(windowRect.x, windowRect.y);
      windowRect = null;
    }
  };

  window.maximize = function () {
    window.saveRect();
    remoteWindow.maximize();
  };

  window.minimize = function () {
    window.saveRect();
    remoteWindow.minimize();
  };

  window.restore = function () {
    remoteWindow.restore();
    window.restoreRect();
  };

  const focus = window.focus.bind(window);

  window.focus = (...args) => {
    remoteWindow.show();
    focus(...args);
  }; // endregion
  // region tray


  window.tray = (() => ({
    updateState(state) {
      ipcRenderer.send('tray_state', state);
    },

    subscribe(eventName, listener) {
      ipcRenderer.on('tray_on' + eventName, (event, ...args) => {
        listener(...args);
      });
    }

  }))();

  window.tray.subscribe('click', e => {
    console.log(e);
  }); // endregion
  // region Dev

  if (appConfig.dev && appConfig.dev.devTools) {
    window.dev = {
      openDevTools() {
        remoteWindow.webContents.openDevTools({
          mode: 'undocked',
          activate: true
        });
      }

    };
    window.addEventListener('keydown', function (e) {
      if (e.key === 'F12') {
        window.dev.openDevTools();
      }
    });
  } // endregion

}

initWindow(window, remoteWindow);