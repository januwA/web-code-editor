const path = require("path");
const webpackDevServer = require("webpack-dev-server");
const webpack = require("webpack");
const util = require("./util");

const devConfig = require("./dev.config");

const contentBase = util.output();
// https://webpack.js.org/configuration/dev-server
const options = {
  contentBase,
  index: "index.html",
  openPage: "",
  host: "localhost",
  open: true, // 默认打开浏览器
  port: 5000, // 默认打开的端口
  writeToDisk: true,
  compress: true,
  overlay: {
    // warnings: true,
    errors: true,
  },

  // 现在有个/api/users的请求会将请求代理到http://localhost:3000/api/users
  // proxy: {
  //   '/api': 'http://localhost:3000/'
  // },

  after(app, server, compiler) {
    // 拦截路由
    //
    // See also:
    // https://gkedge.gitbooks.io/react-router-in-the-real/content/node_express.html
    // https://expressjs.com/zh-cn/4x/api.html#req
    app.get("*", (req, res, next) => {
      const fileExt = path.extname(req.path);
      if (!fileExt) {
        // 没有文件扩展名的任何路由（例如 /devices）
        res.sendFile(path.join(contentBase, "index.html"));
      } else {
        next();
      }
    });
  },
};

webpackDevServer.addDevServerEntrypoints(devConfig, options);
const compiler = webpack(devConfig);
const server = new webpackDevServer(compiler, options);

server.listen(options.port, options.host, () => {
  console.log(`dev server listening on port ${options.port}`);
});
