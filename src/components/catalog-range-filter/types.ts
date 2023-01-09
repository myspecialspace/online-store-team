import { State } from ".";

export enum CatalogRangeFilterEventName {
  CHANGE = "change",
}

export interface RangeValue {
  from: number;
  to: number;
}

export type CatalogRangeFilterEvents = {
  eventName: CatalogRangeFilterEventName.CHANGE;
  data: State;
};
