import { ProductsResponse } from "./types";

class Api {
  readonly baseUrl = "https://dummyjson.com";

  public getProducts() {
    const query = "?" + this.getQuery({ limit: "100" });
    return this.request<ProductsResponse>("/products" + query);
  }

  private async request<TResponse>(
    url: string,
    options?: Partial<RequestInit>
  ): Promise<TResponse> {
    const res = await fetch(this.baseUrl + url, options);
    const json = await res.json();
    return json;
    // TODO error handling
  }

  private getQuery(data: Record<string, string>): string {
    const pairs: string[] = Object.keys(data).map((key) => {
      return `${key}=${data[key]}`;
    });
    const result = pairs.join("&");
    return result;
  }
}

export const api = new Api();
