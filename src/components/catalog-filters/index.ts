import { Component } from "../../helpers/component";
import "./index.scss";
import template from "./template.html";
import {
  State as CheckboxFilterState,
  CatalogCheckboxFilterComponent,
} from "../catalog-checkbox-filter";
import { CatalogCheckboxFilterEventName } from "../catalog-checkbox-filter/types";
import { CatalogFiltersEventName, CatalogFiltersEvents } from "./types";
import { CatalogRangeFilterComponent } from "../catalog-range-filter";
import { CatalogRangeFilterEventName } from "../catalog-range-filter/types";
import { State as CatalogRangeFilterState } from "../catalog-range-filter";

type State = {
  category: CheckboxFilterState;
  brand: CheckboxFilterState;
  price: CatalogRangeFilterState;
  stock: CatalogRangeFilterState;
};

export class CatalogFiltersComponent extends Component<
  State,
  CatalogFiltersEvents
> {
  $category: HTMLSelectElement | null = null;
  $brand: HTMLDivElement | null = null;
  $price: HTMLDivElement | null = null;
  $stock: HTMLDivElement | null = null;
  $reset: HTMLButtonElement | null = null;
  $copy: HTMLButtonElement | null = null;

  categoryComponent: CatalogCheckboxFilterComponent | null = null;
  brandComponent: CatalogCheckboxFilterComponent | null = null;
  priceComponent: CatalogRangeFilterComponent | null = null;
  stockComponent: CatalogRangeFilterComponent | null = null;

  selectedBrands: string[] = [];
  selectedCategories: string[] = [];
  price: CatalogRangeFilterState | null = null;
  stock: CatalogRangeFilterState | null = null;

  timeoutId = 0;

  constructor(state: State) {
    super({ template, state });
  }

  onMounted() {
    this.$category = this.query(".category");
    this.$brand = this.query(".brand");
    this.$price = this.query(".price");
    this.$stock = this.query(".stock");
    this.$reset = this.query(".reset");
    this.$copy = this.query(".copy");

    this.createCategoryFilter();
    this.createBrandFilter();
    this.createPriceFilter();
    this.createStockFilter();
    this.onUpdated();
    this.addEvents();
  }

  onUpdated() {
    this.categoryComponent!.state = this.state.category;
    this.brandComponent!.state = this.state.brand;
    this.priceComponent!.state = this.state.price;
    this.stockComponent!.state = this.state.stock;

    this.price = this.state.price;
    this.stock = this.state.stock;
  }

  createCategoryFilter() {
    this.categoryComponent = new CatalogCheckboxFilterComponent(
      this.state.category
    );
    this.categoryComponent.render(this.$category!);
    this.categoryComponent.on(
      CatalogCheckboxFilterEventName.CHANGE,
      (selected) => {
        this.selectedCategories = selected;
        this.emitChange();
      }
    );
  }

  createBrandFilter() {
    this.brandComponent = new CatalogCheckboxFilterComponent(this.state.brand);
    this.brandComponent.render(this.$brand!);
    this.brandComponent.on(
      CatalogCheckboxFilterEventName.CHANGE,
      (selected) => {
        this.selectedBrands = selected;
        this.emitChange();
      }
    );
  }

  createPriceFilter() {
    this.priceComponent = new CatalogRangeFilterComponent(this.state.price);
    this.priceComponent.render(this.$price!);
    this.priceComponent.on(CatalogRangeFilterEventName.CHANGE, (data) => {
      this.price = data;
      this.emitChange();
    });
  }

  createStockFilter() {
    this.stockComponent = new CatalogRangeFilterComponent(this.state.stock);
    this.stockComponent.render(this.$stock!);
    this.stockComponent.on(CatalogRangeFilterEventName.CHANGE, (data) => {
      this.stock = data;
      this.emitChange();
    });
  }

  emitChange() {
    this.emit(CatalogFiltersEventName.CHANGE, {
      brands: this.selectedBrands,
      categories: this.selectedCategories,
      price: this.price!,
      stock: this.stock!,
    });
  }

  addEvents(): void {
    this.$reset!.addEventListener("click", () => {
      this.selectedBrands = [];
      this.selectedCategories = [];
      this.price = null;
      this.stock = null;

      this.emit(CatalogFiltersEventName.RESET);
    });

    this.$copy!.addEventListener("click", () => {
      this.emit(CatalogFiltersEventName.COPY);

      this.$copy!.textContent = "COPIED!";

      clearTimeout(this.timeoutId);

      this.timeoutId = setTimeout(() => {
        this.$copy!.textContent = "COPY";
      }, 2000);
    });
  }
}
