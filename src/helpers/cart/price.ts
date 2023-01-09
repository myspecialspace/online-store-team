import { Product } from "../api/types";
import { CartState } from "./types";

export const getTotalPrice = (
  cartState: CartState,
  products: Product[]
): number => {
  return cartState.reduce((acc, item) => {
    const product = products.find((product) => product.id === item.id)!;
    const sum = product.price * item.quantity;

    acc += sum;

    return acc;
  }, 0);
};

export const formatPrice = (value: number): string => {
  return value + "$";
};
