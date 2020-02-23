import templates, { iconMask, icon } from "../../../helpers/templates";
import colors from '../../templates/colors';
module.exports = [{
  '.icon': [{
    '&-window': {
      '&-minimize': iconMask({
        url: 'client/images/icons/window/minimize.png',
        y: `83%`
      }),
      '&-maximize': iconMask({
        url: 'client/images/icons/window/maximize.png',
        y: `80%`
      }),
      '&-restore': iconMask({
        url: 'client/images/icons/window/restore.png'
      }),
      '&-close': iconMask({
        url: 'client/images/icons/window/close.png'
      }),
      '&-fullscreen': {
        '&-enter': iconMask({
          url: 'client/images/icons/window/fullscreen-enter.png'
        }),
        '&-exit': iconMask({
          url: 'client/images/icons/window/fullscreen-exit.png'
        })
      }
    },
    '&-check': iconMask({
      url: 'client/images/icons/check.png'
    }),
    '&-loading': icon({
      url: 'client/images/icons/loading.png',
      // see also: base/at-rules.js and https://stackoverflow.com/a/16771693/5221762
      animation: `spin 4s linear infinite`
    })
  }, templates.important({
    '&--blue': {
      'background-color': colors.blue
    },
    '&--gray': {
      'background-color': colors.base[14]
    },
    '&--red': {
      'background-color': colors.red[13]
    },
    '&--yellow': {
      'background-color': colors.yellow
    },
    '&--green': {
      'background-color': colors.green
    }
  })]
}];