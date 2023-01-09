import { Component } from "../../helpers/component";
import "./index.scss";
import template from "./template.html";
import bigIcon from "../../assets/grid-big.png";
import smallIcon from "../../assets/grid-small.png";
import { CatalogPanelEventName, CatalogPanelEvents, ViewType } from "./types";
import { SortField, SortType } from "../../pages/catalog/types";

type State = {
  total: number;
  limit: number;
  view: ViewType;
  search: string;
  sortType: SortType;
  sortField: SortField;
};

export class CatalogPanelComponent extends Component<
  State,
  CatalogPanelEvents
> {
  $sort: HTMLSelectElement | null = null;
  $total: HTMLDivElement | null = null;
  $search: HTMLInputElement | null = null;
  $buttonSmall: HTMLInputElement | null = null;
  $buttonBig: HTMLInputElement | null = null;
  onButtonClick = (event: MouseEvent) => {
    const currentTarget = event.currentTarget as HTMLButtonElement;
    const type = currentTarget.dataset.type as ViewType;
    this.emit(CatalogPanelEventName.VIEW, type);
  };

  constructor(state: State) {
    super({ template, state });
  }

  onMounted() {
    this.$sort = this.query(".sort");
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
    this.$total!.textContent =
      "Found " + this.state.limit + " of " + this.state.total;

    [this.$buttonBig, this.$buttonSmall].forEach((button) => {
      const type = button!.dataset.type;
      button?.classList.toggle("active", type === this.state.view);
    });

    this.$search!.value = this.state.search;
    this.$sort!.value = `${this.state.sortField}-${this.state.sortType}`;
  }

  addEvents() {
    this.$sort!.addEventListener("change", () => {
      this.emit(CatalogPanelEventName.SORT, this.$sort!.value);
    });

    this.$search!.addEventListener("input", () => {
      this.emit(CatalogPanelEventName.SEARCH, this.$search!.value);
    });

    this.$buttonBig!.addEventListener("click", this.onButtonClick);
    this.$buttonSmall!.addEventListener("click", this.onButtonClick);
  }
}
