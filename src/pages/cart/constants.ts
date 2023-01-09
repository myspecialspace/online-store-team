import { ParseOptions, ParseType } from "../../helpers/api/router";
import { QueryName } from "./types";

export const parseOptions: ParseOptions = {
  fields: {
    [QueryName.LIMIT]: ParseType.NUMBER,
    [QueryName.PAGE]: ParseType.NUMBER,
  },
};

export enum PromoCode {
  RS = "RS",
  EPM = "EPM",
  SCHOOL = "SCHOOL",
}

export const promoCodeInfo: Record<
  PromoCode,
  { discount: number; description: string }
> = {
  [PromoCode.RS]: {
    discount: 0.1,
    description: "Rolling Scopes School",
  },
  [PromoCode.EPM]: {
    discount: 0.1,
    description: "EPAM Systems",
  },
  [PromoCode.SCHOOL]: {
    discount: 0.55,
    description: "SUPER DISCOUNT",
  },
};
