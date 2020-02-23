// @ts-ignore
import { html, SparkMD5 } from './helpers-cjs';
export function md5(str) {
  const spark = new SparkMD5();
  spark.append(str);
  return spark.end();
}
export function escapeJs(str) {
  return str && str.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
}
export function escapeHtml(str) {
  return html.escape(str);
}
export function delay(timeMilliseconds) {
  return new Promise(resolve => setTimeout(resolve, timeMilliseconds));
}

const _spacesRegex = new RegExp('\\s+');

const _spacesWithoutNewLinesRegex = new RegExp('[^\\S\\n]+');

const _fixNewLines = new RegExp('([^\\S\\n]*\\n[^\\S\\n]*)');

export function removeExcessSpaces(text, keepLines) {
  if (!text) {
    return text;
  }

  if (keepLines) {
    text = text.replace(_spacesWithoutNewLinesRegex, ' ').trim();
    text = text.replace(_fixNewLines, '\\r\\n');
    text = text.replace(new RegExp('((\\r\\n){' + keepLines + '})[\\r\\n]*'), '$1');
  } else {
    text = text.replace(_spacesRegex, ' ').trim();
  }

  return text;
}
export function getGlobalScope() {
  if (typeof window !== 'undefined') {
    return window;
  }

  if (typeof self !== 'undefined') {
    return self;
  }

  if (typeof global !== 'undefined') {
    return global;
  }

  return null;
}
export const globalScope = getGlobalScope();