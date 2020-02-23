"use strict";

module.exports = [requireCss('./normalize.css'), require('./tags'), require('./layout'), {
  '.design-image': {
    transform: "translate(-10%, -10%) scale(0.80)",
    width: "fit-content",
    height: "fit-content",
    'image-rendering': "pixelated"
  }
}];