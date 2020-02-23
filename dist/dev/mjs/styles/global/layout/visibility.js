import templates from "../../helpers/templates";
module.exports = [templates.important({
  '.hidden': {
    visibility: `hidden`
  },
  '.collapsed': {
    display: `none`
  },
  '.no-ghost-childs > *': {
    'pointer-events': `auto`,
    'user-select': `auto`
  },
  '.ghost': {
    'pointer-events': `none`,
    'user-select': `none`
  },
  '.no-ghost': {
    'pointer-events': `auto`,
    'user-select': `auto`
  }
})];