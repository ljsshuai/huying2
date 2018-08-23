import {aboutUsFn} from "../actions/index.redux";

var React = require('react')
var ReactDOM = require('react-dom')
import 'antd/dist/antd.css';
import '../css/login.css';
import { Form, Icon, Input, Button, Checkbox ,message} from 'antd';
const FormItem = Form.Item;
import {connect} from 'react-redux';
import fetch from '../component/fetch';
import createHistory from 'history/createHashHistory';
const history = createHistory();

class UpdatePassword extends React.Component {
    constructor(...args){
      super(...args);
      this.state={
        loading:false,
        localToken:localStorage.getItem('token'),
      }
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
              fetch('editPassword',{type:'edit',_id:this.props.state.userLogin.user,password:values.newPassword}).then(data => {
                  message.success(data.msg,3,function(){
                      _thisState.setState({submitLoading: false, visible: false,loading:false});
                  });
              })
          }
        });
    }

    render() {
      const { getFieldDecorator } = this.props.form;
      const num=this.props.num;
      const formItemLayout = {
        labelCol: {
            span: 8
        },
        wrapperCol: {
            xs: {
                span: 16
            },
            sm: {
                span: 16
            }
        }
    };
    const buttonLayout={
        wrapperCol: {
          xs: {
            span: 10,
            offset: 8,
          },
          sm: {
            span: 10,
            offset: 8,
          },
        }
    }
    const uppassword={
      maxWidth:500,
      paddingTop:0,
      width:300,
      marginLeft:-150
    }
    // .login-form {
      
    //   /* width: 300px; */
    //   /* position: absolute; */
    //   /* left: 50%; */
    //   padding-top: 10%;
    //   margin-left: -150px;
  // }



      return (
        <div  className="uppassword" style={uppassword}>
            <Form onSubmit={this.handleSubmit.bind(this)} >
          <FormItem label="新密码"  {...formItemLayout}>
            {getFieldDecorator('newPassword', {
              rules: [{ required: true, message: '请输入密码!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="" />
            )}
          </FormItem>
          <FormItem {...buttonLayout}>
            
       
            <Button type="primary" loading={this.state.loading} htmlType="submit" className="login-form-button">
              修改密码
            </Button>
            
          </FormItem>
        </Form>
        
        </div>
      );
    }
  }
const mapStatetoProps = (state => {
    return {state}
});
const actionCreators = {}
UpdatePassword = connect(mapStatetoProps, actionCreators)(UpdatePassword)
export default UpdatePassword = Form.create({})(UpdatePassword);