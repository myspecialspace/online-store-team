import { Component } from "../../helpers/component";
import { CartProduct } from "../../pages/cart/types";
import { CartListItemComponent } from "../cart-list-item";
import "./index.scss";
import template from "./template.html";
import { CartListEventName, CartListEvents } from "./types";

export interface State {
  cartProducts: CartProduct[];
  pagination: {
    limit: number;
    maxLimit: number;
    page: number;
    maxPage: number;
  };
}

export class CartListComponent extends Component<State, CartListEvents> {
  $list: HTMLDivElement | null = null;
  $limit: HTMLInputElement | null = null;
  $page: HTMLDivElement | null = null;
  $prev: HTMLButtonElement | null = null;
  $next: HTMLButtonElement | null = null;

  itemComponents: CartListItemComponent[] = [];

  constructor(state: State) {
    super({ template, state });
  }

  onMounted() {
    this.$list = this.query(".list");
    this.$limit = this.query(".limit .value");
    this.$page = this.query(".page .value");
    this.$prev = this.query(".prev");
    this.$next = this.query(".next");

    this.onUpdated();
    this.addEvents();
  }

  onUpdated(): void {
    if (this.state.cartProducts.length === this.itemComponents.length) {
      this.itemComponents.forEach((component, index) => {
        component.state = this.state.cartProducts[index];
      });
    } else {
      this.destroyItems();
      this.createItems();
    }

    this.$limit!.value = String(this.state.pagination.limit);
    this.$limit!.min = String(1);
    this.$limit!.max = String(this.state.pagination.maxLimit);

    this.$page!.textContent = String(this.state.pagination.page);

    this.$prev!.disabled = this.state.pagination.page === 1;
    this.$next!.disabled =
      this.state.pagination.page === this.state.pagination.maxPage;
  }

  createItems(): void {
    this.state.cartProducts.forEach((cartProduct) => {
      const component = new CartListItemComponent(cartProduct);
      component.render(this.$list!);
      this.itemComponents.push(component);
    });
  }

  destroyItems(): void {
    let component;

    while ((component = this.itemComponents.pop())) {
      component.destroy();
    }
  }

  addEvents(): void {
    this.$limit!.addEventListener("change", () => {
      const limit = parseInt(this.$limit!.value);
      this.emit(CartListEventName.LIMIT, { limit });
    });

    this.$prev!.addEventListener("click", () => {
      const page = this.state.pagination.page - 1;
      this.emit(CartListEventName.PAGE, { page });
    });

    this.$next!.addEventListener("click", () => {
      const page = this.state.pagination.page + 1;
      this.emit(CartListEventName.PAGE, { page });
    });
  }
}
