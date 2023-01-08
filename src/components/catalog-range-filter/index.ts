import { Component } from "../../helpers/component";
import "./index.scss";
import template from "./template.html";
import { CatalogRangeFilterEvent } from "./types";

export type State = {
  min: number;
  max: number;
  from: number;
  to: number;
  title: string;
};

export class CatalogRangeFilterComponent extends Component<State> {
  $from: HTMLInputElement | null = null;
  $to: HTMLInputElement | null = null;
  $title: HTMLDivElement | null = null;
  $fromLabel: HTMLDivElement | null = null;
  $toLabel: HTMLDivElement | null = null;

  fromValue = 0;
  toValue = 0;

  readonly delta = 0;

  constructor(state: State) {
    super({ template, state });
  }

  onMounted() {
    this.$from = this.query("#from");
    this.$to = this.query("#to");
    this.$title = this.query(".title");
    this.$fromLabel = this.query(".from-label");
    this.$toLabel = this.query(".to-label");

    this.onUpdated();
    this.addEvents();
  }

  onUpdated() {
    this.$title!.textContent = this.state.title;

    this.$from!.min = String(this.state.min);
    this.$from!.max = String(this.state.max);
    this.$from!.value = String(this.state.from);

    this.$to!.min = String(this.state.min);
    this.$to!.max = String(this.state.max);
    this.$to!.value = String(this.state.to);

    this.updateFromToLabels();
  }

  addEvents(): void {
    this.$from!.addEventListener("input", () => {
      const lowerVal = parseInt(this.$from!.value);
      const upperVal = parseInt(this.$to!.value);

      if (upperVal < lowerVal + this.delta) {
        this.$from!.value = String(upperVal - this.delta);

        if (String(lowerVal) === this.$from!.min) {
          this.$to!.value = String(this.delta);
        }
      }

      this.updateFromToLabels();
      this.emitChange();
    });

    this.$to!.addEventListener("input", () => {
      const lowerVal = parseInt(this.$from!.value);
      const upperVal = parseInt(this.$to!.value);

      if (lowerVal > upperVal - this.delta) {
        this.$to!.value = String(lowerVal + this.delta);

        if (String(upperVal) === this.$to!.max) {
          this.$from!.value = String(parseInt(this.$to!.max) - this.delta);
        }
      }

      this.updateFromToLabels();
      this.emitChange();
    });
  }

  updateFromToLabels(): void {
    this.$fromLabel!.textContent = this.$from!.value;
    this.$toLabel!.textContent = this.$to!.value;
  }

  emitChange(): void {
    const from = parseInt(this.$from!.value);
    const to = parseInt(this.$to!.value);

    this.emit(CatalogRangeFilterEvent.CHANGE, { from, to });
  }
}
