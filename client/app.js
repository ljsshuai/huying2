import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { StaticRouter ,Switch,Route,Redirect,HashRouter} from 'react-router-dom'
// import  reducers  from './common/Reducers/index';
import  roters  from './common/roter';
export default class App extends React.Component{
    render(){
        return (
            <div>
                {roters}
            </div>
        )
    }
}
// <Provider store={store}>
//     <BrowserRouter>
//         {roters}
//     </BrowserRouter>
// </Provider>
// ReactDom.hydrate(<App/>,document.getElementById('root'));