import { Component } from "../../helpers/component";
import "./index.scss";
import template from "./template.html";
import {
  State as CheckboxFilterState,
  CatalogCheckboxFilterComponent,
} from "../catalog-checkbox-filter";
import { CatalogCheckboxFilterEvent } from "../catalog-checkbox-filter/types";
import { CatalogFiltersEvent } from "./types";
import { CatalogRangeFilterComponent } from "../catalog-range-filter";
import {
  CatalogRangeFilterEvent,
  RangeValue,
} from "../catalog-range-filter/types";

type State = {
  category: CheckboxFilterState;
  brand: CheckboxFilterState;
};

export class CatalogFiltersComponent extends Component<State> {
  $category: HTMLSelectElement | null = null;
  $brand: HTMLDivElement | null = null;
  $price: HTMLDivElement | null = null;
  $stock: HTMLDivElement | null = null;
  $reset: HTMLButtonElement | null = null;

  categoryComponent: CatalogCheckboxFilterComponent | null = null;
  brandComponent: CatalogCheckboxFilterComponent | null = null;
  priceComponent: CatalogRangeFilterComponent | null = null;
  stockComponent: CatalogRangeFilterComponent | null = null;

  selectedBrands: string[] = [];
  selectedCategories: string[] = [];
  price: RangeValue = { from: 10, to: 1749 }; // TODO
  stock: RangeValue = { from: 2, to: 150 }; // TODO

  constructor(state: State) {
    super({ template, state });
  }

  onMounted() {
    this.$category = this.query(".category");
    this.$brand = this.query(".brand");
    this.$price = this.query(".price");
    this.$stock = this.query(".stock");
    this.$reset = this.query(".reset");

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
  }

  createCategoryFilter() {
    this.categoryComponent = new CatalogCheckboxFilterComponent(
      this.state.category
    );
    this.categoryComponent.render(this.$category!);
    this.categoryComponent.on(CatalogCheckboxFilterEvent.CHANGE, (selected) => {
      this.selectedCategories = selected;
      this.emitChange();
    });
  }

  createBrandFilter() {
    this.brandComponent = new CatalogCheckboxFilterComponent(this.state.brand);
    this.brandComponent.render(this.$brand!);
    this.brandComponent.on(CatalogCheckboxFilterEvent.CHANGE, (selected) => {
      this.selectedBrands = selected;
      this.emitChange();
    });
  }

  createPriceFilter() {
    this.priceComponent = new CatalogRangeFilterComponent({
      min: 10,
      max: 1749,
      title: "Price",
    });
    this.priceComponent.render(this.$price!);
    this.priceComponent.on(CatalogRangeFilterEvent.CHANGE, (data) => {
      this.price = data;
      this.emitChange();
    });
  }

  createStockFilter() {
    this.stockComponent = new CatalogRangeFilterComponent({
      min: 2,
      max: 150,
      title: "Stock",
    });
    this.stockComponent.render(this.$stock!);
    this.stockComponent.on(CatalogRangeFilterEvent.CHANGE, (data) => {
      this.stock = data;
      this.emitChange();
    });
  }

  emitChange() {
    this.emit(CatalogFiltersEvent.CHANGE, {
      brands: this.selectedBrands,
      categories: this.selectedCategories,
      price: this.price,
      stock: this.stock,
    });
  }

  addEvents(): void {
    this.$reset!.addEventListener("click", () => {
      this.selectedBrands = [];
      this.selectedCategories = [];
      this.emitChange();
    });
  }
}
