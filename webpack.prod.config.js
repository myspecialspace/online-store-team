import MiniCssExtractPlugin, { loader } from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";

export const mode = "production";
export const plugins = [
  new MiniCssExtractPlugin({
    filename: "index.css",
  }),
  new CssMinimizerPlugin(),
];
export const module = {
  rules: [
    {
      test: /\.css$/i,
      use: [loader, "css-loader"],
    },
  ],
};
export const optimization = {
  minimizer: [new CssMinimizerPlugin()],
};
