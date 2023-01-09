import { CartState } from "./types";

export const getProductInCart = (
  stateCart: CartState,
  productId: number
): boolean => {
  return stateCart.some((item) => item.id === productId);
};
