const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const { VantResolver } = require('unplugin-vue-components/resolvers');
const ComponentsPlugin = require('unplugin-vue-components/webpack');


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
          to: `${path.resolve("dist")}/manifest.json`
        }
      ]
    : [
        {
          from: path.resolve("src/manifest.development.json"),
          to: `${path.resolve("dist")}/manifest.json`
        }
      ];
plugins.push({
    from: path.resolve("src/background.js"),
    to: `${path.resolve("dist")}/background.js`
})

module.exports = {
  pages: pagesObj,
  configureWebpack: {
    plugins: [
        CopyWebpackPlugin(plugins),
        ComponentsPlugin({
            resolvers: [VantResolver()],
        }),
    ],
    devtool: 'cheap-module-source-map'
  }
};
