import React from 'react';
// var otCss = require('../css/footer.css')

// console.log(FootCss)
export default class Footer extends React.Component{
  componentWillMount(){
    console.log('footer+准备加载1')
  }
  componentDidMount(){
    console.log('footer+这是加载后')
  }
  render(){
    // console.log(FootCss)
    return  <footer ><h1>我ssssssssssssssssssssssssssssssss是尾巴，放置版权声明等信息！！！</h1></footer>
  }
}
