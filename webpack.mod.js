const webpack = require('webpack');
const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

const LIB_PATH = path.resolve(__dirname, 'src/index.ts');
const BUILD_PATH = path.resolve(__dirname, 'dist');

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

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: '/node_modules/',
      },
    ],
  },

  plugins: [
    new ESLintPlugin({
      extensions: ['ts'],
    }),
    new webpack.BannerPlugin(
      `wsopcua.js ${require('./package.json').version} - Copyright © 2017-2022 Michael Derfler`
    ),
  ],
};
