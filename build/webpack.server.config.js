const path = require('path');
const webpack =require ('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //自动生成html文件的插件
const CleanWebpackPlugin = require('clean-webpack-plugin'); //清除之前打包的文件
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');// 压缩混淆JS文件
const ExtractTextPlugin = require('extract-text-webpack-plugin');//指定CSS为单独文件
var ImageminPlugin = require('imagemin-webpack-plugin').default; //图片进行压缩处理
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ManifestPlugin = require('webpack-manifest-plugin'); //生成静态文件JSON 服务端渲染使用
const isDev = process.env.NODE_ENV === 'development'
module.exports = {
    mode: 'none',
    target: 'node',
    entry: {
        app: path.join(__dirname, '../client/server-entry.js'),
    },
    output: {
        filename: './server-entry.js',  // 打包后文件
        path: path.join(__dirname, '../dist/client'),
        publicPath: '/public/',
        libraryTarget:'commonjs2'
    },
    externals: Object.keys(require('../package.json').dependencies),
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [

            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'react','stage-1'],
                        plugins: ['transform-decorators-legacy']
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
    plugins: [
        new ExtractTextPlugin("css/[chunkhash:8].css"),
        new ManifestPlugin({
            fileName: 'ssr-asset-manifest.json', //服务端渲染样式文件
        }),
    // new CleanWebpackPlugin(path.resolve(__dirname, '../dist/server'), {
    //     root: path.resolve(__dirname, '../'),    // 设置root
    //     verbose: true
    // })
        ]
}
