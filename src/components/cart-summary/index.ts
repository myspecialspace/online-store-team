import { Component } from "../../helpers/component";
import "./index.scss";
import template from "./template.html";

interface State {}

export class CartSummaryComponent extends Component<State> {
  $pic: HTMLImageElement | null = null;

  constructor(state: State) {
    super({ template, state });
  }

  onMounted() {
    this.$pic = this.query(".pic");

    this.addEvents();
    this.onUpdated();
  }

  onUpdated() {}

  createAdditional() {}

  addEvents() {}
}
