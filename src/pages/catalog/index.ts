/* eslint-disable @typescript-eslint/no-unused-vars */
import { CatalogItemComponent } from "../../components/catalog-item";
import { CatalogPanelComponent } from "../../components/catalog-panel";
import { api } from "../../helpers/api";
import { ProductsResponse } from "../../helpers/api/types";
import { Component } from "../../helpers/component";
import { router } from "../../helpers/router";
import "./index.scss";
import template from "./template.html";

export class CatalogPage extends Component {
  itemComponents: CatalogItemComponent[] = [];
  panelComponent: CatalogPanelComponent | null = null;
  data: ProductsResponse | null = null;
  $items: HTMLElement | null = null;
  $panel: HTMLElement | null = null;

  constructor() {
    super({ template });
  }

  async onMounted() {
    this.$items = this.query(".catalog-items");
    this.$panel = this.query(".panel");
    this.data = await api.getProducts(); //сохр.дату
    this.createPanel();
    this.createProducts();
    //console.log("res", res); - проверка подгрузки данных
  }
  //создаем панель над карточками где поиск
  createPanel() {
    this.panelComponent = new CatalogPanelComponent({
      limit: this.data!.limit,
    });

    this.panelComponent.render(this.$panel!);
  }
  //создаем карточки с продуктами
  createProducts() {
    this.data?.products.forEach((product) => {
      const itemComponent = new CatalogItemComponent(product); //создали компонент
      itemComponent.render(this.$items!); //зарендерили его
      this.itemComponents.push(itemComponent); //пушим itemComponent
    });
  }
}
