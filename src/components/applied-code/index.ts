import { Component } from "../../helpers/component";
import { PromoCode, promoCodeInfo } from "../../pages/cart/constants";
import "./index.scss";
import template from "./template.html";
import { AppliedCodeEvents } from "./types";

type State = {
  code: PromoCode;
  isApplied: boolean;
  hideButton?: boolean;
};

export class AppliedCodeComponent extends Component<State> {
  $desc: HTMLDivElement | null = null;
  $discount: HTMLDivElement | null = null;
  $button: HTMLButtonElement | null = null;

  constructor(state: State) {
    super({ template, state });
  }

  onMounted() {
    this.$desc = this.query(".desc");
    this.$discount = this.query(".discount");
    this.$button = this.query(".drop");

    this.addEvents();
    this.onUpdated();
  }

  onUpdated() {
    const info = promoCodeInfo[this.state.code];
    this.$desc!.textContent = info.description;
    this.$discount!.textContent = Math.floor(info.discount * 100) + "%";

    this.$button!.textContent = this.state.isApplied ? "DROP" : "ADD";
    this.$button!.classList.toggle("visible", !this.state.hideButton);
  }

  addEvents() {
    this.$button!.addEventListener("click", () => {
      this.emit(AppliedCodeEvents.CHANGE_CODE, this.state);
    });
  }
}
