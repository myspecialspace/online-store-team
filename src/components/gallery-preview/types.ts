import { State } from ".";

export enum GalleryPreviewEventName {
  SELECT = "select",
}

export type GalleryPreviewEvents = {
  eventName: GalleryPreviewEventName.SELECT;
  data: State;
};
