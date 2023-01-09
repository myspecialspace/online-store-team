import { cart } from "../../helpers/cart";
import { Component } from "../../helpers/component";
import { CartProduct } from "../../pages/cart/types";
import "./index.scss";
import template from "./template.html";

type State = CartProduct;

export class CartListItemComponent extends Component<State> {
  $index: HTMLDivElement | null = null;
  $image: HTMLImageElement | null = null;
  $title: HTMLDivElement | null = null;
  $description: HTMLDivElement | null = null;
  $rating: HTMLDivElement | null = null;
  $discount: HTMLDivElement | null = null;
  $stock: HTMLDivElement | null = null;
  $increment: HTMLButtonElement | null = null;
  $quantity: HTMLDivElement | null = null;
  $decrement: HTMLButtonElement | null = null;
  $price: HTMLDivElement | null = null;

  constructor(state: State) {
    super({ template, state });
  }

  onMounted() {
    this.$index = this.query(".index");
    this.$image = this.query(".image");
    this.$title = this.query(".title");
    this.$description = this.query(".description");
    this.$rating = this.query(".rating");
    this.$discount = this.query(".discount");
    this.$stock = this.query(".stock");
    this.$increment = this.query(".increment");
    this.$quantity = this.query(".quantity");
    this.$decrement = this.query(".decrement");
    this.$price = this.query(".price");

    this.addEvents();
    this.onUpdated();
  }

  onUpdated() {
    this.$index!.textContent = String(this.state.index);
    this.$image!.src = this.state.product.images[0];
    this.$title!.textContent = this.state.product.title;
    this.$description!.textContent = this.state.product.description;
    this.$rating!.textContent = String(this.state.product.rating);
    this.$discount!.textContent = String(this.state.product.discountPercentage);
    this.$stock!.textContent = "Stock: " + this.state.product.stock;
    this.$quantity!.textContent = String(this.state.quantity);
    this.$price!.textContent = this.state.product.price + "$";

    this.$increment!.disabled =
      this.state.quantity === this.state.product.stock;
  }

  addEvents() {
    this.$increment!.addEventListener("click", () => {
      cart.incrementItem(this.state.id);
    });

    this.$decrement!.addEventListener("click", () => {
      cart.decrementItem(this.state.id);
    });
  }
}
