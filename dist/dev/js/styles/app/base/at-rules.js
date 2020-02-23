"use strict";

module.exports = [// region For loading animation: https://stackoverflow.com/a/16771693/5221762
{
  '@-moz-keyframes spin': {
    '100%': {
      '-moz-transform': "rotate(360deg)"
    }
  },
  '@-webkit-keyframes spin': {
    '100%': {
      '-webkit-transform': "rotate(360deg)"
    }
  },
  '@keyframes spin': {
    '100%': {
      '-webkit-transform': "rotate(360deg)",
      transform: "rotate(360deg)"
    }
  }
} // endregion
];