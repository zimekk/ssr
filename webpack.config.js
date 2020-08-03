// const HtmlWebpackPlugin = require('html-webpack-plugin')
const nodeExternals = require('webpack-node-externals');
const { RawSource } = require('webpack-sources');

const PLUGIN_NAME = 'MyWebpackPlugin';

class MyWebpackPlugin {
	constructor(options = {}) {
		this.options = options;
		this.plugin = this.plugin.bind(this);
	}

	plugin(compilation, callback) {
		const {
			filename = 'index.html',
			publicPath = '',
			template,
			context,
			chunks,
		} = this.options;

const template = () =>

		Promise.resolve(template(options)).then(source => {
			compilation.assets[filename] = new RawSource(source);
			callback();
		});


/*

		const files = getFiles(
			normalizeEntrypoints(compilation.entrypoints),
			chunks
		);

		const options = Object.assign({}, { publicPath }, context, files);

		Promise.resolve((template || defaultTemplate)(options)).then(source => {
			compilation.assets[filename] = new RawSource(source);
			callback();
		});
*/
  }

	apply(compiler) {
		compiler.hooks.emit.tapAsync(PLUGIN_NAME, this.plugin);
	}
}


module.exports = [{
  devServer: {
    // lazy: true,
    // filename: 'render.js',
before(app, server) {

  let resolveRender

  const chunks = {};
  const render = chunks => Promise.all([dfd.render, dfd.chunks]).then(() => render.fn(chunks));

  let addChunks;
  let setRender;
  const dfd = {
    chunks: new Promise(resolve => {
      addChunks = ch => {
        Object.assign(chunks, ch);
        resolve();
      };
    }),
    render: new Promise(resolve => {
      setRender = fn => {
        Object.assign(render, { fn });
        resolve();
      };
    }),
  };

  // const setRender = fn => {
  //   Object.assign(render, { fn });
  //   resolveRender();
  // };
  // const addChunks = ch => {
  //   Object.assign(chunks, ch);
  //   resolveChunks();
  // };

// console.log('---render a')
//   render('a').then(r => console.log('---render.then a', r))
//   console.log('---render b')
//   render('b').then(r => console.log('---render.then b', r))

//   setTimeout(() => {
//     console.log('---setRender t')
// setRender(t => console.log('t', t))
//   }, 200)
// setTimeout(() => {
//   console.log('---render c')
//   render('c').then(r => console.log('---render.then c', r))  
// }, 100)
// console.log('---render d')
// render('d').then(r => console.log('---render.then d', r))

  app.get('/', (req, res) => render(chunks).then(html => res.send(html)))


  server.compiler.compilers
  .forEach(compiler => {
    compiler.hooks.done.tap('srv', (stats) => {
      console.log('compilation')
      // console.log(stats.compilation)
      console.log('entrypoints', stats.compilation.entrypoints.keys())
      // console.log(stats.compilation.chunks)

      // const { client, server } = 
      stats.compilation.chunks.forEach(({ id, files }) => {
        // ...chunks,
        // [compiler.target]: {
        //   ...chunks[compiler.target],
        //   [id]: files
        // }
        console.log('target', compiler.options.target)
        if (compiler.options.target === 'node') {
          const [file] = files;
          console.log('file', file)
          const asset = stats.compilation.assets[file];
          setRender(eval(asset.source()).default);
        } else {
          addChunks({
            [id]: files
          })
        }
      })
    })
  })
}
  },
  // entry: {
  //   client: require.resolve('./src')
  // },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   template: require.resolve('./src/server/render')
    // })
  ]
}, {
  watch: true,
  target: 'node',
  externals: [nodeExternals()],
  // entry: {
  //   server: require.resolve('./src/server')
  // },
  entry: require.resolve('./src/server/render'),
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      }
    ]
  },
  output: {
    filename: 'render.js'
  }
}]