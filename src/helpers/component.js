export class Component {
  constructor(options) {
    this._state = options.state || {};
    this._template = options.template;
    this._$parent;
    this._listeners = [];
    this.isMounted = false;

    this._templateDom = document.createElement('div');
    this._templateDom.innerHTML = this._template;
  }

  set state(patch) {
    this._state = {
      ...this._state,
      ...patch,
    };

    if (this.isMounted) {
      this._callHook('onUpdated');
    }
  }

  get state() {
    return this._state;
  }

  render(appendTo) {
    this._$parent = typeof appendTo === 'string'
      ? document.querySelector(appendTo)
      : appendTo;
    
    const domChildren = this._templateDom.children;

    if (domChildren.length !== 1) {
      console.error('DomChildren', domChildren);
      throw Error(`Component template must have only 1 root element. But got ${domChildren.length}.`);
    }

    this.$root = domChildren[0];
    this._$parent.appendChild(this.$root);

    this.isMounted = true;

    this._callHook('onMounted');
  }

  destroy() {
    this.$root.remove();
    this.isDestroyed = true;
    this._listeners = [];
    this._callHook('onDestroyed');
  }

  query(selector) {
    return this.$root.querySelector(selector);
  }

  queryAll(selector) {
   return this.$root.querySelectorAll(selector);
  }

  on(name, fn) {
    this._listeners.push({ name, fn });
  }

  emit(name, data) {
    this._listeners.forEach((listener) => {
      if (listener.name === name) {
        listener.fn(data);
      }
    });
  }

  onMounted() { }
  onUpdated() { }
  onDestroyed() { }

  _callHook(name) {
    if (typeof this[name] === 'function') {
      this[name]();
    }
  }
}