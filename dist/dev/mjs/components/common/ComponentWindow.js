export class ComponentWindow {
  // resizable=no is not worked in browsers because: https://stackoverflow.com/a/15481333/5221762
  constructor({
    windowControllerFactory,
    componentClass,
    options,
    props
  }) {
    this._windowControllerFactory = windowControllerFactory;
    this._componentClass = componentClass;
    this._options = options;
    this._props = props;

    this._windowControllerFactory.loadObservable.subscribe(async windowController => {
      const destroy = await this.attachComponent({
        windowController,
        componentClass: this._componentClass,
        options: { ...this._options,
          props: this._props
        }
      });

      if (destroy) {
        windowController.closeObservable.subscribe(destroy);
      }
    });
  }

  get windowController() {
    return this._windowControllerFactory.windowController;
  }

  // async needed for bypass slows down performance on electron
  async attachComponent({
    windowController,
    componentClass,
    options
  }) {
    const component = new componentClass({ ...options,
      target: windowController.win.container,
      props: {
        win: windowController.win,
        ...(options && options.props)
      }
    });
    this._component = component;
    return () => {
      if (this._component === component) {
        this._component = null;
      }

      if (windowController.isDestroyed) {
        return;
      }

      component.$destroy();
    };
  }

  setProps(props) {
    this._props = props;

    if (this._component) {
      this._component.$set(this._props);
    }
  }

  close() {
    this._windowControllerFactory.close();
  }

}