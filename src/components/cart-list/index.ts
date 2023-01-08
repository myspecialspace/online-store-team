import { Component } from "../../helpers/component";
import { CartProduct } from "../../pages/cart/types";
import { CartListItemComponent } from "../cart-list-item";
import "./index.scss";
import template from "./template.html";

interface State {
  cartProducts: CartProduct[];
}

export class CartListComponent extends Component<State> {
  $list: HTMLDivElement | null = null;

  itemComponents: CartListItemComponent[] = [];

  constructor(state: State) {
    super({ template, state });
  }

  onMounted() {
    this.$list = this.query(".list");

    this.onUpdated();
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
}
