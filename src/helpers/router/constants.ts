export enum RouterPaths {
  CATALOG = "catalog",
  DETAILS = "details/:id",
  CART = "cart",
  NOT_FOUND = "*",
}

export const detailsRoutePath = (id: number) => `details/${id}`;
