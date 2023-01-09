import { Product } from "../../helpers/api/types";
import { Component } from "../../helpers/component";
import { router } from "../../helpers/router";
import { detailsRoutePath } from "../../helpers/router/constants";
import { CatalogItemAdditionalComponent } from "../catalog-item-additional";
import { ViewType } from "../catalog-panel/types";
import "./index.scss";
import template from "./template.html";
import { CatalogItemEventName, CatalogItemEvents } from "./types";

export type State = {
  product: Product;
  inCart: boolean;
  viewType: ViewType;
};

export class CatalogItemComponent extends Component<State, CatalogItemEvents> {
  $pic: HTMLImageElement | null = null;
  $price: HTMLDivElement | null = null;
  $name: HTMLDivElement | null = null;
  $additional: HTMLDivElement | null = null;
  $addToCartButton: HTMLButtonElement | null = null;
  $detailsButton: HTMLButtonElement | null = null;
  additionalComponent: CatalogItemAdditionalComponent | null = null;

  constructor(state: State) {
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
    this.$pic!.src = this.state.product.images[0];
    this.$price!.textContent = this.state.product.price + "$";
    this.$name!.textContent = this.state.product.title;
    this.$name!.title = this.state.product.title;

    if (this.state.viewType === ViewType.BIG) {
      this.$addToCartButton!.textContent = this.state.inCart
        ? "DROP FROM CART"
        : "ADD TO CART";
      this.createAdditional();
    } else {
      this.$addToCartButton!.textContent = this.state.inCart
        ? "DROP"
        : "ADD TO";
      this.destroyAdditional();
    }
  }

  createAdditional() {
    if (this.additionalComponent) {
      return;
    }

    this.additionalComponent = new CatalogItemAdditionalComponent(
      this.state.product
    );
    this.additionalComponent.render(this.$additional!);
  }

  destroyAdditional() {
    if (this.additionalComponent) {
      this.additionalComponent.destroy();
      this.additionalComponent = null;
    }
  }

  addEvents() {
    this.$addToCartButton?.addEventListener("click", () => {
      this.emit(CatalogItemEventName.ADD, this.state);
    });

    this.$detailsButton?.addEventListener("click", () => {
      router.setPage(detailsRoutePath(this.state.product.id));
    });
  }
}
