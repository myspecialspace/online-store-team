import { Component } from "../component";
import { RouterPaths } from "./constants";

export type RouterConfig = Route[];

export interface Route {
  name: RouterPaths;
  component: ComponentType;
}

export type RouterCallback = (page: Route) => void;

export type ComponentType = new () => Component;
