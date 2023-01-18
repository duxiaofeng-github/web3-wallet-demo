const path = require("path");

const NODE_ENV = process.env.NODE_ENV;

const isProduction = NODE_ENV === "production";

module.exports = {
  devtool: false,
  mode: !isProduction ? "development" : "production",
  entry: {
    "content-scripts": "./plugin/content-scripts.ts",
    "background-scripts": "./plugin/background-scripts.ts",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "plugin"),
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
    ],
  },
  watch: true,
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
