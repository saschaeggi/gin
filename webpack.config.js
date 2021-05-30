const path = require('path');
const isDev = (process.env.NODE_ENV !== 'production');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const globImporter = require('node-sass-glob-importer');
const Fiber = require('fibers');
const autoprefixer = require('autoprefixer');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');

module.exports = {
  entry: {
    gin: ['./styles/gin.scss'],
    gin_init: ['./js/gin_init.js'],
    gin_toolbar: ['./js/gin_toolbar.js', './styles/gin_toolbar.scss'],
    gin_horizontal_toolbar: ['./styles/gin_horizontal_toolbar.scss'],
    gin_classic_toolbar: ['./styles/gin_classic_toolbar.scss'],
    gin_accent: ['./js/gin_accent.js','./styles/gin_accent.scss'],
    gin_settings: ['./js/gin_settings.js'],
    gin_editform: ['./js/gin_editform.js'],
    gin_dialog: ['./styles/gin_dialog.scss'],
    gin_ckeditor: ['./js/gin_ckeditor.js', './styles/gin_ckeditor.scss'],
    gin_messages: ['./js/gin_messages.js'],
  },
  output: {
    chunkFilename: 'js/async/[name].chunk.js',
    pathinfo: true,
    filename: 'js/[name].js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '../',
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        exclude: /sprite\.svg$/,
        use: [{
            loader: 'file-loader',
            options: {
              name: 'media/[name].[ext]?[contenthash]',
            },
          },
          {
            loader: 'img-loader',
            options: {
              enabled: !isDev,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              name: '[name].[ext]?[hash]',
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDev,
              importLoaders: 2,
              url: (url) => {
                // Don't handle sprite svg
                if (url.includes('sprite.svg')) {
                  return false;
                }

                return true;
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer()],
              sourceMap: isDev,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDev,
              sassOptions: {
                importer: globImporter(),
                fiber: Fiber,
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: [
      path.join(__dirname, 'node_modules'),
    ],
    extensions: ['.js', '.json'],
  },
  plugins: [
    new RemoveEmptyScriptsPlugin(),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
    new SVGSpritemapPlugin(path.resolve(__dirname, 'media/icons/**/*.svg'), {
      output: {
        filename: 'media/sprite.svg',
        svg: {
          sizes: false
        },
        svgo: {
          plugins: [{
            removeAttrs: {
              attrs: [
                'use:fill',
                'symbol:fill',
                'svg:fill'
              ]
            },
          }],
        },
      },
      sprite: {
        prefix: false,
        gutter: 0,
        generate: {
          title: false,
          symbol: true,
          use: true,
          view: '-view'
        }
      },
      styles: {
        filename: path.resolve(__dirname, 'styles/helpers/_svg-sprite.scss'),
        keepAttributes: true,
        // Fragment does not yet work with Firefox with mask-image.
        // format: 'fragment',
      }
    }),
  ],
  watchOptions: {
    aggregateTimeout: 300,
    ignored: ['**/*.woff', '**/*.json', '**/*.woff2', '**/*.jpg', '**/*.png', '**/*.svg', 'node_modules'],
  }
};
