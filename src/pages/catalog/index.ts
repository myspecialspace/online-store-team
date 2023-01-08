/* eslint-disable @typescript-eslint/no-unused-vars */
import { CatalogFiltersComponent } from "../../components/catalog-filters";
import { CatalogItemComponent } from "../../components/catalog-item";
import { CatalogPanelComponent } from "../../components/catalog-panel";
import { api } from "../../helpers/api";
import { Product, ProductsResponse } from "../../helpers/api/types";
import { State as CheckboxFilterState } from "../../components/catalog-checkbox-filter";
import { State as Checkbox } from "../../components/catalog-checkbox";
import { Component } from "../../helpers/component";
import { router } from "../../helpers/router";
import "./index.scss";
import template from "./template.html";
import { FilterField, parseOptions } from "./constants";
import {
  CatalogPanelEvents,
  ViewType,
} from "../../components/catalog-panel/types";
import { CatalogItemSmallComponent } from "../../components/catalog-item-small";
import { CatalogFiltersEvent } from "../../components/catalog-filters/types";
import { RangeValue } from "../../components/catalog-range-filter/types";
import { RouterPaths } from "../../helpers/router/constants";
import { parseQuery, queryStringify } from "../../helpers/api/router";
import { QueryName } from "./types";

export class CatalogPage extends Component {
  itemComponents: Array<CatalogItemComponent | CatalogItemSmallComponent> = [];
  panelComponent: CatalogPanelComponent | null = null;
  filtersComponent: CatalogFiltersComponent | null = null;

  data: ProductsResponse | null = null;
  visibleProducts: Product[] = [];

  $items: HTMLElement | null = null;
  $panel: HTMLElement | null = null;
  $filters: HTMLElement | null = null;

  sortType: "ASC" | "DESC" = "ASC";
  sortField: "price" | "rating" | "discountPercentage" = "price";
  viewType: ViewType = ViewType.BIG;
  readonly FILTER_INITIAL = {
    brands: [],
    categories: [],
    price: { from: 10, to: 1749 },
    stock: { from: 2, to: 150 },
  };
  currentFilter: {
    brands: string[];
    categories: string[];
    price: RangeValue;
    stock: RangeValue;
  } = this.FILTER_INITIAL;
  searchValue = "";

  constructor() {
    super({ template });

    this.updateFilterFromUrl();
  }

  async onMounted() {
    this.$items = this.query(".catalog-items");
    this.$panel = this.query(".panel");
    this.$filters = this.query(".filters");

    this.data = await api.getProducts();
    this.visibleProducts = this.data.products;

    this.createPanel();
    this.createProducts();
    this.createFilters();
    this.updateViewType(this.viewType);
    //console.log("res", res); - проверка подгрузки данных
  }
  //создаем панель над карточками где поиск
  createPanel() {
    this.panelComponent = new CatalogPanelComponent({
      limit: this.visibleProducts.length,
      view: this.viewType,
    });

    this.panelComponent
      .on(CatalogPanelEvents.SORT, (value) => {
        const values = value.split("-");
        this.sortField = values[0] as typeof this.sortField;
        this.sortType = values[1] as typeof this.sortType;
        this.makeSort(value);
        this.setFilterToUrl();
      })
      .on(CatalogPanelEvents.SEARCH, (value) => {
        this.searchValue = value;
        this.filterAndSearchProducts();
        this.updateFilters();
        this.setFilterToUrl();
      })
      .on(CatalogPanelEvents.VIEW, (type) => {
        this.updateViewType(type);
        this.setFilterToUrl();
      });

    this.panelComponent.render(this.$panel!);
  }
  //создаем карточки с продуктами
  createProducts() {
    this.visibleProducts.forEach((product) => {
      const itemComponent =
        this.viewType === ViewType.BIG
          ? new CatalogItemComponent(product)
          : new CatalogItemSmallComponent(product);

      itemComponent.render(this.$items!);
      this.itemComponents.push(itemComponent);
    });
  }

  destroyProducts() {
    let component;

    while ((component = this.itemComponents.pop())) {
      component.destroy();
    }
  }

  createFilters() {
    const brand = this.getBrandFilter();
    const category = this.getCategoryFilter();
    this.filtersComponent = new CatalogFiltersComponent({ brand, category });
    this.filtersComponent.render(this.$filters!);

    this.filtersComponent.on(CatalogFiltersEvent.CHANGE, (filter) => {
      this.currentFilter = filter;
      this.filterAndSearchProducts();
      this.setFilterToUrl();
    });
  }

