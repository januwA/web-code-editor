process.env.NODE_ENV = "development";

const shared = require("./shared");

const devConfig = {
  // target: 'node' // 如果你只想打包在nodejs环境中运行的代码，就开启这个
  mode: process.env.NODE_ENV,
  externals: shared.externals,
  devtool: "inline-source-map", // 生成map文件
  module: {
    rules: shared.rules,
  },
  resolve: shared.resolve,
  optimization: shared.optimization,
  plugins: shared.plugins,
  experiments: shared.experiments,
};

module.exports = [
  {
    entry: shared.entry,
    output: shared.output,
    ...devConfig,
  },
];
