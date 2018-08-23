var React = require('react')
var ReactDOM = require('react-dom')
import 'antd/dist/antd.css';
import '../css/login.css';
import { Form, Icon, Input, Button, Checkbox ,message} from 'antd';
const FormItem = Form.Item;
import jsonp from '../jsonp/jsonp';
import {connect} from 'react-redux';
const serverSrc = new jsonp();
import { BrowserRouter as Router, Route } from 'react-router-dom'
// import { Router,Route,hashHistory,browserHistory} from 'react-router'
import createHistory from 'history/createHashHistory';
const history = createHistory();
import {loginFn} from '../actions/index.redux'
class Login extends React.Component {
    constructor(...args){
      super(...args);
      this.state={
        loading:false
      }
    }
    componentDidMount(){
      document.getElementsByTagName('title')[0].innerText='登录页'
    }
    handleSubmit(e){
      e.preventDefault();
      var _thisState=this
      this.props.form.validateFields((err, values) => {
          var formData = this
            .props
            .form
            .getFieldsValue();
          if(!err){
            this.setState({loading:true});
              this.props.loginFn(values).then(data=>{
                  message.info(data.msg);
                  if(data.status==='ok'){
                  history.push('/index');
                  }else{
                      this.setState({loading:false});
                  }
              })
              //     .then(data=>{
              //     console.log(data,111)
              // })


//             let formData = new FormData();
// formData.append("loginName",values.loginName);
// formData.append("password",values.password);
//             var opts = {
//                 method:"POST",   //请求方法
//                 body:formData,   //请求体
//                 credentials: 'include'
//             }
//
//             if(values.loginName==='admin'&&values.password==='admin'){
//                 history.push('/index');
//             }else{
//                 message.info("账号或者密码错误！！");
//                 this.setState({loading:false});
//             }
//             console.log(formData)
          //   fetch(serverSrc.__proto__.serverSrc+"admin/in/login",opts)
          //       .then((response) => {
          //   //你可以在这个时候将Promise对象转换成json对象:response.json()
          //   //转换成json对象后return，给下一步的.then处理
          //           return response.json()
          //       })
          //       .then((responseText) => {
          //           console.log(responseText.data)
          //           _thisState.setState({loading:false})
          //           if(responseText.status=='200'){
          //
          //                   localStorage.setItem('token',responseText.data)
          //                   this.props.login(responseText.data)
          //                   history.push('/index');
          //                   // location.href='/'
          //                 }else{
          //                   message.info(responseText.msg);
          //                 }
          //
          //       })
          //       .catch((error) => {
          //         console.log(error)
          //       })
          //
          //
          //
          }

        });
    }
    render() {
      const { getFieldDecorator } = this.props.form;
      const num=this.props.num;
      // console.log(this.props)
      return (
        <div  className="loginform">
            <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
          <FormItem>
            {getFieldDecorator('loginName', {
              rules: [{ required: true, message: '请输入用户名!' }],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="" />
            )}
          </FormItem>
          <FormItem>
            <a className="login-form-forgot" href="">忘记密码</a>
            <Button type="primary" loading={this.state.loading} htmlType="submit" className="login-form-button">
              登录
            </Button>
            
          </FormItem>
        </Form>
        
        </div>
      );
    }
  }


const mapStatetoProps=(state=>{
  return {state}
});
const actionCreators={loginFn}
Login=connect(mapStatetoProps,actionCreators)(Login)

export default Login = Form.create({})(Login);