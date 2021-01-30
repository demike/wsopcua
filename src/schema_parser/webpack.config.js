const path = require('path');

module.exports = {
  watch: true,
  mode:"development",
  entry: {
    main : [
            './src/index']
  },
  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
      }
    ]
  },
  resolve: {
    modules : [path.resolve(__dirname,"node_modules")],
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    //filename: 'wsopcua.js',
		filename: "wsopcua-schema-gen.js",
    path: path.resolve(__dirname, 'dist'),
  //  library: "mylib"
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
 
  externals: {
      canvas: 'void 0',
  }
  
  
};
