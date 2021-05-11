const path = require("path");
const nodeExternals = require("webpack-node-externals");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { DefinePlugin } = require("webpack");
const { StatsWriterPlugin } = require("webpack-stats-plugin");

const contentBase = path.join(__dirname, "build");

const devServer = {
  contentBase,
  before(app, server) {
    app.get("/index.html", (req, res) =>
      Promise.all([
        (({ outputPath, outputFileSystem: fs }) =>
          fs.readFileSync(path.resolve(outputPath, "stats.json")))(
          server.compiler.compilers.find(({ name }) => name == "client")
        ).toString(),
        (({ outputPath, outputFileSystem: fs }) =>
          fs.readFileSync(path.resolve(outputPath, "server.js")))(
          server.compiler.compilers.find(({ name }) => name == "server")
        ).toString(),
      ])
        .then(([stats, server]) =>
          require("require-from-string")(server).default(JSON.parse(stats))(
            req,
            res
          )
        )
        .catch(console.error)
    );
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
    entry: {
      client: [
        require.resolve("./src/assets/favicon.ico"),
        require.resolve("./src/client"),
      ],
    },
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
