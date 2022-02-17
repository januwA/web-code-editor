const path = require("path");
const DevServer = require("webpack-dev-server");
const webpack = require("webpack");

const devConfig = require("./dev.config");

const options = {
  open: false, // 默认打开浏览器
  host: "localhost",
  port: 4000, // 默认打开的端口
  compress: true,
  historyApiFallback: true,
  devMiddleware: {
    stats: "errors-only",
    writeToDisk: true, // 结果输出到磁盘
  },
  client: {
    overlay: {
      // warnings: true,
      errors: true,
    },
  },
};

const compiler = webpack(devConfig);
const server = new DevServer(options, compiler);

(async () => {
  await server.start();
})();
