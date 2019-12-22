module.exports = {
  mode: "development",
  entry: './src/index.ts',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  output: {
    path: `${__dirname}/dist`,
    filename: "index.js"
  },
  devServer: {
    contentBase: `${__dirname}/dist`,
    open: true
  }
};