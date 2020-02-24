import { notificationWindowsController } from '../../../main/browser/helpers/html-controllers/NotificationWindowsController';
import { WindowControllerFactory } from '../../../main/browser/helpers/html-controllers/WindowController';
import { ComponentWindow } from '../ComponentWindow';
export function showNotificationWindowFactory({
  windowOptions,
  componentClass
}) {
  let win;
  return async function showNotification(props) {
    if (props) {
      if (!win) {
        win = new ComponentWindow({
          windowControllerFactory: new WindowControllerFactory({
            windowFeatures: 'width=110,height=110,' + 'titlebar=no,resizable=no,movable=yes,alwaysOnTop=yes,fullscreenable=no,' + 'location=no,toolbar=no,scrollbars=no,menubar=no,status=no,directories=no,' + 'dialog=yes,modal=yes,dependent=yes',
            ...windowOptions,
            windowControllerOptions: {
              windowName: componentClass.name,
              storeWindowState: false,
              ...windowOptions.windowControllerOptions
            }
          }),
          componentClass,
          props
        });
      } else {
        win.setProps(props);
      }

      if (!win.windowController) {
        console.error('Cannot create windowController');
        return;
      }

      notificationWindowsController.show(win.windowController.win);
    } else {
      if (win) {
        win.close();
      }
    }
  };
}
export function showNotificationApiFactory({
  defaultOptions
}) {
  let notification;
  return async function showNotification(options) {
    if (notification) {
      notification.close();
      notification = null;
    }

    if (options) {
      options = { ...defaultOptions,
        ...options
      };
      notification = new Notification(options.title, options);

      if (options.onclick) {
        notification.addEventListener('click', options.onclick);
      }

      if (options.onclose) {
        notification.addEventListener('close', options.onclose);
      }
    }
  };
}
export function showNotificationFactory(options) {
  if (typeof window !== 'undefined' && window.isElectron && options.notificationWindow) {
    return showNotificationWindowFactory(options.notificationWindow);
  } else if (options.notificationApi) {
    const showNotification = showNotificationApiFactory({
      defaultOptions: options.notificationApi.defaultOptions
    });
    return async props => showNotification(props && (await options.notificationApi.getOptions(props)));
  }
}