/* eslint-disable function-paren-newline */
const {
  registerSuite
} = intern.getInterface('object');
const {
  assert
} = intern.getPlugin('chai');

function errorPredicate(log) {
  const message = typeof log === 'string' ? log : log.message;

  if (typeof message !== 'string') {
    return true;
  }

  if (message.endsWith('0:0 Uncaught (in promise) AbortError: Failed to register a ServiceWorker: ServiceWorker script evaluation failed') || message.endsWith('Unhandled rejection: ')) {
    return false;
  }

  if (message.indexOf('__sapper__') >= 0) {
    return false;
  }

  return true;
}

registerSuite('main > sapper > routes > navigation', {
  'base'() {
    // docs:
    // https://theintern.io/docs.html#Leadfoot/2/api/Command/command-1
    // https://theintern.io/leadfoot/module-leadfoot_Command.html
    // this.timeout = 180000
    function clickAll(command, selector, delayMs = 100) {
      return command.findAllByCssSelector(selector).then(async items => {
        for (const item of items) {
          await item.click();
          await delay(delayMs);
        }
      }).end();
    }

    return this.remote // .delay(60000)
    // .getCurrentWindowHandle()
    .openWindow(425, 882).openWindow(425, 882).getWithInternPort('/app/dev').testPage(() => this.remote.testNavigate(null, o => o.pathname, '/app/dev/components/', 2000), errorPredicate);
  }

});