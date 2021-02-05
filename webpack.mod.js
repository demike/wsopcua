var webpack = require('webpack');
var path = require('path');

var LIB_PATH = path.resolve(__dirname, 'src/wsopcua/index.ts');
var BUILD_PATH = path.resolve(__dirname, 'dist');

module.exports = {
  entry: {
    wsopcua: LIB_PATH,
  },

  output: {
    libraryTarget: 'umd',
    umdNamedDefine: true,
    path: BUILD_PATH,
    filename: 'index.js',
  },

  // devtool: 'source-map',

  // watchOptions: { poll: true }, // seems to need this for Windows Linux subsystem to watch

  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'tslint-loader',
        enforce: 'pre',
        exclude: [
          path.join(__dirname, 'node_modules'),
          path.join(__dirname, 'examples'),
          path.join(__dirname, '/src/schema_parser/'),
        ],
        options: { emitErrors: false, failOnHint: false },
      },
      {
        test: /\.tsx?$/,
        exclude: [
          path.join(__dirname, 'node_modules'),
          path.join(__dirname, 'examples'),
          path.join(__dirname, '/src/schema_parser/'),
        ],
        loader: 'ts-loader',
      },
    ],
  },

  plugins: [
    new webpack.BannerPlugin(
      `wsopcua.js ${require('./package.json').version} - Copyright © 2017-2021 Michael Derfler`
    ),
  ],
};
