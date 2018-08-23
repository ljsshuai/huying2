import React, {Component} from 'react';
const serialize = require('serialize-javascript')
import ReactDOMServer from "react-dom/server";
import asyncBootstrap from "react-async-bootstrapper";
import ejs from "ejs";
const getStoreState = (stores) => {
    return Object.keys(stores).reduce((result, storeName) => {
        result[storeName] = stores[storeName].toJson()
        return result
    }, {})
}
export default async (Bundle, getClientHtml, ctx, next) => {
    const routeContent={};
    const serverBundle = Bundle.default
    const stores = Bundle.createStoreMap();
    const app=serverBundle(stores,routeContent,ctx.url);
    await asyncBootstrap(app).then(data=>{
        if(routeContent.url){
            // ctx.response.status=302;
            // // ctx.response.append('Location', routeContent.url);
            ctx.response.redirect(routeContent.url);
            return
        }
        const newStores=getStoreState(stores);

        // console.log(newStores.appState.seclectClass,ctx.url.split('/')[1]);
        // newStores.appState.seclectClass=ctx.url.split('/')[1]
        var content=ReactDOMServer.renderToString(app);
        const html=ejs.render(getClientHtml,{
            root:content,
            initialState: serialize(newStores),
        })
        ctx.response.body=html
        // getClientHtml.replace('<!--root-->',content )
    })
}
