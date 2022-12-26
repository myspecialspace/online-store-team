import { resolve } from "path";

export const mode = "development";
export const devtool = "inline-source-map";
export const devServer = {
  //contentBase: path.resolve(__dirname, './dist'),
  port: 8080,
  hot: "only",
  static: resolve(__dirname, "./dist"),
};
export const module = {
  rules: [
    {
      test: /\.css$/i,
      use: ["style-loader", "css-loader"],
    },
  ],
};
