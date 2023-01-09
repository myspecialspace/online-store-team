export enum CatalogPanelEventName {
  VIEW = "view",
  SORT = "sort",
  SEARCH = "search",
}

export enum ViewType {
  BIG = "big",
  SMALL = "small",
}

export type CatalogPanelViewEvent = {
  eventName: CatalogPanelEventName.VIEW;
  data: ViewType;
};

export type CatalogPanelSortEvent = {
  eventName: CatalogPanelEventName.SORT;
  data: string;
};

export type CatalogPanelSearchEvent = {
  eventName: CatalogPanelEventName.SEARCH;
  data: string;
};

export type CatalogPanelEvents =
  | CatalogPanelViewEvent
  | CatalogPanelSortEvent
  | CatalogPanelSearchEvent;
