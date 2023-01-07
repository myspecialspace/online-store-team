import { Component } from "../../helpers/component";
import "./index.scss";
import template from "./template.html";
import {
  CatalogCheckboxComponent,
  State as Checkbox,
} from "../catalog-checkbox";
import { CatalogCheckboxEvent } from "../catalog-checkbox/types";
import { CatalogCheckboxFilterEvent } from "./types";

export type State = {
  title: string;
  checkboxes: Checkbox[];
};

export class CatalogCheckboxFilterComponent extends Component<State> {
  $title: HTMLSelectElement | null = null;
  $list: HTMLDivElement | null = null;

  checkboxComponents: CatalogCheckboxComponent[] = [];

  selectedSet = new Set<string>();

  constructor(state: State) {
    super({ template, state });
  }

  onMounted() {
    this.$title = this.query(".title");
    this.$list = this.query(".list");

    this.createList();
    this.onUpdated();
  }

  onUpdated() {
    this.$title!.textContent = this.state.title;
    this.checkboxComponents.forEach((checkboxComponent) => {
      const found = this.state.checkboxes.find(
        (checkbox) => checkbox.label === checkboxComponent.state.label
      )!;
      checkboxComponent.state = found;
    });

    this.selectedSet.clear();
    this.state.checkboxes.forEach((checkbox) => {
      if (checkbox.isChecked) {
        this.selectedSet.add(checkbox.label);
      }
    });
  }

  createList() {
    this.state.checkboxes.forEach((checkbox) => {
      const checkboxComponent = new CatalogCheckboxComponent(checkbox);
      checkboxComponent.render(this.$list!);
      checkboxComponent.on(CatalogCheckboxEvent.CHANGE, (data) => {
        const label = data.checkbox.label;

        if (data.isChecked) {
          this.selectedSet.add(label);
        } else {
          this.selectedSet.delete(label);
        }

        const selected = Array.from(this.selectedSet);
        this.emit(CatalogCheckboxFilterEvent.CHANGE, selected);
      });
      this.checkboxComponents.push(checkboxComponent);
    });
  }
}
