const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const util = require("./util");
const packageConfig = require("../../package.json");

const isDevMode = process.env.NODE_ENV === "development";

// 外部依赖，不会创建捆绑包
// https://webpack.js.org/configuration/externals/
const externals = {};

/**
 * 在[dev/prod.config.js]中公用的配置
 */
module.exports = {
  entry: {
    main: util.entry(),
  },
  output: {
    filename: "web-code-editor.js",
    path: util.output(),

    // 如果发布第三方包，可以启动下面这三个配置
    library: "WebCodeEditor",
    libraryTarget: "umd",
    globalObject: "this",
    publicPath: "",
  },

  rules: [
    {
      // See also: https://github.com/microsoft/TypeScript-Babel-Starter
      // 如果你想要.d.ts文件，那么ts-loader可能来的更直接点
      test: /\.tsx?$/,
      exclude: /(node_modules|bower_components)/,
      use: [
        {
          loader: "ts-loader",
          options: {
            configFile: path.join(
              util.rootPath(),
              process.env.NODE_ENV === "production" ? "tsconfig.build.json" : "tsconfig.json"
            ),
          },
        },
      ],
    },
    {
      test: /\.styl$/,
      use: [
        isDevMode ? "style-loader" : MiniCssExtractPlugin.loader,
        { loader: "css-loader", options: { importLoaders: 1 } },
        {
          // https://webpack.js.org/loaders/postcss-loader/
          loader: "postcss-loader",
          options: {
            postcssOptions: {
              plugins: [
                ["postcss-short", {}], // CSS中使用高级速记属性
                [
                  "postcss-preset-env",
                  {}, // 将现代CSS转换为大多数浏览器可以理解的内容
                ],
              ],
            },
          },
        },
        {
          // https://www.npmjs.com/package/stylus-loader
          loader: "stylus-loader",
        },
      ],
    },
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: [
        {
          // https://webpack.js.org/loaders/file-loader/
          loader: "file-loader",
          options: {
            outputPath: "images",
            name: "[name].[ext]",
          },
        },
      ],
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: [
        {
          loader: "file-loader",
          options: {
            outputPath: "fonts",
            name: "[name].[ext]",
          },
        },
      ],
    },
    {
      test: /\.xml$/,
      use: ["xml-loader"],
    },
    // {
    //   test: /\.html$/,
    //   exclude: [/node_modules/, path.resolve(__dirname, "index.html")],
    //   use: { loader: "html-loader" }
    // }
  ],

  // 需要插入到打包后的html文件中的cdn
  externals: externals,
  resolve: {
    // 导入此类文件时，不用添加文件后缀
    extensions: [".tsx", ".ts", ".js"],

    // 如果要配置路径别名，就在/tsconfig.json里面配置
    alias: {
      ...util.alias(),
    },
  },

  // 优化: https://webpack.js.org/configuration/optimization/
  optimization: {},

  // 插件: https://webpack.js.org/configuration/plugins/#plugins
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: false,
      title: "web code editor",
      filename: "index.html",
      template: util.htmlTemplatePath("index.html"),
      cnd: util.externals2Cdn(externals, packageConfig.dependencies),
    }),
    new HtmlWebpackPlugin({
      inject: false,
      title: "web code editor",
      filename: "monaco.html",
      template: util.htmlTemplatePath("monaco.html"),
      cnd: util.externals2Cdn(externals, packageConfig.dependencies),
    }),
  ],

  // 实验性支持: https://webpack.js.org/configuration/experiments/
  experiments: {
    topLevelAwait: true,
  },
};
