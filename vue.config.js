const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const { AntDesignVueResolver } = require('unplugin-vue-components/resolvers');
const ComponentsPlugin = require('unplugin-vue-components/webpack');

const PACKAGE_NAME = "friendly-weather";

// Generate pages object
const pagesObj = {};
const chromeName = ["popup", "options"];

chromeName.forEach(name => {
  pagesObj[name] = {
    entry: `src/${name}/index.js`,
    template: "public/index.html",
    filename: `${name}.html`
  };
});

const plugins =
  process.env.NODE_ENV === "production"
    ? [
        {
          from: path.resolve("src/manifest.production.json"),
          to: `${path.resolve(PACKAGE_NAME)}/manifest.json`
        }
      ]
    : [
        {
          from: path.resolve("src/manifest.development.json"),
          to: `${path.resolve(PACKAGE_NAME)}/manifest.json`
        }
      ];
plugins.push({
    from: path.resolve("src/background.js"),
    to: `${path.resolve(PACKAGE_NAME)}/background.js`
})

module.exports = {
  pages: pagesObj,
  outputDir:PACKAGE_NAME,
  configureWebpack: {
    plugins: [
        CopyWebpackPlugin(plugins),
        ComponentsPlugin({
            resolvers: [AntDesignVueResolver()],
        }),
    ],
    devtool: 'cheap-module-source-map'
  }
};
