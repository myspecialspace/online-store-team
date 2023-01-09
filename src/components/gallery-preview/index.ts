import { Component } from "../../helpers/component";
import "./index.scss";
import template from "./template.html";
import { GalleryPreviewEventName, GalleryPreviewEvents } from "./types";

export type State = string;

export class GalleryPreviewComponent extends Component<
  State,
  GalleryPreviewEvents
> {
  $image: HTMLImageElement | null = null;

  constructor(state: State) {
    super({ template, state });
  }

  onMounted() {
    this.$image = this.query(".image");

    this.onUpdated();
    this.addEvents();
  }

  onUpdated() {
    this.$image!.src = this.state;
  }

  addEvents() {
    this.$root!.addEventListener("click", () => {
      this.emit(GalleryPreviewEventName.SELECT, this.state);
    });
  }
}
