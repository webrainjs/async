// @ts-ignore
import { writable } from 'svelte/store';

function isFullscreen(elem) {
  if (!elem || !elem.getRootNode) {
    return null;
  }

  const document = elem.getRootNode();
  const currentElem = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
  return currentElem === document.documentElement ? true : currentElem ? null : false;
}

function enterFullscreen(elem) {
  if (!elem || !elem.getRootNode) {
    return;
  }

  const document = elem.getRootNode();

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

  const document = elem.getRootNode();

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

  const document = elem.getRootNode();
  return !!(document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen);
}

export function fullscreenStore(elem) {
  if (!canFullscreen(elem)) {
    return null;
  }

  const document = elem.getRootNode();
  const store = writable(isFullscreen(elem));
  const set = store.set.bind(store);

  store.set = value => {
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

  const eventHandler = () => {
    set(isFullscreen(elem));
  };

  ['', 'webkit', 'moz', 'ms'].forEach(prefix => document.addEventListener(prefix + 'fullscreenchange', eventHandler, false));

  store.destroy = () => {
    ['', 'webkit', 'moz', 'ms'].forEach(prefix => document.removeEventListener(prefix + 'fullscreenchange', eventHandler, false));
  };

  return store;
}