import { Component } from "../../helpers/component";
import "./index.scss";
import template from "./template.html";

export type State = {
  header: string;
  content: string;
};

export class InfoRowComponent extends Component<State> {
  $header: HTMLDivElement | null = null;
  $content: HTMLDivElement | null = null;

  constructor(state: State) {
    super({ template, state });
  }

  onMounted() {
    this.$header = this.query(".info-header");
    this.$content = this.query(".info-content");

    this.onUpdated();
  }

  onUpdated() {
    this.$header!.textContent = this.state.header;
    this.$content!.textContent = this.state.content;
  }
}
