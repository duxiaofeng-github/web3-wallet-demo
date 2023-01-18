const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const NODE_ENV = process.env.NODE_ENV;

const isProduction = NODE_ENV === "production";

module.exports = {
  devtool: false,
  mode: !isProduction ? "development" : "production",
  entry: {
    app: "./app/app.tsx",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "app-dist"),
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
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devServer: {
    host: "0.0.0.0",
    port: process.env.PROXY || 8080,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "app/index.html",
    }),
  ],
};
