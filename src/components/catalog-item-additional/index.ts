import { Product } from "../../helpers/api/types";
import { Component } from "../../helpers/component";
import "./index.scss";
import template from "./template.html";
import {
  State as RowState,
  CatalogItemAdditionalRowComponent,
} from "../catalog-item-additional-row";
//верхняя информация на карточке
export class CatalogItemAdditionalComponent extends Component<Product> {
  rowComponents: CatalogItemAdditionalRowComponent[] = [];
  rows: RowState[] = [];

  constructor(state: Product) {
    super({ template, state });
  }

  onMounted() {
    this.onUpdated();
  }

  onUpdated() {
    this.defineRows();
    this.createRows();
  }

  defineRows() {
    this.rows = [
      {
        name: "Category",
        value: this.state.category,
      },
      {
        name: "Brand",
        value: this.state.brand,
      },
      {
        name: "Price",
        value: this.state.price + "$",
      },
      {
        name: "Discount",
        value: this.state.discountPercentage + "%",
      },
      {
        name: "Rating",
        value: this.state.rating,
      },
      {
        name: "Stock",
        value: this.state.stock,
      },
    ];
  }

  createRows() {
    this.rows.forEach((row) => {
      const rowComponent = new CatalogItemAdditionalRowComponent(row);
      rowComponent.render(this.$root!);
      this.rowComponents.push(rowComponent);
    });
  }
}
