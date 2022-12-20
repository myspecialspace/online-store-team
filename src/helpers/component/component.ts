import { EventName, Listener, ListenerFn, ListenerFnData, Options } from "./types";

export class Component<TState = null> {
  private _state: TState;
  private _template: string;
  private _$parent: HTMLElement | null = null;
  private _listeners: Listener[] = [];
  private isMounted: boolean = false;
  private _templateDom: HTMLDivElement;
  private $root: HTMLElement | null = null;

  constructor(options: Options<TState>) {
    this._state = options.state || {} as TState;
    this._template = options.template;
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

  render(appendTo: string | HTMLElement) {
    this._$parent = typeof appendTo === 'string'
      ? document.querySelector(appendTo)
      : appendTo;

    const domChildren = this._templateDom.children;

    if (domChildren.length !== 1) {
      console.error('DomChildren', domChildren);
      throw Error(`Component template must have only 1 root element. But got ${domChildren.length}.`);
    }

     this.$root = domChildren[0] as HTMLElement;
    this._$parent!.appendChild(this.$root);

    this.isMounted = true;

    this._callHook('onMounted');
  }

  destroy() {
    this.$root!.remove();
    this._listeners = [];
    this._callHook('onDestroyed');
  }
  // у query и queryAll  дженерик должен быть тут именно Element
  query<TElement extends Element>(selector: string) {
    return this.$root!.querySelector<TElement>(selector);
  }

  queryAll<TElement extends Element>(selector: string) {
   return this.$root!.querySelectorAll<TElement>(selector);
  }

  on(name: EventName, fn: ListenerFn) {
    this._listeners.push({ name, fn });
  }

  emit(name: EventName, data: ListenerFnData) {
    this._listeners.forEach((listener) => {
      if (listener.name === name) {
        listener.fn(data);
      }
    });
  }

  onMounted() { }
  onUpdated() { }
  onDestroyed() { }

  _callHook(name: keyof this) {
    const hook = this[name];

    if (typeof hook === 'function') {
      hook.call(this); //вызов в контексте иначе теряется
    }
  }
}