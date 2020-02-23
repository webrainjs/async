import { screen } from 'electron';
export let WindowPosition;

(function (WindowPosition) {
  WindowPosition["TrayLeft"] = "trayLeft";
  WindowPosition["TrayBottomLeft"] = "trayBottomLeft";
  WindowPosition["TrayRight"] = "trayRight";
  WindowPosition["TrayBottomRight"] = "trayBottomRight";
  WindowPosition["TrayCenter"] = "trayCenter";
  WindowPosition["TrayBottomCenter"] = "trayBottomCenter";
  WindowPosition["TopLeft"] = "topLeft";
  WindowPosition["TopRight"] = "topRight";
  WindowPosition["BottomLeft"] = "bottomLeft";
  WindowPosition["BottomRight"] = "bottomRight";
  WindowPosition["TopCenter"] = "topCenter";
  WindowPosition["BottomCenter"] = "bottomCenter";
  WindowPosition["LeftCenter"] = "leftCenter";
  WindowPosition["RightCenter"] = "rightCenter";
  WindowPosition["Center"] = "center";
})(WindowPosition || (WindowPosition = {}));

const trayPositions = [WindowPosition.TrayLeft, WindowPosition.TrayBottomLeft, WindowPosition.TrayRight, WindowPosition.TrayBottomRight, WindowPosition.TrayCenter, WindowPosition.TrayBottomCenter]; // from here: https://raw.githubusercontent.com/jenslind/electron-positioner/master/index.js

export class WindowPositioner {
  constructor(browserWindow) {
    this.browserWindow = browserWindow;
    this.electronScreen = screen || window.screen;
  }

  _getCoords(position, trayPosition, margin) {
    const screenSize = this._getScreenSize(trayPosition);

    const windowSize = this._getWindowSize();

    if (!trayPosition) {
      trayPosition = {};
    }

    if (!margin) {
      margin = 0;
    } // Positions


    const positions = {
      [WindowPosition.TrayLeft]: {
        x: Math.floor(trayPosition.x + margin),
        y: screenSize.y + margin
      },
      [WindowPosition.TrayBottomLeft]: {
        x: Math.floor(trayPosition.x + margin),
        y: Math.floor(screenSize.height - (windowSize[1] + margin - screenSize.y))
      },
      [WindowPosition.TrayRight]: {
        x: Math.floor(trayPosition.x - (windowSize[0] + margin) + trayPosition.width),
        y: screenSize.y + margin
      },
      [WindowPosition.TrayBottomRight]: {
        x: Math.floor(trayPosition.x - (windowSize[0] + margin) + trayPosition.width),
        y: Math.floor(screenSize.height - (windowSize[1] + margin - screenSize.y))
      },
      [WindowPosition.TrayCenter]: {
        x: Math.floor(trayPosition.x - windowSize[0] / 2 + trayPosition.width / 2),
        y: screenSize.y + margin
      },
      [WindowPosition.TrayBottomCenter]: {
        x: Math.floor(trayPosition.x - windowSize[0] / 2 + trayPosition.width / 2),
        y: Math.floor(screenSize.height - (windowSize[1] + margin - screenSize.y))
      },
      [WindowPosition.TopLeft]: {
        x: screenSize.x + margin,
        y: screenSize.y + margin
      },
      [WindowPosition.TopRight]: {
        x: Math.floor(screenSize.x + (screenSize.width - (windowSize[0] + margin))),
        y: screenSize.y + margin
      },
      [WindowPosition.BottomLeft]: {
        x: screenSize.x + margin,
        y: Math.floor(screenSize.height - (windowSize[1] + margin - screenSize.y))
      },
      [WindowPosition.BottomRight]: {
        x: Math.floor(screenSize.x + (screenSize.width - (windowSize[0] + margin))),
        y: Math.floor(screenSize.height - (windowSize[1] + margin - screenSize.y))
      },
      [WindowPosition.TopCenter]: {
        x: Math.floor(screenSize.x + (screenSize.width / 2 - windowSize[0] / 2)),
        y: screenSize.y + margin
      },
      [WindowPosition.BottomCenter]: {
        x: Math.floor(screenSize.x + (screenSize.width / 2 - windowSize[0] / 2)),
        y: Math.floor(screenSize.height - (windowSize[1] + margin - screenSize.y))
      },
      [WindowPosition.LeftCenter]: {
        x: screenSize.x + margin,
        y: screenSize.y + Math.floor(screenSize.height / 2) - Math.floor(windowSize[1] / 2)
      },
      [WindowPosition.RightCenter]: {
        x: Math.floor(screenSize.x + (screenSize.width - (windowSize[0] + margin))),
        y: screenSize.y + Math.floor(screenSize.height / 2) - Math.floor(windowSize[1] / 2)
      },
      [WindowPosition.Center]: {
        x: Math.floor(screenSize.x + (screenSize.width / 2 - windowSize[0] / 2)),
        y: Math.floor((screenSize.height + screenSize.y) / 2 - windowSize[1] / 2)
      }
    }; // Default to right if the window is bigger than the space left.
    // Because on Windows the window might get out of bounds and dissappear.

    if (trayPositions.indexOf(position) >= 0 && positions[position].x + windowSize[0] + margin > screenSize.width + screenSize.x) {
      return {
        x: positions[WindowPosition.TopRight].x,
        y: positions[position].y
      };
    }

    return positions[position];
  }

  _getWindowSize() {
    return this.browserWindow.getSize();
  }

  _getScreenSize(trayPosition) {
    if (trayPosition) {
      return this.electronScreen.getDisplayMatching(trayPosition).workArea;
    } else {
      return this.electronScreen.getDisplayNearestPoint(this.electronScreen.getCursorScreenPoint()).workArea;
    }
  }

  move(position, trayPos, margin) {
    // Get positions coords
    const coords = this._getCoords(position, trayPos, margin); // Set the windows position


    this.browserWindow.setPosition(coords.x, coords.y);
  }

  calculate(position, trayPos, margin) {
    // Get positions coords
    const coords = this._getCoords(position, trayPos, margin);

    return {
      x: coords.x,
      y: coords.y
    };
  }

}