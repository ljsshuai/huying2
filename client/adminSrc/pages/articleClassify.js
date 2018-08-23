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
  Radio,
  Checkbox,
  Upload
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const TreeNode = Tree.TreeNode;
const RadioGroup = Radio.Group;
const {TextArea} = Input;
const serverSrc = new jsonp();
import createHistory from 'history/createHashHistory';
const history = createHistory();
class ArticleClassify extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {

      formLayout: 'horizontal',

      loading: false,

      ModaltreeData: [],
      addTreeSelect: [],

      treeData: [],
      visible: false,

      dataSource: [],
      productClassifyData: [],
      localToken: localStorage.getItem('token'),
      loading: true,
      onSelectLength: 0,
      submitLoading: false,
      ModalTitle: '',
      treeEvent: '',
      editModal: false,
      //上传状态
      fileList: [],
      doneImgUrl: '',
      uploading: false,
      previewVisible: false, //图片查看缩略图
      previewImage: '', //图片查看地址
      doneList: [],
      tableImagesVisible: false, //表格分类图片弹窗框
      imgVisible: false,
      cateDataSource: [],
      defaultSelectVal:'',
      filtersArr:null
    };

  }
  componentWillMount() {
    this.getSitedata()
  }

  //获取左侧网站列表
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

        if (ret.status == '200') {
          for (var i = 1, tableArray = []; i <= ret.data.totalPage; i++) {
            jsonp({
              url: 'admin/site/q',
              key: 'callback',
              data: {
                token: _thisState.state.localToken,
                currentPage: i,
                pageSize: 10
              },
              callback: function (retList) {
                if (ret.status == '200') {
                  for (var l = 0; l < retList.data.list.length; l++) {
                    tableArray.push(retList.data.list[l])
                  }
                }

                _thisState.setState({ModaltreeData: tableArray, loading: false})
              }
            })
          }
        } else {
          //  message.error(ret.msg);
        }
      }
    }) //jsonp end

  }

  componentWillReceiveProps() {}
  componentDidMount() {

   
  }
  onDelete(key) {

    var _thisState = this
    jsonp({
      url: 'admin/cate/delete',
      key: 'callback',
      data: {
        token: _thisState.state.localToken,
        id: key
      },
      callback: function (ret) {
        _thisState.searchSite(_thisState.state.onSelectLength[0]);
        if (ret.status == '200') {
          message
            .info("删除成功", 3, function () {

           
            });
        } else {
          message
            .info(ret.msg, 3, function () {});
        }

      }
    }) //jsonp end
  }

  //添加按钮
  addCate() {
    this.setState({submitLoading: false, visible: true, ModalTitle: '添加文章分类',imgVisible:false});
    this
      .props
      .form
      .resetFields();

    this
      .props
      .form
      .setFieldsValue({shared: 1, publish: 1, imgVisible: false});


      this.getCateSeclect(this.state.onSelectLength[0])
  }
  //树形删除机构
  delNode() {
    //取消按钮
  }
  delSite() {
    var _thisState = this
    jsonp({
      url: 'admin/org/delete',
      key: 'callback',
      data: {
        token: _thisState.state.localToken,
        id: this.state.onSelectLength[0]
      },
      callback: function (ret) {

        if (ret.status == '200') {
          _thisState.treedata()
          message
            .info("删除成功", 3, function () {
             
            });
        } else {
          message.error(ret.msg);
        }

      }
    }) //jsonp end
  }
  //通过机构ID查询 网站列表
  getCateSeclect(id,evSelectId){
    var formData = new FormData();
    formData.append('siteId',id);
    formData.append("token", this.state.localToken);
    formData.append('type','article');
    var opts = {
      method: "POST", //请求方法
      body: formData, //请求体
      credentials: 'include'
    }
    
    fetch(serverSrc.__proto__.serverSrc + "admin/cate/query", opts).then((response) => {
      //你可以在这个时候将Promise对象转换成json对象:response.json() 转换成json对象后return，给下一步的.then处理
      return response.json()
    }).then((responseText) => {
      if (responseText.status == '200') {
 
        this.setState({cateDataSource: responseText.data});

      } else {
        // message.info(responseText.msg)
      }
    }).catch((error) => {
      alert(error)
    })

  }
  searchSite(id) {

    this.setState({loading: true})
    var _thisState = this
    jsonp({
      url: 'admin/cate/q',
      key: 'callback',
      data: {
        token: _thisState.state.localToken,
        pageSize: 10,
        siteId: id,
        type: 'article'
      },
      callback: function (ret) {

        if (ret.status == '200') {


          // for (var i = 1, tableArray = []; i <= ret.data.list.totalPage; i++) {
            jsonp({
              url: 'admin/cate/q',
              key: 'callback',
              data: {
                token: _thisState.state.localToken,
                currentPage: 1,
                siteId: id,
                pageSize: ret.data.list.totalData,
                type: 'article'
              },
              callback: function (retList) {
                if (ret.status == '200') {
                  var filtersArr = [];
                  var obj={};
  
                  retList.data.list.list
                    .forEach(value => {
  
                      if(!obj[value.cateName]){
                        filtersArr.push({text: value.cateName, value: value.cateName});
                        obj[value.cateName]=true;
                      }
                    })
  
                  
                    
                _thisState.setState({dataSource:retList.data.list.list,filtersArr:filtersArr})
                }

          
              }
            })
          // }
        } else {
          message
            .info(ret.msg, 3, function () {})
          _thisState.setState({dataSource: []})
        }
        _thisState.setState({loading: false})
      }
    }) //jsonp end

  }

  handleCancel(e) {}
  //自动上传方法，原ANT 上传组件跨域存在问题 添加机构
  nodeSubmit(e) {
    e.preventDefault();
    // this.UponRemove();

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
          // const { fileList } = this.state;
          let formData = new FormData();
          // fileList.forEach((file) => {   formData.append('image', file); });
          if (this.state.ModalTitle == '添加文章分类') {

            // this.state.fileList

            formData.append("token", _thisState.state.localToken);
            formData.append("title", values.title);
            formData.append('image', this.state.doneImgUrl);
            formData.append("ordering", values.ordering);
            formData.append("type", "article");
            formData.append("shared", values.shared);
            formData.append("publish", values.publish);
            formData.append("siteId", _thisState.state.onSelectLength[0]);
            formData.append("parentId", values.parentId);
            formData.append("metaTitle", values.metaTitle);
            formData.append("metaKeyword", values.metaKeyword);
            formData.append("metaDescription", values.metaDescription);
            var opts = {
              method: "POST", //请求方法
              body: formData, //请求体
              credentials: 'include'
            }

            fetch(serverSrc.__proto__.serverSrc + "admin/cate/add", opts).then((response) => {
              //你可以在这个时候将Promise对象转换成json对象:response.json() 转换成json对象后return，给下一步的.then处理
              return response.json()
            }).then((responseText) => {

              _thisState.setState({submitLoading: false});
       
              if (responseText.status == '200') {
                
              _thisState.setState({visible: false, fileList: "", doneImgUrl: '', imgVisible: false});
                _thisState
              .props
              .form
              .resetFields();
                   // this.refs.upElem.refs.input.files[0]='';
            _thisState.searchSite(_thisState.state.onSelectLength[0]);
                message.info("添加成功", 3, function () {
                 

                  //  history.push('#');
                });
              } else {
                message.info(responseText.msg)
              }
            }).catch((error) => {
              alert(error)
            })

          } else if (this.state.ModalTitle == '编辑文章分类') {

            formData.append("token", _thisState.state.localToken);
            formData.append("title", values.title);
            formData.append('image', this.state.doneImgUrl.indexOf(serverSrc.__proto__.serverSrc) != -1
              ? serverSrc.__proto__.serverSrc + this.state.doneImgUrl
              : this.state.doneImgUrl);
            formData.append("ordering", values.ordering);
            formData.append("type", "article");
            formData.append("shared", values.shared);
            formData.append("publish", values.publish);
            formData.append("siteId", _thisState.state.onSelectLength[0]);
            formData.append("parentId", values.parentId);
            formData.append("id", _thisState.state.setSiteId);
            formData.append("metaTitle", values.metaTitle);
            formData.append("metaKeyword", values.metaKeyword);
            formData.append("metaDescription", values.metaDescription);
            var opts = {
              method: "POST", //请求方法
              body: formData, //请求体
              credentials: 'include'
            }

            fetch(serverSrc.__proto__.serverSrc +"admin/cate/update", opts).then((response) => {
              //你可以在这个时候将Promise对象转换成json对象:response.json() 转换成json对象后return，给下一步的.then处理
              _thisState.setState({submitLoading: false});
              return response.json()
            }).then((responseText) => {

             
            
            _thisState.searchSite(_thisState.state.onSelectLength[0]);
              if (responseText.status == '200') {
                _thisState
                .props
                .form
                .resetFields();
                _thisState.setState({visible: false});
                message
                  .info("修改成功", 3, function () {
                  });
              } else {

                message.info(responseText.msg)
              }
            }).catch((error) => {
              alert(error+'1111')
            })

          }

        }
      })
  }
  // 编辑机构 editSite(){   this.setState({visible: true,ModalTitle:'编辑机构'});   var
  // formValue=this.state.treeEvent   this.props.form.setFieldsValue({
  // orgFullName: formValue.orgFullName,     orgShortName: formValue.orgShortName,
  //     orgCode:formValue.orgCode,     description:formValue.description,   }) }
  // 树形
  renderTreeNodes(data) {
    return data.map((item) => {
      // if (item.children) {     return (         <TreeNode title={item.orgName}
      // key={item.orgId} dataRef={item}> {this.renderTreeNodes(item.children)}
      //  </TreeNode>     ); }

      return (<TreeNode
        title={item.serverName + '-' + item.domainName}
        key={item.id}
        dataRef={item}/>)
    });
  }
  //读取机构列表到弹出框下拉框内 添加产品分类下拉框
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
        <Option key={item.id} value={item.id}>{item.title}</Option>
      )
    })
  }

  //编辑 分类
  editModal(ev) {

    this.setState({
      submitLoading: false,
      doneImgUrl: ev.image,
      visible: true,
      imgVisible: true,
      setSiteId: ev.id,
      ModalTitle: '编辑文章分类',
      // defaultSelectVal:ev.parentId
    });
    

    // this.getCateSeclect(this.state.onSelectLength[0],ev.parentId)
    // this.setState(({doneList, doneImgUrl}) => { doneImgUrl = ev.image;
    // doneList[0] = {   uid: ev.id,   name: ev.id + '***.png',   url: ev.image,
    // thumbUrl: ev.image }; doneList[0].url = ev.image; doneList[0].thumbUrl =
    // ev.image; return doneList })

    // this.setState({
  
    //   defaultSelectVal:ev.parentId
    // });

    this
      .props
      .form
      .setFieldsValue({
        ordering: ev.ordering,

        parentId:ev.parentId,
        // orgId:ev.orgId,
        metaDescription: ev.metaDescription,
        metaKeyword: ev.metaKeyword,
        metaTitle: ev.metaTitle,
        publish: ev.publish?1:0,
        shared: ev.shared?1:0,
        title: ev.title
      })
  }

  //树形 操作
  onSelect(ev, event, a, b) {
    this.setState({onSelectLength: ev})
    this.getCateSeclect(ev[0])
    if (ev.length > 0) {
      this.searchSite(ev[0])
      this.setState({treeEvent: event.selectedNodes[0].props.dataRef})
    }
    // console.log(values)

  }
  // 分类图片上传方法 handleUpload(e) { console.log(e,444444444444444444) const { fileList
  // } = this.state; const formData = new FormData(); fileList.forEach((file) => {
  // formData.append('files[]', file); }); this.setState({   uploading: true, });
  // // You can use any AJAX library you like reqwest({   url:
  // '//jsonplaceholder.typicode.com/posts/',   method: 'post',   processData:
  // false,   data: formData,   success: () => {     this.setState({ fileList: [],
  //       uploading: false,     });     message.success('upload successfully.');
  //  },   error: () => {     this.setState({       uploading: false,     });
  // message.error('upload failed.');   }, }); } 查看缩略图 弹出框 取消
  handleCancel() {

    this.setState({previewVisible: false, visible: false, tableImagesVisible: false})
    // document.getElementsByClassName('ant-upload-list')[0].innerHTML="";

  }
  //
  showImages(e, iamgeSrc) {
    // console.log(e.target.src)

    this.setState({previewImage: e.target.src, tableImagesVisible: true});
  }
  // //缩略图删除 UponRemove(file) {   this.setState(({fileList}) => {     const index
  // = fileList.indexOf(file);     const newFileList = fileList.slice();
  // newFileList.splice(index, 1);     return {fileList: newFileList};   }); }
  // onChange(info, res) {   if (info.file.status == "done") {     //
  // info.fileList[0].url=serverSrc.__proto__.serverSrc+info.file.response.data
  //  this.setState({doneImgUrl: info.file.response.data});   } }
  // beforeUpload(file) {   this.setState(({fileList}) => ({fileList: file}));
  // // return false; }
  upfileinput(e) {
    // console.log(this.refs.upElem.refs.input.files[0])
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
        this.searchSite(this.state.onSelectLength[0])
      } else {
        this.setState({
          filterDropdownVisible: false,
          filtered: !!searchText,
          dataSource: this
            .state
            .dataSource
            .map((record) => {
              const match = record
                .title
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
    const {dataSource} = this.state;
    const formItemLayout = {
      labelCol: {
        span: 5
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
        title: '名称',
        dataIndex: 'title',
        className: 'column-center',
        width: 180,
        
        key: 'title',
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
        title: '上级分类',
        dataIndex: 'cateName',
        className: 'column-center',
        width: 180,
        key: 'cateName',
        sorter: (a, b) => a
          .cateName
          .localeCompare(b.cateName),
        filters:this.state.filtersArr,
        onFilter: (value, record) => record.cateName.indexOf(value) === 0,
      }, {
        title: '分类图片',
        dataIndex: 'image',
        className: 'column-center',
        width: 150,
        key: 'image',
        render: (text, record) => {
          // console.log(record.image)
          return (<img
            style={{
            width: 20,
            height: 20,
            cursor: 'pointer'
          }}
            onClick={this
            .showImages
            .bind(this)}
            src={serverSrc.__proto__.serverSrc + record.image}/>);
        }
      }, {
        title: '分类标题',
        dataIndex: 'metaTitle',
        className: 'column-center',
        width: 100,
        key: 'metaTitle'
      }, {
        title: '分类关键词',
        className: 'column-center',
        dataIndex: 'metaKeyword',
        width: 100,
        key: 'metaKeyword'
      }, {
        title: '分类描述',
        className: 'column-center',
        dataIndex: 'metaDescription',
        width: 100,
        key: 'metaDescription',
        // sorter: (a, b) => {     return a.user_id - b.user_id }, filterDropdown: (
        // <div className="custom-filter-dropdown" ref="DropdownVb">       <Input
        // ref={ele => this.searchInput = ele}         placeholder="Search name"
        // value={this.state.searchText} onChange={this.onInputChange.bind(this)}
        // onPressEnter={this.onSearch.bind(this)}       />       <Button type="primary"
        // onClick={this.onSearch.bind(this)}>Search</Button>     </div>   ),
        // filterIcon: <Icon type="search" style={{ color: this.state.filtered ?
        // '#108ee9' : '#aaa' }} />,
        // filterDropdownVisible:this.state.filterDropdownVisible,
        // onFilterDropdownVisibleChange: (visible) => {     //
        // console.log(this.refs.DropdownVb.style.display='blcok')     this.setState({
        //     filterDropdownVisible: visible     })     // ,() =>
        // this.state.searchInput.focus()   }
      }, {
        title: '排序',
        // sorter: (a, b) => {     if (a.permission_date === undefined) {
        // a.permission_date = ' '     };     if (b.permission_date === undefined) {
        // b.permission_date = ' '     };     return a.permission_date.length -
        // b.permission_date.length },
        className: 'column-center',
        dataIndex: 'ordering',
        width: 100,
        key: 'ordering',
        sorter: (a, b) => a
          .ordering-b.ordering,
      }, {
        title: '是否显示',
        dataIndex: 'publish',
        className: 'column-center',
        width: 100,
        key: 'publish',
        render: (text, record) => {

          if (text == true || text == 1) {
            return (
              <span>是</span>
            )
          } else {
            return (
              <span>否</span>
            )
          }

        }
      }, {
        title: '全站共享',
        dataIndex: 'shared',
        className: 'column-center',
        width: 100,
        key: 'shared',
        render: (text, record) => {

          if (text == true || text == 1) {
            return (
              <span>是</span>
            )
          } else {
            return (
              <span>否</span>
            )
          }

        }
      }, {
        title: '操作',
        dataIndex: 'operation',
        className: 'column-center',
        width: 100,
        fixed:'right',
        render: (text, record) => {
          if(record.siteId==this.state.onSelectLength[0]){
            return (
              <div>
                <Popconfirm title="确认删除该条文章分类?" onConfirm={() => this.onDelete(record.id)}>
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
                  borderStyle: "solid",
                  borderColor: "#108ee9"
                }}
                  onClick={this
                  .editModal
                  .bind(this, record)}>编辑</a>
              </div>
            )
            

          }
        
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

    const hasSelected = this.state.onSelectLength > 0;
    // selectedRowKeys.length > 0; console.log(FootCss) 上传 页面渲染 const doneList =
    // this.state.doneList; const {uploading} = this.state; const props = {
    // onPreview: (file) => {     this.setState({       previewImage:
    // serverSrc.__proto__.serverSrc + file.response.data,       previewVisible:
    // true     });   } };
    return (

      <Row>
        <Col
          span={5}
          style={{
          height: 545,
          overflow: "auto"
        }}>

          <Tree
            showLine
            onSelect={this
            .onSelect
            .bind(this)}
            defaultExpandAll>
            {this.renderTreeNodes(this.state.ModaltreeData)}
          </Tree>
        </Col>
        <Col span={1}></Col>
        <Col span={18}>
          <Button.Group >
            <Button
              style={{
              marginBottom: 10
            }}
              type="primary"
              disabled={!hasSelected}
              onClick={this
              .addCate
              .bind(this)}>
              添加
            </Button>
          </Button.Group >
          <Modal
            onCancel={this
            .handleCancel
            .bind(this)}
            title={this.state.ModalTitle}
            visible={this.state.visible}
            footer={null}>
            <div ref="bbbbbb">
              <Form
                layout={formLayout}
                onSubmit={this
                .nodeSubmit
                .bind(this)}>
                <FormItem label="名称" {...formItemLayout }>
                  {getFieldDecorator('title', {
                    rules: [
                      {
                        required: true,
                        message: '请输入名称!'
                      }
                    ]
                  })(<Input placeholder=""/>)}
                </FormItem>
                <FormItem label="分类图片" {...formItemLayout }>
                  {getFieldDecorator('image', {
                    rules: [
                      {
                        required: false,
                        message: '!'
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
                <Modal
                  visible={this.state.previewVisible}
                  footer={null}
                  onCancel={this
                  .handleCancel
                  .bind(this)}>
                  <img
                    alt="example"
                    style={{
                    width: '100%'
                  }}
                    src={this.state.previewImage}/>
                </Modal>
                <FormItem label="排序" {...formItemLayout }>
                  {getFieldDecorator('ordering', {
                    rules: [
                      {
                        required: true,
                        message: '请输入排序!'
                      }
                    ]
                  })(<Input placeholder=""/>)}

                </FormItem>

                <FormItem label="上级分类" {...formItemLayout }>
                  {getFieldDecorator('parentId', {
                    rules: [
                      {
                        required: false,
                        message: '请选择上级分类!'
                      }
                    ]
                  })(
                    <Select  style={{
                      width: '100%'
                    }}>
                      {this.addTreeNodes(this.state.cateDataSource)}
                    </Select>

                  )}

                </FormItem>

                <FormItem label="全站共享" {...formItemLayout }>
                  {getFieldDecorator('shared', {
                    rules: [
                      {
                        required: true,
                        message: '请选择是否显示'
                      }
                    ]
                  })(
                    <RadioGroup size="large">
                      <Radio value={1}>是</Radio>
                      <Radio value={0}>否</Radio>
                    </RadioGroup>
                  )}

                </FormItem>

                <FormItem label="是否显示" {...formItemLayout }>
                  {getFieldDecorator('publish', {
                    rules: [
                      {
                        required: true,
                        message: '请选择是否显示'
                      }
                    ]
                  })(
                    <RadioGroup size="large">
                      <Radio value={1}>是</Radio>
                      <Radio value={0}>否</Radio>
                    </RadioGroup>
                  )}

                </FormItem>

                <FormItem label="分类标题" {...formItemLayout }>
                  {getFieldDecorator('metaTitle', {
                    rules: [
                      {
                        required: true,
                        message: ''
                      }
                    ]
                  })(<Input placeholder=""/>)}

                </FormItem>
                <FormItem label="分类关键词" {...formItemLayout }>
                  {getFieldDecorator('metaKeyword', {
                    rules: [
                      {
                        required: true,
                        message: ''
                      }
                    ]
                  })(<TextArea
                    placeholder="分类关键词"
                    autosize={{
                    minRows: 2,
                    maxRows: 6
                  }}/>)}

                </FormItem>

                <FormItem label="分类描述" {...formItemLayout }>
                  {getFieldDecorator('metaDescription', {
                    rules: [
                      {
                        required: true,
                        message: ''
                      }
                    ]
                  })(<TextArea
                    placeholder="分类描述,内容高度自适应"
                    autosize={{
                    minRows: 2,
                    maxRows: 6
                  }}/>)}

                </FormItem>

                <FormItem {...buttonItemLayout }>
                  <Button type="primary" loading={this.state.submitLoading} htmlType="submit">
                    提交
                  </Button>
                </FormItem>
              </Form>
            </div>
          </Modal>

          <Table
            bordered
            dataSource={dataSource}
            columns={columns}
            size="middle"
            rowKey="id"
            scroll={{
            x:1000
          }}
            loading={this.state.loading}/>
          <Modal
            visible={this.state.tableImagesVisible}
            footer={null}
            onCancel={this
            .handleCancel
            .bind(this)}>
            <img
              alt="example"
              style={{
              width: '100%'
            }}
              src={this.state.previewImage}/>
          </Modal>
        </Col>

      </Row>
    )
  }
}

ArticleClassify = Form.create({})(ArticleClassify);
export default ArticleClassify

/* <Upload
defaultFileList={this.state.doneList}
action={serverSrc.__proto__.serverSrc+'admin/in/upload'} data={{'token':this.state.localToken,'image':this.state.fileList}} beforeUpload={this.beforeUpload.bind(this)}  onChange={this.onChange.bind(this)} listType='picture'  onRemove={this.UponRemove.bind(this)}>
<Button>
<Icon type="upload" />上传
</Button>
</Upload>         */

/* <b  className="ant-btn"  style={{lineHeight:2.15}}> 上传</b> */
