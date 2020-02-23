import { HtmlController } from './HtmlController';
export class ScrollDragController extends HtmlController {
  constructor({
    container,
    scrollMatches,
    noDragMatches,
    throttlePixels = 5
  }) {
    super(container);
    this._throttlePixels = throttlePixels;
    this._scrollMatches = scrollMatches;
    this._noDragMatches = noDragMatches;
    this.addEventListener(scrollMatches, 'mousedown', this.mousedown.bind(this));
    this.addEventListener(scrollMatches, 'mousemove', this.mousemove.bind(this));
    this.addEventListener(null, 'mouseup', this.mouseup.bind(this));
    this.addEventListener(null, 'click', this.click.bind(this));
  }

  mousedown(event) {
    const scroll = event.container;

    if (scroll && (!this._noDragMatches || !this._noDragMatches(event.target) || document.elementFromPoint(event.pageX, event.pageY) === scroll)) {
      this._pushed = 1;
      this._moved = false;
      this._lastClientX = event.clientX;
      this._lastClientY = event.clientY; // event.preventDefault()
    }
  }

  mouseup(event) {
    this._pushed = 0;

    if (this._moved) {
      event.preventDefault();
    }
  }

  click(event) {
    if (this._moved) {
      event.preventDefault();
      this._moved = false;
    }
  }

  mousemove(event) {
    const scroll = event.container;

    if (scroll && this._pushed && (Math.abs(this._lastClientX - event.clientX) > this._throttlePixels || Math.abs(this._lastClientY - event.clientY) > this._throttlePixels)) {
      this._moved = true;
      (this._scroller = scroll._scroller || scroll).scrollLeft -= this._newScrollX = -this._lastClientX + (this._lastClientX = event.clientX);
      this._scroller.scrollTop -= this._newScrollY = -this._lastClientY + (this._lastClientY = event.clientY);

      if (scroll === document.body) {
        (this._scroller = document.documentElement).scrollLeft -= this._newScrollX;
        this._scroller.scrollTop -= this._newScrollY;
      }
    }
  }

}