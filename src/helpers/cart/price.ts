import { PromoCode, promoCodeInfo } from "../../pages/cart/constants";
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
  return value.toFixed(2) + "$";
};

export const getDiscountTotal = (
  totalPrice: number,
  appliedCodes: PromoCode[]
): number => {
  const discountPercent = appliedCodes.reduce((acc, code) => {
    const codeDiscount = promoCodeInfo[code].discount;
    acc += codeDiscount;
    return acc;
  }, 0);

  const discountValue = totalPrice * discountPercent;
  const result = totalPrice - discountValue;
  return result;
};
