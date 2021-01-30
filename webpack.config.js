const path = require('path');

module.exports = {
  watch: true,
  mode:"development",
  entry: {
    main : [
            './src/client/opcua_client'],
    examples : ['./examples/test']
  },
  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
        exclude: /node_modules\/examples/,
      }
    ]
  },
  resolve: {
    modules : [path.resolve(__dirname,"node_modules")],
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    //filename: 'wsopcua.js',
		filename: "[name].entry.js",
    path: path.resolve(__dirname, 'dist'),
  //  library: "mylib"
  },
  optimization: {
      splitChunks: {
        chunks: 'initial',
        
      }
  }
};
