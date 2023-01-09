import { State } from ".";

export enum CatalogCheckboxEventName {
  CHANGE = "change",
}

export type CatalogCheckboxEvents = {
  eventName: CatalogCheckboxEventName.CHANGE;
  data: {
    checkbox: State;
    isChecked: boolean;
  };
};
