"use strict";

/* tslint:disable:no-var-requires */
var SparkMD5 = require('spark-md5');

var html = require('html-escaper'); // don't mix require and import/export; see: https://github.com/rollup/rollup/issues/1058#issuecomment-254187433


module.exports = {
  SparkMD5: SparkMD5,
  html: html
};