var React = require('react')
var ReactDOM = require('react-dom')
import Comheader from './component/header';
import ComFooter from './component/footer';
import Contents from './component/content';
import {Input,Layout, Menu, Icon} from 'antd';
import {Link,history,Redirect } from 'react-router-dom';
import 'antd/dist/antd.css';
import {allMenu} from './utils/menu';
import {connect} from 'react-redux';
const SubMenu = Menu.SubMenu;
const { Header, Footer, Sider, Content } = Layout;
import jsonp from './jsonp/jsonp';
import {loginout} from './actions/index.redux'


class Index extends React.Component{
  constructor(...args){
    super(...args);//
    this.state={
      username:'parry',
      age:20000,
      collapsed: false,
      openKeys:[],
      allMenuparend:[],
      localToken:null
    }
  }
  toggle(){
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  componentWillMount(){
    //定义你的逻辑即可
    this.setState({
      localToken:localStorage.getItem('token')
    })
    
  }

  componentDidMount(){
    document.getElementsByTagName('title')[0].innerText='组件化网站管理'
    let arraprend=[];
    allMenu.map(value=>{
        arraprend.push(value.url)
    });
    // var LocalStorageVal=localStorage.getItem('token')
    this.setState({
      allMenuparend:arraprend,
    })
    this.render();
  }

  changeUserInfo(){
    this.setState({age:50});

  }
  handleChildVal(ev){
    this.setState({
      age:ev.target.value
    })
  }
  getNavMenuItems(menusData, parentPath = '') {
    if (!menusData) {
      return [];
    }
    return menusData.map((item) => {
      if (!item.name) {
        return null;
      }
      let itemPath;

      if (item.children && item.children.some(child => child.name)) {
        return (      
          <SubMenu key={item.url} title={<span><Icon type={item.icon} /><span>{item.name}</span></span>}>
          {this.getNavMenuItems(item.children)}
          </SubMenu>
        );
      }
      const icon = item.icon && <Icon type={item.icon} />;
      return (
        <Menu.Item key={item.url}>
         <Link to={`/${item.url}`} >
           <Icon type={item.icon} /><span className="nav-text">{item.name}</span>
         </Link>
       </Menu.Item>
      );
    });
  }
  LoginOut(e){
    e.preventDefault()
    console.log(this.props);

    this.props.loginout();
  }
  onOpenChange (openKeys) {
    const lastOpenKey = openKeys[openKeys.length - 1];
    openKeys.find(function(key){
    })
    if (this.state.allMenuparend.indexOf(lastOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: lastOpenKey ? [lastOpenKey] : [],
      });
    }
  }
  render(){
    var userName='Parry';
    var bootInput=false
    var html="Imlljslkdgooc\u0020\u0020s56406545";
    const divstyle={
      height:'100%',
        minWidth:"1280px"
    }
    console.log(this.props)
    const app=<div style={divstyle}>
    <Layout  style={divstyle}>
    <Sider
      trigger={null}
      collapsible
      collapsed={this.state.collapsed}
    >
      <div className="logo"  ><img style={{width:"100%"}} src={require('./public/images/logo.png')} alt=""/></div>
      <Menu  theme="dark" mode="inline" openKeys={this.state.openKeys}  onOpenChange={this.onOpenChange.bind(this)}   >
         {this.getNavMenuItems(allMenu)}
      </Menu>
    </Sider>
    <Layout>
      <Header style={{ background: '#fff', padding: 0 }}>
        <Icon
          className="trigger"
          type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle.bind(this)}
        />
        <Menu style={{display:'inline-block',float:'right'}} mode="horizontal" className="logOut" >
       <SubMenu title={<span><Icon type="user" />管理员名称</span>} >
       <Menu.Item key="setPassword"><Link to="/index/updatePassword" >修改密码</Link></Menu.Item>
           <Menu.Item key="logOut"><a onClick={this.LoginOut.bind(this)} >退出</a></Menu.Item>
       </SubMenu>
   </Menu>
      </Header>
      <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' , minWidth
    :'1024px',position:"relative"
    }}>
        <Contents token={this.state.localToken}/>
      </Content>
    </Layout>
  </Layout>
  </div>
  // console.log()
  const isLogin=this.props.state.userLogin.isLogin?app:<Redirect to="/login"></Redirect>;
    return    isLogin
  }
}


const mapStatetoProps=(state=>{
  return {state}
});
const actionCreators={loginout}
Index=connect(mapStatetoProps,actionCreators)(Index)

export default Index
// Index=connect()(Index)
document.getElementById('example').style.background="rgba(0)";

