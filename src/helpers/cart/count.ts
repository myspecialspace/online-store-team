import { CartState } from "./types";

export const getTotalQuantity = (cartState: CartState): number => {
  return cartState.reduce((acc, item) => {
    return acc + item.quantity;
  }, 0);
}