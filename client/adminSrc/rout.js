import React from 'react';
import ReactDOM from 'react-dom';
import Index from './index';
import Login from './component/login';
import {Provider} from 'react-redux'
import { applyMiddleware, createStore } from 'redux';
import thunk from "redux-thunk";
import reducers from './actions/reducers'
// import ComponentList from './component/mit';
// import Componentmit_child from './component/mit_child';
import { HashRouter,Switch,Router, Route ,Redirect,BrowserRouter} from 'react-router-dom'
// import { HashRouter,Route,Router } from 'react-router-dom'
const store = createStore(reducers,applyMiddleware(thunk));
import createHistory from 'history/createBrowserHistory'
const history = createHistory()
const location = history.location
export default class Selfindex extends React.Component{
  render(){
    return (
      <Provider store={store}>
          <HashRouter>
            <Switch>
            <Route  exact  path="/login" component={Login}></Route>
            <Route  path="/index" component={Index}>
            </Route>
            <Redirect to="/login"></Redirect>
          </Switch>
        </HashRouter>
     </Provider>
    )
  }
}

//  store={store}


  ReactDOM.render(
  <Selfindex />,
  document.getElementById('example')
  )



/* <HashRouter  history={browserHistory}>
<div>
<Route path="/" component={Login}></Route>
<Route path="/index" component={Index}></Route>
</div>
</HashRouter> */

/* <Router history={hashHistory}>
<Route  path="/" component={Login}>
  <Route  path="details" component={Componentmit_child}></Route>
</Route>
<Route path="/list/:idd" component={ComponentList}></Route>
</Router> */
