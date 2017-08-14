module.exports = {
  entry: './src/main.jsx',
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist/',
    filename: 'browser.js'
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
