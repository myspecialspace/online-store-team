import { Component } from "../component";
import { RouterPaths } from "./constants";

export type RouterConfig = Route[]; //массив роут

export interface Route {
  name: RouterPaths; //придет одно из значений enum
  component: new () => Component; //наш web component (а тут говорим что это экземпляр класса, надо через 'new () =>',это класс который возвращает нам Component )
}

export type RouterCallback = (page: Route) => void;
