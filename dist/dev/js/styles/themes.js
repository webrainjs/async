"use strict";

module.exports = function (componentId) {
  if (componentId === void 0) {
    componentId = '';
  }

  return [require('./app/themes.js')(componentId)];
};