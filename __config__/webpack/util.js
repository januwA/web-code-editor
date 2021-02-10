const path = require("path");
const fs = require("fs");
const JSON5 = require("json5");

class Util {
  /**
   * 读取 tsconfig.json的配置
   */
  tsconfig() {
    return JSON5.parse(
      fs.readFileSync(path.resolve(__dirname, "../../", "tsconfig.json"), {
        encoding: "utf-8",
      })
    );
  }

  /**
   * 返回项目根目录
   */
  rootPath() {
    return path.resolve(__dirname, "../../");
  }

  /**
   * 返回打包入口文件路径
   */
  entry() {
    return path.resolve(this.rootPath(), "src", "index.ts");
  }

  /**
   * 打包输出目录
   */
  output() {
    const tsConfig = this.tsconfig();
    const out = tsConfig ? tsConfig.compilerOptions.outDir : "dist";
    return path.resolve(this.rootPath(), out);
  }

  /**
   * 返回[HtmlWebpackPlugin]插件的[template]配置路径
   */
  htmlTemplatePath() {
    return path.resolve(this.rootPath(), "index.html");
  }

  /**
   * 解析[tsconfig.json]中的paths配置，并返回一个能在webpack中使用的[alias]
   *
   * input:
   * ```json
   * {
   * 	"compilerOptions": {
   * 		"paths": {
   * 			"~src/*": [
   * 				"./src/*"
   * 			],
   * 			"~assets/*": [
   * 				"./src/assets/*"
   * 			]
   * 		}
   * 	}
   * }
   * ```
   *
   * output:
   * ```
   * {
   *   "~src": "./src",
   *   "~assets": "./src/assets",
   * }
   * ```
   */
  alias() {
    const tsConfig = this.tsconfig();
    const { paths, baseUrl } = tsConfig.compilerOptions;
    const alias = {};
    if (paths) {
      const rootPath = this.rootPath();
      const exp = /\/\*$/;
      for (const aliasPath in paths) {
        const key = aliasPath.replace(exp, "");
        const value = paths[aliasPath][0].replace(exp, "");
        alias[key] = path.resolve(rootPath, baseUrl, value);
      }
    }
    return alias;
  }

  /**
   *
   * @param {*} externals webpack的[externals]配置
   * @param {*} dependencies package.js中的[dependencies]字段
   */
  externals2Cdn(externals, dependencies) {
    const result = [];
    for (const libKey in externals) {
      if (libKey in dependencies) {
        const version = dependencies[libKey].replace(/^\D/, "");
        result.push(externals[libKey].cdn(version));
      }
    }
    return result;
  }
}
const util = new Util();
module.exports = util;
