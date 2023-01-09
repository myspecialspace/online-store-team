import { State as CatalogRangeFilterState } from "../catalog-range-filter";

export enum CatalogFiltersEventName {
  CHANGE = "change",
  RESET = "reset",
  COPY = "copy",
}

export type CatalogFiltersChangeEvent = {
  eventName: CatalogFiltersEventName.CHANGE;
  data: {
    brands: string[];
    categories: string[];
    price: CatalogRangeFilterState;
    stock: CatalogRangeFilterState;
  };
};

export type CatalogFiltersResetEvent = {
  eventName: CatalogFiltersEventName.RESET;
};

export type CatalogFiltersCopyEvent = {
  eventName: CatalogFiltersEventName.COPY;
};

export type CatalogFiltersEvents =
  | CatalogFiltersChangeEvent
  | CatalogFiltersResetEvent
  | CatalogFiltersCopyEvent;
