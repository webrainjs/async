// @ts-ignore
import Color from 'color';

function palette(baseColor, minLight = 5) {
  const hsl = Color(baseColor).hsl().color;
  const h = hsl[0];
  const s = hsl[1];
  const coef = Math.pow(minLight / 100, 1 / 15);
  const result = [];
  result[0] = '#000';
  result[16] = '#fff';
  let light = 100;

  for (let i = 0; i < 15; i++) {
    result[15 - i] = Color.hsl(h, s, light *= coef).toString();
  }

  return result;
}

module.exports = {
  palette
};