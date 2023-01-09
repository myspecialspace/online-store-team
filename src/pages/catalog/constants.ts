import { ParseOptions, ParseType } from "../../helpers/api/router";
import { QueryName } from "./types";

export enum FilterField {
  CATEGORY = "category",
  BRAND = "brand",
}

export const parseOptions: ParseOptions = {
  fields: {
    [QueryName.BRANDS]: ParseType.ARRAY,
    [QueryName.CATEGORIES]: ParseType.ARRAY,
    [QueryName.PRICE_FROM]: ParseType.NUMBER,
    [QueryName.PRICE_TO]: ParseType.NUMBER,
    [QueryName.STOCK_FROM]: ParseType.NUMBER,
    [QueryName.STOCK_TO]: ParseType.NUMBER,
    [QueryName.SORT_TYPE]: ParseType.STRING,
    [QueryName.SORT_FIELD]: ParseType.STRING,
    [QueryName.SEARCH]: ParseType.STRING,
    [QueryName.VIEW]: ParseType.STRING,
  },
};
