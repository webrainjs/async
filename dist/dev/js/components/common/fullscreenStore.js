"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.fullscreenStore = fullscreenStore;

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _store = require("svelte/store");

// @ts-ignore
function isFullscreen(elem) {
  if (!elem || !elem.getRootNode) {
    return null;
  }

  var document = elem.getRootNode();
  var currentElem = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
  return currentElem === document.documentElement ? true : currentElem ? null : false;
}

function enterFullscreen(elem) {
  if (!elem || !elem.getRootNode) {
    return;
  }

  var document = elem.getRootNode();

  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    /* Firefox */
    document.documentElement.mozRequestFullScreen();
  } else if (document.documentElement.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
  } else if (document.documentElement.msRequestFullscreen) {
    /* IE/Edge */
    document.documentElement.msRequestFullscreen();
  }
}

function exitFullscreen(elem) {
  if (!elem || !elem.getRootNode) {
    return;
  }

  var document = elem.getRootNode();

  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE/Edge */
    document.msExitFullscreen();
  }
}

function canFullscreen(elem) {
  if (!elem || !elem.getRootNode) {
    return false;
  }

  var document = elem.getRootNode();
  return !!(document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen);
}

function fullscreenStore(elem) {
  var _context, _context2;

  if (!canFullscreen(elem)) {
    return null;
  }

  var document = elem.getRootNode();
  var store = (0, _store.writable)(isFullscreen(elem));
  var set = (0, _bind.default)(_context = store.set).call(_context, store);

  store.set = function (value) {
    if (!value) {
      if (isFullscreen(elem) !== false) {
        exitFullscreen(elem);
      }
    } else {
      if (isFullscreen(elem) !== true) {
        enterFullscreen(elem);
      }
    }
  };

  store.toggle = function () {
    if (isFullscreen(elem) === true) {
      exitFullscreen(elem);
    } else {
      enterFullscreen(elem);
    }
  };

  var eventHandler = function eventHandler() {
    set(isFullscreen(elem));
  };

  (0, _forEach.default)(_context2 = ['', 'webkit', 'moz', 'ms']).call(_context2, function (prefix) {
    return document.addEventListener(prefix + 'fullscreenchange', eventHandler, false);
  });

  store.destroy = function () {
    var _context3;

    (0, _forEach.default)(_context3 = ['', 'webkit', 'moz', 'ms']).call(_context3, function (prefix) {
      return document.removeEventListener(prefix + 'fullscreenchange', eventHandler, false);
    });
  };

  return store;
}