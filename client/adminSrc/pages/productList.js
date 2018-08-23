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
import Ueditor from './Ueditor';
const {TextArea} = Input;
const serverSrc = new jsonp();
import createHistory from 'history/createHashHistory';
const history = createHistory();
class ProductList extends React.Component {
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
      selectdataSource: null,
      gallerydoneImgUrl: '',
      galleryimgVisible: false,
      resGalleryphont: '',
      productDataSource: [],
      defaultSelectVal: '',
      searchText:'',
      filtersArr:null
    };

  }
  componentWillMount() {
    this.getSitedata()
    // UE.delEditor('contentProduct');
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

    // this.initEditor();
  }
  onDelete(key) {

    var _thisState = this
    jsonp({
      url: 'admin/product/delete',
      key: 'callback',
      data: {
        token: _thisState.state.localToken,
        id: key
      },
      callback: function (ret) {

        if (ret.status == '200') {
          _thisState.searchSite(_thisState.state.onSelectLength[0]);
          message.info("删除成功", 3, function () {});
        } else {
          message
            .info(ret.msg, 3, function () {});
        }

      }
    }) //jsonp end
  }

  //添加按钮
  addCate() {

      
    

    this.setState({submitLoading: false, visible: true, ModalTitle: '添加产品'},function(){
      UE.getEditor('contentProduct').ready(function(){
          UE.getEditor('contentProduct').setContent('请输入内容。。。') 
      })
 
      document.getElementById('image').getElementsByTagName('img')[0].style.display=='inline-block'?document.getElementById('image').getElementsByTagName('img')[0].style.display='none':null;

      console.log( document.getElementById('image').getElementsByTagName('img')[0].style.display)

      if (document.getElementsByClassName('galleryClass').length != 0) {
        for (var i = 0; i <= document.getElementsByClassName('galleryClass').length+1; i++) {
          console.log()
          document
            .getElementsByClassName('galleryClass')[0]
            .parentNode
            .removeChild(document.getElementsByClassName('galleryClass')[0])
        }
      }

    });
    this
      .props
      .form
      .resetFields();
    this
      .props
      .form
      .setFieldsValue({hot: 1, shared: 1, publish: 1, imgVisible: false})

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
          message.info("删除成功", 3, function () {});
        } else {
          message.error(ret.msg);
        }

      }
    }) //jsonp end
  }
  //通过机构ID查询 网站列表

  searchSite(id) {

    this.setState({loading: true})
    var _thisState = this
    jsonp({
      url: 'admin/product/q',
      key: 'callback',
      data: {
        token: _thisState.state.localToken,
        pageSize: 10,
        siteId: id,
        type: 'product'
      },
      callback: function (ret) {

        if (ret.status == '200') {








         
            jsonp({
              url: 'admin/product/q',
              key: 'callback',
              data: {
                token: _thisState.state.localToken,
                currentPage: 1,
                siteId: id,
                pageSize: ret.data.totalData,
                type: 'product'
              },
              callback: function (retList) {
                if (ret.status == '200') {
                  var filtersArr = [];
                  var obj={};
                  retList.data.list
                    .forEach(value => {
                      if(!obj[value.cateName]){
                        filtersArr.push({text: value.cateName, value: value.cateName});
                        obj[value.cateName]=true;
                      }
                    })
                }
                _thisState.setState({dataSource: retList.data.list,filtersArr:filtersArr})
              }
            })
          
        } else {
          message
            .info(ret.msg, 3, function () {})
          _thisState.setState({dataSource: []})
        }
        _thisState.setState({loading: false})
      }
    }) //jsonp end

  }

  //自动上传方法，原ANT 上传组件跨域存在问题 添加机构
  nodeSubmit(e) {
    e.preventDefault();
    // this.UponRemove();
    // console.dir(document.getElementsByClassName('galleryClass')[0].parentNode.rem
    // o veChild(document.getElementsByClassName('galleryClass')[0]))

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
          if (this.state.ModalTitle == '添加产品') {
            formData.append("token", _thisState.state.localToken);
            formData.append("name", values.name);
            formData.append('image', this.state.doneImgUrl);
            formData.append("categoryId", values.categoryId);
            formData.append("type", "product");
            formData.append("shared", values.shared);
            formData.append("publish", values.publish);
            formData.append("siteId", _thisState.state.onSelectLength[0]);
            formData.append("ordering", values.ordering);
            formData.append("hot", values.hot);
            formData.append("description", UE.getEditor('contentProduct').getContent());

            formData.append("price", values.price);
            formData.append("gallery", this.state.gallerydoneImgUrl);
            formData.append("productCode", values.productCode);
            formData.append("shortDescription", values.shortDescription);

            formData.append("metaTitle", values.shortDescription);
            formData.append("metaKeyword", values.shortDescription);
            formData.append("metaDescription", values.shortDescription);

            var opts = {
              method: "POST", //请求方法
              body: formData, //请求体
              credentials: 'include'
            }
            fetch(serverSrc.__proto__.serverSrc + "admin/product/add", opts).then((response) => {
              //你可以在这个时候将Promise对象转换成json对象:response.json() 转换成json对象后return，给下一步的.then处理
              return response.json()
            }).then((responseText) => {
              this.setState({submitLoading: false})
              if (responseText.status == '200') {
                _thisState.searchSite(_thisState.state.onSelectLength[0]);
                _thisState.setState({visible: false, fileList: "", doneImgUrl: '', imgVisible: false});
                message.info("添加成功", 3, function () {
                  _thisState
                    .props
                    .form
                    .resetFields();
                  // this.refs.upElem.refs.input.files[0]='';
                  for (var i = 0; i <= document.getElementsByClassName('galleryClass').length; i++) {
                    document
                      .getElementsByClassName('galleryClass')[0]
                      .parentNode
                      .removeChild(document.getElementsByClassName('galleryClass')[0])
                  }

                  //  history.push('#');
                });
              } else {
                message.info(responseText.msg)
              }

            }).catch((error) => {
              alert(error)
            })

          } else {
            formData.append("token", _thisState.state.localToken);
            formData.append("name", values.name);
            formData.append('image', this.state.doneImgUrl.indexOf(serverSrc.__proto__.serverSrc) != -1
              ? serverSrc.__proto__.serverSrc + this.state.doneImgUrl
              : this.state.doneImgUrl);
            formData.append("categoryId", values.categoryId);
            formData.append("type", "product");
            formData.append("shared", values.shared);
            formData.append("publish", values.publish);
            formData.append("siteId", _thisState.state.onSelectLength[0]);
            formData.append("ordering", values.ordering);
            formData.append("hot", values.hot);
            formData.append("id", _thisState.state.setSiteId);
            formData.append("description", UE.getEditor('contentProduct').getContent());
            formData.append("price", values.price);
            formData.append("gallery", this.state.gallerydoneImgUrl);
            formData.append("productCode", values.productCode);
            formData.append("shortDescription", values.shortDescription);

            formData.append("metaTitle", values.shortDescription);
            formData.append("metaKeyword", values.shortDescription);
            formData.append("metaDescription", values.shortDescription);
            var opts = {
              method: "POST", //请求方法
              body: formData, //请求体
              credentials: 'include'
            }
            fetch(serverSrc.__proto__.serverSrc + "admin/product/update", opts).then((response) => {
              //你可以在这个时候将Promise对象转换成json对象:response.json() 转换成json对象后return，给下一步的.then处理
              return response.json()
            }).then((responseText) => {
              if (responseText.status == '200') {
                _thisState.setState({visible: false, fileList: "", doneImgUrl: '', imgVisible: false});
                _thisState
                    .props
                    .form
                    .resetFields();
                  // this.refs.upElem.refs.input.files[0]='';
                  for (var i = 0; i <= document.getElementsByClassName('galleryClass').length; i++) {
                    document
                      .getElementsByClassName('galleryClass')[0]
                      .parentNode
                      .removeChild(document.getElementsByClassName('galleryClass')[0])
                  }
                  _thisState.searchSite(_thisState.state.onSelectLength[0]);
                message.info("修改成功", 3, function () {
                  
                  //  history.push('#');
                });
              } else {
                message.info(responseText.msg)
              }

            }).catch((error) => {
              alert(error)
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
      // </TreeNode>     ); }

      return (<TreeNode
        title={item.serverName + '-' + item.domainName}
        key={item.id}
        dataRef={item}/>)
    });
  }
  //读取机构列表到弹出框下拉框内 添加产品分类下拉框
  addTreeNodes(data) {

    if (data != null) {
      return data.map(item => {
        return (
          <Option key={item.id} value={item.id}>{item.title}</Option>
        )
      })
    }
  }
  //弹出框下拉框数据
  selectClass(id) {

    this.setState({loading: true})

    var formData = new FormData();
    formData.append('siteId', id);
    formData.append("token", this.state.localToken);
    formData.append('type', 'product');
    var opts = {
      method: "POST", //请求方法
      body: formData, //请求体
      credentials: 'include'
    }

    fetch(serverSrc.__proto__.serverSrc + "admin/cate/query", opts).then((response) => {
      //你可以在这个时候将Promise对象转换成json对象:response.json() 转换成json对象后return，给下一步的.then处理
      return response.json()
    }).then((responseText) => {
      this.setState({loading: false})
      if (responseText.status == '200') {
        console.log(responseText, 5555555)
        this.setState({selectdataSource: responseText.data});
      } else {}
    }).catch((error) => {
      alert(error)
    })

  }
  //编辑 分类
  editModal(ev) {
    // UE.getEditor('contentProduct')
    // UE.delEditor('contentProduct');
    this
      .setState({
        submitLoading: false,
        doneImgUrl: ev.image,
        gallerydoneImgUrl: ev.gallery,
        visible: true,
        imgVisible: true,
        setSiteId: ev.id,
        ModalTitle: '编辑产品'
      }, function () {

        if (document.getElementsByClassName('galleryClass').length != 0) {


          for (var i = 0; i <= document.getElementsByClassName('galleryClass').length+1; i++) {
            console.log()
            document
              .getElementsByClassName('galleryClass')[0]
              .parentNode
              .removeChild(document.getElementsByClassName('galleryClass')[0])
          }
        }

        

        if (ev.gallery.indexOf(',') != -1) {
          var resImgUrl = ev
            .gallery
            .split(',');

          for (var jj = 0; jj < resImgUrl.length; jj++) {
            //左侧入
            var img = document.createElement('img'); //1、创建元素
            img.className = "galleryClass"
            img.src = serverSrc.__proto__.serverSrc + resImgUrl[jj]
            var container = document.getElementById('gallery')
            //2、找到父级元素
            container.appendChild(img); //插入到最左边
          }
        };

        UE.getEditor('contentProduct').ready((ueditor) => {
          UE.getEditor('contentProduct').setContent(ev.description)
        });
  
      });

      
    this
      .props
      .form
      .setFieldsValue({
        // categoryId: ev.categoryId, orgId:ev.orgId, description: ev.description,
        hot: ev.hot,
        categoryId: ev.categoryId,
        metaDescription: ev.metaDescription,
        metaKeyword: ev.metaKeyword,
        metaTitle: ev.metaTitle,
        name: ev.name,
        ordering: ev.ordering,
        price: ev.price,
        productCode: ev.productCode,
        description:ev.description,
        publish: ev.publish == true
          ? 1
          : 0,
        shared: ev.shared == true
          ? 1
          : 0,
        shortDescription: ev.shortDescription
      })

  }

  //树形 操作
  onSelect(ev, event, a, b) {

    this.setState({onSelectLength: ev})
    if (ev.length > 0) {

      this.searchSite(ev[0]);
      this.setState({treeEvent: event.selectedNodes[0].props.dataRef})
    }

    this.selectClass(ev[0]);

  }
  // 分类图片上传方法 handleUpload(e) { console.log(e,444444444444444444) const { fileList
  // } = this.state; const formData = new FormData(); fileList.forEach((file) => {
  // formData.append('files[]', file); }); this.setState({   uploading: true, });
  // // You can use any AJAX library you like reqwest({   url:
  // '//jsonplaceholder.typicode.com/posts/',   method: 'post',   processData:
  // false,   data: formData,   success: () => {     this.setState({ fileList: [],
  //       uploading: false,     });     message.success('upload successfully.');
  // },   error: () => {     this.setState({       uploading: false,     });
  // message.error('upload failed.');   }, }); } 查看缩略图 弹出框 取消
  handleCancel() {

    this.setState({previewVisible: false, visible: false, tableImagesVisible: false})
    // document.getElementsByClassName('ant-upload-list')[0].innerHTML="";

  }
  //
  showImages(e, iamgeSrc) {
    this.setState({previewImage: e.target.src, tableImagesVisible: true});
  }

  upfileinput(e) {

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

  galleryupfileinput(e) {

    if (this.refs.galleryupElem.refs.input.files[0] != undefined) {
      var formData = new FormData();
      var fileLength = this.refs.galleryupElem.refs.input.files;

      for (var i = 0; i <= fileLength.length; i++) {
        formData.append("image", fileLength[i]);
      }
      formData.append("token", this.state.localToken);
      var opts = {
        method: "POST", //请求方法
        body: formData, //请求体
        credentials: 'include'
      }
      fetch(serverSrc.__proto__.serverSrc + "admin/in/uploadM", opts).then((response) => {
        //你可以在这个时候将Promise对象转换成json对象:response.json() 转换成json对象后return，给下一步的.then处理
        return response.json()
      }).then((responseText) => {
        if (responseText.status == '200') {
          this.setState({gallerydoneImgUrl: responseText.data, galleryimgVisible: true});

          if (responseText.data.indexOf(',') != -1) {
            var resImgUrl = responseText
              .data
              .split(',');
            for (var jj = 0; jj < resImgUrl.length; jj++) {
              //左侧入
              var img = document.createElement('img'); //1、创建元素
              img.className = "galleryClass"
              img.src = serverSrc.__proto__.serverSrc + resImgUrl[jj]
              var container = document.getElementById('gallery');
              //2、找到父级元素
              container.appendChild(img); //插入到最左边
            }
          } else {
            var img = document.createElement('img'); //1、创建元素
            img.className = "galleryClass"
            img.src = serverSrc.__proto__.serverSrc + responseText.data
            var container = document.getElementById('gallery');
            //2、找到父级元素
            container.appendChild(img);
          }
        } else {
          // message.info(responseText.msg)
        }
      }).catch((error) => {
        alert(error)
      })
    }
  }
  galleryUpBtn() {
    this
      .refs
      .galleryupElem
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
              .name
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
        span: 4
      },
      wrapperCol: {
        xs: {
          span: 9
        },
        sm: {
          span: 9
        }
      }
    };
    const ueditorformItemLayout = {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        xs: {
          span: 17
        },
        sm: {
          span: 17
        }
      }
    };
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        className: 'column-center',
        width: 150,
        key: 'name',
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
        title: '分类',
        dataIndex: 'cateName',
        className: 'column-center',
        width: 150,
        key: 'cateName',
        sorter: (a, b) => a
        .cateName
        .localeCompare(b.cateName),
      filters:this.state.filtersArr,
      onFilter: (value, record) => record.cateName.indexOf(value) === 0,

      }, {
        title: '主图',
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
        title: '多图',
        dataIndex: 'gallery',
        className: 'column-center',
        width: 150,
        key: 'gallery',
        render: (text, record) => {

          if (record.gallery.indexOf(',') != -1) {

            var arrImg = record
              .gallery
              .split(',')

            var arraa = []
            for (var keyi in arrImg) {
              arraa.push(<img
                key={arrImg[keyi]}
                style={{
                width: 20,
                height: 20,
                marginLeft: 10,
                cursor: 'pointer'
              }}
                onClick={this
                .showImages
                .bind(this)}
                src={serverSrc.__proto__.serverSrc + arrImg[keyi]}/>)

            }
            return arraa
            // for(var i=0,arr=undefined;i<arrImg.length;i++){     console.log(i)
            // console.log(arrImg[i],77777777777)     return  (<img         style={{  width:
            // 20,         height: 20,         cursor: 'pointer'       }} onClick={this
            // .showImages         .bind(this)} src={serverSrc.__proto__.serverSrc
            // +arrImg[i]}/>) } return arrImg.map(value=>{     return (<img style={{
            //     width: 20,             height: 20,             cursor: 'pointer'
            //  }}      onClick={this             .showImages .bind(this)}
            // src={serverSrc.__proto__.serverSrc +value.image}/>);         } }) return arr
            // return (<img     style={{     width: 20,     height: 20, cursor: 'pointer'
            // }}     onClick={this     .showImages     .bind(this)}
            // src={serverSrc.__proto__.serverSrc +record.image}/>); }

          } else {

            // return (<img     style={{     width: 20,     height: 20,     cursor:
            // 'pointer'   }}     onClick={this     .showImages     .bind(this)}
            // src={serverSrc.__proto__.serverSrc +record.image}/>);
          }
        }

      }, {
        title: '详情',
        dataIndex: 'description',
        className: 'column-center',
        width: 150,
        render: (text, record) => {
          // console.log(record.image)
          return (
            <div
              style={{
              display: 'inline-block',
              height: '20px',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              width: '150px'
            }}>
              {text}
            </div>
          )
        },
        key: 'description'

      }, {
        title: '首页',
        dataIndex: 'hot',
        className: 'column-center',
        width: 80,
        key: 'hot',
        render: (text, record) => {

          if (text == 1) {
            return '是'
          } else {
            return '否'
          }
        }
      }, {
        title: '价格',
        dataIndex: 'price',
        className: 'column-center',
        width: 100,
        key: 'price'
      }, {
        title: '产品编号',
        dataIndex: 'productCode',
        className: 'column-center',
        width: 150,
        key: 'productCode'
      }, {
        title: '全站共享',
        dataIndex: 'shared',
        className: 'column-center',
        width: 100,
        key: 'shared',
        render: (text, record) => {
          if (text == 1 || text == true) {
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
        title: '分类标题',
        dataIndex: 'metaTitle',
        className: 'column-center',
        width: 150,
        key: 'metaTitle',
        render: (text) => {
          return (
            <div
              style={{
              textOverflow: 'ellipsis',
              display: 'inline-block',
              height: '30.5px',
              overflow: 'hidden',
              padding: '6px 8px',
              width: '150px',
              whiteSpace: 'nowrap'
            }}>
              {text}
            </div>
          )
        }
      }, {
        title: '分类关键词',
        className: 'column-center',
        dataIndex: 'metaKeyword',
        width: 180,
        key: 'metaKeyword',
        render: (text) => {
          return (
            <div
              style={{
              textOverflow: 'ellipsis',
              display: 'inline-block',
              height: '30.5px',
              overflow: 'hidden',
              padding: '6px 8px',
              width: '180px',
              whiteSpace: 'nowrap'
            }}>
              {text}
            </div>
          )
        }
      }, {
        title: '分类描述',
        className: 'column-center',
        dataIndex: 'metaDescription',
        width: 180,
        key: 'metaDescription',
        render: (text) => {
          return (
            <div
              style={{
              textOverflow: 'ellipsis',
              display: 'inline-block',
              height: '30.5px',
              overflow: 'hidden',
              padding: '6px 8px',
              width: '180px',
              whiteSpace: 'nowrap'
            }}>
              {text}
            </div>
          )
        }
      }, {
        title: '排序',

        className: 'column-center',
        dataIndex: 'ordering',
        width: 80,
        key: 'ordering',
        sorter: (a, b) => a.ordering-b.ordering,
      }, {

        title: '是否显示',
        dataIndex: 'publish',
        className: 'column-center',
        width: 100,
        key: 'publish',
        render: (text, record) => {
          if (text == 1 || text == true) {
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
        width: 120,
        key: 'operation',
        fixed: 'right',
        render: (text, record) => {
          if(record.siteId==this.state.onSelectLength[0]){
          return (
            <div>
              <Popconfirm title="确认删除该条产品?" onConfirm={() => this.onDelete(record.id)}>
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
            width={1000}
            footer={null}>
            <div ref="bbbbbb">
              <Form
                layout={formLayout}
                onSubmit={this
                .nodeSubmit
                .bind(this)}>
                <FormItem label="名称" {...formItemLayout }>
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: '请输入名称!'
                      }
                    ]
                  })(<Input placeholder=""/>)}
                </FormItem>

                <FormItem label="产品编号" {...formItemLayout }>
                  {getFieldDecorator('productCode', {
                    rules: [
                      {
                        required: true,
                        message: '请输入产品编号!'
                      }
                    ]
                  })(<Input placeholder=""/>)}
                </FormItem>

                <FormItem label="产品简介" {...formItemLayout }>
                  {getFieldDecorator('shortDescription', {
                    rules: [
                      {
                        required: true,
                        message: ''
                      }
                    ]
                  })(<TextArea
                    placeholder="description"
                    autosize={{
                    minRows: 2,
                    maxRows: 6
                  }}/>)}

                </FormItem>
                <FormItem label="分类" {...formItemLayout }>
                  {getFieldDecorator('categoryId', {
                    rules: [
                      {
                        required: true,
                        message: '请选择分类!'
                      }
                    ]
                  })(

                    <Select style={{
                      width: '100%'
                    }}>

                      {this.addTreeNodes(this.state.selectdataSource)}

                    </Select>

                  )}

                </FormItem>
                <FormItem label="主图" {...formItemLayout }>
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
                <FormItem label="多图" {...formItemLayout }>
                  {getFieldDecorator('gallery', {
                    rules: [
                      {
                        required: false,
                        message: '!'
                      }
                    ]
                  })(
                    <div >
                      <Input
                        multiple
                        style={{
                        display: 'none'
                      }}
                        ref="galleryupElem"
                        onChange={this
                        .galleryupfileinput
                        .bind(this)}
                        type="file"
                        placeholder=""/>
                      <b
                        className="ant-btn"
                        ref="galleryUpBtn"
                        onClick={this
                        .galleryUpBtn
                        .bind(this)}
                        style={{
                        lineHeight: 2.15
                      }}>
                        上传</b>

                    </div>
                  )}
                </FormItem>
                <FormItem label="价格" {...formItemLayout }>
                  {getFieldDecorator('price', {
                    rules: [
                      {
                        required: true,
                        message: '请输入价格!'
                      }
                    ]
                  })(<Input placeholder=""/>)}
                </FormItem>

                <FormItem label="产品详情" {...ueditorformItemLayout }>

                  <Ueditor   id="contentProduct" height="200px"/>
                </FormItem>

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

                <FormItem label="放置首页" {...formItemLayout }>
                  {getFieldDecorator('hot', {
                    rules: [
                      {
                        required: true,
                        message: '请选择是否放置首页'
                      }
                    ]
                  })(
                    <RadioGroup size="large">
                      <Radio value={1}>是</Radio>
                      <Radio value={0}>否</Radio>
                    </RadioGroup>
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
            size="small"
            rowKey="id"
            scroll={{
            x: 1900
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

ProductList = Form.create({})(ProductList);
export default ProductList

/* <Upload
defaultFileList={this.state.doneList}
action={serverSrc.__proto__.serverSrc+'admin/in/upload'} data={{'token':this.state.localToken,'image':this.state.fileList}} beforeUpload={this.beforeUpload.bind(this)}  onChange={this.onChange.bind(this)} listType='picture'  onRemove={this.UponRemove.bind(this)}>
<Button>
<Icon type="upload" />上传
</Button>
</Upload>         */

/* <b  className="ant-btn"  style={{lineHeight:2.15}}> 上传</b> */
