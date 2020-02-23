import { getPPI } from './ppi';
export function calcRelativeFontSize(container, coef = 1.0) {
  const fontSize = Math.min(container.offsetWidth, container.offsetHeight) / 480 * getPPI() / 96 * 10 * coef;
  console.log(`ppi = ${getPPI()}; width = ${container.offsetWidth}; height = ${container.offsetHeight}; fontSize = ${fontSize}`);
  return fontSize;
}
export function setRelativeFontSize(container, coef = 1.0) {
  const fontSize = calcRelativeFontSize(container, coef);
  container.style.fontSize = `${fontSize}px`;
  return fontSize;
}