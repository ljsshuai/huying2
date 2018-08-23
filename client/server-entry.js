import React, { Component } from 'react';
import App from './app'
import { StaticRouter } from 'react-router-dom'
import { Provider, useStaticRendering } from 'mobx-react'
import { createStoreMap } from './common/store/state'
// 让mobx在服务端渲染的时候不会重复数据变换
useStaticRendering(true)

export default (stores, routerContext, url) => {
    return (
        <Provider {...stores}>
            <StaticRouter context={routerContext} location={url}>
                <App/>
            </StaticRouter>
        </Provider>
    )
}

export {   createStoreMap  }
