import { CatalogItemComponent } from "../../components/catalog-item";
import { api } from "../../helpers/api";
import { ProductsResponse } from "../../helpers/api/types";
import { Component } from "../../helpers/component";
import { router } from "../../helpers/router";
import "./index.scss";
import template from "./template.html";

export class CatalogPage extends Component {
  itemComponents: CatalogItemComponent[] = [];
  data: ProductsResponse | null = null;
  $items: HTMLElement | null = null;

  constructor() {
    super({ template });
  }

  async onMounted() {
    this.$items = this.query(".catalog-items");
    this.data = await api.getProducts(); //сохр.дату
    this.createProducts();
    //console.log("res", res); - проверка подгрузки данных
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
