import { Component } from "../helpers/component";
import { router } from "../helpers/router";
import "./index.scss";
import template from "./template.html";

export class RootComponent extends Component {
  private component: Component | null = null;
  private $router: HTMLElement | null = null;

  constructor() {
    super({ template });
  }

  updateComponent(page: any) {
    const prevComponent = this.component;

    this.component = new page.component();
    if (prevComponent) {
      prevComponent.destroy();
    }
    this.component!.render(this.$router!);
  }
  //onMounted вызывается в хуке helpers/component/component.ts  _callHook
  onMounted() {
    console.log("this", this);
    //созд.роутер => отрисовка в template.html по id
    //query достанет html элемент
    this.$router = this.query("#router");

    this.updateComponent(router.getCurrentPage());

    router.onChange((page: any) => {
      this.updateComponent(page);
    });
  }
}
