export interface Options<TState> {
  state?: TState;
  template: string;
}

export interface Listener<TEvents extends EventsUnion> {
  name: EventName;
  fn: ListenerFn<EventsData<TEvents, EventsName<TEvents>>>;
}

export type ListenerFn<TData> = (data: TData) => void;

export type EventsName<TEvents extends EventsUnion> = TEvents["eventName"];

export type EventsData<
  TEvents extends EventsUnion,
  TName extends EventsName<TEvents>
> = Extract<TEvents, { eventName: TName }>["data"];

export type EventsUnion = {
  eventName: string;
  data?: unknown;
};

export type EventName = string;

export enum Hooks {
  ON_MOUNTED = "onMounted",
  ON_UPDATED = "onUpdated",
  ON_DESTROYED = "onDestroyed",
}
