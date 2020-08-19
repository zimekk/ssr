const path = require("path");
const nodeExternals = require("webpack-node-externals");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { DefinePlugin } = require("webpack");
const { StatsWriterPlugin } = require("webpack-stats-plugin");

const contentBase = path.join(__dirname, "build");

const devServer = {
  // lazy: true,
  // filename: 'render.js',
  // publicPath: path.join(__dirname, 'build'),
  // publicPath: '/',
  contentBase,
  // contentBasePublicPath: '',
  before(app, server) {
    const data = {
      server: { server: (req, res) => res.send(404) },
      client: {},
    };

    app.get("/index.html", (req, res) =>
      data.server.server.default(data.stats)(req, res)
    );

    server.compiler.compilers.forEach((compiler) => {
      compiler.hooks.done.tap("srv", (stats) => {
        console.log("compilation");
        // console.log(stats.compilation)
        console.log("entrypoints", stats.compilation.entrypoints.keys());
        // console.log(stats.compilation.chunks)

        Object.assign(
          data,
          stats.compilation.assets["stats.json"] && {
            stats: JSON.parse(stats.compilation.assets["stats.json"].source()),
          }
        );

        stats.compilation.chunks.forEach(({ id, files }) => {
          console.log("target", compiler.options.target, compiler.options.name);
          if (compiler.options.name === "server") {
            const [file] = files;
            const asset = stats.compilation.assets[file];
            Object.assign(data[compiler.options.name], {
              [id]: require("require-from-string")(asset.source()),
            });
          } else {
            Object.assign(data[compiler.options.name], {
              [id]: files,
            });
          }
        });
      });
    });
  },
};

const plugins = [
  new DefinePlugin({
    "process.env": {
      ROOT_ELEMENT: JSON.stringify("root"),
    },
  }),
];

const rules = [
  {
    test: /\.js$/,
    use: "babel-loader",
  },
  {
    test: /\.(eot|svg|ttf|woff|woff2)$/,
    use: {
      loader: "url-loader",
    },
  },
  {
    test: /\.(ico)$/,
    use: {
      loader: "file-loader",
      options: {
        name: "[name].[ext]",
      },
    },
  },
];

module.exports = [
  {
    name: "client",
    devServer,
    entry: { client: require.resolve("./src/client") },
    module: {
      rules,
    },
    output: {
      publicPath: "/",
      path: contentBase,
    },
    plugins: [
      ...plugins,
      new CleanWebpackPlugin(),
      new StatsWriterPlugin({
        filename: "stats.json", // Default
      }),
    ],
  },
  {
    name: "server",
    watch: true,
    target: "node",
    externals: [nodeExternals()],
    entry: { server: require.resolve("./src/server") },
    module: {
      rules,
    },
    output: {
      libraryTarget: "commonjs2",
      path: path.resolve(__dirname, "lib"),
    },
    plugins: [...plugins, new CleanWebpackPlugin()],
  },
];
