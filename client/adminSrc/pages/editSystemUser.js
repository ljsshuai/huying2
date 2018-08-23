import React from 'react';
import jsonp from '../jsonp/jsonp';
import {Button, Row, Col} from 'antd';
import SiteEditContent from './siteEditContent.js'
import {
  Tree,
  Modal,
  Table,
  Input,
  Icon,
  Popconfirm,
  Select,
  message,
  Form,
  Tabs,
  DatePicker,
  Radio,
  Switch,
  Divider
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const serverSrc = new jsonp();
const TreeNode = Tree.TreeNode;
const RadioGroup = Radio.Group;
// var otCss = require('../css/footer.css') console.log(FootCss)
class EditSystemUser extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      loginUserbranch_rank: '',
      loginUserbranch_id: '',
      editNodeVal: '',
      editBVisible: false,
      branchOptions: [],
      branch4Options: [],
      addBVisible: false,
      formLayout: 'horizontal',
      checkNick: false,
      OutVisible: false,
      noDelloading: false,
      outloading: false,
      OutexpandedKeys: [],
      selectedRowKeys: [],
      loading: false,
      filterDropdownVisible: false,
      searchText: '',
      filtered: false,
      ModaltreeData: [],
      userId: '',
      inBranchId: '',
      treeData: [],
      visible: false,
      expandedKeys: ['0'],
      defaultExpandAll: false,
      //以下为表格数据 editable:false,
      dataSource: [],
      xuehao: "sdgsd54",
      count: 2,
      editNameDefaultValue: '',
      userRender: '',
      addUserModal: false,
      localToken: localStorage.getItem('token'),
      loading: true,
      submitLoading: false,
      SwwitchLoad: false,
      ModalTitle: '',
      editModal: false,
      setSiteId: null,
      imgVisible: false,
      doneImgUrl: '',
      filterDropdownVisible: false
    };

  }
  componentWillMount() {

    this.getSitedata();

  }
  componentWillReceiveProps() {}

  getSitedata() {
    var _thisState = this
    jsonp({
      url: 'admin/info/q',
      key: 'callback',
      data: {
        token: _thisState.state.localToken,
        pageSize: 10
      },
      callback: function (ret) {
        console.log(ret)
        if (ret.status == '200') {
          for (var i = 1, tableArray = []; i <= ret.data.totalPage; i++) {
            jsonp({
              url: 'admin/info/q',
              key: 'callback',
              data: {
                token: _thisState.state.localToken,
                currentPage: i,
                pageSize: 10
              },
              callback: function (retList) {
                if (ret.status == '200') {
                  for (var l = 0; l < retList.data.list.length; l++) {

                    retList.data.list[l].sex == 1
                      ? retList.data.list[l].sex = '男'
                      : retList.data.list[l].sex = '女'
                    tableArray.push(retList.data.list[l])
                  }
                }
                console.log(tableArray)
                _thisState.setState({dataSource: tableArray, loading: false})
              }
            })
          }
        } else {
          //  message.error(ret.msg);
        }
      }
    }) //jsonp end

  }

  componentDidMount() {}
  onDelete(key) {
    // const dataSource = [...this.state.dataSource];
    var _thisState = this
    jsonp({
      url: 'admin/info/delete',
      key: 'callback',
      data: {
        token: _thisState.state.localToken,
        id: key
      },
      callback: function (ret) {

        if (ret.status == '200') {
          _thisState.getSitedata();
          message
            .info("删除成功", 3, function () {
              
            });
        } else {
          message
            .info(ret.msg, 3, function () {});
        }

      }
    }) //jsonp end

    // this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
    // console.log(this.state.dataSource.filter(item => item.id != key))
  }

  //添加按钮
  addSite() {
    this
      .props
      .form
      .resetFields();
    this.setState({visible: true, ModalTitle: '添加管理员'});
    this.getSelect()
    this
      .props
      .form
      .setFieldsValue({sex: 1})
  }
  getSelect() {
    //获取tree
    var _thisState = this
    jsonp({
      url: 'admin/org/q',
      key: 'callback',
      data: {
        token: _thisState.state.localToken
      },
      callback: function (ret) {

        if (ret.status == '200') {
          _thisState
            .setState({
              ModaltreeData: ret.data
              //   loading:false
            }, function () {});
        } else {
          message.info(ret.msg);
        }
      }
    }) //jsonp end
  }
  handleCancel(e) {
    this.setState({visible: false, editModal: false,editPassVisible:false});
  }
  // nodeSubmit(e) {   e.preventDefault();  this.props.form.validateFields((err,
  // values) => {   var formData = this     .props     .form
  // .getFieldsValue();   if(!err){       console.log(4103435430)   } } ) }
  // 添加机构下拉框
  addTreeNodes(data) {
    var selectTreeData = [];
    function eachSelect(data1) {

      data1.map(value => {
        if (value.children) {
          eachSelect(value.children)
        }
        selectTreeData.push(value)
      })
    }
    eachSelect(data)
    // console.log(selectTreeData) this.setState({
    // ModaltreeData:selectTreeData.join('') })

    return selectTreeData.map(item => {
      return (
        <Option key={item.id} value={item.id}>{item.orgFullName}</Option>
      )
    })
  }

  //添加网站
  nodeSubmit(e) {
    e.preventDefault();
    this
      .props
      .form
      .validateFields((err, values) => {
        var formData = this
          .props
          .form
          .getFieldsValue();
        if (!err) {
          this.setState({submitLoading: true});
          var _thisState = this

          if (this.state.ModalTitle == '添加管理员') {
            jsonp({
              url: 'admin/info/add',
              key: 'callback',
              data: {
                loginName: values.loginName,
                password: values.password,
                orgId: values.orgId,
                mobile: values.mobile,
                adminGroupId: values.adminGroupId,
                firstName: values.firstName,
                lastName: values.lastName,
                loginName: values.loginName,
                sex: values.sex,
                headImg: _thisState.state.doneImgUrl,
                token: _thisState.state.localToken,
                qq: values.qq,
                wechat: values.wechat,
                tel: values.tel
              },
              callback: function (ret) {
                _thisState.setState({submitLoading: false, visible: false});
                if (ret.status == '200') {
                  _thisState
                        .props
                        .form
                        .resetFields();
                      _thisState.getSitedata();
                  message
                    .info("添加成功", 3, function () {
                      
                    });
                } else {
                  message.error(ret.msg);
                }
              }
            }) //jsonp end

          } else {
            jsonp({
              url: 'admin/info/update',
              key: 'callback',
              data: {
                loginName: values.loginName,
                password: values.password,
                orgId: values.orgId,
                mobile: values.mobile,
                adminGroupId: values.adminGroupId,
                firstName: values.firstName,
                lastName: values.lastName,
                loginName: values.loginName,
                sex: values.sex,
                headImg: _thisState.state.doneImgUrl,
                token: _thisState.state.localToken,
                qq: values.qq,
                wechat: values.wechat,
                tel: values.tel,
                id: this.state.setSiteId

              },
              callback: function (ret) {
                _thisState.setState({submitLoading: false, visible: false});
                if (ret.status == '200') {
                  _thisState
                    .props
                    .form
                    .resetFields();
                  _thisState.getSitedata();
                  message.info("修改成功", 3, function () {});
                } else {
                  message.error(ret.msg);
                }
              }
            }) //jsonp end
          }
        }
      })
  }
  //修改网站状态
  setStatus(key) {
    console.log(key)
  }
  SwitchonChange(id, e) {

    var _thisState = this
    jsonp({
      url: 'admin/site/update/status',
      key: 'callback',
      data: {
        token: _thisState.state.localToken,
        siteId: id,
        status: e
          ? 1
          : 0
      },
      callback: function (ret) {
        if (ret.status == '200') {
          _thisState.getSitedata();
          message
            .info("成功修改状态", 3, function () {
           
            });
        } else {
          message
            .info(ret.msg, 5, function () {});
        }
      }
    }) //jsonp end
  }
  editModal(setSiteId, record) {
    console.log(record)
    this.setState({setSiteId: setSiteId});

    this
      .props
      .form
      .resetFields();
    this.setState({visible: true, ModalTitle: '编辑管理员', doneImgUrl: record.headImg, imgVisible: true});
    this.getSelect()
    this
      .props
      .form
      .setFieldsValue({
        adminGroupId: record.adminGroupId,
        sex: record.sex == 1
          ? 1
          : 2,
        loginName: record.loginName,
        password: record.password,
        mobile: record.mobile,
        firstName: record.firstName,
        lastName: record.lastName,
        headImg: record.headImg,
        qq: record.qq,
        orgId: record.orgId,
        wechat: record.wechat,
        tel: record.tel
      })

  }
  //服务器编辑
  editServerModal(ev, isBan) {
    var _thisState = this
    jsonp({
      url: 'admin/update/status',
      key: 'callback',
      data: {
        token: _thisState.state.localToken,
        id: ev,
        status: isBan == 0
          ? 1
          : 0
      },
      callback: function (ret) {
        if (ret.status == '200') {
          _thisState.getSitedata();
          message
            .info("修改成功", 3, function () {
             
            });
        } else {
          message
            .info(ret.msg, 3, function () {});
        }
      }
    }) //jsonp end
  }

  upfileinput(e) {
    console.log(this.refs.upElem.refs.input.files[0])
    if (this.refs.upElem.refs.input.files[0] != undefined) {
      var formData = new FormData();

      // this.refs.upElem.refs.input.files.FileList.forEach((file) => {
      // formData.append('image', file); });
      formData.append("token", this.state.localToken);
      formData.append('image', this.refs.upElem.refs.input.files[0]);
      var opts = {
        method: "POST", //请求方法
        body: formData, //请求体
        credentials: 'include'
      }

      fetch(serverSrc.__proto__.serverSrc + "admin/in/upload", opts).then((response) => {
        //你可以在这个时候将Promise对象转换成json对象:response.json() 转换成json对象后return，给下一步的.then处理
        return response.json()
      }).then((responseText) => {
        if (responseText.status == '200') {
          console.log(responseText)
          this.setState({doneImgUrl: responseText.data, imgVisible: true});
        } else {
          // message.info(responseText.msg)
        }
      }).catch((error) => {
        alert(error)
      })
    }

  }
  UpBtn() {

    this
      .refs
      .upElem
      .refs
      .input
      .click()
  }

  //搜索方法
  onInputChange(e) {
    console.log(e.target.value)
    this.setState({searchText: e.target.value});
    // console.log(thiis.state.searchText)
  }
  onSearch() {
    const {searchText} = this.state;
    console.log(this.state.searchText);
    const reg = new RegExp(searchText, 'gi');
    if (searchText == '') {
      this.getSitedata();
    } else {
      this.setState({
        filterDropdownVisible: false,
        filtered: !!searchText,
        dataSource: this
          .state
          .dataSource
          .map((record) => {
            const match = record
              .loginName
              .match(reg);
            if (!match) {
              return null;
            }
            return record;
          })
          .filter(record => !!record)
      });
    }
  }

  editPassword(ev) {
    this.setState({editPassVisible: true,setSiteId:ev})
  }

  newPassSubmit(e) {

    e.preventDefault();
    this
      .props
      .form
      .validateFields(['newPassword'], (err, values) => {
        var formData = this
          .props
          .form
          .getFieldsValue();
        if (!err) {
          this.setState({submitLoading: true});

          var formData = new FormData();

          // this.refs.upElem.refs.input.files.FileList.forEach((file) => {
          // formData.append('image', file); });
          formData.append("token", this.state.localToken);
          formData.append('newPassword', values.newPassword);
          formData.append('id', this.state.setSiteId);
          var opts = {
            method: "POST", //请求方法
            body: formData, //请求体
            credentials: 'include'
          }
    
          fetch(serverSrc.__proto__.serverSrc + "admin/update/password", opts).then((response) => {
            //你可以在这个时候将Promise对象转换成json对象:response.json() 转换成json对象后return，给下一步的.then处理
            return response.json()
          }).then((responseText) => {
            this.props.form.resetFields();
            this.setState({submitLoading: false,editPassVisible:false});
            if (responseText.status == '200') {

              message.info('修改成功')
            } else {
              // message.info(responseText.msg)
            }
          }).catch((error) => {
            alert(error)
          })
          

        }
      })
  }

  render() {
    const {dataSource, ModaltreeData} = this.state;
    const formItemLayout = {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 16
        }
      }
    };
    const columns = [
      {
        title: '账号',
        dataIndex: 'loginName',
        className: 'column-center',
        width: 200,
        // sorter: (a, b) => {     if (a.user_name === undefined) {         a.user_name
        // = ' '     };     if (b.user_name === undefined) {         b.user_name = ' '
        //   };     return a.user_name.length - b.user_name.length },
        key: 'loginName',
        filterDropdown: (
          <div className="custom-filter-dropdown" ref="DropdownVb">
            <Input
              ref={ele => this.searchInput = ele}
              placeholder="Search name"
              value={this.state.searchText}
              onChange={this
              .onInputChange
              .bind(this)}
              onPressEnter={this
              .onSearch
              .bind(this)}/>
            <Button
              type="primary"
              onClick={this
              .onSearch
              .bind(this)}>Search</Button>
          </div>
        ),
        filterIcon: <Icon
          type="search"
          style={{
          color: this.state.filtered
            ? '#108ee9'
            : '#aaa'
        }}/>,
        filterDropdownVisible: this.state.filterDropdownVisible,
        onFilterDropdownVisibleChange: (visible) => {
          this.setState({filterDropdownVisible: visible})
        }
      }, {
        title: '所属组织',
        className: 'column-center',
        dataIndex: 'orgName',
        key: 'orgName',
        width: 200
      }, {
        title: '角色',
        width: 200,
        className: 'column-center',
        dataIndex: 'isSystem',
        key: 'isSystem',
        render: (text) => {
          if (text == true) {
            return (
              <span>系统管理员</span>
            )
          } else {
            return (
              <span>普通管理员</span>
            )
          }
        }

      }, {
        title: '性别',
        // sorter: (a, b) => {     if (a.permission_date === undefined) {
        // a.permission_date = ' '     };     if (b.permission_date === undefined) {
        //     b.permission_date = ' '     };     return a.permission_date.length -
        // b.permission_date.length },
        className: 'column-center',
        dataIndex: 'sex',
        width: 200,
        key: 'sex'
      }, {
        title: '手机',
        // sorter: (a, b) => {     return a.phone - b.phone },<a href="#">删除</a>
        className: 'column-center',
        dataIndex: 'mobile',
        key: 'mobile',
        width: 200
      }, {
        title: '负责的网站',
        className: 'column-center',
        dataIndex: 'sites',
        key: 'sites',
        width: 200,
        render: (text) => {
          if (text == null) {
            return ''
          } else {
            return text.map(value => {
              return value.domainName + ','
            })

          }
        }
      }, {
        title: '状态',
        // sorter: (a, b) => {     return a.phone - b.phone },<a href="#">删除</a>
        className: 'column-center',
        dataIndex: 'isBan',
        key: 'isBan',
        width: 200,
        render: (text, record) => {
          if (text == 0) {
            return (
              <span>已启用</span>
            )
          } else {
            return (
              <span>冻结中</span>
            )
          }

        }
      }, {
        title: '操作',
        dataIndex: 'operation',
        className: 'column-center',
        fixed: 'right',
        width: 200,
        render: (text, record) => {
          return(
              <div>

                <a
                  href="javascript:;"
                  style={{
                  marginRight: 10,
                  paddingRight: 10,
                  border: 0,
                  borderRight: 1,
                  borderStyle: "solid",
                  borderColor: "#108ee9"
                }}
                  onClick={this
                  .editPassword
                  .bind(this, record.id, record)}>修改密码</a>

                <Popconfirm title="确认删除该管理员?" onConfirm={() => this.onDelete(record.id)}>
                  <a href="#" style={{
                    marginRight: 10
                  }}>删除</a>
                </Popconfirm>

                <a
                  href="javascript:;"
                  style={{
                  paddingLeft: 10,
                  paddingRight: 10,
                  border: 0,
                  borderLeft: 1,
                  borderRight: 1,
                  borderStyle: "solid",
                  borderColor: "#108ee9"
                }}
                  onClick={this
                  .editModal
                  .bind(this, record.id, record)}>编辑</a>

                {record.isBan == 0
                  ? <Popconfirm
                      title="确认删除该用户状态?"
                      onConfirm={() => this.editServerModal(record.id, record.isBan)}>
                      <a
                        href="javascript:;"
                        style={{
                        marginLeft: 10
                      }}>冻结</a>
                    </Popconfirm>
                  : <Popconfirm
                    title="确认删除该用户状态?"
                    onConfirm={() => this.editServerModal(record.id, record.isBan)}>
                    <a
                      href="javascript:;"
                      style={{
                      marginLeft: 10
                    }}>开启</a>
                  </Popconfirm>}

              </div>

            )
        }
      }
    ];

    const {getFieldDecorator} = this.props.form;
    const {formLayout} = this.state;
    const buttonItemLayout = {
      wrapperCol: {
        offset: 12,
        span: 1
      }
    };
    // console.log(FootCss)
    return <div>
      <Modal
        onCancel={this
        .handleCancel
        .bind(this)}
        title=''
        visible={this.state.editModal}
        footer={null}>
        <SiteEditContent
          localToken={this.state.localToken}
          siteId={this.state.setSiteId}/>
      </Modal>
      <Modal
        onCancel={this
        .handleCancel
        .bind(this)}
        title={this.state.ModalTitle}
        visible={this.state.visible}
        footer={null}>
        <div>
          <Form
            layout={formLayout}
            onSubmit={this
            .nodeSubmit
            .bind(this)}>
            <FormItem label="账号" {...formItemLayout }>
              {getFieldDecorator('loginName', {
                rules: [
                  {
                    required: true,
                    message: '请输入域名!'
                  }
                ]
              })(<Input placeholder=""/>)}
            </FormItem>

            <FormItem label="角色" {...formItemLayout }>
              {getFieldDecorator('adminGroupId', {
                rules: [
                  {
                    required: true,
                    message: ''
                  }
                ]
              })(
                <RadioGroup size="large">
                  <Radio value={1}>系统管理员</Radio>
                  <Radio value={2}>普通管理员</Radio>
                </RadioGroup>
              )}
            </FormItem>

            <FormItem label="性别" {...formItemLayout }>
              {getFieldDecorator('sex', {
                rules: [
                  {
                    required: false,
                    message: ''
                  }
                ]
              })(

                <RadioGroup size="large">
                  <Radio value={1}>男</Radio>
                  <Radio value={2}>女</Radio>

                </RadioGroup>
              )}

            </FormItem>
            <FormItem label="姓" {...formItemLayout }>
              {getFieldDecorator('firstName', {
                rules: [
                  {
                    required: false,
                    message: ''
                  }
                ]
              })(<Input placeholder=""/>)}

            </FormItem>
            <FormItem label="名" {...formItemLayout }>
              {getFieldDecorator('lastName', {
                rules: [
                  {
                    required: false,
                    message: ''
                  }
                ]
              })(<Input placeholder=""/>)}

            </FormItem>

            <FormItem label="所属机构" {...formItemLayout }>
              {getFieldDecorator('orgId', {
                rules: [
                  {
                    required: true,
                    message: '请选择上级机构!'
                  }
                ]
              })(
                <Select style={{
                  width: '100%'
                }}>
                  {this.addTreeNodes(this.state.ModaltreeData)}
                </Select>

              )}

            </FormItem>
            <FormItem label="头像" {...formItemLayout }>
              {getFieldDecorator('headImg', {
                rules: [
                  {
                    required: false,
                    message: ''
                  }
                ]
              })(
                <div>
                  <Input
                    style={{
                    display: 'none'
                  }}
                    ref="upElem"
                    onChange={this
                    .upfileinput
                    .bind(this)}
                    type="file"
                    placeholder=""/>
                  <b
                    className="ant-btn"
                    onClick={this
                    .UpBtn
                    .bind(this)}
                    style={{
                    lineHeight: 2.15
                  }}>
                    上传</b>
                  <img
                    style={{
                    marginLeft: 20,
                    height: 32,
                    verticalAlign: 'top',
                    display: this.state.imgVisible
                      ? 'inline-block'
                      : 'none'
                  }}
                    src={serverSrc.__proto__.serverSrc + this.state.doneImgUrl}></img>
                </div>
              )}

            </FormItem>

            <FormItem label="手机" {...formItemLayout }>
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    required: false,
                    message: ''
                  }
                ]
              })(<Input placeholder=""/>)}

            </FormItem>
            <FormItem label="Qq" {...formItemLayout }>
              {getFieldDecorator('qq', {
                rules: [
                  {
                    required: false,
                    message: ''
                  }
                ]
              })(<Input placeholder=""/>)}

            </FormItem>
            <FormItem label="微信" {...formItemLayout }>
              {getFieldDecorator('wechat', {
                rules: [
                  {
                    required: false,
                    message: ''
                  }
                ]
              })(<Input placeholder=""/>)}

            </FormItem>
            <FormItem label="固定电话" {...formItemLayout }>
              {getFieldDecorator('tel', {
                rules: [
                  {
                    required: false,
                    message: ''
                  }
                ]
              })(<Input placeholder=""/>)}

            </FormItem>

            <FormItem {...buttonItemLayout }>
              <Button type="primary" loading={this.state.submitLoading} htmlType="submit">
                提交
              </Button>
            </FormItem>
          </Form>
        </div>
      </Modal>
      <Button
        style={{
        marginBottom: 10
      }}
        type="primary"
        onClick={this
        .addSite
        .bind(this)}>
        添加
      </Button>

      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        size="middle"
        loading={this.state.loading}
        scroll={{
        x: 1400
      }}
        rowKey="id"/>

      <Modal
        onCancel={this
        .handleCancel
        .bind(this)}
        title='修改密码'
        visible={this.state.editPassVisible}
        footer={null}>
        <div>
          <Form
            layout={formLayout}
            onSubmit={this
            .newPassSubmit
            .bind(this)}>
            <FormItem label="新密码" {...formItemLayout }>
              {getFieldDecorator('newPassword', {
                rules: [
                  {
                    required: true,
                    pattern: /^[0-9a-zA-Z].{5,20}$/,
                    message: '请输入新密码,最少为6位,且只能为数字和数字!',
                    len:8
                  }
                ]
              })(<Input placeholder=""/>)}
            </FormItem>
            <FormItem {...buttonItemLayout }>
              <Button type="primary" loading={this.state.submitLoading} htmlType="submit">
                提交
              </Button>
            </FormItem>
          </Form>
        </div>
      </Modal>
    </div>
  }
}

EditSystemUser = Form.create({})(EditSystemUser);
export default EditSystemUser