import { WindowControllerFactory } from '../../main/browser/helpers/html-controllers/WindowController';
import { ComponentWindow } from '../common/ComponentWindow'; // @ts-ignore

import WebrainWindow from './WebrainWindow.svelte';
const webrainWindow = new ComponentWindow({
  windowControllerFactory: new WindowControllerFactory({
    windowName: 'Webrain'
  }),
  componentClass: WebrainWindow
});
export async function openWebrainWindow() {
  webrainWindow.windowController.show();
}