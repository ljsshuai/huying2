import React, {Component} from 'react';
const path = require('path');
const NativeModule = require('module');
const vm = require('vm');
const fs = require('fs');
const serialize = require('serialize-javascript')
const axios = require('axios')  //服务端渲染请求DIST目录的index文件
const webpack = require('webpack')  //服务端渲染读取webpack配置以文件
const MemoryFs = require('memory-fs') // 读写内存的FS 模块，API参照NODE  FS模块
import ReactDOMServer from "react-dom/server";
import asyncBootstrap from "react-async-bootstrapper";
import ejs from "ejs";
import serverRender from '../util/server-render';
const getModuleFromString = (bundle, filename) => {
    const m = {exports: {}};
    const wrapper = NativeModule.wrap(bundle);
    const script = new vm.Script(wrapper, {
        filename: filename,
        displayErrors: true,
    })
    const result = script.runInThisContext();
    result.call(m.exports, m.exports, require, m);
    return m
};
const serverConfig = require('../../../build/webpack.server.config');
const getTemplate = (mfsData) => {
    return new Promise((resolve, reject) => {
        axios.get('http://127.0.0.1:9000/public/server.ejs')
            .then(res => {
                resolve(res.data)
            })
            .catch(reject)
    })
};
const mfs = new MemoryFs;
const serverCompiler = webpack(serverConfig);
serverCompiler.outputFileSystem = mfs;
let serverBundle = 0;
function serverWatch(){
    return new Promise((resolve, reject) => {
        serverCompiler.watch({}, (err, stats) => {
            if (err) throw err;
            // stats = stats.toJson();
            // stats.errors.forEach(err => console.error(err));
            // stats.warnings.forEach(warn => console.warn(warn));
            const bundlePath = path.join(
                serverConfig.output.path,
                serverConfig.output.filename
            );
            const bundle = mfs.readFileSync(bundlePath, 'utf-8');
            const m = getModuleFromString(bundle, 'server-entry.js')
            serverBundle = m.exports
            resolve(true)
        });
    })
}

export default async (ctx,next)=>{
    var getClientHtml=await getTemplate();
    serverBundle===0?await serverWatch():null;
    await serverRender(serverBundle,getClientHtml,ctx,next)
}