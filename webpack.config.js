var webpack = require("webpack");
var path = require("path");

// variables
var isProduction = process.argv.indexOf("-p") >= 0;
var sourcePath = path.join(__dirname, "./src");
var outPath = path.join(__dirname, "./dist");

// plugins
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  context: sourcePath,
  devServer: {
    contentBase: sourcePath,
    hot: true,
    stats: {
      warnings: false,
    },
  },
  entry: {
    main: "./index.tsx",
    vendor: [
      "react",
      "react-dom",
      "react-redux",
      "react-router",
      "redux",
    ],
  },
  module: {
    loaders: [
      // .ts, .tsx
      {
        test: /\.tsx?$/,
        use: isProduction
          ? "awesome-typescript-loader?module=es6"
          : [
            "react-hot-loader",
            "awesome-typescript-loader",
          ],
      },
      // css
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              query: {
                importLoaders: 1,
                localIdentName: "[local]__[hash:base64:5]",
                modules: true,
                sourceMap: !isProduction,
              },
            },
            {
              loader: "postcss-loader",
              options: {
                ident: "postcss",
                plugins: [
                  require("postcss-import")({ addDependencyTo: webpack }),
                  require("postcss-url")(),
                  require("postcss-cssnext")(),
                  require("postcss-reporter")(),
                  require("postcss-browser-reporter")({ disabled: isProduction }),
                ],
              },
            },
          ],
        }),
      },
      // static assets
      { test: /\.html$/, use: "html-loader" },
      { test: /\.png$/, use: "url-loader?limit=10000" },
      { test: /\.jpg$/, use: "file-loader" },
    ],
    rules: [
      {
        enforce: "pre",
        loader: "tslint-loader",
        test: /\.tsx?$/,
      },
      {
        loader: "babel-loader",
        test: /\.jsx$/,
      },
      {
        loader: "react-hot-loader!awesome-typescript-loader",
        test: /\.tsx?$/,
      },
      {
        include: path.resolve("./src"),
        loaders: [
          "style-loader",
          "css-loader?modules&importLoaders=10&localIdentName=[local]___[hash:base64:5]",
          "postcss-loader",
        ],
        test: /\.css$/,
      },
    ],
  },
  node: {
    // workaround for webpack-dev-server issue
    // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
    fs: "empty",
    net: "empty",
  },
  output: {
    filename: "bundle.js",
    path: outPath,
    publicPath: "/",
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      filename: "vendor.bundle.js",
      minChunks: Infinity,
      name: "vendor",
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new ExtractTextPlugin({
      disable: !isProduction,
      filename: "styles.css",
    }),
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
  ],
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
    // Fix webpack"s default behavior to not load packages with jsnext:main module
    // https://github.com/Microsoft/TypeScript/issues/11677
    mainFields: ["main"],
  },
  target: "web",
};
