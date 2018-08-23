import React from 'react';
import { Route ,Redirect,Switch} from 'react-router-dom'
import { Layout } from 'antd';

import siteEdit from '../pages/siteEdit'
import siteList from '../pages/siteList'
import updatePassword from '../pages/updatePassword'
import productList from '../pages/productList'
import WebsiteInformation from '../pages/WebsiteInformation'
import org from '../pages/org'
import editSystemUser from '../pages/editSystemUser'
import articleList from '../pages/articleList'
import AboutUs from '../pages/AboutUs'

const { Content } = Layout

export default class Contents extends React.Component {
  constructor(...args){
    super(...args);
  }
  render() {

    return (
      <Content className="content">
      <Switch>
          <Route path="/index/siteEdit"  component={siteEdit} />
          <Route path="/index/siteList"  component={siteList} />
          <Route path="/index/updatePassword" component={updatePassword} />
          <Route path="/index/productList" component={productList} />
          <Route path="/index/org" component={org} />
          <Route path="/index/editSystemUser" component={editSystemUser} />
          <Route path="/index/articleList" component={articleList} />
          <Route path="/index/AboutUs" component={AboutUs} />
          <Route path="/index/WebsiteInformation" component={WebsiteInformation} />
        <Redirect to="/index"></Redirect>
          </Switch>
      </Content>
    );
  }
}
