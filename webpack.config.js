const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
require('dotenv').config();

module.exports = env => {
  const isEnvProduction = !!env && env.production;
  console.log('Production: ', isEnvProduction);
  return {
    devtool: 'cheap-module-eval-source-map',
    entry: './src/index.jsx',
    devtool: 'source-map', //eval | source-map
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.(scss|less|css)$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['*', '.js', '.jsx'],
    },
    output: {
      path: __dirname + '/dist',
      publicPath: '/',
      filename: 'brytecam-conference.[hash].js',
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            inject: true,
            template: path.resolve(__dirname, 'public/index.html'),
          },
          isEnvProduction
            ? {
                minify: {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true,
                },
              }
            : undefined
        )
      ),
      new webpack.DefinePlugin({
        'process.env.FIREBASE_API_KEY': JSON.stringify(
          process.env.FIREBASE_API_KEY
        ),
        'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(
          process.env.FIREBASE_AUTH_DOMAIN
        ),
        'process.env.FIREBASE_DATABASE_URL': JSON.stringify(
          process.env.FIREBASE_DATABASE_URL
        ),
        'process.env.FIREBASE_PROJECT_ID': JSON.stringify(
          process.env.FIREBASE_PROJECT_ID
        ),
        'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(
          process.env.FIREBASE_STORAGE_BUCKET
        ),
        'process.env.FIREBASE_MESSAGING_ID': JSON.stringify(
          process.env.FIREBASE_MESSAGING_ID
        ),
        'process.env.FIREBASE_APP_ID': JSON.stringify(
          process.env.FIREBASE_APP_ID
        ),
        'process.env.FIREBASE_MEASUREMENT_ID': JSON.stringify(
          process.env.FIREBASE_MEASUREMENT_ID
        ),
        'process.env.TOKEN_ENDPOINT': JSON.stringify(
          process.env.TOKEN_ENDPOINT
        ),
        'process.env.INTERNAL': process.env.INTERNAL,
        'process.env.CREATE_ROOM_ENDPOINT': JSON.stringify(
          process.env.CREATE_ROOM_ENDPOINT
        )
      }),
    ],
    devServer: {
      hot: true,
    },
  };
};
