import { Component } from "../../helpers/component";
import "./index.scss";
import template from "./template.html";

export class BuyModalComponent extends Component {
  $desc: HTMLDivElement | null = null;

  constructor() {
    super({ template });
  }
}
