import { Component } from "../../helpers/component";
import "./index.scss";
import template from "./template.html";
import { GalleryPreviewEvents } from "./types";

type State = string;

export class GalleryPreviewComponent extends Component<State> {
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
      this.emit(GalleryPreviewEvents.SELECT, this.state);
    });
  }
}
