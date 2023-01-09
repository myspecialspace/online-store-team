import { State as AppliedCodeState } from "../applied-code";

export enum CartSummaryEventName {
  CHANGE_PROMO_CODE = "change_promo_code",
  BUY = "buy",
}

export type CartSummaryChangePromoCodeEvent = {
  eventName: CartSummaryEventName.CHANGE_PROMO_CODE;
  data: AppliedCodeState;
};

export type CartSummaryBuyEvent = {
  eventName: CartSummaryEventName.BUY;
};

export type CartSummaryEvents =
  | CartSummaryChangePromoCodeEvent
  | CartSummaryBuyEvent;
