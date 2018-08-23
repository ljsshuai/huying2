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
const TreeNode = Tree.TreeNode;
const RadioGroup = Radio.Group;

import Adminaccess from './Adminaccess'

// var otCss = require('../css/footer.css') console.log(FootCss)
class SiteList extends React.Component {
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
      AdminaccessVisible: false,
      setSiteHr: null, //获取 分配的一整行数据 跳装到分配管理员页面 抓取网址对应
      filtersArr:null  //表格删选显示机构
    };

  }
  componentWillMount() {

    this.getSitedata();

  }
  componentWillReceiveProps() {}

  getSitedata() {
    var _thisState = this
    jsonp({
      url: 'admin/site/q',
      key: 'callback',
      data: {
        token: _thisState.state.localToken,
        pageSize: 10
      },
      callback: function (ret) {
        console.log(ret)
        if (ret.status == '200') {
          // for (var i=1,tableArray=[];i<=ret.data.totalPage;i++){
          jsonp({
            url: 'admin/site/q',
            key: 'callback',
            data: {
              token: _thisState.state.localToken,
              currentPage: 1,
              pageSize: ret.data.totalData
            },
            callback: function (retList) {
              if (ret.status == '200') {
                var filtersArr = [];
                var obj={};

                retList
                  .data
                  .list
                  .forEach(value => {

                    if(!obj[value.orgName]){
                      filtersArr.push({text: value.orgName, value: value.orgName});
                      obj[value.orgName]=true;
                    }
                  })

                  console.log(filtersArr)
                _thisState.setState({dataSource: retList.data.list, loading: false,filtersArr:filtersArr})
              }

            }
          })
          // }
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
      url: 'admin/site/delete',
      key: 'callback',
      data: {
        token: _thisState.state.localToken,
        id: key
      },
      callback: function (ret) {

        if (ret.status == '200') {
          _thisState.getSitedata();
          message.info("删除成功", 3, function () {});
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
    console.log(this.state.ModaltreeData)
    this
      .props
      .form
      .resetFields();
    this.setState({visible: true, ModalTitle: '添加网站服务器'});
    this.getSelect()
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
          message.error(ret.msg);
        }
      }
    }) //jsonp end
  }
  handleCancel(e) {
    this.setState({visible: false, editModal: false, AdminaccessVisible: false});
  }
  // nodeSubmit(e) {   e.preventDefault();  this.props.form.validateFields((err,
  // values) => {   var formData = this     .props     .form .getFieldsValue();
  // if(!err){       console.log(4103435430)   } } ) } 添加机构下拉框
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
        <Option key={item.id}>{item.orgFullName}</Option>
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

          if (this.state.ModalTitle == '添加网站服务器') {
            jsonp({
              url: 'admin/site/add',
              key: 'callback',
              data: {
                token: _thisState.state.localToken,
                domainName: values.domainName,
                serverName: values.serverName,
                ip: values.ip,
                orgId: values.orgId,
                description: values.description
              },
              callback: function (ret) {
                _thisState
                  .props
                  .form
                  .resetFields();
                _thisState.setState({submitLoading: false, visible: false});
                _thisState.getSitedata();
                if (ret.status == '200') {
                  message
                    .info("添加成功", 3, function () {});
                } else {
                  message.error(ret.msg);
                }
              }
            }) //jsonp end

          } else if (this.state.ModalTitle == '网站复制') {
            jsonp({
              url: 'admin/site/copy',
              key: 'callback',
              data: {
                token: _thisState.state.localToken,
                domainName: values.domainName,
                serverName: values.serverName,
                ip: values.ip,
                orgId: values.orgId,
                description: values.description,
                siteId: _thisState.state.setSiteId
              },
              callback: function (ret) {
                if (ret.status == '200') {
                  _thisState
                    .props
                    .form
                    .resetFields();
                  _thisState.setState({submitLoading: false, visible: false});
                  _thisState.getSitedata();
                  message.info("复制成功", 3, function () {});
                } else {
                  message.error(ret.msg);
                }
              }
            }) //jsonp end
          } else {
            jsonp({
              url: 'admin/site/update',
              key: 'callback',
              data: {
                token: _thisState.state.localToken,
                domainName: values.domainName,
                serverName: values.serverName,
                ip: values.ip,
                orgId: values.orgId,
                description: values.description,
                id: _thisState.state.setSiteId
              },
              callback: function (ret) {
                if (ret.status == '200') {
                  _thisState
                    .props
                    .form
                    .resetFields();
                  _thisState.setState({submitLoading: false, visible: false});
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
          message.info("成功修改状态", 3, function () {});
        } else {
          message
            .info(ret.msg, 5, function () {});
        }
      }
    }) //jsonp end
  }
  editModal(setSiteId) {

    this.setState({editModal: true, setSiteId: setSiteId});
  }

  AdminaccessModal(setSiteId, setSiteHr) {
    this.setState({AdminaccessVisible: true, setSiteId: setSiteId, setSiteHr: setSiteHr});
  }

  //服务器编辑
  editServerModal(ev) {
    this.getSelect()
    //   this.setState({     treeEvent:event.selectedNodes[0].props.dataRef   }) var
    // formValue=this.state.treeEvent
    this
      .props
      .form
      .setFieldsValue({
        domainName: ev.domainName, serverName: ev.serverName, ip: ev.ip,
        // orgId:ev.orgId,
        description: ev.description
      })
    this.setState({visible: true, ModalTitle: '编辑网站服务器', setSiteId: ev.id});
  }
  //网站复制
  copySiteBtn(ev) {
    this
      .props
      .form
      .resetFields();
    this.getSelect()
    // this.props.form.setFieldsValue({   domainName:ev.domainName,
    // serverName:ev.serverName,         ip:ev.ip,         // orgId:ev.orgId,
    // description:ev.description, })
    this.setState({visible: true, ModalTitle: '网站复制', setSiteId: ev.id});
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
              .domainName
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
        title: '域名',
        dataIndex: 'domainName',
        className: 'column-center',
        width: 200,

        key: 'domainName',
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
        title: '名称',
        className: 'column-center',
        dataIndex: 'serverName',
        width: 180,
        key: 'serverName'
      }, {
        title: 'ip',
        className: 'column-center',
        dataIndex: 'ip',
        width: 150,
        key: 'ip'
      }, {
        title: '所属机构',
        width: 200,
        className: 'column-center',
        dataIndex: 'orgName',
        key: 'orgName',
        sorter: (a, b) => a
          .orgName
          .localeCompare(b.orgName),
        filters:this.state.filtersArr,
        onFilter: (value, record) => record.orgName.indexOf(value) === 0,
      }, {
        title: '备注',
        width: 280,
        className: 'column-center',
        dataIndex: 'description',
        key: 'description',
        render: (text) => {
          return (
            <div
              style={{
              textOverflow: 'ellipsis',
              display: 'inline-block',
              height: '30.5px',
              overflow: 'hidden',
              padding: '6px 8px',
              width: '280px',
              whiteSpace: 'nowrap'
            }}>
              {text}
            </div>

          )
        }
      }, {
        title: '状态',
        width: 170,
        // sorter: (a, b) => {     return a.phone - b.phone },<a href="#">删除</a>
        className: 'column-center',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => {
          console.log(text)
          if (text == 1) {
            return (<Switch
              checkedChildren="开启"
              onChange={this
              .SwitchonChange
              .bind(this, record.id)}
              unCheckedChildren="关闭"
              defaultChecked/>)
          } else {
            return (<Switch
              checkedChildren="开启"
              onChange={this
              .SwitchonChange
              .bind(this, record.id)}
              unCheckedChildren="关闭"/>)
          }
        }
      }, {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        className: 'column-center',
        width: 350,
        render: (text, record) => {
          return (
            <div>
              <Popconfirm
                title="确认删除该网站信息,删除此条信息将包含此网站内的所有相关信息,请确认是否删除?"
                onConfirm={() => this.onDelete(record.id)}>
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
                .bind(this, record.id)}>网站编辑</a>

              <a
                href="javascript:;"
                style={{
                paddingLeft: 10,
                paddingRight: 10,
                border: 0,
                borderRight: 1,
                borderStyle: "solid",
                borderColor: "#108ee9"
              }}
                onClick={this
                .copySiteBtn
                .bind(this, record)}>网站复制</a>

              <a
                href="javascript:;"
                style={{
                marginLeft: 10
              }}
                onClick={this
                .editServerModal
                .bind(this, record)}>服务器编辑</a>

              <a
                href="javascript:;"
                style={{
                marginLeft: 10,
                paddingLeft: 10,
                border: 0,
                borderLeft: 1,
                borderStyle: "solid",
                borderColor: "#108ee9"
              }}
                onClick={this
                .AdminaccessModal
                .bind(this, record.id, record)}>分配管理员</a>
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

    return <div>
      <Modal
        onCancel={this
        .handleCancel
        .bind(this)}
        width={1000}
        title=''
        visible={this.state.editModal}
        footer={null}>
        <SiteEditContent
          key={Math.random()}
          localToken={this.state.localToken}
          siteId={this.state.setSiteId}/>
      </Modal>

      <Modal
        onCancel={this
        .handleCancel
        .bind(this)}
        title=''
        visible={this.state.AdminaccessVisible}
        footer={null}>
        <Adminaccess
          key={Math.random()}
          setSiteHr={this.state.setSiteHr}
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
            <FormItem label="域名" {...formItemLayout }>
              {getFieldDecorator('domainName', {
                rules: [
                  {
                    required: true,
                    message: '请输入域名!'
                  }
                ]
              })(<Input placeholder=""/>)}
            </FormItem>
            <FormItem label="服务器名称" {...formItemLayout }>
              {getFieldDecorator('serverName', {
                rules: [
                  {
                    required: true,
                    message: '请输入服务器名!'
                  }
                ]
              })(<Input placeholder=""/>)}
            </FormItem>
            <FormItem label="ip" {...formItemLayout }>
              {getFieldDecorator('ip', {
                rules: [
                  {
                    required: true,
                    message: '请输入ip!'
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
            <FormItem label="备注" {...formItemLayout }>
              {getFieldDecorator('description', {
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
        size="small"
        bordered
        dataSource={dataSource}
        columns={columns}
        loading={this.state.loading}
        scroll={{
        x: 1400
      }}
        rowKey="id"/>

    </div>
  }
}

SiteList = Form.create({})(SiteList);
export default SiteList