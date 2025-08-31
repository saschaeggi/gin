const path = require('path');
const isDev = (process.env.NODE_ENV !== 'production');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const autoprefixer = require('autoprefixer');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const postcssRTLCSS = require('postcss-rtlcss');
const postcssRtlLogicalProperties = require('postcss-rtl-logical-properties');

module.exports = {
  entry: {
    // ################################################
    // Javascript
    // ################################################
    'accent': ['./js/accent.js'],
    'description_toggle': ['./js/description_toggle.js'],
    'dropbutton': ['./js/dropbutton.js'],
    'more_actions': ['./js/more_actions.js'],
    'init': ['./js/init.js'],
    'messages': ['./js/messages.js'],
    'settings': ['./js/settings.js'],
    'sidebar': ['./js/sidebar.js'],
    'sticky': ['./js/sticky.js'],
    'navigation': ['./js/navigation.js'],
    'escape_admin': ['./js/escape_admin.js'],
    'tableheader': ['./js/tableheader.js'],
    // ################################################
    // CSS
    // ################################################
    // Base
    'base/gin': ['./styles/gin.scss'],
    // Components
    'components/ajax': ['./styles/components/ajax.scss'],
    'components/autocomplete': ['./styles/components/autocomplete.scss'],
    'components/breadcrumb': ['./styles/components/breadcrumb.scss'],
    'components/ckeditor5': ['./styles/components/ckeditor5.scss'],
    'components/contextual_links': ['./styles/components/contextual_links.scss'],
    'components/description_toggle': ['./styles/components/description_toggle.scss'],
    'components/dialog': ['./styles/components/dialog.scss'],
    'components/more_actions': ['./styles/components/more_actions.scss'],
    'components/edit_form': ['./styles/components/edit_form.scss'],
    'components/maintenance_page': ['./styles/components/maintenance_page.scss'],
    'components/media_library': ['./styles/components/media_library.scss'],
    'components/node_preview': ['./styles/components/node_preview.scss'],
    'components/revisions': ['./styles/components/revisions.scss'],
    'components/settings_tray': ['./styles/components/settings_tray.scss'],
    'components/settings_tray_edit': ['./styles/components/settings_tray_edit.scss'],
    'components/settings': ['./styles/components/settings.scss'],
    'components/sidebar': ['./styles/components/sidebar.scss'],
    'components/status': ['./styles/components/status.scss'],
    'components/tableselect': ['./styles/components/tableselect.scss'],
    'components/tabs': ['./styles/components/tabs.scss'],
    'components/toolbar': ['./styles/components/toolbar.scss'],
    'components/tooltip': ['./styles/components/tooltip.scss'],
    // Layout
    'layout/top_bar': ['./styles/layout/top_bar.scss'],
    'layout/navigation': ['./styles/layout/navigation.scss'],
    'layout/toolbar': ['./styles/layout/toolbar.scss'],
    // Theme
    'theme/accent': ['./styles/theme/accent.scss'],
    'theme/dialog': ['./styles/theme/dialog.scss'],
    'theme/font': ['./styles/theme/font.scss'],
    'theme/variables': ['./styles/theme/variables.scss'],
  },
  output: {
    filename: 'js/[name].js',
    chunkFilename: 'js/async/[name].chunk.js',
    path: path.resolve(__dirname, 'dist'),
    pathinfo: true,
    publicPath: '../../',
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        exclude: /sprite\.svg$/,
        type: 'javascript/auto',
        use: [{
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]', //?[contenthash]
              publicPath: (url, resourcePath, context) => {
                const relativePath = path.relative(context, resourcePath);

                // Settings
                if (resourcePath.includes('media/settings')) {
                  return `../../${relativePath}`;
                }

                return `../${relativePath}`;
              },
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
              sourceMap: isDev,
              postcssOptions: {
                plugins: [
                  autoprefixer(),
                  postcssRtlLogicalProperties(),
                  postcssRTLCSS(),
                  ['postcss-perfectionist', {
                    format: 'expanded',
                    indentSize: 2,
                    trimLeadingZero: true,
                    zeroLengthNoUnit: false,
                    maxAtRuleLength: false,
                    maxSelectorLength: false,
                    maxValueLength: false,
                  }]
                ],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDev,
              // Global SCSS imports:
              additionalData: `
                @use "sass:color";
                @use "sass:math";
                @import "styles/helpers/_mq.scss";
                @import "styles/helpers/_vars.scss";
                @import "styles/helpers/_tools.scss";
              `,
            },
          },
        ],
      },
      {
        test: /\.(woff(2))(\?v=\d+\.\d+\.\d+)?$/,
        type: 'javascript/auto',
        use: [{
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]?[hash]',
            publicPath: (url, resourcePath, context) => {
              const relativePath = path.relative(context, resourcePath);

              // Settings
              if (resourcePath.includes('media/font')) {
                return `../../${relativePath}`;
              }

              return `../${relativePath}`;
            },
          }
        }],
      },
    ],
  },
  resolve: {
    alias: {
      media: path.join(__dirname, 'media'),
      settings: path.join(__dirname, 'media/settings'),
      font: path.join(__dirname, 'media/font'),
    },
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
          plugins: [
            {
              name: 'removeAttrs',
              params: {
                attrs: '(use|symbol|svg):fill'
              }
            }
          ],
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
        // Fragment now works with Firefox 84+ and 91esr+
        format: 'fragment',
      }
    }),
  ],
  watchOptions: {
    aggregateTimeout: 300,
    ignored: ['**/*.woff', '**/*.json', '**/*.woff2', '**/*.jpg', '**/*.png', '**/*.svg', 'node_modules'],
  }
};
