import React from 'react';
const defaultProppp={
  age:'这是一个默认的用户名'
};
import Mixin from './mixinlog'
export default class BodyChild extends React.Component{

  render(){
    return <div>
      <div>从父级元素传过来的：{this.props.username}。从父级元素传参过来的:{this.props.age}</div>
      <p>子页面输入:<input type="text" onChange={this.props.handleChildVal}/></p>
    </div>
  }
}

BodyChild.propTypes={
  username:React.PropTypes.number.isRequired
}
BodyChild.defaultProps=defaultProppp;
