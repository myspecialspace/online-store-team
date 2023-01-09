export enum CartListEventName {
  LIMIT = "limit",
  PAGE = "page",
}

export type CartListEventLimit = {
  eventName: CartListEventName.LIMIT;
  data: { limit: number };
};

export type CartListEventPage = {
  eventName: CartListEventName.PAGE;
  data: { page: number };
};

export type CartListEvents = CartListEventLimit | CartListEventPage;
