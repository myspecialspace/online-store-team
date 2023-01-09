import { Component } from "../../helpers/component";
import "./index.scss";
import template from "./template.html";
import { CatalogCheckboxEvents, CatalogCheckboxEventName } from "./types";

export type State = {
  label: string;
  visible: number;
  total: number;
  isChecked: boolean;
};

export class CatalogCheckboxComponent extends Component<
  State,
  CatalogCheckboxEvents
> {
  $label: HTMLDivElement | null = null;
  $count: HTMLDivElement | null = null;
  $control: HTMLInputElement | null = null;

  constructor(state: State) {
    super({ template, state });
  }

  onMounted() {
    this.$label = this.query(".label");
    this.$count = this.query(".count");
    this.$control = this.query(".control");

    this.onUpdated();
    this.addEvents();
  }

  onUpdated() {
    this.$label!.textContent = this.state.label;
    this.$count!.textContent = `(${this.state.visible}/${this.state.total})`;

    this.$root!.classList.toggle("not_found", this.state.visible === 0);
    this.$control!.checked = this.state.isChecked;
  }

  addEvents() {
    this.$control!.addEventListener("change", () => {
      this.emit(CatalogCheckboxEventName.CHANGE, {
        checkbox: this.state,
        isChecked: this.$control!.checked,
      });
    });
  }
}
