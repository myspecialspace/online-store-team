import {
  EventsData,
  EventsName,
  EventsUnion,
  Hooks,
  Listener,
  ListenerFn,
  Options,
} from "./types";

export class Component<
  TState = Record<string, never>,
  TEvents extends EventsUnion = EventsUnion
> {
  private _state: TState;
  private _template: string;
  private _$parent: HTMLElement | null = null;
  private _listeners: Listener<TEvents>[] = [];
  private isMounted = false;
  private _templateDom: HTMLDivElement;
  public $root: HTMLElement | null = null;

  constructor(options: Options<TState>) {
    this._state = options.state || ({} as TState);
    this._template = options.template;
    this._templateDom = document.createElement("div");
    this._templateDom.innerHTML = this._template;
  }

  public set state(patch: Partial<TState>) {
    this._state = {
      ...this._state,
      ...patch,
    };

    if (this.isMounted) {
      this.callHook(Hooks.ON_UPDATED);
    }
  }

  public get state(): TState {
    return this._state;
  }

  public render(appendTo: string | HTMLElement) {
    this._$parent =
      typeof appendTo === "string"
        ? document.querySelector(appendTo)
        : appendTo;

    const domChildren = this._templateDom.children;

    if (domChildren.length !== 1) {
      console.error("DomChildren", domChildren);
      throw Error(
        `Component template must have only 1 root element. But got ${domChildren.length}.`
      );
    }

    this.$root = domChildren[0] as HTMLElement;
    this._$parent!.appendChild(this.$root);

    this.isMounted = true;

    this.callHook(Hooks.ON_MOUNTED);
  }

  public destroy() {
    this.$root!.remove();
    this._listeners = [];
    this.callHook(Hooks.ON_DESTROYED);
  }

  public query<TElement extends Element>(selector: string) {
    return this.$root!.querySelector<TElement>(selector);
  }

  public queryAll<TElement extends Element>(selector: string) {
    return this.$root!.querySelectorAll<TElement>(selector);
  }

  public on<
    TName extends EventsName<TEvents>,
    TData extends EventsData<TEvents, TName>
  >(name: TName, fn: ListenerFn<TData>) {
    this._listeners.push({ name, fn } as Listener<TEvents>);
    return this;
  }

  public emit<
    TName extends EventsName<TEvents>,
    TData extends EventsData<TEvents, TName>
  >(name: TName, data?: TData) {
    this._listeners.forEach((listener) => {
      if (listener.name === name) {
        listener.fn(data);
      }
    });
  }

  private callHook(hookName: Hooks) {
    const hook = this[hookName as keyof this];

    if (typeof hook === "function") {
      hook.call(this);
    }
  }
}
