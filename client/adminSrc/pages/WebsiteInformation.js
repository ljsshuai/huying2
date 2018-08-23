var React = require('react')
var ReactDOM = require('react-dom')
import 'antd/dist/antd.css';
import '../css/login.css';
import { Form, Icon, Input, Button, Checkbox ,message} from 'antd';
const FormItem = Form.Item;
import jsonp from '../jsonp/jsonp';
import {connect} from 'react-redux';
import createHistory from 'history/createHashHistory';
import fetch from '../component/fetch';
const history = createHistory();
const {TextArea} = Input;
class WebsiteInformation extends React.Component {
    constructor(...args){
    super(...args);
    this.state={
        loading:false,
        _id:'',
        localToken:localStorage.getItem('token'),
    }
}

    componentDidMount() {
        fetch('WebsiteInformation',{type:'query'}).then(data => {
            console.log(data)
            this.props.form.setFieldsValue({
                title: data.data[0].title,
                shortDescription: data.data[0].shortDescription,
                keyword: data.data[0].keyword,
            })
            this.setState({
                _id:data.data[0]._id
            })
        })
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
        fetch('WebsiteInformation', Object.assign({
            type: 'edit',
            _id: this.state._id
        }, values)).then(data => {
            message.success(data.msg,3,function(){
                _thisState.setState({submitLoading: false, visible: false,loading:false});
            });
        })




        //
        // let formData = new FormData();
        // // formData.append("loginName",values.loginName);
        // formData.append("newPassword",values.newPassword);
        // formData.append("token",this.state.localToken);
        // console.log(typeof this.state.localToken)
        // var opts = {
        //     method:"POST",   //请求方法
        //     body:formData,
        //     credentials: 'include'  //请求体
        // }
        // fetch(serverSrc.__proto__.serverSrc+"admin/update/password",opts)
        //     .then((res) => {return res.json()
        //     //你可以在这个时候将Promise对象转换成json对象:response.json()
        //     //转换成json对象后return，给下一步的.then处理
        //
        // })
    // .then((responseText) => {
    //         console.log(responseText)
    //     if(responseText.status=='200'){
    //         message.info('成功修改密码，3秒后跳转登录页面重新登录！',3,function(){
    //             history.push('/');
    //
    //
    //         });
    //         // arrayBuffer()
    //         // blob()
    //         // json()
    //         // text()
    //         // formData()
    //         // location.href='/'
    //     }else{
    //         message.info(responseText.msg);
    //     }
    //
    // })
    // .catch((error) => {
    //         console.log(error)
    // })
    //
    //
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
        maxWidth:600,
        paddingTop:0,
        width:500,
        marginLeft:-300
    }
    return (
        <div  className="uppassword" style={uppassword}>
        <Form onSubmit={this.handleSubmit.bind(this)} >
<FormItem label="网站名称" {...formItemLayout}>
    {getFieldDecorator('title', {
        rules: [
            {
                required: true,
                message: '请输入网站名称'
            }
        ]
    })(<Input placeholder=""/>)}
</FormItem>
<FormItem label="网站描述" {...formItemLayout}>
    {getFieldDecorator('shortDescription', {
        rules: [
            {
                required: true,
                message: '请输入网站描述'
            }
        ]
    })(<TextArea
        placeholder="description"
        autosize={{
        minRows: 2,
            maxRows: 6
    }}/>)}
    </FormItem>
    <FormItem label="关键字" {...formItemLayout}>
        {getFieldDecorator('keyword', {
            rules: [
                {
                    required: true,
                    message: '请输入关键字'
                }
            ]
        })(<Input placeholder=""/>)}
    </FormItem>
    <FormItem {...buttonLayout}>
<Button type="primary" loading={this.state.loading} htmlType="submit" className="login-form-button">
        提交
        </Button>
        </FormItem>
        </Form>
        </div>
);
}
}

export default WebsiteInformation = Form.create({})(WebsiteInformation);