import { api } from "../helpers/api";
import { Product } from "../helpers/api/types";
import { cart } from "../helpers/cart";
import { CartState } from "../helpers/cart/types";
import { Component } from "../helpers/component";
import { formatPrice, getTotalPrice } from "../helpers/cart/price";
import { router } from "../helpers/router";
import { RouterPaths } from "../helpers/router/constants";
import { Route } from "../helpers/router/types";
import "./index.scss";
import template from "./template.html";
import { getTotalQuantity } from "../helpers/cart/count";

export class RootComponent extends Component {
  private component: Component | null = null;
  private $router: HTMLElement | null = null;
  private $logo: HTMLAnchorElement | null = null;
  private $cartTotalValue: HTMLDivElement | null = null;
  private $cart: HTMLAnchorElement | null = null;

  private cartState: CartState = [];
  private products: Product[] = [];

  constructor() {
    super({ template });
  }

  updateComponent(page: Route) {
    const prevComponent = this.component;

    this.component = new page.component();
    if (prevComponent) {
      prevComponent.destroy();
    }
    this.component!.render(this.$router!);
  }

  async onMounted() {
    this.$router = this.query("#router");
    this.$logo = this.query(".logo");
    this.$cartTotalValue = this.query(".cart-total .value");
    this.$cart = this.query(".cart");

    this.updateComponent(router.getCurrentRoute()!);

    router.onChange((page) => {
      this.updateComponent(page);
    });

    cart.onChange((cartState) => {
      this.cartState = cartState;
      this.updateCartLink();
      this.updateCartTotal();
    });

    this.addEvents();

    this.cartState = cart.getCart();
    this.updateCartLink();

    this.products = (await api.getProducts()).products;
    this.updateCartTotal();
  }

  addEvents() {
    this.$logo!.addEventListener('click', (event) => {
      event.preventDefault();
      router.setPage(RouterPaths.CATALOG);
    });

    this.$cart!.addEventListener('click', (event) => {
      event.preventDefault();
      router.setPage(RouterPaths.CART);
    });
  }

  updateCartLink(): void {
    const count = getTotalQuantity(this.cartState);

    this.$cart!.textContent = count === 0 ? 'Cart': `Cart (${count})`;
  }

  updateCartTotal(): void {
    this.$cartTotalValue!.textContent = formatPrice(getTotalPrice(this.cartState!, this.products));
  }
}
