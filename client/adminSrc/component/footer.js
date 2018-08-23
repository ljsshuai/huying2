import React from 'react';
// var otCss = require('../css/footer.css')
import FootCss from '../css/footer.css';
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
    return  <footer className={FootCss.minifooter}><h1>@小易课堂</h1></footer>
  }
}
