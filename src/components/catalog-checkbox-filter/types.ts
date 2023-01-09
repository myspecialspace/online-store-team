export enum CatalogCheckboxFilterEventName {
  CHANGE = "change",
}

export type CatalogCheckboxFilterEvents = {
  eventName: CatalogCheckboxFilterEventName.CHANGE;
  data: string[];
};
