const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const NODE_ENV = process.env.NODE_ENV;

const isProduction = NODE_ENV === "production";

module.exports = {
  devtool: false,
  mode: !isProduction ? "development" : "production",
  entry: {
    "content-scripts": "./plugin/content-scripts.ts",
    "background-scripts": "./plugin/background-scripts.ts",
    popup: "./plugin/popup/popup.tsx",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "plugin-dist"),
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts)$/,
        use: [
          {
            loader: "ts-loader", // transform ts to js
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader", // inject all css codes into <style> tag on html
          },
          {
            loader: "css-loader", // extract all css imports on js file
          },
        ],
      },
    ],
  },
  watch: true,
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "popup.html",
      template: "plugin/popup/popup.html",
      favicon: "plugin/assets/wallet.svg",
      chunks: ["popup"], // only inject popup script
    }),
    // copy static files to dist folder
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "plugin/manifest.json"),
          to: "manifest.json",
        },
        {
          from: path.resolve(__dirname, "plugin/assets"),
          to: "assets",
        },
      ],
    }),
  ],
};
