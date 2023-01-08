import { CatalogPage } from "../../pages/catalog";
import { RouterConfig, Route, RouterCallback, ComponentType } from "./types";
import { RouterPaths } from "./constants";
import { NotFoundPage } from "../../pages/not-found";
import { DetailsPage } from "../../pages/details";

class Router {
  private _config: RouterConfig;
  private _currentRoute: Route | null = null;
  private _callbacks: RouterCallback[];
  private _NotFoundPage: ComponentType;
  // _callbacks массив колбэков, в качестве вызова в компоненте onChange => подписываемся через эти колбэки на изменения роута
  // например вызываем onChange передаем в нее функцию

  constructor(config: RouterConfig, NotFoundPage: ComponentType) {
    this._config = config;
    this._callbacks = [];
    this._NotFoundPage = NotFoundPage;

    this.setPage(window.location.pathname + window.location.search);

    window.addEventListener("popstate", () => {
      this.setPage(window.location.pathname + window.location.search);
    });
  }
  /*
  сюда передаем и эта функция вызовется, когда произойдет изменение роута => в root в router.onChange мы получим вызов этой стрелочной функции.
  при изменении роута можно логику сделать нужную (изменение параметров url, при загрузке страницы что-то делать)
  */
  onChange(fn: RouterCallback) {
    this._callbacks.push(fn);
  }

  setPage(url: string): void {
    const prevRoute = this._currentRoute;
    this._currentRoute = this._findPage(url);

    // TODO check if set same url

    if (this._currentRoute) {
      this._changeUrl(url);
    } else {
      this._currentRoute = {
        name: RouterPaths.NOT_FOUND,
        component: this._NotFoundPage,
      };
    }

    if (prevRoute?.name !== this._currentRoute.name) {
      this._emitCallbacks();
    }
  }

  getCurrentRoute() {
    return this._currentRoute;
  }

  _emitCallbacks() {
    this._callbacks.forEach((fn) => fn(this._currentRoute!));
  }

  _findPage(url: string) {
    const tail = url[0] === "/" ? url : "/" + url;
    const nextUrl = new URL(window.location.origin + tail);
    const pathname = nextUrl.pathname;

    const name = pathname.slice(1);
    return this._config.find((item) => item.name === name) || null;
  }

  _changeUrl(name: string) {
    window.history.pushState(null, "", name);
  }
}

const config: RouterConfig = [
  {
    name: RouterPaths.CATALOG,
    component: CatalogPage,
  },
  {
    name: RouterPaths.DETAILS,
    component: DetailsPage,
  },
  // {
  //   name: RouterPaths.CART,
  //   component: CartPage,
  // },
];

export const router = new Router(config, NotFoundPage);
