import { Component } from "../../helpers/component";
import "./index.scss";
import template from "./template.html";
import bigIcon from "../../assets/grid-big.png";
import smallIcon from "../../assets/grid-small.png";
import { CatalogPanelEvents, ViewType } from "./types";

type State = {
  limit: number;
  view: ViewType;
};

export class CatalogPanelComponent extends Component<State> {
  $select: HTMLSelectElement | null = null;
  $total: HTMLDivElement | null = null;
  $search: HTMLInputElement | null = null;
  $buttonSmall: HTMLInputElement | null = null;
  $buttonBig: HTMLInputElement | null = null;
  onButtonClick = (event: MouseEvent) => {
    const currentTarget = event.currentTarget as HTMLButtonElement;
    const type = currentTarget.dataset.type;
    this.emit(CatalogPanelEvents.VIEW, type);
  };

  constructor(state: State) {
    super({ template, state });
  }

  onMounted() {
    this.$select = this.query(".sort");
    this.$total = this.query(".total");
    this.$search = this.query(".search");

    this.$buttonBig = this.query(".button.big");
    this.$buttonSmall = this.query(".button.small");

    this.$buttonBig!.querySelector("img")!.src = bigIcon;
    this.$buttonSmall!.querySelector("img")!.src = smallIcon;

    this.onUpdated();
    this.addEvents();
  }

  onUpdated() {
    this.$total!.textContent = "Found: " + this.state.limit;

    [this.$buttonBig, this.$buttonSmall].forEach((button) => {
      const type = button!.dataset.type;
      button?.classList.toggle("active", type === this.state.view);
    });
  }

  addEvents() {
    this.$select!.addEventListener("change", () => {
      this.emit(CatalogPanelEvents.SORT, this.$select!.value);
    });

    this.$search!.addEventListener("input", () => {
      this.emit(CatalogPanelEvents.SEARCH, this.$search!.value);
    });

    this.$buttonBig!.addEventListener("click", this.onButtonClick);
    this.$buttonSmall!.addEventListener("click", this.onButtonClick);
  }
}
