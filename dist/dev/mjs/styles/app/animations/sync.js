module.exports = [{
  '.should-sync, .syncing': {
    'animation-name': `sync-fade`,
    'animation-iteration-count': `infinite`,
    'animation-direction': `alternate`,
    'animation-timing-function': `ease-in-out`
  },
  '.should-sync': {
    'animation-duration': `1s`
  },
  '.syncing': {
    'animation-duration': `0.333s`
  }
}];