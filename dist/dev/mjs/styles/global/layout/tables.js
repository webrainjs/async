import templates from '../../helpers/templates';
module.exports = [{
  '.table-layout': {
    'border-collapse': `collapse`,
    'border-spacing': `0`,
    position: `relative`,
    '&--fill': {
      width: `100%`,
      height: `100%`,
      '&-horizontal': {
        width: `100%`
      }
    },
    '&--fixed': {
      'table-layout': `fixed`
    },
    '&__row': {
      '&--fill': {
        height: `100%`
      }
    },
    '&__cell': {
      position: `relative`,
      overflow: `hidden`,
      'vertical-align': `middle`,
      '&--fill': {
        width: `100%`
      }
    },
    '&__scroll': { ...templates.fill,
      overflow: `scroll`,
      '&-vertical': { ...templates.fill,
        'overflow-y': `scroll`,
        'overflow-x': `hidden`,
        '.table-layout__content': { ...templates.fill,
          bottom: `auto`
        }
      },
      '&-horizontal': { ...templates.fill,
        'overflow-y': `hidden`,
        'overflow-x': `scroll`,
        '.table-layout__content': { ...templates.fill,
          right: `auto`
        }
      }
    }
  }
}];