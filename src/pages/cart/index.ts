import { CartListComponent } from "../../components/cart-list";
import { CartListEvents } from "../../components/cart-list/types";
import { CartSummaryComponent } from "../../components/cart-summary";
import { api } from "../../helpers/api";
import { parseQuery, queryStringify } from "../../helpers/api/router";
import { Product } from "../../helpers/api/types";
import { cart } from "../../helpers/cart";
import { CartState } from "../../helpers/cart/types";
import { Component } from "../../helpers/component";
import { router } from "../../helpers/router";
import { RouterPaths } from "../../helpers/router/constants";
import { parseOptions, PromoCode } from "./constants";
import "./index.scss";
import template from "./template.html";
import { CartProduct, QueryName, QueryValues } from "./types";
import { State as CartListState } from "../../components/cart-list";
import { getDiscountTotal, getTotalPrice } from "../../helpers/cart/price";
import { getTotalQuantity } from "../../helpers/cart/count";
import { CartSummaryEvents } from "../../components/cart-summary/types";
import { BuyModalComponent } from "../../components/buy-modal";

export class CartPage extends Component {
  cartState: CartState = cart.getCart();
  products: Product[] = [];
  cartProducts: CartProduct[] = [];
  listComponent: CartListComponent | null = null;
  summaryComponent: CartSummaryComponent | null = null;
  buyComponent: BuyModalComponent | null = null;

  $list: HTMLDivElement | null = null;
  $summary: HTMLDivElement | null = null;
  $empty: HTMLDivElement | null = null;

  pagination: CartListState["pagination"] = {
    limit: 1,
    maxLimit: 1,
    page: 1,
    maxPage: 1,
  };

  appliedCodes: PromoCode[] = [];

  totalQuantity = 0;
  totalPrice = 0;
  discountTotal = 0;

  constructor() {
    super({ template });
  }

  async onMounted() {
    this.$list = this.query(".cart-page-list");
    this.$summary = this.query(".cart-page-summary");
    this.$empty = this.query(".cart-empty");

    this.cartState = cart.getCart();
    this.products = (await api.getProducts()).products;
    this.cartProducts = this.getCartProductsPagination();

    this.updateSummaryValues();
    this.updatePaginationFromUrl();
    this.listOrEmpty();
    this.updatePaginationList();

    cart.onChange((cartState) => {
      this.cartState = cartState;
      this.updateSummaryValues();
      this.updatePaginationList();
      this.listOrEmpty();

      if (this.listComponent) {
        this.listComponent.state = {
          cartProducts: this.getCartProductsPagination(),
        };
      }

      if (this.summaryComponent) {
        this.summaryComponent!.state = {
          total: this.totalPrice,
          quantity: this.totalQuantity,
          discountTotal: this.discountTotal,
        };
      }
    });
  }

  getCartProductsPagination(): CartProduct[] {
    const { page, limit } = this.pagination;

    const start = page * limit - limit;
    const end = limit + start;

    const sliced = this.cartState.slice(start, end);

    return sliced.map((item, index) => {
      return {
        ...item,
        index: start + index + 1,
        product: this.products.find((product) => product.id === item.id)!,
      };
    });
  }

  createList(): void {
    if (!this.listComponent) {
      this.listComponent = new CartListComponent({
        cartProducts: this.cartProducts,
        pagination: this.pagination,
      });

      this.listComponent
        .on(CartListEvents.LIMIT, ({ limit }) => {
          this.pagination.limit = limit;
          this.updatePaginationList();
          this.setPaginationInUrl();
        })
        .on(CartListEvents.PAGE, ({ page }) => {
          this.pagination.page = page;
          this.updatePaginationList();
          this.setPaginationInUrl();
        });

      this.listComponent.render(this.$list!);
    }
  }

  destroyList(): void {
    this.listComponent?.destroy();
  }

  createSummary(): void {
    if (!this.summaryComponent) {
      this.summaryComponent = new CartSummaryComponent({
        quantity: this.totalQuantity,
        total: this.totalPrice,
        discountTotal: this.totalPrice,
        codes: Object.values(PromoCode),
        appliedCodes: this.appliedCodes,
      });
      this.summaryComponent.render(this.$summary!);
      this.summaryComponent
        .on(CartSummaryEvents.CHANGE_PROMO_CODE, (data) => {
          this.appliedCodes = data.isApplied
            ? this.appliedCodes.filter((code) => code !== data.code)
            : this.appliedCodes.concat(data.code);

          this.summaryComponent!.state = {
            appliedCodes: this.appliedCodes,
            discountTotal: getDiscountTotal(this.totalPrice, this.appliedCodes),
          };
        })
        .on(CartSummaryEvents.BUY, () => {
          this.buyComponent = new BuyModalComponent({});
          this.buyComponent.render(document.body);
          // this.buyComponent.on(...)
          // handle close modal and destroy
        });
    }
  }

  destroySummary(): void {
    this.summaryComponent?.destroy();
  }

  listOrEmpty(): void {
    const isEmpty = this.cartState.length === 0;

    if (isEmpty) {
      this.$empty!.classList.add("visible");
      this.destroyList();
      this.destroySummary();
    } else {
      this.$empty!.classList.remove("visible");
      this.createList();
      this.createSummary();
    }
  }

  updatePaginationFromUrl(): void {
    const queryData = parseQuery(parseOptions) as QueryValues;

    this.pagination = {
      ...this.pagination,
      limit: queryData[QueryName.LIMIT] ?? this.cartState.length,
      page: queryData[QueryName.PAGE] ?? 1,
    };
  }

  setPaginationInUrl(): void {
    const data = {
      [QueryName.PAGE]: this.pagination.page,
      [QueryName.LIMIT]: this.pagination.limit,
    };

    const qs = "?" + queryStringify(data);
    const url = "/" + RouterPaths.CART + qs;
    router.setPage(url);
  }

  updatePaginationList(): void {
    if (!this.listComponent) {
      return;
    }

    const productsLength = this.cartState.length;
    const maxPage = Math.ceil(productsLength / this.pagination.limit);

    if (this.pagination.page > maxPage) {
      this.pagination.page = maxPage;
    }

    this.listComponent!.state = {
      cartProducts: this.getCartProductsPagination(),
      pagination: {
        ...this.pagination,
        maxLimit: productsLength,
        maxPage,
      },
    };
  }

  updateSummaryValues() {
    this.totalPrice = getTotalPrice(this.cartState, this.products);
    this.totalQuantity = getTotalQuantity(this.cartState);
    this.discountTotal = getDiscountTotal(this.totalPrice, this.appliedCodes);
  }
}
