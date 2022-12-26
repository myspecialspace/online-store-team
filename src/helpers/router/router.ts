import { CatalogPage } from "../../pages/catalog";
import { RouterPaths } from "./constants";
import { RouterConfig, Route, RouterCallback } from "./types";

class Router {
  private _config: RouterConfig;
  private _currentPage: Route | null;
  private _callbacks: RouterCallback[]; //массив колбэков, в качестве вызова в компоненте onChange => подписываемся через эти колбэки на изменения роута
  //например вызываем onChange передаем в нее функцию

  constructor(config: RouterConfig, initialPage: Route) {
    this._config = config;
    this._currentPage = initialPage;
    this._callbacks = [];
  }
  /*
  сюда передаем и эта функция вызовется, когда произойдет изменение роута => в root в router.onChange мы получим вызов этой стрелочной функции.
  при изменении роута можно логику сделать нужную (изменение параметров url, при загрузке страницы что-то делать)
  */
  onChange(fn: RouterCallback) {
    this._callbacks.push(fn);
  }

  setPage(name: RouterPaths) {
    if (name !== this._currentPage?.name) {
      //засетить из _findPage в _currentPage и вызвать колбэки из onChange
      this._currentPage = this._findPage(name) || null;
      this._emitCallbacks();
    }
  }

  getCurrentPage() {
    return this._currentPage;
  }

  _emitCallbacks() {
    this._callbacks.forEach((fn) => fn(this._currentPage!));
  }
  //найти нужную страницу в const config и ее отрисовать потом
  _findPage(name: RouterPaths) {
    return this._config.find((item) => item.name === name);
  }
}

const config: RouterConfig = [
  {
    name: RouterPaths.CATALOG,
    component: CatalogPage, //передаем класс  CatalogPage (а не его экземпляр), который наследуется от Component
  },
  /*{
    name: RouterPaths.PRODUCT_DETAILS,
    component: ProductDetailsPage,
  },
  {
    name: RouterPaths.CART,
    component: CartPage,
  },*/
];

export const router = new Router(config, config[0]);
