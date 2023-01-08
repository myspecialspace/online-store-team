import { ViewType } from "../../components/catalog-panel/types";

export enum QueryName {
  CATEGORIES = "categories",
  BRANDS = "brands",
  PRICE_FROM = "price_form",
  PRICE_TO = "price_to",
  STOCK_FROM = "stock_from",
  STOCK_TO = "stock_to",
  SORT_TYPE = "sort_type",
  SORT_FIELD = "sort_field",
  SEARCH = "search",
  VIEW = "view",
}

export enum SortType {
  ASC = "ASC",
  DESC = "DESC",
}

export enum SortField {
  PRICE = "price",
  RATING = "rating",
  DISCOUNT_PERCENTAGE = "discountPercentage",
}
export interface QueryValues {
  [QueryName.CATEGORIES]: string[];
  [QueryName.BRANDS]: string[];
  [QueryName.PRICE_FROM]: number;
  [QueryName.PRICE_TO]: number;
  [QueryName.STOCK_FROM]: number;
  [QueryName.STOCK_TO]: number;
  [QueryName.SORT_TYPE]: SortType;
  [QueryName.SORT_FIELD]: SortField;
  [QueryName.SEARCH]: string;
  [QueryName.VIEW]: ViewType;
}
