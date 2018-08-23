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
const {TextArea} = Input;
const TreeNode = Tree.TreeNode;
const RadioGroup = Radio.Group;
// var otCss = require('../css/footer.css') console.log(FootCss)
class SitePage extends React.Component {
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
            filterDropdownVisible: false,
            pageEditVisible: false,
            pageEditId: null,
            activeSiteImg: null, //当前页面选中的版面图片
            bannerModaltreeData: null,
            bannerVisible: false,
            bannerpageEditId: null,
            bannerpageTitle: '',
            bannerdoneImgUrl: '',
            bannerimgVisible: false,
            bannerAddEditData: null,
            adminPageQuery: null,
            navbarModaltreeData: null,
            navbarVisible: false,
            navbarpageEditId: null,
            navbarpageTitle: '',
            navbardoneImgUrl: '',
            navbarimgVisible: false,
            navbarAddEditData: null
        };

    }
    componentWillMount() {}
    componentWillReceiveProps() {}

    getSitedata() {
        var _thisState = this
        jsonp({
            url: 'admin/page/q',
            key: 'callback',
            data: {
                token: _thisState.props.localToken,
                pageSize: 10,
                siteId: _thisState.props.siteId
            },
            callback: function (ret) {
                console.log(ret, 1111)
                if (ret.status == '200') {

                    // console.log(ret.data.navbar) ret.data.list.banner=[];
                    // ret.data.list.navbar=[];
                    ret
                        .data
                        .list
                        .map(value => {
                            console.log(value)
                            value.banner = [];
                            value.navbar = [];
                            ret
                                .data
                                .banner
                                .map(bannerValue => {
                                    if (value.id == bannerValue.pageId) {
                                        value
                                            .banner
                                            .push(bannerValue)
                                    }
                                })
                            ret
                                .data
                                .navbar
                                .map(navbarValue => {
                                    if (value.id == navbarValue.pageId) {
                                        value
                                            .navbar
                                            .push(navbarValue)
                                    }
                                })
                        })
                    // console.log(ret.data.list)

                    _thisState.setState({dataSource: ret.data.list, loading: false})
                    //   for (var i = 1, tableArray = []; i <= ret.data.totalPage; i++) { jsonp({
                    // url: 'admin/page/q',       key: 'callback',       data: {   token:
                    // _thisState.props.localToken,         currentPage: i, pageSize: 10, siteId:
                    // _thisState.props.siteId       }, callback: function (retList) {   if
                    // (ret.status == '200') { for (var l = 0; l < retList.data.list.length; l++) {
                    // tableArray.push(retList.data.list[l])           }         }
                    // console.log(tableArray)         _thisState.setState({dataSource: tableArray,
                    // loading: false})       }     })   }
                } else {
                    message.info(ret.msg);
                }
            }
        }) //jsonp end

    }

    componentDidMount() {

        this.getSitedata();
    }
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
                    message
                        .info("删除成功", 3, function () {
                            _thisState.getSitedata();
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

        console.log(this.state.selectedRowKeys)
        if (this.state.selectedRowKeys.length < 1) {
            message
                .info('请勾选要添加此网站的管理员', 3, function () {})
        } else {

            var formData = new FormData();

            // this.refs.upElem.refs.input.files.FileList.forEach((file) => {
            // formData.append('image', file); });
            formData.append("token", this.props.localToken);
            formData.append('siteId', this.props.siteId);
            formData.append('admins', this.state.selectedRowKeys.join(','));

            console.log(this.state.selectedRowKeys.join(','))
            var opts = {
                method: "POST", //请求方法
                body: formData, //请求体
                credentials: 'include'
            }

            fetch(serverSrc.__proto__.serverSrc + "admin/access/update", opts).then((response) => {
                //你可以在这个时候将Promise对象转换成json对象:response.json() 转换成json对象后return，给下一步的.then处理
                return response.json()
            }).then((responseText) => {
                if (responseText.status == '200') {
                    console.log(responseText)
                    message.info('添加成功')
                    // this.setState({doneImgUrl: responseText.data, imgVisible: true});
                    this.getSitedata();

                } else {
                    message.info(responseText.msg)
                }
            }).catch((error) => {
                alert(error)
            })

        }

        // this.props.form.resetFields(); this.setState({visible:
        // true,ModalTitle:'添加管理员'}); this.getSelect() this   .props   .form
        // .setFieldsValue({     sex:1,   })

    }
    //   getSelect() {     //获取tree     var _thisState = this     jsonp({       url:
    // 'admin/org/q',       key: 'callback',       data: {         token:
    // _thisState.state.localToken       },       callback: function (ret) { if
    // (ret.status == '200') {           _thisState             .setState({
    // ModaltreeData: ret.data               //   loading:false }, function () {});
    //      } else {           message.info(ret.msg); }       }     }) //jsonp end
    // }
    handleCancel(e) {
        this.setState({visible: false, editModal: false, pageEditVisible: false, bannerVisible: false});

    }

    bannerhandleCancel(e) {
        this.setState({bannerVisible: false});
    }

    navbarhandleCancel(e) {
        this.setState({navbarVisible: false});
    }
    // nodeSubmit(e) {   e.preventDefault();  this.props.form.validateFields((err,
    // values) => {   var formData = this     .props     .form .getFieldsValue();
    // if(!err){       console.log(4103435430)   } } ) } 添加机构下拉框 addTreeNodes(data)
    // {     var selectTreeData = [];     function eachSelect(data1) {
    // data1.map(value => {         if (value.children) { eachSelect(value.children)
    //         } selectTreeData.push(value)       }) }     eachSelect(data)     //
    // console.log(selectTreeData) this.setState({ //
    // ModaltreeData:selectTreeData.join('') })     return selectTreeData.map(item
    // => {       return (         <Option key={item.id}>{item.orgFullName}</Option>
    //       )     })   } 添加网站

    bannernodeSubmit(e) {

        e.preventDefault();
        this
            .props
            .form
            .validateFields([
                'orgId1', 'navbarAll', 'PagemetaTitle', 'PagemetaDescription', 'PagemetaKeyword'
            ], (err, values) => {
                var formData = this
                    .props
                    .form
                    .getFieldsValue();
                if (!err) {
                    this.setState({submitLoading: true});
                    var _thisState = this

                    var formData = new FormData();
                    



                    // this.refs.upElem.refs.input.files.FileList.forEach((file) => {
                    // formData.append('image', file); });
                    formData.append("token", this.props.localToken);
                    formData.append('pageId', _thisState.state.pageEditId);
                    formData.append('tempId', values.orgId1);
                    formData.append('siteId', _thisState.props.siteId);
                    formData.append('navbar', JSON.stringify(_thisState.state.bannerModaltreeData));
                    formData.append('banner', JSON.stringify(_thisState.state.navbarModaltreeData));
                    formData.append('metaTitle', values.PagemetaTitle);
                    formData.append('metaKeyword', values.PagemetaKeyword);
                    formData.append('metaDescription', values.PagemetaDescription);
                    formData.append('seoId', this.state.adminPageQuery.seo != null
                        ? this.state.adminPageQuery.seo.id
                        : null);

                    var opts = {
                        method: "POST", //请求方法
                        body: formData, //请求体
                        credentials: 'include'
                    }

                    fetch(serverSrc.__proto__.serverSrc + "admin/page/update", opts).then((response) => {
                        //你可以在这个时候将Promise对象转换成json对象:response.json() 转换成json对象后return，给下一步的.then处理
                        this.setState({submitLoading: false});
                        return response.json()
                    }).then((responseText) => {
                        console.log(responseText)
                        if (responseText.status == '200') {
                            console.log(responseText)
                            message.info('添加成功') 
                            this.setState({pageEditVisible:false,
                        submitLoading: false});
                            
                            this.getSitedata();

                        } else {
                            message.info(responseText.msg)
                        }

                        

                    }).catch((error) => {
                        alert(error)
                    })

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
                    message
                        .info("成功修改状态", 3, function () {
                            _thisState.getSitedata();
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
        this.setState({visible: true, ModalTitle: '添加管理员', doneImgUrl: record.headImg, imgVisible: true});
        this.getSelect()
        this
            .props
            .form
            .setFieldsValue({
                sex: record.sex,
                loginName: record.loginName,
                password: record.password,
                mobile: record.mobile,
                adminGroupId: record.adminGroupId,
                firstName: record.firstName,
                lastName: record.lastName,
                headImg: record.headImg,
                qq: record.qq,
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
                    message
                        .info("修改成功", 3, function () {
                            _thisState.getSitedata();
                        });
                } else {
                    message
                        .info(ret.msg, 3, function () {});
                }
            }
        }) //jsonp end
    }

    bannerupfileinput(e) {
        console.log(this.refs.bannerupElem.refs.input.files[0])
        if (this.refs.bannerupElem.refs.input.files[0] != undefined) {
            var formData = new FormData();

            // this.refs.upElem.refs.input.files.FileList.forEach((file) => {
            // formData.append('image', file); });
            formData.append("token", this.props.localToken);
            formData.append('image', this.refs.bannerupElem.refs.input.files[0]);
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
                    this.setState({bannerdoneImgUrl: responseText.data, bannerimgVisible: true});
                } else {
                    message.info(responseText.msg)
                }
            }).catch((error) => {
                alert(error)
            })
        }

    }
    bannerUpBtn() {

        this
            .refs
            .bannerupElem
            .refs
            .input
            .click()
    }





    //横幅上传图片
    navbarupfileinput(e) {
        console.log(this.refs.navbarupElem.refs.input.files[0])
        if (this.refs.navbarupElem.refs.input.files[0] != undefined) {
            var formData = new FormData();

            // this.refs.upElem.refs.input.files.FileList.forEach((file) => {
            // formData.append('image', file); });
            formData.append("token", this.props.localToken);
            formData.append('image', this.refs.navbarupElem.refs.input.files[0]);
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
                    this.setState({navbardoneImgUrl: responseText.data, navbarimgVisible: true});
                } else {
                    message.info(responseText.msg)
                }
            }).catch((error) => {
                alert(error)
            })
        }

    }
    navbarUpBtn() {

        this
            .refs
            .navbarupElem
            .refs
            .input
            .click()
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
                    message.info(responseText.msg)
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
            // 搜索为空重新请选节点 人员数据 $.ajax({     url:
            // "http://119.29.227.15/recruit-party-members/admin/branch/get/other/users",
            // dataType: 'jsonp',     jsonp: "callback",     data: {
            // branchId:this.state.expandedKeys[0]     },     success: function (data) { if
            // (data.status !== 200) {} else { //提示信息没有标题         }     },     error:
            // function (xhr, status, error) {         console.log(xhr, status, error)   //
            // this.info()     } //error end }).done((data) => {     if (data.status ===
            // 200) {         if (data.data != null) { this.setTableDate(data.data)
            // this.setState({ dataSource: data.data,                 selectedRowKeys: ''
            //    })         //删除用户所要的支部ID         } else { this.setState({ dataSource: []
            //               // expandedKeys: [ev[0]], selectedRowKeys: '' })         }
            // } else { this.info(data.msg)     } })
        } else {
            // this.state.dataSource.map((record) => {   const match =
            // record.loginName.match(reg);   console.log(match)   if (!match) {     return
            // null;   }   return record; }).filter(record => !!record)

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

    //表格多选 按钮
    onSelectChange(selectedRowKeys) {
        console.log(selectedRowKeys)
        this.setState({selectedRowKeys});

    }

    //页面设置 下拉框版面选择
    SitePageonChange(e) {

        console.log(this.state.ModaltreeData[e - 1])
        this.setState({
            activeSiteImg: serverSrc.__proto__.serverSrc + this.state.ModaltreeData[e - 1].image
        })

    }

    //编辑弹窗页面设置
    pageEditModal(ev) {

        this.setState({pageEditVisible: true, pageEditId: ev.id});

        console.log(this.props)
        var formData = new FormData();

        // this.refs.upElem.refs.input.files.FileList.forEach((file) => {
        // formData.append('image', file); });
        formData.append("token", this.props.localToken);
        formData.append('siteId', this.props.siteId);
        formData.append('pageId', ev.id);
        formData.append('pageSize', 10);
        var opts = {
            method: "POST", //请求方法
            body: formData, //请求体
            credentials: 'include'
        }

        fetch(serverSrc.__proto__.serverSrc + "admin/page/query", opts).then((response) => {
            //你可以在这个时候将Promise对象转换成json对象:response.json() 转换成json对象后return，给下一步的.then处理
            return response.json()
        }).then((responseText) => {
            if (responseText.status == '200') {
                console.log(responseText, 66666666666666)

               
                   

                    
                    formData.set('pageSize', responseText.data.navbar.totalData);
                    fetch(serverSrc.__proto__.serverSrc + "admin/page/query", opts).then((response) => {
                        //你可以在这个时候将Promise对象转换成json对象:response.json() 转换成json对象后return，给下一步的.then处理
                        return response.json()
                    }).then((responseTextPageMax) => {
                        responseTextPageMax
                        .data
                        .navbar
                        .list
                        .map(value => {
                            value.addId = value.id;
                        })
                       
                        this.setState({bannerModaltreeData: responseTextPageMax.data.navbar.list})
                    })

                    formData.set('pageSize', responseText.data.navbar.totalData);
                    fetch(serverSrc.__proto__.serverSrc + "admin/page/query", opts).then((response) => {
                        //你可以在这个时候将Promise对象转换成json对象:response.json() 转换成json对象后return，给下一步的.then处理
                        return response.json()
                    }).then((responseTextPageMax) => {
                        responseText
                        .data
                        .banner
                        .list
                        .map(value => {
                            value.addId = value.id;
                        })
                       
                        this.setState({navbarModaltreeData: responseTextPageMax.data.banner.list})
                    })
                this.setState({ModaltreeData: responseText.data.temp, adminPageQuery: responseText.data, bannerModaltreeData: responseText.data.navbar.list, bannerAddEditData: responseText.data.navbar.list});
            } else {
                message.info(responseText.msg)
            }
        }).catch((error) => {
            alert(error)
        })

    }

    bannerPageEditModal(ev) {
        this.setState({bannerdoneImgUrl: ev.icon, bannerimgVisible: true, bannerVisible: true, bannerpageEditId: ev.addId, bannerpageTitle: '编辑导航菜单'});
        console.log( '编辑导航菜单',ev.icon)
        this
            .props
            .form
            .setFieldsValue({
                Ordering: ev.ordering, bannerName: ev.name, bannerImage: ev.icon, url: ev.url,
                // orgId:ev.orgId,
                shared: ev.shared == true
                    ? 1
                    : 0,
                publish: ev.publish == true
                    ? 1
                    : 0
            })
    }

    navbarPageEditModal(ev) {
        console.log(ev)
        this.setState({navbardoneImgUrl: ev.image, navbarimgVisible: true, navbarVisible: true, navbarpageEditId: ev.addId, navbarpageTitle: '编辑横幅'});

        this
            .props
            .form
            .setFieldsValue({
                navbarrdering: ev.ordering, navbartitle: ev.title, navbarImage: ev.image, navbarurl: ev.url,navbaralt:ev.alt,
                // orgId:ev.orgId,
                navbarshared: ev.shared == true
                    ? 1
                    : 0,
                    navbarpublish: ev.publish == true
                    ? 1
                    : 0
            })
    }
    addbanner() {

        this.setState({bannerVisible: true, bannerpageTitle: '添加导航菜单'});
    }

    addNavber() {

        this.setState({navbarVisible: true, navbarpageTitle: '添加横幅'});
    }
    //banner提交
    bannerSubmit(e) {

        e.preventDefault();
        this
            .props
            .form
            .validateFields([
                'bannerName',
                'url',
                'parentid',
                'Ordering',
                'publish',
                'shared',
                'bannerImage'
                // 'siteMetaTitle', 'siteTitleSuffix', 'siteMetaKeyword', 'siteMetaDescription'
            ], (err, values) => {
                if (!err) {
                    values.bannerImage = this.state.bannerdoneImgUrl
                    if (this.state.bannerpageTitle == "添加导航菜单") {
                        const newbannerModaltreeData = this.state.bannerModaltreeData;
                       

                        // {"id":2,"siteId":5,"pageId":1,"parentId":0,"level":1,"name":"导航一","url":"123"
                        // ,"icon":"1","publish":1,"ordering":1,"shared":1,"createUid":null,"createTime":
                        // null,"updateUid":1,"updateTime":1514370152000}

                        this.setState({
                            bannerModaltreeData: [
                                ...newbannerModaltreeData, {

                                    createTime: null,
                                    createUid: null,
                                    addId: (newbannerModaltreeData[newbannerModaltreeData.length - 1].addId + 1),
                                    icon: values.bannerImage,
                                    ordering: values.Ordering,
                                    pageId: 1,
                                    publish: values.publish,
                                    shared: values.publish,
                                    siteId: this.props.siteId,
                                    parentId: values.parentid,
                                    name: values.bannerName,
                                    updateTime: null,
                                    updateUid: null,
                                    url: values.url
                                }
                            ],
                            bannerVisible: false,
                            bannerimgVisible: true
                        })
                        console.log(values)
                    } else {

                        const newData = [...this.state.bannerModaltreeData];
                        console.log(newData.filter(item => this.state.bannerpageEditId === item.addId))
                        const target = newData.filter(item => this.state.bannerpageEditId === item.addId)[0];

                        target.name = values.bannerName
                        target.icon = values.bannerImage
                        target.ordering = values.Ordering
                        target.parentId = values.parentid
                        target.url = values.url
                        target.shared = values.shared
                        target.publish = values.publish
                        if (target) {
                            //   delete target.editable;

                            this.setState({bannerModaltreeData: newData, bannerVisible: false, bannerimgVisible: true});
                            //   this.cacheData = newData.map(item => ({ ...item }));
                        }

                    }

                    this
                        .props
                        .form
                        .resetFields();

                }

            })

    }
    //删除按钮
    navbarDelete(record){
        const newData = [...this.state.navbarModaltreeData];
        console.log(newData.filter(item => record.addId === item.addId))
        const target = newData.filter(item => record.addId === item.addId)[0];
        this.state.navbarModaltreeData.map((value,i)=>{
            if(value==target){
               console.log(i,value) 
               newData.splice(i,1)
            }
        })

        var formData = new FormData();
        formData.append("token", this.state.localToken);
        formData.append('id', record.id);
        var opts = {
            method: "POST", //请求方法
            body: formData, //请求体
            credentials: 'include'
        }

        fetch(serverSrc.__proto__.serverSrc + "admin/banner/delete", opts).then((response) => {
            //你可以在这个时候将Promise对象转换成json对象:response.json() 转换成json对象后return，给下一步的.then处理
            return response.json()
        }).then((responseText) => {
            if (responseText.status == '200') {
                message.info('成功删除')
                // this.setState({doneImgUrl: responseText.data, imgVisible: true});
            } else {
                message.info(responseText.msg)
            }
        }).catch((error) => {
            alert(error)
        })

        if (target) {
            this.setState({navbarModaltreeData: newData});
        }
    }
    bannerDelete(record){
        const newData = [...this.state.bannerModaltreeData];
        console.log(newData.filter(item => record.addId === item.addId))
        const target = newData.filter(item => record.addId === item.addId)[0];
        this.state.bannerModaltreeData.map((value,i)=>{
            if(value==target){
               console.log(i,value) 
               newData.splice(i,1)
            }
        })
        
        var formData = new FormData();
        formData.append("token", this.state.localToken);
        formData.append('id', record.id);
        var opts = {
            method: "POST", //请求方法
            body: formData, //请求体
            credentials: 'include'
        }

        fetch(serverSrc.__proto__.serverSrc + "admin/navbar/delete", opts).then((response) => {
            //你可以在这个时候将Promise对象转换成json对象:response.json() 转换成json对象后return，给下一步的.then处理
            return response.json()
        }).then((responseText) => {
            if (responseText.status == '200') {
                message.info('成功删除')
                // this.setState({doneImgUrl: responseText.data, imgVisible: true});
            } else {
                message.info(responseText.msg)
            }
        }).catch((error) => {
            alert(error)
        })
        if (target) {
            this.setState({bannerModaltreeData: newData});
        }
    }

    



    //banner提交
    navbarSubmit(e) {

      



        e.preventDefault();
        // return false;
        this
            .props
            .form
            .validateFields([
                'navbartitle',
                'navbarurl',
                'navbarImage',
                'navbarshared',
                'navbarpublish',
                'navbarordering',
                'navbaralt'
                // 'siteMetaTitle', 'siteTitleSuffix', 'siteMetaKeyword', 'siteMetaDescription'
            ], (err, values) => {
                if (!err) {
                    values.navbarImage = this.state.navbardoneImgUrl
                    if (this.state.navbarpageTitle == "添加横幅") {
                        const newnavbarModaltreeData = this.state.navbarModaltreeData;
                        

                        console.log(values)
                     
                        this.setState({
                            navbarModaltreeData: [
                                ...newnavbarModaltreeData, {
                                    alt:values.navbaralt,
                                    createTime: null,
                                    createUid: null,
                                    addId: Math.random(),
                                    image: values.navbarImage,
                                    ordering: values.navbarordering,
                                    pageId: 1,
                                    publish: values.navbarpublish==1?true:false,
                                    shared: values.navbarshared,
                                    siteId:this.props.siteId,
                                    title: values.navbartitle,
                                    updateTime: null,
                                    updateUid: null,
                                    url: values.navbarurl
                                }
                            ],
                            navbarVisible: false,
                            navbarimgVisible: true
                        })
                        console.log(values)
                    } else {

                        
                        const newData = [...this.state.navbarModaltreeData];
                        const target = newData.filter(item => this.state.navbarpageEditId === item.addId)[0];
                        target.title = values.navbartitle
                        target.image = values.navbarImage
                        target.ordering = values.navbarordering
                        target.alt = values.navbaralt
                        target.url = values.navbarurl
                        target.shared = values.navbarshared
                        target.publish = values.navbarpublish==1?true:false
                        if (target) {
                            //   delete target.editable;
                            this.setState({navbarModaltreeData: newData, navbarVisible: false,navbarimgVisible: true});
                            //   this.cacheData = newData.map(item => ({ ...item }));
                        }
                        // const newData = [...this.state.bannerModaltreeData];
                        // console.log(newData.filter(item => this.state.bannerpageEditId === item.id))
                        // const target = newData.filter(item => this.state.bannerpageEditId === item.id)[0];

                        // target.name = values.bannerName
                        // target.icon = values.bannerImage
                        // target.ordering = values.Ordering
                        // target.parentId = values.parentid
                        // target.url = values.url
                        // target.shared = values.shared
                        // target.publish = values.publish
                        // if (target) {
                        //     //   delete target.editable;

                        //     this.setState({bannerModaltreeData: newData, bannerVisible: false, bannerimgVisible: true});
                        //     //   this.cacheData = newData.map(item => ({ ...item }));
                        // }

                    }

                    this
                        .props
                        .form
                        .resetFields();

                }

            })

    }
    addTreeNodes(data) {
        console.log(data)
        if (data != null) {
            return data.map(item => {
                return (
                    <Option key={item.id}>{item.title}</Option>
                )
            })
        }
    }

    banneraddTreeNodes(data) {
        console.log(data)
        if (data != null) {
            return data.map(item => {
                return (
                    <Option key={item.id}>{item.name}</Option>
                )
            })
        }
    }

    render() {
        const {dataSource, ModaltreeData, bannerModaltreeData, selectedRowKeys, navbarModaltreeData} = this.state;

        const rowSelection = {
            selectedRowKeys,
            hideDefaultSelections: true,
            onChange: this
                .onSelectChange
                .bind(this),
            onSelection: this.onSelection
        };
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
                title: '页面',
                dataIndex: '页面',
                className: 'column-center',
                width: 200,
                key: '页面'
            }, {
                title: '页面版式',
                className: 'column-center',
                dataIndex: '页面版式',
                key: '页面版式',
                width: 200
            }, {
                title: 'h1标题',
                width: 200,
                className: 'column-center',
                dataIndex: 'h1标题',
                key: 'h1标题',
                render: (text) => {
                    //   if (text == true) {     return (       <span>系统管理员</span>     )   } else {
                    return (
                        <span>普通管理员</span>
                    )
                    //   }
                }

            }, {
                title: 'meat信息',
                // sorter: (a, b) => {     return a.phone - b.phone },<a href="#">删除</a>
                className: 'column-center',
                dataIndex: 'meta_title',
                key: 'meta_title',
                width: 150,
                render: (text, record) => {
                    //   if (text == 0) {     return (       <span>已启用</span>     )   } else {
                    return (
                        <span>{text}</span>
                    )
                    //   }

                }
            }, {
                title: '横幅',
                className: 'column-center',
                dataIndex: 'banner',
                key: 'banner',
                width: 200,
                render: (text) => {
                    if (text.length > 0) {
                        var arraa = []
                        for (var keyi in text) {
                            if (text[keyi].image) {
                                arraa.push(<img
                                    key={text[keyi].image}
                                    style={{
                                    width: 20,
                                    height: 20,
                                    marginLeft: 10,
                                    cursor: 'pointer'
                                }}
                                    src={serverSrc.__proto__.serverSrc + text[keyi].image}/>)
                            }

                        }
                        return arraa

                    }
                }
            }, {
                title: '导航栏',
                className: 'column-center',
                dataIndex: 'navbar',
                key: 'navbar',
                width: 200,
                render: (text) => {
                    if (text.length > 0) {

                        var arraa = ''
                        for (var keyi in text) {
                            if (text[keyi].name) {
                                arraa += text[keyi].name + ','
                                console.log(text[keyi].name)
                                // arraa.push(<span>text[keyi].name/</span>)
                            }

                        }
                        arraa = arraa.substr(0, arraa.length - 1)
                        return arraa

                    }
                }
            }, {

                title: '操作',
                dataIndex: 'operation',
                width: 150,
                key: 'operation',

                render: (text, record) => {
                    return (
                        <div>
                            <a
                                href="javascript:;"
                                style={{}}
                                onClick={this
                                .pageEditModal
                                .bind(this, record)}>编辑</a>
                        </div>
                    )
                }
            }

        ];

        const bannercolumns = [
            {
                title: '名称',
                dataIndex: 'name',
                className: 'column-center',
                width: 200,
                key: 'name'
            }, {
                title: '链接',
                className: 'column-center',
                dataIndex: 'url',
                key: 'url',
                width: 200
            }, {
                title: '图标',
                width: 200,
                className: 'column-center',
                dataIndex: 'icon',
                key: 'icon',
                render: (text) => {
                    return (<img
                        key={text}
                        style={{
                        width: 20,
                        height: 20,
                        marginLeft: 10,
                        cursor: 'pointer'
                    }}
                        src={serverSrc.__proto__.serverSrc + text}/>)

                }

            }, {
                title: '全站共享',
                // sorter: (a, b) => {     return a.phone - b.phone },<a href="#">删除</a>
                className: 'column-center',
                dataIndex: 'shared',
                key: 'shared',
                width: 150,
                render: (text, record) => {
                    if (text == 1||text == true) {
                        return (
                            <span>是</span>
                        //   <Switch  checkedChildren="开启"
                        // onChange={this.SwitchonChange.bind(this,record.id)} unCheckedChildren="关闭"
                        // defaultChecked />
                        )
                    } else {
                        return (
                            <span>否</span>
                        //   <Switch  checkedChildren="开启"
                        // onChange={this.SwitchonChange.bind(this,record.id)} unCheckedChildren="关闭"  />
                        )
                    }
                }
            }, {
                title: '是否显示',
                // sorter: (a, b) => {     return a.phone - b.phone },<a href="#">删除</a>
                className: 'column-center',
                dataIndex: 'publish',
                key: 'publish',
                width: 150,
                render: (text, record) => {
                    if (text == 1||text == true) {
                        return (
                            <span>是</span>
                        //   <Switch  checkedChildren="开启"
                        // onChange={this.SwitchonChange.bind(this,record.id)} unCheckedChildren="关闭"
                        // defaultChecked />
                        )
                    } else {
                        return (
                            <span>否</span>
                        //   <Switch  checkedChildren="开启"
                        // onChange={this.SwitchonChange.bind(this,record.id)} unCheckedChildren="关闭"  />
                        )
                    }
                }
            }, {

                title: '操作',
                dataIndex: 'operation',
                width: 150,
                key: 'operation',

                render: (text, record) => {
                    if(this.props.siteId==record.siteId){
                    return (
                        <div>
                            <Popconfirm title="确认删除该条导航菜单?" onConfirm={() => this.bannerDelete(record)}>
                                <a
                                    href="#"
                                    style={{
                                    marginRight: 10
                                }}>删除</a>
                            </Popconfirm>
                            <a
                                href="javascript:;"
                                style={{}}
                                onClick={this
                                .bannerPageEditModal
                                .bind(this, record)}>编辑</a>
                        </div>
                    )
                }
                }
            }

        ];

        // alt : "asd"
        // createTime : null
        // createUid : 1
        // id : 1
        // image : "image/123.jpg"
        // ordering : 1
        // pageId : 1
        // publish : true
        // shared : 1
        // siteId : 5
        // title : "sd"
        // updateTime : 1514370019000
        // updateUid : 

        const navbarcolumns = [
            {
                title: '横幅标题',
                dataIndex: 'title',
                className: 'column-center',
                width: 200,
                key: 'title'
            }, {
                title: '横幅Alt',
                dataIndex: 'alt',
                className: 'column-center',
                width: 200,
                key: 'alt'
            }, {
                title: '横幅链接',
                className: 'column-center',
                dataIndex: 'url',
                key: 'url',
                width: 200
            }, {
                title: '图片',
                width: 200,
                className: 'column-center',
                dataIndex: 'image',
                key: 'image',
                render: (text) => {
                    return (<img
                        key={text}
                        style={{
                        width: 20,
                        height: 20,
                        marginLeft: 10,
                        cursor: 'pointer'
                    }}
                        src={serverSrc.__proto__.serverSrc + text}/>)

                }

            }, {
                title: '全站共享',
                // sorter: (a, b) => {     return a.phone - b.phone },<a href="#">删除</a>
                className: 'column-center',
                dataIndex: 'shared',
                key: 'shared',
                width: 150,
                render: (text, record) => {

                    if (text == 1||text == true) {
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
                title: '是否显示',
                // sorter: (a, b) => {     return a.phone - b.phone },<a href="#">删除</a>
                className: 'column-center',
                dataIndex: 'publish',
                key: 'publish',
                width: 150,
                render: (text, record) => {
                    if (text == 1||text == true) {
                        return (
                            <span>是</span>
                        //   <Switch  checkedChildren="开启"
                        // onChange={this.SwitchonChange.bind(this,record.id)} unCheckedChildren="关闭"
                        // defaultChecked />
                        )
                    } else {
                        return (
                            <span>否</span>
                        //   <Switch  checkedChildren="开启"
                        // onChange={this.SwitchonChange.bind(this,record.id)} unCheckedChildren="关闭"  />
                        )
                    }
                }
            }, {

                title: '操作',
                dataIndex: 'operation',
                width: 150,
                key: 'operation',

                render: (text, record) => {
                    if(this.props.siteId==record.siteId){
                        return (
                            <div>
                            <Popconfirm title="确认删除该条横幅菜单?" onConfirm={() => this.navbarDelete(record)}>
                                    <a
                                        href="#"
                                        style={{
                                        marginRight: 10
                                    }}>删除</a>
                                </Popconfirm>
                                <a
                                    href="javascript:;"
                                    style={{}}
                                    onClick={this
                                    .navbarPageEditModal
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
                width={1000}
                title='编辑页面'
                visible={this.state.pageEditVisible}
                footer={null}>
                <div>
                    <Form
                        layout={formLayout}
                        onSubmit={this
                        .bannernodeSubmit
                        .bind(this)}>

                        <p
                            style={{
                            fontSize: 20,
                            marginBottom: 5,
                            fontWeight: 600
                        }}>页面版式</p>
                        <FormItem label="页面版式" {...formItemLayout }>
                            {getFieldDecorator('orgId1', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择上级机构1!'
                                    }
                                ]
                            })(
                                <Select
                                    onChange={this
                                    .SitePageonChange
                                    .bind(this)}
                                    style={{
                                    width: '100%'
                                }}>
                                    {this.addTreeNodes(this.state.ModaltreeData)}
                                </Select>

                            )}

                        </FormItem>
                        <FormItem label=" " {...formItemLayout }>
                            <div>
                                <img
                                    ref="SiteImg"
                                    style={{
                                    width: 100
                                }}
                                    src={this.state.activeSiteImg}/>
                            </div>
                        </FormItem>

                        <p
                            style={{
                            fontSize: 20,
                            marginBottom: 5,
                            fontWeight: 600
                        }}>导航栏菜单

                            <Button
                                style={{
                                marginBottom: 10,
                                marginLeft: 10
                            }}
                                type="primary"
                                onClick={this
                                .addbanner
                                .bind(this)}>
                                添加
                            </Button>

                        </p>

                        <FormItem label="" {...formItemLayout }>
                            {getFieldDecorator('navbarAll', {
                                rules: [
                                    {
                                        required: false,
                                        message: ''
                                    }
                                ]
                            })}
                        </FormItem>

                        <Table
                            bordered
                            dataSource={bannerModaltreeData}
                            columns={bannercolumns}
                            size="middle"
                            loading={this.state.loading}
                            rowKey="addId"
                            scroll={{
                            x: true
                        }}
                            />

                        <Modal
                            onCancel={this
                            .bannerhandleCancel
                            .bind(this)}
                            width={500}
                            title={this.state.bannerpageTitle}
                            visible={this.state.bannerVisible}
                            footer={null}>
                            <div>
                                <Form
                                    layout={formLayout}
                                    onSubmit={this
                                    .bannerSubmit
                                    .bind(this)}>

                                    <FormItem label="标题" {...formItemLayout }>
                                        {getFieldDecorator('bannerName', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: ''
                                                }
                                            ]
                                        })(<Input placeholder=""/>)}
                                    </FormItem>
                                    <FormItem label="链接" {...formItemLayout }>
                                        {getFieldDecorator('url', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: ''
                                                }
                                            ]
                                        })(<Input placeholder=""/>)}
                                    </FormItem>

                                    <FormItem label="图标" {...formItemLayout }>
                                        {getFieldDecorator('bannerImage', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: ''
                                                }
                                            ]
                                        })(
                                            <div>
                                                <Input
                                                    style={{
                                                    display: 'none'
                                                }}
                                                    ref="bannerupElem"
                                                    onChange={this
                                                    .bannerupfileinput
                                                    .bind(this)}
                                                    type="file"
                                                    placeholder=""/>
                                                <b
                                                    className="ant-btn"
                                                    onClick={this
                                                    .bannerUpBtn
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
                                                    display: this.state.bannerimgVisible
                                                        ? 'inline-block'
                                                        : 'none'
                                                }}
                                                    src={serverSrc.__proto__.serverSrc + this.state.bannerdoneImgUrl}></img>
                                            </div>
                                        )}
                                    </FormItem>

                                    <FormItem label="上级菜单" {...formItemLayout }>
                                        {getFieldDecorator('parentid', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: ''
                                                }
                                            ]
                                        })(
                                            <Select
                                                style={{
                                                width: '100%'
                                            }}>
                                                {this.banneraddTreeNodes(this.state.bannerAddEditData)}
                                            </Select>

                                        )}
                                    </FormItem>

                                    <FormItem label="全站共享" {...formItemLayout }>
                                        {getFieldDecorator('shared', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: ''
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
                                                    message: ''
                                                }
                                            ]
                                        })(
                                            <RadioGroup size="large">
                                                <Radio value={1}>是</Radio>
                                                <Radio value={0}>否</Radio>
                                            </RadioGroup>
                                        )}

                                    </FormItem>

                                    <FormItem label="排序" {...formItemLayout }>
                                        {getFieldDecorator('Ordering', {
                                            rules: [
                                                {
                                                    required: true,
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

                        <p
                            style={{
                            fontSize: 20,
                            marginBottom: 5,
                            fontWeight: 600
                        }}>横幅
                            <Button
                                style={{
                                marginBottom: 10,
                                marginLeft: 10
                            }}
                                type="primary"
                                onClick={this
                                .addNavber
                                .bind(this)}>
                                添加
                            </Button>

                        </p>

                        <FormItem label="" {...formItemLayout }>
                            {getFieldDecorator('bannerAll', {
                                rules: [
                                    {
                                        required: false,
                                        message: ''
                                    }
                                ]
                            })}
                        </FormItem>
                        <Table
                            bordered
                            dataSource={navbarModaltreeData}
                            columns={navbarcolumns}
                            size="middle"
                            loading={this.state.loading}
                           
                            scroll={{
                            x: true
                        }}
                            rowKey="addId"/>
                        <Modal
                            onCancel={this
                            .navbarhandleCancel
                            .bind(this)}
                            width={500}
                            title={this.state.navbarpageTitle}
                            visible={this.state.navbarVisible}
                            footer={null}>
                            <div>
                                <Form
                                    layout={formLayout}
                                    onSubmit={this
                                    .navbarSubmit
                                    .bind(this)}>



                                    <FormItem label="横幅标题" {...formItemLayout }>
                                        {getFieldDecorator('navbartitle', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: ''
                                                }
                                            ]
                                        })(<Input placeholder=""/>)}
                                    </FormItem>
                                    <FormItem label="横幅alt" {...formItemLayout }>
                                        {getFieldDecorator('navbaralt', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: ''
                                                }
                                            ]
                                        })(<Input placeholder=""/>)}
                                    </FormItem>
                                    <FormItem label="横幅链接" {...formItemLayout }>
                                        {getFieldDecorator('navbarurl', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: ''
                                                }
                                            ]
                                        })(<Input placeholder=""/>)}
                                    </FormItem>
                                    <FormItem label="图片" {...formItemLayout }>
                                        {getFieldDecorator('navbarImage', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: ''
                                                }
                                            ]
                                        })(
                                            <div>
                                                <Input
                                                    style={{
                                                    display: 'none'
                                                }}
                                                    ref="navbarupElem"
                                                    onChange={this
                                                    .navbarupfileinput
                                                    .bind(this)}
                                                    type="file"
                                                    placeholder=""/>
                                                <b
                                                    className="ant-btn"
                                                    onClick={this
                                                    .navbarUpBtn
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
                                                    display: this.state.navbarimgVisible
                                                        ? 'inline-block'
                                                        : 'none'
                                                }}
                                                    src={serverSrc.__proto__.serverSrc + this.state.navbardoneImgUrl}></img>
                                            </div>
                                        )}
                                    </FormItem>

                                  

                                    <FormItem label="全站共享" {...formItemLayout }>
                                        {getFieldDecorator('navbarshared', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: ''
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
                                        {getFieldDecorator('navbarpublish', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: ''
                                                }
                                            ]
                                        })(
                                            <RadioGroup size="large">
                                                <Radio value={1}>是</Radio>
                                                <Radio value={0}>否</Radio>
                                            </RadioGroup>
                                        )}

                                    </FormItem>

                                    <FormItem label="排序" {...formItemLayout }>
                                        {getFieldDecorator('navbarordering', {
                                            rules: [
                                                {
                                                    required: true,
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

                        <p
                            style={{
                            fontSize: 20,
                            marginBottom: 5,
                            fontWeight: 600
                        }}>SEO设置</p>

                        <FormItem label="页面标题" {...formItemLayout }>
                            {getFieldDecorator('PagemetaTitle', {
                                rules: [
                                    {
                                        required: false,
                                        message: '请输入页面标题!'
                                    }
                                ]
                            })(<Input placeholder=""/>)}
                        </FormItem>

                        <FormItem label="页面关键词" {...formItemLayout }>
                            {getFieldDecorator('PagemetaKeyword', {
                                rules: [
                                    {
                                        required: false,
                                        message: '网站关键词!'
                                    }
                                ]
                            })(<TextArea
                                placeholder="网站详情,内容高度自适应"
                                autosize={{
                                minRows: 2,
                                maxRows: 4
                            }}/>)}
                        </FormItem>

                        <FormItem label="页面描述" {...formItemLayout }>
                            {getFieldDecorator('PagemetaDescription', {
                                rules: [
                                    {
                                        required: false,
                                        message: '请输入页面描述!'
                                    }
                                ]
                            })(<TextArea
                                placeholder="网站详情,内容高度自适应"
                                autosize={{
                                minRows: 3,
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
                loading={this.state.loading}
                rowKey="id"
                scroll={{
                x: true
            }}
                rowKey="id"/>
        </div>
    }
}

SitePage = Form.create({})(SitePage);
export default SitePage