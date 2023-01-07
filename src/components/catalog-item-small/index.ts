import { Product } from "../../helpers/api/types";
import { Component } from "../../helpers/component";
import "./index.scss";
import template from "./template.html";

export class CatalogItemSmallComponent extends Component<Product> {
  $pic: HTMLImageElement | null = null;
  $price: HTMLDivElement | null = null;
  $name: HTMLDivElement | null = null;
  $addToCartButton: HTMLButtonElement | null = null;
  $detailsButton: HTMLButtonElement | null = null;

  constructor(state: Product) {
    super({ template, state });
  }

  onMounted() {
    this.$pic = this.query(".pic");
    this.$price = this.query(".price");
    this.$name = this.query(".name");
    this.$addToCartButton = this.query(".add-to-cart");
    this.$detailsButton = this.query(".details");

    this.addEvents();
    this.onUpdated();
  }

  onUpdated() {
    this.$pic!.src = this.state.images[0];
    this.$price!.textContent = this.state.price + "$";
    this.$name!.textContent = this.state.title;
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
