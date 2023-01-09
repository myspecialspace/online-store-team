import { State } from ".";

export enum CatalogItemEventName {
  ADD = "add",
}

export type CatalogItemEvents = {
  eventName: CatalogItemEventName.ADD;
  data: State;
};
