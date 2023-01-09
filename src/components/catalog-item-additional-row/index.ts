import { Component } from "../../helpers/component";
import "./index.scss";
import template from "./template.html";

export type State = {
  name: string;
  value: string | number;
};

export class CatalogItemAdditionalRowComponent extends Component<State> {
  $name: HTMLDivElement | null = null;
  $value: HTMLDivElement | null = null;

  constructor(state: State) {
    super({ template, state });
  }

  onMounted() {
    this.$name = this.query(".name");
    this.$value = this.query(".value");

    this.onUpdated();
  }

  onUpdated() {
    this.$name!.textContent = this.state.name + ":";
    this.$value!.textContent = String(this.state.value);
  }
}
