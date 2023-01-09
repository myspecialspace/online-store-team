import { Product } from "../../helpers/api/types";
import { CartItem } from "../../helpers/cart/types";

export interface CartProduct extends CartItem {
  product: Product;
  index: number;
}

export enum QueryName {
  PAGE = "page",
  LIMIT = "limit",
}

export interface QueryValues {
  [QueryName.PAGE]: number;
  [QueryName.LIMIT]: number;
}
