/* eslint-disable no-console */
/* eslint-env node */

const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier'); // https://www.npmjs.com/package/webpack-build-notifier
const ExtractCssPlugin = require('mini-css-extract-plugin');

const srcEntry = 'index2.jsx';

const dirHtml = path.resolve(__dirname, 'html');
const dirSrc = path.resolve(__dirname, 'src');
const dirBuild = path.resolve(__dirname, 'build');
// const dirImg = path.resolve(__dirname, 'img');

// // Common used style variables // XXX 2019.06.03, 12:41 -- Added by Igor
// const stylesConfig = require('./styles.config.js')

// // Less-specific variables (in form `@{name}`) // XXX 2019.06.03, 12:41 -- Added by Igor
// const lessConfig = Object.entries(stylesConfig)
//   .reduce((data, [key, val]) => Object.assign({ [`@${key}`]: val }, data), {})

module.exports = (env, argv) => {

  const { mode, watch } = argv;

  console.log('Build', [
    mode,
    watch && 'watch',
  ].filter(x => x).join(', '));

  return {

    entry: path.join(dirSrc, srcEntry),

    mode,
    watch: watch || false,

    performance: {
      hints: false,
    },

    plugins: [

      !watch && new CleanWebpackPlugin(), // XXX 2019.06.03, 12:41 -- Added by Igor

      new CopyPlugin([
        // (mode !== 'production') && { from: 'debug-data', to: './debug-data/' }, // Dev-server-only data stubs // XXX 2019.06.03, 12:41 -- Added by Igor
        // { from: css, to: dirBuild },
        // { from: dirImg, to: './img/' },
      ].filter(x => x)),

      new HtmlWebpackPlugin({
        inject: true,
        template: path.join(dirHtml, 'index.html'),
        filename: 'index.html',
        cache: true,
      }),

      new webpack.NoEmitOnErrorsPlugin(),

      new WebpackBuildNotifierPlugin({ // XXX 2019.06.03, 12:40 -- Added by Igor
        // title: "My Project Webpack Build",
        // logo: path.resolve("./img/favicon.png"),
        suppressSuccess: true,
      }),

      // Extract styles for production build // XXX 2019.06.03, 12:40 -- Added by Igor
      !watch && new ExtractCssPlugin({
        filename: 'bundle.css',
      }),

      // Pass constants to source code // XXX 2019.06.03, 12:40 -- Added by Igor
      new webpack.DefinePlugin({
        'process.env': {
          DEBUG: JSON.stringify(mode === 'development' || watch),
        },
      }),

    ].filter(x => x),

    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules)/,
          loader: 'babel-loader',
        },
      ],
    },

    optimization: {
      // XXX 2019.06.03, 12:41 -- Minimize properties added by Igor
      minimize: mode === 'production',
      minimizer: [
        new TerserPlugin({}),
        new OptimizeCSSAssetsPlugin({}),
      ],
      splitChunks: mode === 'development'
        ? {
          chunks: 'all',
          minSize: 30000,
          maxSize: 0,
          minChunks: 1,
          maxAsyncRequests: 5,
          maxInitialRequests: 3,
          automaticNameDelimiter: '~',
          name: true,
          cacheGroups: {
            vendors: {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
            },
            default: {
              minChunks: 2,
              priority: -20,
            },
          },
        }
        : {},
    },
    stats: {
      // Nice colored output
      colors: true,
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },

    output: {
        path: dirBuild,
        filename: 'bundle.js',
      },

    devServer: {
      // contentBase: dirBuild,
    },

    // Create Sourcemaps for the bundle
    devtool: mode === 'production' ? 'none' : '#source-map',

  };

};
