var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  entry: './src/demo/main.js',
  output: {
    path: path.resolve(__dirname, 'demo'),
    filename: 'demo.js',
  },
  resolve: {
    // 设置别名
    alias: {
        '@': resolve('src')// 这样配置后 @ 可以指向 src 目录
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [path.resolve(__dirname, 'src')],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: true,
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: 'babel-loader?babelrc',
            scss: 'style-loader!css-loader!postcss-loader!sass-loader',
          },
        },
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=40000',
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      },
      {
        test: /\.html$/,
        loader: 'vue-html-loader',
      },
    ],
  },
  devtool: '#eval-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'demo'),
    compress: true,
    port: 3000,
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'http://192.168.0.133:7103/',
        secure: false,
        changeOrigin: true,
        pathRewrite (path) {
          return path.replace(/^\/api/, '/api')
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/demo/index.html',
      favicon: 'src/demo/favicon.ico',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `"${process.env.NODE_ENV}"`,
      },
      VERSION: JSON.stringify(require("./package.json").version),
    }),
  ],
}

if (process.env.NODE_ENV === 'production') {
  module.exports.output.publicPath = '/'
  module.exports.devtool = '#source-map'
  // http://vuejs.github.io/vue-loader/workflow/production.html
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
  )
}