import { CartState, ChangeFn } from "./types";

const CART_KEY = 'STORE_CART';

class Cart {
  private changeFns: ChangeFn[] = [];

  public incrementItem(id: number, quantity = 1): void {
    const nextCart = this.getCart();
    const index = nextCart.findIndex((item) => item.id === id);

    if (index === -1) {
      nextCart.push({ id, quantity });
    } else {
      const prevQuantity = nextCart[index].quantity;
      nextCart.splice(index, 1, { id, quantity: prevQuantity + quantity });
    }

    this.setCart(nextCart);
  }

  public decrementItem(id: number, quantity = 1): void {
    const nextCart = this.getCart();
    const index = nextCart.findIndex((item) => item.id === id);
    const item = nextCart[index];

    if (item.quantity === 1) {
      nextCart.splice(index, 1);
    } else {
      nextCart.splice(index, 1, { id, quantity: item.quantity - quantity });
    }

    this.setCart(nextCart);
  }

  public onChange(fn: ChangeFn): void {
    this.changeFns.push(fn);
  }

  public getCart(): CartState {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  }

  private setCart(data: CartState): void {
    localStorage.setItem(CART_KEY, JSON.stringify(data));
    this.callChangeFns();
  }

  private callChangeFns(): void {
    const cartState = this.getCart();

    this.changeFns.forEach((fn) => {
      fn(cartState);
    });
  }
}

export const cart = new Cart();