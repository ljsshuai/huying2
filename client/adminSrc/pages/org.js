import React from 'react';
import jsonp from '../jsonp/jsonp';
import {Button, Row, Col} from 'antd';
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
    Radio
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const TreeNode=Tree.TreeNode;
const RadioGroup=Radio.Group;
// var otCss = require('../css/footer.css')


class Org extends React.Component{
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
        filterDropdownVisible:false,
        searchText: '',
        filtered: false,
        ModaltreeData: [],
        addTreeSelect:[],
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
        localToken:localStorage.getItem('token'),
        loading:true,
        onSelectLength:0,
        submitLoading:false,
        ModalTitle:'',
        treeEvent:''
    };
 
  }
  componentWillMount(){
    this.treedata()
  }
  treedata(){
    //获取tree
   //
   //    _thisState.setState({
   //        loading:false
   //    })
   //
   //
   //  var _thisState=this
   //
   //     jsonp({
   //   url: 'admin/org/q',
   //   key: 'callback',
   //   data: { token:_thisState.state.localToken },
   //   callback: function(ret) {
   //     console.log(ret,66666)
   //     if(ret.status=='200'){
   //      _thisState.setState({
   //        ModaltreeData:ret.data,
   //
   //      })
   //      _thisState.setState({
   //        loading:false
   //      })
   //     }else{
   //       message.error(ret.msg);
   //     }
   //   }
   // })//jsonp end
  }
  componentWillReceiveProps(){
   
  }
  componentDidMount(){
 
  }
  onDelete(key) {
  
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  }

  //添加按钮
  addSite(){
    this.setState({visible: true,ModalTitle:'添加机构'});
    this.props.form.resetFields();
  }
  //树形删除机构
  delNode(){
    //取消按钮
  }
  delSite(){
    var _thisState=this
    jsonp({
      url: 'admin/org/delete',
      key: 'callback',
      data: { token:_thisState.state.localToken,id:this.state.onSelectLength[0] },
      callback: function(ret) {
        _thisState.treedata()
          if(ret.status=='200'){
            message.info("删除成功",3,function(){
            });
           }else{
             message.error(ret.msg);
           }


      }
    })//jsonp end
  }
  //通过机构ID查询 网站列表

  searchSite(id){
    var _thisState=this
       jsonp({
     url: 'admin/site/q',
     key: 'callback',
     data: { token:_thisState.state.localToken,orgId:id },
     callback: function(ret) {
       if(ret.status=='200'){
         console.log(ret,11111)
        _thisState.setState({
          dataSource:ret.data,
          loading:false
        })
       }else{
         message.error(ret.msg);
       }
     }
   })//jsonp end
  }
  handleCancel(e) {
    this.setState({visible: false});
  }


  //添加机构
  nodeSubmit(e) {
    e.preventDefault();
   this.props.form.validateFields((err, values) => {
    var formData = this
      .props
      .form
      .getFieldsValue();
    if(!err){
      this.setState({submitLoading:true});
      var _thisState=this
      if(this.state.ModalTitle=='添加机构'){
        jsonp({
          url: 'admin/org/add',
          key: 'callback',
          data: { 
            token:_thisState.state.localToken,
            orgFullName:values.orgFullName,
            orgShortName:values.orgShortName,
            orgCode:values.orgCode,
            parentId:values.parentId,
            description:values.description,
            status:values.status
          },
          callback: function(ret) {
            if(ret.status=='200'){
              _thisState.props.form.resetFields();
             _thisState.setState({submitLoading:false,visible:false});
             _thisState.treedata()
             message.info("添加成功",3,function(){
                
             });
            }else{
              message.error(ret.msg);
            }
          }
        })//jsonp end
      }else{
        jsonp({
          url: 'admin/org/update',
          key: 'callback',
          data: { 
            token:_thisState.state.localToken,
            orgFullName:values.orgFullName,
            orgShortName:values.orgShortName,
            orgCode:values.orgCode,
            parentId:values.parentId,
            description:values.description,
            status:values.status,
            id:_thisState.state.onSelectLength[0]
          },
          callback: function(ret) {
            _thisState.props.form.resetFields();
            _thisState.setState({submitLoading:false,visible:false});
            _thisState.treedata()
            if(ret.status=='200'){
             message.info("修改成功",3,function(){
              
             });
            }else{
              message.error(ret.msg);
            }
          }
        })//jsonp end
      }
      
    }
  }
  )
  }
  //编辑机构
  editSite(){
    this.setState({visible: true,ModalTitle:'编辑机构'});
    var formValue=this.state.treeEvent
    this.props.form.setFieldsValue({
      orgFullName: formValue.orgFullName,
      orgShortName: formValue.orgShortName,
      orgCode:formValue.orgCode,
      parentId:formValue.parentId,
      status:formValue.status,
      description:formValue.description,
    })
  }


  //树形
  renderTreeNodes(data) {
    return data.map((item) => {
        if (item.children) {
            return (
                <TreeNode title={item.orgFullName} key={item.id} dataRef={item}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return (<TreeNode title={item.orgFullName} key={item.id} dataRef={item}/>)
    });
  }
  //读取机构列表到弹出框下拉框内
  
  //添加机构下拉框
  addTreeNodes(data) {
    var selectTreeData=[];
    function eachSelect(data1){
        data1.map(value=>{
              if (value.children) {
                eachSelect(value.children)
              }
                selectTreeData.push(value)
            })
    }
    eachSelect(data)
    return selectTreeData.map(item=>{
      //编辑状态  不输出自身机构
      if(this.state.onSelectLength[0]!=item.id){
          return (<Option key={item.id} value={item.id}>{item.orgFullName}</Option>)
      }
    })
  }
  //树形 操作
  onSelect(ev,event,a,b) {
      console.log(event.selectedNodes[0].props.dataRef)
      this.setState({
        onSelectLength:ev
      })
      if(ev.length>0){
        this.searchSite(ev[0])
        this.setState({
          treeEvent:event.selectedNodes[0].props.dataRef
        })
      }
      // console.log(values)

  }

  render(){
    const {dataSource} = this.state;
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
          width: "15%",
          // sorter: (a, b) => {
          //     if (a.user_name === undefined) {
          //         a.user_name = ' '
          //     };
          //     if (b.user_name === undefined) {
          //         b.user_name = ' '
          //     };
          //     return a.user_name.length - b.user_name.length
          // },
          key: 'domainName'
      }
      , {
          title: '名称',
          className: 'column-center',
          dataIndex: 'serverName',
          key: 'serverName'
      }, {
          title: 'ip',
          className: 'column-center',
          dataIndex: 'ip',
          key: 'ip',
          // sorter: (a, b) => {
          //     return a.user_id - b.user_id
          // },
          // filterDropdown: (
          //     <div className="custom-filter-dropdown" ref="DropdownVb">
          //       <Input
          //         ref={ele => this.searchInput = ele}
          //         placeholder="Search name"
          //         value={this.state.searchText}
          //         onChange={this.onInputChange.bind(this)}
          //         onPressEnter={this.onSearch.bind(this)}
          //       />
          //       <Button type="primary" onClick={this.onSearch.bind(this)}>Search</Button>
          //     </div>
          //   ),
          //   filterIcon: <Icon type="search" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
          //   filterDropdownVisible:this.state.filterDropdownVisible,
          //   onFilterDropdownVisibleChange: (visible) => {
          //     //   console.log(this.refs.DropdownVb.style.display='blcok')
          //     this.setState({

          //         filterDropdownVisible: visible
          //     })
          //     // ,() => this.state.searchInput.focus()
          //   }
      },{
          title: '备注',
          // sorter: (a, b) => {
          //     if (a.permission_date === undefined) {
          //         a.permission_date = ' '
          //     };
          //     if (b.permission_date === undefined) {
          //         b.permission_date = ' '
          //     };
          //     return a.permission_date.length - b.permission_date.length
          // },
          className: 'column-center',
          dataIndex: 'description',
          key: 'description'
      } 
  ];
  const { getFieldDecorator } = this.props.form;
  const {formLayout} = this.state;
  const buttonItemLayout = {
    wrapperCol: {
        offset: 12,
        span: 1
    }
};
  const hasSelected=this.state.onSelectLength>0;
// selectedRowKeys.length > 0;
    // console.log(FootCss)
    return  (
                <div>...</div>
    )
  }
}





//
//
// <Col span={6}>
//     <Button.Group ><Button style={{
//         marginBottom: 10}}
//                            type="primary"
//                            onClick={this
//                                .addSite
//                                .bind(this)}>
//         添加
//     </Button>
//         <Button style={{
//             marginBottom: 10}}
//                 type="primary"
//                 onClick={this
//                     .editSite
//                     .bind(this)}
//                 disabled={!hasSelected}
//         >
//             编辑
//         </Button>
//         <Popconfirm
//             placement="topLeft"
//             title='确定删除此机构?'
//
//             onCancel={this
//                 .delNode
//                 .bind(this)}
//             onConfirm={this
//                 .delSite
//                 .bind(this)}
//             okText="确定"
//             cancelText="取消">
//             <Button  disabled={!hasSelected} type="primary">
//                 删除
//             </Button>
//         </Popconfirm>
//
//
//
//
//     </Button.Group >
//
//     <Tree
//         showLine
//         onSelect={this
//             .onSelect
//             .bind(this)}
//         defaultExpandAll>
//         {this.renderTreeNodes(this.state.ModaltreeData)}
//     </Tree>
// </Col>





Org = Form.create({})(Org);
export default Org