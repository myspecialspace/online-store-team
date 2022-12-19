import { CatalogPage } from "../catalog";


class Router {
  constructor(config, initialPage) {
    this._config = config;
    this._currentPage = initialPage;
    this._callbacks = [];
  }

  onChange(fn) {
    this._callbacks.push(fn);
  }

  setPage(name) {
    if (name !== this._currentPage.name)  {
      this._currentPage = this._findPage(name);
      this._emitCallbacks();
    }
  }

  getCurrentPage() {
    return this._currentPage;
  }

  _emitCallbacks() {
    this._callbacks.forEach((fn) => fn(this._currentPage));
  }

  _findPage(name) {
    return this._config.find((item) => item.name === name);
  }
}

export const ROUTER_PATHS = {
  CATALOG: 'catalog',
  PRODUCT_DETAILS: 'product-details/:id',
  CART: 'cart',
};

const config = [
  {
    name: ROUTER_PATHS.CATALOG,
    component: CatalogPage,
  },
  /*{
    name: ROUTER_PATHS.PRODUCT_DETAILS,
    component: ProductDetailsPage,
  },
  {
    name: ROUTER_PATHS.CART,
    component: CartPage,
  },*/
];

export const router = new Router(config, config[0]);
