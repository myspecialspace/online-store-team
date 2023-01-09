import { State } from "./index";

export enum AppliedCodeEventName {
  CHANGE_CODE = "change_code",
}

export type AppliedCodeChangeCode = {
  eventName: AppliedCodeEventName.CHANGE_CODE;
  data: State;
};

export type AppliedCodeEvents = AppliedCodeChangeCode;
