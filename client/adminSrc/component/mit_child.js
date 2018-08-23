import React from 'react';
export default class Comlistchild extends React.Component{
  render(){
    return <div>
          <h2>这里是嵌套在首页的详情页子页面{this.props.params.idd}</h2>
    </div>
  }
}
