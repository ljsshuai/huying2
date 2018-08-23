var path = require("path");

//
// var path = require("path");
// module.exports = {
//   entry: {
//     app: ["./src/index.js"]
//   },
//   module:{
//       loaders:[
//         {
//         test:/\.js$/,
//         loader:'babel-loader',
//         exclude:/node_modules/
//         },
//       ]
//     },
//   output: {
//     path: path.resolve(__dirname, "dist"),
//     publicPath: "/dist/",
//     filename: "index.js"
//   }
// };
module.exports = {
  // devServer: {
  //
  //   historyApiFallback:true
  // },
  entry:{
  	main:["./adminSrc/rout.js"]
  },
  output:{
		  path:__dirname+"/dist",
      publicPath: "/dist/",
		  filename:"index.js",
  },
  module:{
    loaders:[
      {
      test:/\.js$/,
      loader:'babel-loader',
      exclude:/node_modules/
      },
      {
        test:/\.css$/,
        loader:'style-loader!css-loader'
      },
        {
            test: /\.(png|jpg|gif)$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 4096,
                        name: '[hash].[ext]',
                        outputPath: function (fileName) {
                            return 'images/' + fileName    // 后面要拼上这个 fileName 才行
                        }
                    }
                }
            ]
        },
    ]
  }
}
// ?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]
