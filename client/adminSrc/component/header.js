import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';


export default class Header extends React.Component{
  constructor(){
    super();
    this.state={
      miniHeader:false
    }
  }

  componentWillMount(){
    //定义你的逻辑即可
    console.log('Header+这是加载前')
  }
  weitchHeader(){
    this.setState({
      miniHeader:!this.state.miniHeader
    })
  }

  componentDidMount(){
    console.log('Header+这是加载后')
  }

  render(){
    const styleComponentHeader={
      header:{
        backgroundColor:'#333333',
        color:"#ffffff !important",
        paddingTop:(this.state.miniHeader)?"3px":"15px",
        paddingBottom:(this.state.miniHeader)?"3px":'15px'
      }

    }
    return <header onClick={this.weitchHeader.bind(this)} className="smallFontSize" style={styleComponentHeader.header}><h1>我是头部组件</h1>
    <ul>
      <li><Link to={'/'}>首页</Link></li>
      <li><Link to={'/details'}>首页详情页面</Link></li>
      <li><Link to={'/list/8888'}>列表页面</Link></li>
    </ul>

    </header>
  }
}
//
// var h1='<h1> sdg6s0454645456</h1>'
// export default h1
