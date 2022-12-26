export interface Options<TState> {
  //component Options
  state?: TState;
  template: string;
}

export interface Listener {
  name: EventName;
  fn: ListenerFn;
}

export type EventName = string;
export type ListenerFn = (data: ListenerFnData) => any; //TODO
export type ListenerFnData = any; //TODO
