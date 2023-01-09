import { BreadcrumbsComponent } from "../../components/breadcrumbs";
import { GalleryComponent } from "../../components/gallery";
import { InfoRowComponent } from "../../components/info-row";
import { api } from "../../helpers/api";
import { Product } from "../../helpers/api/types";
import { Component } from "../../helpers/component";
import { router } from "../../helpers/router";
import "./index.scss";
import template from "./template.html";
import { State as InfoRowState } from "../../components/info-row";
import { cart } from "../../helpers/cart";
import { getProductInCart } from "../../helpers/cart/product";
import { formatPrice } from "../../helpers/cart/price";
import { RouterPaths } from "../../helpers/router/constants";

export class DetailsPage extends Component {
  product: Product | null = null;
  breadcrumbsComponent: BreadcrumbsComponent | null = null;
  galleryComponent: GalleryComponent | null = null;
  infoRowComponents: InfoRowComponent[] = [];

  $breadcrumbs: HTMLDivElement | null = null;
  $header: HTMLDivElement | null = null;
  $gallery: HTMLDivElement | null = null;
  $info: HTMLDivElement | null = null;
  $toCart: HTMLButtonElement | null = null;
  $buy: HTMLButtonElement | null = null;
  $price: HTMLButtonElement | null = null;

  inCart = false;

  constructor() {
    super({ template });
  }

  async onMounted() {
    this.$breadcrumbs = this.query(".breadcrumbs");
    this.$header = this.query(".header");
    this.$gallery = this.query(".gallery-wrap");
    this.$info = this.query(".info");
    this.$toCart = this.query(".to-cart");
    this.$price = this.query(".price");
    this.$buy = this.query(".buy");

    const productId = router.getId();
    this.product = await api.getProduct(productId);

    this.updateInCart();

    this.createBreadcrumbs();
    this.createGallery();
    this.createInfo();

    this.$header!.textContent = this.product!.title;
    this.$price!.textContent = formatPrice(this.product!.price);

    this.addEvents();
  }

  createBreadcrumbs() {
    const state = [
      "store",
      this.product!.category,
      this.product!.brand,
      this.product!.title,
    ].map((item) => item?.toUpperCase());

    this.breadcrumbsComponent = new BreadcrumbsComponent(state);
    this.breadcrumbsComponent.render(this.$breadcrumbs!);
  }

  createGallery() {
    const uniqueImages = [...new Set(this.product!.images)];
    this.galleryComponent = new GalleryComponent(uniqueImages);
    this.galleryComponent.render(this.$gallery!);
  }

  createInfo() {
    const rows: InfoRowState[] = [
      {
        header: "Description:",
        content: this.product!.description,
      },
      {
        header: "Discount Percentage:",
        content: String(this.product!.discountPercentage),
      },
      {
        header: "Rating:",
        content: String(this.product!.rating),
      },
      {
        header: "Stock:",
        content: String(this.product!.stock),
      },
      {
        header: "Brand:",
        content: String(this.product!.brand),
      },
      {
        header: "Category:",
        content: String(this.product!.category),
      },
    ];

    rows.forEach((row) => {
      const component = new InfoRowComponent(row);
      component.render(this.$info!);
      this.infoRowComponents.push(component);
    });
  }

  addEvents(): void {
    this.$toCart!.addEventListener("click", () => {
      if (this.inCart) {
        cart.decrementItem(this.product!.id);
      } else {
        cart.incrementItem(this.product!.id);
      }

      this.updateInCart();
    });

    this.$buy!.addEventListener("click", () => {
      if (!this.inCart) {
        cart.incrementItem(this.product!.id);
      }

      router.setPage("/" + RouterPaths.CART + "?buy=1");
    });
  }

  updateInCart(): void {
    this.inCart = getProductInCart(cart.getCart(), this.product!.id);
    this.$toCart!.textContent = this.inCart ? "DROP" : "ADD";
  }
}
