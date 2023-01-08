export type CartState = CartItem[];

export interface CartItem {
  id: number;
  quantity: number;
}

export type ChangeFn = (cartState: CartState) => any;