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
import { CatalogFiltersEvent } from "../../components/catalog-filters/types";
import { RangeValue } from "../../components/catalog-range-filter/types";
import { RouterPaths } from "../../helpers/router/constants";
import { parseQuery, queryStringify } from "../../helpers/api/router";
import { QueryName, QueryValues, SortField, SortType } from "./types";
import { getProductInCart } from "../../helpers/cart/product";
import { cart } from "../../helpers/cart";
import { CatalogItemEvents } from "../../components/catalog-item/types";

export class CatalogPage extends Component {
  itemComponents: CatalogItemComponent[] = [];
  panelComponent: CatalogPanelComponent | null = null;
  filtersComponent: CatalogFiltersComponent | null = null;

  data: ProductsResponse | null = null;
  visibleProducts: Product[] = [];

  $items: HTMLElement | null = null;
  $panel: HTMLElement | null = null;
  $filters: HTMLElement | null = null;
  $noResults: HTMLDivElement | null = null;

  sortType: SortType = SortType.ASC;
  sortField: SortField = SortField.PRICE;
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
  }

  async onMounted() {
    this.$items = this.query(".catalog-items");
    this.$panel = this.query(".panel");
    this.$filters = this.query(".filters");
    this.$noResults = this.query(".no-results");

    this.data = await api.getProducts();
    this.visibleProducts = this.data.products;

    this.createPanel();
    this.createProducts();
    this.createFilters();

    this.updateFilterFromUrl();
    this.filterAndSearchProducts();
    this.updateFilters();

    this.updateViewType(this.viewType);
    this.makeSort();
  }

  createPanel() {
    this.panelComponent = new CatalogPanelComponent({
      total: this.data!.total,
      limit: this.visibleProducts.length,
      view: this.viewType,
      search: this.searchValue,
      sortField: this.sortField,
      sortType: this.sortType,
    });

    this.panelComponent
      .on(CatalogPanelEvents.SORT, (value) => {
        const values = value.split("-");
        this.sortField = values[0] as typeof this.sortField;
        this.sortType = values[1] as typeof this.sortType;
        this.makeSort();
        this.setFilterToUrl();
      })
      .on(CatalogPanelEvents.SEARCH, (value) => {
        this.searchValue = value;
        this.filterAndSearchProducts();
        this.makeSort();
        this.updateFilters();
        this.setFilterToUrl();
      })
      .on(CatalogPanelEvents.VIEW, (type) => {
        this.updateViewType(type);
        this.setFilterToUrl();
      });

    this.panelComponent.render(this.$panel!);
  }

  createProducts() {
    const cartState = cart.getCart();

    this.visibleProducts.forEach((product) => {
      const inCart = getProductInCart(cartState, product.id);
      const itemComponent = new CatalogItemComponent({
        product,
        inCart,
        viewType: this.viewType,
      });

      itemComponent.on(CatalogItemEvents.ADD, (state) => {
        if (state.inCart) {
          cart.decrementItem(state.product.id);
        } else {
          cart.incrementItem(state.product.id);
        }

        itemComponent!.state = {
          inCart: !state.inCart,
        };
      });
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
    const price = this.getPriceFilter();
    const stock = this.getStockFilter();
    this.filtersComponent = new CatalogFiltersComponent({
      brand,
      category,
      price,
      stock,
    });
    this.filtersComponent.render(this.$filters!);

    this.filtersComponent
      .on(CatalogFiltersEvent.CHANGE, (filter) => {
        this.currentFilter = filter;
        this.filterAndSearchProducts();
        this.makeSort();
        this.setFilterToUrl();
      })
      .on(CatalogFiltersEvent.RESET, () => {
        this.resetFilter();
      })
      .on(CatalogFiltersEvent.COPY, () => {
        this.copyFilter();
      });
  }

  updateFilters() {
    const brand = this.getBrandFilter();
    const category = this.getCategoryFilter();
    const price = this.getPriceFilter();
    const stock = this.getStockFilter();

    this.filtersComponent!.state = { brand, category, stock, price };

    this.panelComponent!.state = {
      search: this.searchValue,
      sortField: this.sortField,
      sortType: this.sortType,
      view: this.viewType,
    };
  }

  getBrandFilter() {
    return this.getFilter(FilterField.BRAND, "Brand");
  }

  getCategoryFilter() {
    return this.getFilter(FilterField.CATEGORY, "Category");
  }

  getStockFilter() {
    return {
      min: 2,
      max: 150,
      from: this.currentFilter.stock.from,
      to: this.currentFilter.stock.to,
      title: "Stock",
    };
  }

  getPriceFilter() {
    return {
      min: 10,
      max: 1749,
      from: this.currentFilter.price.from,
      to: this.currentFilter.price.to,
      title: "Price",
    };
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

  makeSort() {
    this.sortVisibleProducts();
    this.destroyProducts();
    this.createProducts();
  }

  sortVisibleProducts() {
    this.visibleProducts.sort((a, b) => {
      if (this.sortType === SortType.ASC) {
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
      this.itemComponents.forEach((component) => {
        component.state = {
          viewType: this.viewType,
        };
      });
    }

    this.panelComponent!.state = {
      view: this.viewType,
    };
  }

  updateFound(): void {
    this.panelComponent!.state = {
      limit: this.visibleProducts.length,
    };

    this.$noResults?.classList.toggle(
      "visible",
      this.visibleProducts.length === 0
    );
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
    const searchFields: (keyof Product)[] = ["title", "description"];

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
    const queryData = parseQuery<QueryValues>(parseOptions);

    this.currentFilter = {
      brands: queryData[QueryName.BRANDS] || this.FILTER_INITIAL.brands,
      categories:
        queryData[QueryName.CATEGORIES] || this.FILTER_INITIAL.categories,
      price: {
        from: queryData[QueryName.PRICE_FROM] || this.FILTER_INITIAL.price.from,
        to: queryData[QueryName.PRICE_TO] || this.FILTER_INITIAL.price.to,
      },
      stock: {
        from: queryData[QueryName.STOCK_FROM] || this.FILTER_INITIAL.stock.from,
        to: queryData[QueryName.STOCK_TO] || this.FILTER_INITIAL.stock.to,
      },
    };

    this.sortType = queryData[QueryName.SORT_TYPE] || SortType.ASC;
    this.sortField = queryData[QueryName.SORT_FIELD] || SortField.PRICE;
    this.searchValue = queryData[QueryName.SEARCH] || "";
    this.viewType = queryData[QueryName.VIEW] || ViewType.BIG;
  }

  resetFilter() {
    router.setPage(RouterPaths.CATALOG);
    this.updateFilterFromUrl();
    this.filterAndSearchProducts();
    this.makeSort();
    this.updateFilters();
  }

  async copyFilter() {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }
}
