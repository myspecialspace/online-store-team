import { Component } from "../../helpers/component";
import "./index.scss";
import template from "./template.html";

type State = string[];

export class BreadcrumbsComponent extends Component<State> {
  $desc: HTMLDivElement | null = null;

  constructor(state: State) {
    super({ template, state });
  }

  onMounted() {
    this.onUpdated();
  }

  onUpdated() {
    this.$root!.textContent = this.state.join("   >>   ");
  }
}
