const path = require('path');
const webpack =require ('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //自动生成html文件的插件
const CleanWebpackPlugin = require('clean-webpack-plugin'); //清除之前打包的文件
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');// 压缩混淆JS文件
const ExtractTextPlugin = require('extract-text-webpack-plugin');//指定CSS为单独文件
var ImageminPlugin = require('imagemin-webpack-plugin').default; //图片进行压缩处理
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ManifestPlugin = require('webpack-manifest-plugin'); //生成静态文件JSON 服务端渲染使用
const isDev = process.env.NODE_ENV === 'development';
// var entryJSON=require('../src/config/page.json')
// const extractCSS = new ExtractTextPlugin('../dist/stylesheets/one.css');  // 第二种指定CSS单独文件路径名称方法



// 入口管理
// let entry = {
//     // 引入jQuery，这个是为了配合 webpack.optimize.CommonsChunkPlugin 这个插件使用。
// }
// entryJSON.map(page => {
//     entry[page.url] = path.resolve(__dirname, `../src/page/${page.url}.js`)
// });
// entry['jquery']='jquery';
// 因为多入口，所以要多个HtmlWebpackPlugin，每个只能管一个入口
// let plugins = entryJSON.map(page => {
//     return new HtmlWebpackPlugin({
//         filename: path.resolve(__dirname, `../dist/${page.url}.html`),
//         template: path.resolve(__dirname, `../src/page/${page.url}.html`),
//         chunks: [`jquery`,`${page.url}`], // 实现多入口的核心，决定自己加载哪个js文件，这里的 page.url 指的是 entry 对象的 key 所对应的入口打包出来的js文件
//         // hash: true, // 为静态资源生成hash值   //开启后页面 相同的文件在多个页面不会进行缓存读取本地文件，每次都读取服务器文件。调试可以使用。例如A页面读取服务器加载JQ库，B 页面同样引入了还是去加载服务器文件，影响文件缓存，加大服务负载
//         minify: true,   // 压缩，如果启用这个的话，需要使用html-minifier，不然会直接报错
//         xhtml: true,    // 自闭标签
//         cache:true,  //仅在文件被更改时才发出文件  ,缓存效果
//         chunksSortMode: 'manual'  //JS 标签出入排序 。改为手动按照chunks 值顺序排序
//     })
// })
const config= {
    mode: process.env.NODE_ENV,
    entry: {
        index:path.resolve(__dirname, `../client/index.js`),
        // react:['react','react-dom'],
        // antd:['antd'],
    }, //指定入口文件，程序从这里开始编译,__dirname当前所在目录, ../表示上一级目录, ./同级目录
    output: {
        path: path.resolve(__dirname, '../dist/client'), // 输出的路径
        filename: 'js/[name].[hash:8].js',  // 打包后文件
        chunkFilename: 'js/[name].[hash:8].js',
        publicPath:'/public/'
    },
    module: {
        rules: [
            // {
            //     test: /\.ejs$/, loader: 'ejs-compiled?htmlmin',
            //     exclude: /node_modules/,
            // },
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'react','stage-1'],
                        plugins: ['transform-decorators-legacy','transform-decorators']
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.(css|scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader:'css-loader',
                            options: {
                                minimize: false
                            }
                            // root: path.resolve(__dirname, '../src/static'),   // url里，以 / 开头的路径，去找src/static文件夹
                        }
                        ,'sass-loader'
                    ],
                    publicPath: '../'
                })
                ,
                // exclude: /node_modules/,

                //引入antd的样式不要默认排除，后续还要引入到模块中
                //我之前也看到过出现该问题在最下面：原因应该是您webpack的loaders配置加入了exclude(将antd资源排除其外)和include(未能将antd资源包含其内)。
                //
                // //不应该exclude
                // exclude: /node_modules/,
                // //而且要include，而且要注意一下/node_modules/antd这个路径是否正确
                // include: path.resolve(__dirname, '/node_modules/antd'),
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
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-withimg-loader', //处理 HTML 文件中 IMA标签静态图片
                    }
                ]
            }
        ]
    },

    optimization: {
        minimize:true,//自带压缩
        // 单独提取JS文件引入html
        // runtimeChunk: {
        //     name: "manifest"
        // },
        splitChunks: {
            cacheGroups: {
                // commons: {
                //     test: /[\\/]node_modules[\\/]/,
                // chunks: "initial",
                // minChunks: 1,
                // maxInitialRequests: 5, // The default limit is too small to showcase the effect
                // minSize: 0 // This is example is too small to create commons chunks
                //  }
                //  ,
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    priority: -20,
                    chunks: "all"
                }
            }
        }
        // splitChunks: {
        //     chunks: 'initial', //
        //     minSize: 30000,
        //     //     chunks: "initial", // 必须三选一： "initial" | "all"(默认就是all) | "async"
        //     //     minSize: 0, // 最小尺寸，默认0
        //     minChunks:1, // 最小 chunk ，默认1
        //     maxAsyncRequests: 2, // 最大异步请求数， 默认1
        //     maxInitialRequests: 2, // 最大初始化请求书，默认1
        //     name:true,
        //     cacheGroups: { // 这里开始设置缓存的 chunks
        //         commons: { // 键值可以自定义
        //             chunks: 'initial', //
        //             minChunks:1, // 最小 chunk ，默认1
        //             enforce: true,   // 强制
        //             reuseExistingChunk: true // 可设置是否重用该chunk（查看源码没有发现默认值）
        //         }
        //         //         priority: 0, // 缓存组优先级
        //         //         jquery: { // key 为entry中定义的 入口名称
        //         //             chunks: "initial", // 必须三选一： "initial" | "all" | "async"(默认就是异步)
        //         //             name: "vendor", // 要缓存的 分隔出来的 chunk 名称
        //         //             minSize: 0,
        //         //             minChunks: 1,
        //         //             enforce: true,
        //         //             maxAsyncRequests: 1, // 最大异步请求数， 默认1
        //         //             maxInitialRequests: 1, // 最大初始化请求书，默认1
        //         //             reuseExistingChunk: true // 可设置是否重用该chunk（查看源码没有发现默认值）
        //     }
        // }
    },

    plugins: [
        new webpack.LoaderOptionsPlugin({
            // test: /\.xxx$/, // may apply this only for some modules
            options: {
                'ejs-compiled-loader': {
                    'htmlmin': true, // or enable here
                    'htmlminOptions': {
                        removeComments: true
                    }
                },
            }
        }),
        new ExtractTextPlugin("css/[name].[chunkHash:8].css"),
        new ManifestPlugin({
            fileName: 'ssr-asset-manifest.json', //服务端渲染样式文件
        }),
        new CleanWebpackPlugin(path.resolve(__dirname, '../dist/client'), {
            root: path.resolve(__dirname, '../'),    // 设置root
            verbose: true
        }),
        // new BundleAnalyzerPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV) }),
        new ImageminPlugin({
            test: /\.(jpe?g|png|gif|svg)$/i ,
            // externalImages: {
            //     context: './images/ys', // Important! This tells the plugin where to "base" the paths at
            //     // sources: glob.sync('src/images/**/*.png'),
            //     // destination: 'src/public/images'
            // },
            // test: 'images/ys/*.png',
            disable: process.env.NODE_ENV === 'development', // Disable during development
            pngquant: {
                quality: '90'
            },
        }),

        // new webpack.ProvidePlugin({     //直接从module库中  引入到各个文件中一起压缩导入。当你某个模块有使用
        //     $: 'jquery', //下载Jquery
        // }),
        // 通过ProvidePlugin和 import直接引入区别
        // 1. import $...，引入之后，无论你在代码中是否使用jquery，打包后，都会打进去，这样其实产生大量的冗余js
        // 2. Provideplugin, 只有你在使用到此库，才会打包

        new HtmlWebpackPlugin({
            filename : 'index.html',//输出的html路径
            template : './client/index.html', //html模板路径
            //inject : 'head',  //js文件在head中，若为body则在body中
            inject : true,
            title : 'this is a.html',
            author : 'Kongwc',
            // excludeChunks: ['main'],//打包时不打包main.js文件
            // excludeChunks : ['react','antd'], //打包时只打包main和a的js文件，见entry，注意使用chunks时模板index.html文件里面不允许有script标签，即使注释掉也会报错
            date : new Date()
            /*,
            minify : {
                removeComments : true, //打包后删除参数
                collapseWhitespace : true //打包后删除空格
            }*/
        }),
        new HtmlWebpackPlugin({
            filename : 'server.ejs',//输出的html路径
            template: '!!ejs-compiled-loader!' + path.join('./client/server.ejs'),
        }),
    ]
}

if (isDev) {
    config.entry={
        index: [
        'react-hot-loader/patch',
        path.resolve(__dirname, `../client/index.js`)
        ]
    }
    config.devServer = {
        host: '0.0.0.0',
        compress: true,
        port: 9000,
        contentBase: path.join(__dirname, "../dist/client"),
        hot: true,
        overlay: {
            errors: true
        },
        publicPath: '/public/',
        historyApiFallback: {
            index: '/public/index.html'
        },
        // proxy: {
        //     '/api': 'http://localhost:3333'
        // }
    }
    config.plugins.push(new webpack.HotModuleReplacementPlugin())
}


module.exports =config