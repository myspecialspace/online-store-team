export interface Options<TState> {
  state?: TState;
  template: string;
}

export interface Listener {
  name: EventName;
  fn: ListenerFn;
}

export type EventName = string;
export type ListenerFn = (data: ListenerFnData) => unknown;
export type ListenerFnData = any; // TODO

export enum Hooks {
  ON_MOUNTED = "onMounted",
  ON_UPDATED = "onUpdated",
  ON_DESTROYED = "onDestroyed",
}
