import { formatPrice } from "../../helpers/cart/price";
import { Component } from "../../helpers/component";
import { PromoCode } from "../../pages/cart/constants";
import { AppliedCodeComponent } from "../applied-code";
import { AppliedCodeEvents } from "../applied-code/types";
import "./index.scss";
import template from "./template.html";
import { CartSummaryEvents } from "./types";

interface State {
  quantity: number;
  total: number;
  discountTotal: number;
  codes: PromoCode[];
  appliedCodes: PromoCode[];
}

export class CartSummaryComponent extends Component<State> {
  $quantity: HTMLImageElement | null = null;
  $total: HTMLImageElement | null = null;
  $discountTotal: HTMLImageElement | null = null;
  $appliedCodesList: HTMLImageElement | null = null;
  $promoInput: HTMLInputElement | null = null;
  $promoFoundCode: HTMLDivElement | null = null;
  $promoInputHint: HTMLDivElement | null = null;
  $buy: HTMLButtonElement | null = null;

  appliedCodesComponents: AppliedCodeComponent[] = [];
  foundCodeComponent: AppliedCodeComponent | null = null;

  constructor(state: State) {
    super({ template, state });
  }

  onMounted() {
    this.$quantity = this.query(".quantity");
    this.$total = this.query(".total");
    this.$discountTotal = this.query(".discount-total");
    this.$appliedCodesList = this.query(".applied-codes-list");
    this.$promoInput = this.query(".promo-input");
    this.$promoFoundCode = this.query(".promo-found-code");
    this.$promoInputHint = this.query(".promo-input-hint");
    this.$buy = this.query(".buy");

    this.createAppliedCodes();
    this.addEvents();
    this.onUpdated();
  }

  onUpdated() {
    this.$quantity!.textContent = `Products: ${this.state.quantity}`;
    this.$total!.textContent = `Total: ${formatPrice(this.state.total)}`;

    if (this.state.appliedCodes.length > 0) {
      this.$total!.classList.add("has-discount");
      this.$discountTotal!.textContent = `Total: ${formatPrice(
        this.state.discountTotal
      )}`;
    } else {
      this.$total!.classList.remove("has-discount");
      this.$discountTotal!.textContent = ``;
    }

    if (this.state.appliedCodes.length !== this.appliedCodesComponents.length) {
      this.destroyAppliedCodes();
      this.createAppliedCodes();
    } else {
      this.appliedCodesComponents.forEach((component, index) => {
        component.state = {
          code: this.state.appliedCodes[index],
        };
      });
    }

    this.$promoInputHint!.textContent =
      `Promo for test: ` + this.state.codes.join(", ");
  }

  createAppliedCodes() {
    this.state.appliedCodes.forEach((appliedCode) => {
      const component = new AppliedCodeComponent({
        code: appliedCode,
        isApplied: true,
      });
      component.render(this.$appliedCodesList!);
      component.on(AppliedCodeEvents.CHANGE_CODE, (data) => {
        this.emit(CartSummaryEvents.CHANGE_PROMO_CODE, data);
      });
      this.appliedCodesComponents.push(component);
    });
  }

  destroyAppliedCodes(): void {
    let component;

    while ((component = this.appliedCodesComponents.pop())) {
      component.destroy();
    }
  }

  addEvents() {
    this.$promoInput!.addEventListener("input", () => {
      const value = this.$promoInput!.value.toUpperCase();
      const promoCode = this.state.codes.find((code) => code === value);

      if (promoCode) {
        const isApplied = this.state.appliedCodes.includes(promoCode);

        this.foundCodeComponent = new AppliedCodeComponent({
          code: promoCode,
          isApplied,
          hideButton: isApplied,
        });
        this.foundCodeComponent.render(this.$promoFoundCode!);
        this.foundCodeComponent.on(AppliedCodeEvents.CHANGE_CODE, (data) => {
          this.emit(CartSummaryEvents.CHANGE_PROMO_CODE, data);
          this.$promoInput!.value = "";
          this.destroyFoundComponent();
        });
      } else {
        this.destroyFoundComponent();
      }
    });

    this.$buy!.addEventListener("click", () => {
      this.emit(CartSummaryEvents.BUY);
    });
  }

  destroyFoundComponent(): void {
    if (this.foundCodeComponent) {
      this.foundCodeComponent.destroy();
      this.foundCodeComponent = null;
    }
  }
}
