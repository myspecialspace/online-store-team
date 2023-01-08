import { CartListComponent } from "../../components/cart-list";
import { CartSummaryComponent } from "../../components/cart-summary";
import { api } from "../../helpers/api";
import { Product } from "../../helpers/api/types";
import { cart } from "../../helpers/cart";
import { CartState } from "../../helpers/cart/types";
import { Component } from "../../helpers/component";
import "./index.scss";
import template from "./template.html";
import { CartProduct } from "./types";

export class CartPage extends Component {
  cartState: CartState | null = null;
  products: Product[] = [];
  cartProducts: CartProduct[] = [];
  listComponent: CartListComponent | null = null;
  summaryComponent: CartSummaryComponent | null = null;

  $list: HTMLDivElement | null = null;
  $summary: HTMLDivElement | null = null;
  $empty: HTMLDivElement | null = null;

  constructor() {
    super({ template });
  }

  async onMounted() {
    this.$list = this.query('.cart-page-list');
    this.$summary = this.query('.cart-page-summary');
    this.$empty = this.query('.cart-empty');

    this.cartState = cart.getCart();
    this.products = (await api.getProducts()).products;
    this.cartProducts = this.getCartProducts();

    this.listOrEmpty();
    
    cart.onChange((cartState) => {
      console.log('cart.onChange', cartState);
      this.cartState = cartState;
      this.cartProducts = this.getCartProducts();
      this.listOrEmpty();

      if (this.listComponent) {
        this.listComponent.state = {
          cartProducts: this.cartProducts,
        };
      }
    });
  }

  getCartProducts(): CartProduct[] {
    return this.cartState!.map((item, index) => {
      return {
        ...item,
        index: index + 1,
        product: this.products.find((product) => product.id === item.id)!,
      };
    });
  }

  createList(): void {
    if (!this.listComponent) {
      this.listComponent = new CartListComponent({ cartProducts: this.cartProducts }); // TODO
      this.listComponent.render(this.$list!);
    }
  }

  destroyList(): void {
    this.listComponent?.destroy();
  }

  createSummary(): void {
    if (!this.summaryComponent) {
      this.summaryComponent = new CartSummaryComponent({}); // TODO
      this.summaryComponent.render(this.$summary!);
    }
  }

  destroySummary(): void {
    this.summaryComponent?.destroy();
  }

  listOrEmpty(): void {
    const isEmpty = this.cartProducts.length === 0;

    if (isEmpty) {
      this.$empty!.classList.add('visible');
      this.destroyList();
      this.destroySummary();
    } else {
      this.$empty!.classList.remove('visible');
      this.createList();
      this.createSummary();
    }
  }
}
