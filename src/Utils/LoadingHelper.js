// Helper for handler Loading

class LoadingHelper {
  instance;

  isShow = false;

  constructor() {
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  setInstance(instance) {
    this.instance = instance;
  }

  show() {
    if (this.instance) {
      this.instance.show();
    }
  }

  hide() {
    if (this.instance) {
      this.instance.hide();
    }
  }
}

export default new LoadingHelper();
