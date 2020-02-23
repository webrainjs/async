import constants from '../../helpers/constants';
const fontClear = {
  'font-size': `100%`,
  'font-family': constants.fonts.base,
  color: `rgba(0,0,0,0)`,
  'text-transform': `none`,
  'text-rendering': `initial`,
  'text-size-adjust': `initial`,
  'letter-spacing': `initial`,
  'font-weight': `initial`,
  '-webkit-box-direction': `initial`,
  '-webkit-font-smoothing': `initial`
};
module.exports = [{
  '.icon': {
    position: `absolute`,
    top: `0`,
    left: `0`,
    right: `0`,
    bottom: `0`,
    margin: `auto`
  },
  '.icon-block': {
    display: `block`,
    width: `1em`,
    height: `1em`
  },
  '.icon-inline': {
    display: `inline-block`,
    width: `1em`,
    height: `1em`,
    'vertical-align': `middle`,
    'margin-top': `-0.223em`,
    'white-space': `nowrap`,
    ...fontClear
  }
}];