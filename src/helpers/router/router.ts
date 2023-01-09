import { CatalogPage } from "../../pages/catalog";
import { RouterConfig, Route, RouterCallback, ComponentType } from "./types";
import { RouterPaths } from "./constants";
import { NotFoundPage } from "../../pages/not-found";
import { DetailsPage } from "../../pages/details";
import { CartPage } from "../../pages/cart";

class Router {
  private _config: RouterConfig;
  private _currentRoute: Route | null = null;
  private _callbacks: RouterCallback[];
  private _NotFoundPage: ComponentType;

  constructor(config: RouterConfig, NotFoundPage: ComponentType) {
    this._config = config;
    this._callbacks = [];
    this._NotFoundPage = NotFoundPage;

    this.setInitialPage();

    window.addEventListener("popstate", () => {
      const url = window.location.pathname + window.location.search;
      this.setPage(url, false);
    });
  }

  public onChange(fn: RouterCallback) {
    this._callbacks.push(fn);
  }

  public setPage(url: string, pushState = true): void {
    const prevRoute = this._currentRoute;
    this._currentRoute = this.findPage(url);

    if (this._currentRoute) {
      if (pushState) {
        this.changeUrl(url);
      }
    } else {
      this._currentRoute = {
        name: RouterPaths.NOT_FOUND,
        component: this._NotFoundPage,
      };
    }

    if (prevRoute?.name !== this._currentRoute.name) {
      // TODO remove ?
      this.emitCallbacks();
    }
  }

  public getCurrentRoute() {
    return this._currentRoute;
  }

  public getId(): number {
    const param = location.pathname.split("/")[2];
    return parseInt(param);
  }

  private emitCallbacks() {
    this._callbacks.forEach((fn) => fn(this._currentRoute!));
  }

  private findPage(url: string) {
    const tail = url[0] === "/" ? url : "/" + url;
    const nextUrl = new URL(window.location.origin + tail);
    const pathname = nextUrl.pathname;

    const name = pathname.slice(1);
    return (
      this._config.find((item) => {
        const nameWithId = item.name.includes("/:");
        if (nameWithId) {
          const itemHead = this.getHead(item.name);
          const urlHead = this.getHead(name);
          return itemHead === urlHead;
        }
        return item.name === name;
      }) || null
    );
  }

  private changeUrl(url: string) {
    if (url !== window.location.pathname + window.location.pathname) {
      window.history.pushState(null, "", url);
    }
  }

  private setInitialPage() {
    const { pathname, search } = window.location;
    const url =
      pathname === "/" ? this._config[0].name + search : pathname + search;

    this.setPage(url);
  }

  private getHead(url: string): string | undefined {
    const matches = url.match(/^(.+)\//);
    if (matches) {
      return matches[1];
    }
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
  {
    name: RouterPaths.CART,
    component: CartPage,
  },
];

export const router = new Router(config, NotFoundPage);
