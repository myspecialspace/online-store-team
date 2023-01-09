import { Component } from "../../helpers/component";
import { GalleryPreviewComponent } from "../gallery-preview";
import { GalleryPreviewEvents } from "../gallery-preview/types";
import "./index.scss";
import template from "./template.html";

type State = string[];

export class GalleryComponent extends Component<State> {
  $previews: HTMLDivElement | null = null;
  $image: HTMLImageElement | null = null;
  $zoom: HTMLImageElement | null = null;

  previewComponents: GalleryPreviewComponent[] = [];

  selectedImage: string | null = null;

  constructor(state: State) {
    super({ template, state });
  }

  onMounted() {
    this.$previews = this.query(".previews");
    this.$image = this.query(".main-image");
    this.$zoom = this.query(".zoom-image");

    this.createPreviews();
    this.addEvents();
    this.updateImage(this.state[0]);
  }

  addEvents() {
    this.$image!.addEventListener("mousemove", (event) => {
      const rect = this.$image!.getBoundingClientRect();

      const scaleFactor = 1.5;

      const x = event.clientX - rect.x;
      const y = event.clientY - rect.y;

      const xMiddle = this.$image!.offsetWidth / 2;
      const yMiddle = this.$image!.offsetHeight / 2;

      const xPos = (xMiddle - x) / scaleFactor;
      const yPos = (yMiddle - y) / scaleFactor;

      this.setZoomPosition(xPos, yPos);
    });
  }

  createPreviews() {
    this.state.forEach((src) => {
      const component = new GalleryPreviewComponent(src);
      component.render(this.$previews!);
      component.on(GalleryPreviewEvents.SELECT, (src) => {
        this.updateImage(src);
      });
      this.previewComponents.push(component);
    });
  }

  updateImage(src: string): void {
    this.selectedImage = src;
    this.$image!.src = src;
    this.$zoom!.src = src;
  }

  setZoomPosition(x: number, y: number): void {
    this.$zoom!.style.left = x + "px";
    this.$zoom!.style.top = y + "px";
  }
}
