import React, { Component } from 'react';
import App from './app'
import ReactDom from 'react-dom';
import { AppContainer } from 'react-hot-loader' // eslint-disable-line
import {Provider } from 'mobx-react'
import AppState from './common/store/app.state'
// ReactDom.hydrate(<App/>,document.getElementById('root'));
import { BrowserRouter } from 'react-router-dom'
const root =document.getElementById('root')
const store=window.__INITIAL__STATE__||{};
const render=(Component)=>{
    ReactDom.hydrate(
        <AppContainer>
            <Provider appState={new AppState(store.appState)}>
                <BrowserRouter>
                  <Component/>
                </BrowserRouter>
            </Provider>
        </AppContainer>,root
    )
}
render(App)
if(module.hot){
    module.hot.accept('./app',()=>{
        const NextApp=require('./App').default
        // ReactDom.hydrate(<NextApp/>,document.getElementById('root'));
        render(NextApp)
    })
}