  updateFilters() {
    const brand = this.getBrandFilter();
    const category = this.getCategoryFilter();
    this.filtersComponent!.state = { brand, category };
  }

  getBrandFilter() {
    return this.getFilter(FilterField.BRAND, "Brand");
  }

  getCategoryFilter() {
    return this.getFilter(FilterField.CATEGORY, "Category");
  }

  getFilter(fieldName: FilterField, title: string): CheckboxFilterState {
    const products = this.data?.products || [];
    const visibleProducts = this.visibleProducts || [];

    const checkboxes: Checkbox[] = [];
    const fieldMap: Record<string, true> = {};

    products.forEach((product) => {
      const value = product[fieldName];
      if (!fieldMap[value]) {
        const total = products.filter(
          (product) => product[fieldName] === value
        ).length;
        const visible = visibleProducts.filter(
          (product) => product[fieldName] === value
        ).length;

        const isChecked = this.getIsCheckboxChecked(fieldName, value);
        checkboxes.push({ label: value, total, visible, isChecked });
        fieldMap[value] = true;
      }
    });

    return {
      title,
      checkboxes,
    };
  }

  getIsCheckboxChecked(fieldName: FilterField, value: string): boolean {
    const selected =
      fieldName === FilterField.BRAND
        ? this.currentFilter.brands
        : this.currentFilter.categories;
    return selected.includes(value);
  }

  makeSort(value: string) {
    this.sortVisibleProducts(value);
    this.destroyProducts();
    this.createProducts();
  }

  sortVisibleProducts(value: string) {
    this.visibleProducts.sort((a, b) => {
      if (this.sortType === "DESC") {
        return a[this.sortField] - b[this.sortField];
      } else {
        return b[this.sortField] - a[this.sortField];
      }
    });
  }

  updateViewType(view: ViewType): void {
    const isChanged = this.viewType !== view;
    this.viewType = view;

    Object.values(ViewType).forEach((value) => {
      this.$root!.classList.remove(`view_${value}`);
    });

    this.$root!.classList.add(`view_${view}`);

    if (isChanged) {
      this.destroyProducts();
      this.createProducts();
    }

    this.panelComponent!.state = {
      view: this.viewType,
    };
  }

  updateFound(): void {
    this.panelComponent!.state = {
      limit: this.visibleProducts.length,
    };
  }

  filterAndSearchProducts(): void {
    this.filterAndSearch();
    this.destroyProducts();
    this.createProducts();
    this.updateFound();
    this.updateFilters();
  }

  filterAndSearch(): void {
    this.visibleProducts = [];

    const { categories, brands, price, stock } = this.currentFilter;
    const searchFields: (keyof Product)[] = ["title"]; // TODO more fields

    for (const product of this.data?.products || []) {
      if (categories.length && !categories.includes(product.category)) {
        continue;
      }

      if (brands.length && !brands.includes(product.brand)) {
        continue;
      }

      if (product.price < price.from || product.price > price.to) {
        continue;
      }

      if (product.stock < stock.from || product.stock > stock.to) {
        continue;
      }

      if (this.searchValue) {
        const searchValue = this.searchValue.toLocaleLowerCase();

        const isMatch = searchFields.some((field) => {
          const productValue = String(product[field]).toLocaleLowerCase();
          return productValue.includes(searchValue);
        });

        if (!isMatch) {
          continue;
        }
      }

      this.visibleProducts.push(product);
    }
  }

  setFilterToUrl(): void {
    const data = {
      [QueryName.CATEGORIES]: this.currentFilter.categories,
      [QueryName.BRANDS]: this.currentFilter.brands,
      [QueryName.PRICE_FROM]: this.currentFilter.price.from,
      [QueryName.PRICE_TO]: this.currentFilter.price.to,
      [QueryName.STOCK_FROM]: this.currentFilter.stock.from,
      [QueryName.STOCK_TO]: this.currentFilter.stock.to,
      [QueryName.SORT_TYPE]: this.sortType,
      [QueryName.SORT_FIELD]: this.sortField,
      [QueryName.SEARCH]: this.searchValue,
      [QueryName.VIEW]: this.viewType,
    };

    const qs = "?" + queryStringify(data);
    const url = "/" + RouterPaths.CATALOG + qs;
    router.setPage(url);
  }

  updateFilterFromUrl(): void {
    const queryData = parseQuery(parseOptions);
    console.log("queryData", queryData);

    // TODO
    // this.sortType = queryData.sort_type;
    // this.currentFilter = {
    //   brands: queryData[QueryName.BRANDS],
    //   categories: queryData[QueryName.CATEGORIES],
    // }
  }
}
