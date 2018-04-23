var autoprefixer = require("autoprefixer");

var webpack = require("webpack");
var path = require("path");

// variables
var isProduction = process.argv.indexOf("-p") >= 0;
var sourcePath = path.join(__dirname, "./src");
var outPath = path.join(__dirname, "./dist");

// plugins
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
//var OfflinePlugin = require("offline-plugin");
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  context: sourcePath,
  devServer: {
    contentBase: sourcePath,
    hot: true,
    disableHostCheck: true,
    stats: {
      warnings: false,
    },
  },
  entry: {
    main: ["babel-polyfill", "./index.tsx"],
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
          ? "ts-loader?module=es6"
          : [
            "react-hot-loader",
            "ts-loader",
          ],
      },
      // static assets
      {test: /\.html$/, use: "html-loader"},
      {test: /\.png$/, use: "url-loader?limit=10000"},
      {test: /\.jpg$/, use: "file-loader"},
    ],
    rules: [
      {
        enforce: "pre",
        loader: "tslint-loader",
        test: /\.tsx?$/,
      },
      {
        loader: "react-hot-loader!ts-loader",
        test: /\.tsx?$/,
      },
      {test: /\.svg$/, use: "file-loader"},
      // {
      //   test: /\.svg$/,
      //   loader: 'svg-inline-loader'
      // },
      { test: /\.(eot|ttf|woff)$/, loader: "file-loader" },
      { test: /\.(js)$/,
          loader: "babel-loader",
          options: {
            babelrc: false,
            presets: ["es2015", "stage-0", "react"]
        },
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader']
        }),
      },
      {
        test: /\.png$/,
        exclude: /node_modules/,
        loader: 'file-loader?name=images/[name].[ext]',
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
    // new BundleAnalyzerPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      filename: "vendor.bundle.js",
      minChunks: 3,
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
   // new OfflinePlugin()
  ],
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
    // Fix webpack"s default behavior to not load packages with jsnext:main module
    // https://github.com/Microsoft/TypeScript/issues/11677
    mainFields: ["main"],
  },
  target: "web",
};
