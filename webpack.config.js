const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const PATHS = {
  main: './src/main.jsx',
  dist: path.join(__dirname, 'dist')
};

const commonConfig = {
  entry: {
    main: PATHS.main
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Output Management',
      template: 'src/templates/index.template.ejs',
      inject: 'body'
    })
  ],
  output: {
    path: PATHS.dist,
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(jsx|es6)$/,
        exclude: /node_modules|examples/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.es6', '.json']
  }
};

const productionConfig = () => commonConfig;

const developmentConfig = () => {
  const config = {
    devtool: 'source-map',
    devServer: {
      historyApiFallback: true,
      stats: 'errors-only',
      host: process.env.HOST,
      port: process.env.PORT || 3000
    }
  };

  return Object.assign(
    {},
    commonConfig,
    config
  )
};

module.exports = (env) => {
  if (env === 'production') {
    return productionConfig();
  }

  return developmentConfig();
}
