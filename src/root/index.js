import { Component } from '../helpers/component';
import { router } from '../helpers/router';
import './index.scss';
import template from './template.html';



export class RootComponent extends Component {
  constructor() {
    super({ state: {}, template });
  }

  updateComponent(page) {
    const prevComponent = this.component;

    this.component = new page.component();
    if (prevComponent) {
      prevComponent.destroy();
    }
    this.component.render(this.$router);
  }

  onMounted() {
    this.$router = this.query('#router');


    this.updateComponent(router.getCurrentPage());

    router.onChange((page) => {
      this.updateComponent(page);
      this.updateActiveNav();
    });
  }
}
