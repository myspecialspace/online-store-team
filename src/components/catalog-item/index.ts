/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Product } from "../../helpers/api/types";
import { Component } from "../../helpers/component";
import { router } from "../../helpers/router";
import { RouterPaths } from "../../helpers/router/constants";
import { CatalogItemAdditionalComponent } from "../catalog-item-additional";
import "./index.scss";
import template from "./template.html";

export class CatalogItemComponent extends Component<Product> {
  $pic: HTMLImageElement | null = null;
  $price: HTMLDivElement | null = null;
  $name: HTMLDivElement | null = null;
  $additional: HTMLDivElement | null = null;
  $addToCartButton: HTMLButtonElement | null = null;
  $detailsButton: HTMLButtonElement | null = null;
  additionalComponent: CatalogItemAdditionalComponent | null = null;

  constructor(state: Product) {
    super({ template, state });
  }

  onMounted() {
    this.$pic = this.query(".pic");
    this.$price = this.query(".price");
    this.$name = this.query(".name");
    this.$additional = this.query(".additional");
    this.$addToCartButton = this.query(".add-to-cart");
    this.$detailsButton = this.query(".details");

    this.addEvents();
    this.onUpdated();
  }

  onUpdated() {
    this.$pic!.src = this.state.images[0];
    this.$price!.textContent = this.state.price + "$";
    this.$name!.textContent = this.state.title;

    this.createAdditional();
  }

  createAdditional() {
    this.additionalComponent = new CatalogItemAdditionalComponent(this.state);
    this.additionalComponent.render(this.$additional!);
  }

  addEvents() {
    this.$addToCartButton?.addEventListener("click", () => {
      // TODO set store
    });

    this.$detailsButton?.addEventListener("click", () => {
      // router.setPage(RouterPaths.PRODUCT_DETAILS);
    });
  }
}
