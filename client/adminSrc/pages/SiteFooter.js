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
    Divider,
    Checkbox
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const serverSrc = new jsonp();
const TabPane = Tabs.TabPane;
const TreeNode = Tree.TreeNode;
const RadioGroup = Radio.Group;
const {TextArea} = Input;
// var otCss = require('../css/footer.css') console.log(FootCss)
class SiteFooter extends React.Component {
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
            navbarAddEditData: null,
            bottomQueryDataSource: null,
            linkdoneImgUrl: null,
            linkimgVisible: null
        };
    }
    componentWillMount() {}
    componentWillReceiveProps() {}
    getSitedata() {
        var _thisState = this
        jsonp({
            url: 'admin/bottom/query',
            key: 'callback',
            data: {
                token: _thisState.props.localToken,
                pageSize: 10,
                siteId: _thisState.props.siteId
            },
            callback: function (ret) {
                console.log(ret, 11111111)
                if (ret.status == '200') {
                    if (ret.data.link != null) {
                        // for (var i = 1, tableArray = []; i <= ret.data.link.totalPage; i++) {
                        jsonp({
                            url: 'admin/bottom/query',
                            key: 'callback',
                            data: {
                                linkPage: 1,
                                token: _thisState.state.localToken,
                                pageSize: ret.data.link.totalData,
                                siteId: _thisState.props.siteId
                            },
                            callback: function (retList) {
                                // if (ret.status == '200') {     for (var l = 0; l < retList.data.list.length;
                                // l++) {         tableArray.push(retList.data.list[l])     } }
                                console.log(retList, 878787)

                                retList
                                    .data
                                    .link
                                    .list
                                    .map(value => {
                                        value.addId = value.id;
                                    })

                                _thisState.setState({bannerModaltreeData: retList.data.link.list, loading: false})
                            }
                        })
                        // }
                    }
                    setTimeout(function () {
                        if (ret.data.copy != null) {
                            jsonp({
                                url: 'admin/bottom/query',
                                key: 'callback',
                                data: {
                                    copyPage: 1,
                                    token: _thisState.state.localToken,
                                    pageSize: ret.data.copy.totalData,
                                    siteId: _thisState.props.siteId
                                },
                                callback: function (retList) {
                                    // if (ret.status == '200') {     for (var l = 0; l < retList.data.list.length;
                                    // l++) {         tableArray.push(retList.data.list[l])     } }
                                    console.log(retList, 'cope')

                                    retList
                                        .data
                                        .copy
                                        .list
                                        .map(value => {
                                            value.addId = value.id;
                                        })

                                    _thisState.setState({navbarModaltreeData: retList.data.copy.list, loading: false})
                                }
                            })
                        }

                    }, 500)

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

    handleCancel(e) {
        this.setState({visible: false, editModal: false, pageEditVisible: false, bannerVisible: false});

    }

    bannerhandleCancel(e) {
        this.setState({bannerVisible: false});
    }

    navbarhandleCancel(e) {
        this.setState({navbarVisible: false});
    }

    bannernodeSubmit(e) {

        e.preventDefault();
        this
            .props
            .form
            .validateFields([
                'copyright'
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
                    // formData.append('pageId', _thisState.state.pageEditId);
                    formData.append('copyright', values.copyright);
                    formData.append('siteId', _thisState.props.siteId);
                    formData.append('link', JSON.stringify(_thisState.state.bannerModaltreeData));
                    formData.append('copy', JSON.stringify(_thisState.state.navbarModaltreeData));
                    // formData.append('metaTitle', values.PagemetaTitle);
                    // formData.append('metaKeyword', values.PagemetaKeyword);
                    // formData.append('metaDescription', values.PagemetaDescription);
                    // formData.append('seoId', this.state.adminPageQuery.seo != null
                    //     ? this.state.adminPageQuery.seo.id
                    //     : null);

                    var opts = {
                        method: "POST", //请求方法
                        body: formData, //请求体
                        credentials: 'include'
                    }

                    fetch(serverSrc.__proto__.serverSrc + "admin/bottom/update", opts).then((response) => {
                        //你可以在这个时候将Promise对象转换成json对象:response.json() 转换成json对象后return，给下一步的.then处理
                        this.setState({submitLoading: false});
                        return response.json()
                    }).then((responseText) => {
                        console.log(responseText)
                        if (responseText.status == '200') {
                            console.log(responseText)
                            message.info('修改成功')
                            this.setState({pageEditVisible: false, submitLoading: false});
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
                    // message.info(responseText.msg)
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

    //友情链接鼠标悬浮
    linkupfileinput(e) {
        console.log(this.refs.linkupElem.refs.input.files[0])
        if (this.refs.linkupElem.refs.input.files[0] != undefined) {
            var formData = new FormData();

            // this.refs.upElem.refs.input.files.FileList.forEach((file) => {
            // formData.append('image', file); });
            formData.append("token", this.props.localToken);
            formData.append('image', this.refs.linkupElem.refs.input.files[0]);
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
                    this.setState({linkdoneImgUrl: responseText.data, linkimgVisible: true});
                } else {
                    // message.info(responseText.msg)
                }
            }).catch((error) => {
                alert(error)
            })
        }

    }
    linkUpBtn() {

        this
            .refs
            .linkupElem
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
                    // message.info(responseText.msg)
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

    // //搜索方法 onInputChange(e) {     console.log(e.target.value)
    // this.setState({searchText: e.target.value});     //
    // console.log(thiis.state.searchText) } onSearch() {     const {searchText} =
    // this.state;     console.log(this.state.searchText);     const reg = new
    // RegExp(searchText, 'gi');     if (searchText == '') {
    // this.getSitedata();     } else {         //
    // this.state.dataSource.map((record) => {   const match =         //
    // record.loginName.match(reg);   console.log(match)   if (!match) {     return
    //        // null;   }   return record; }).filter(record => !!record)
    // this.setState({             filterDropdownVisible: false,
    // filtered: !!searchText,             dataSource: this                 .state
    //               .dataSource                 .map((record) => {
    //    const match = record                         .loginName
    //      .match(reg);                     if (!match) {
    // return null;                     }                     return record;
    //         })                 .filter(record => !!record)         });     } }
    // 表格多选 按钮 onSelectChange(selectedRowKeys) {     console.log(selectedRowKeys)
    //  this.setState({selectedRowKeys}); } 页面设置 下拉框版面选择 SitePageonChange(e) {
    // console.log(this.state.ModaltreeData[e - 1])     this.setState({
    // activeSiteImg: serverSrc.__proto__.serverSrc + this.state.ModaltreeData[e -
    // 1].image     }) } 编辑弹窗页面设置 pageEditModal(ev) {
    // this.setState({pageEditVisible: true, pageEditId: ev.id});
    // console.log(this.props)     var formData = new FormData();     //
    // this.refs.upElem.refs.input.files.FileList.forEach((file) => {     //
    // formData.append('image', file); });     formData.append("token",
    // this.props.localToken);     formData.append('siteId', this.props.siteId);
    // formData.append('pageId', ev.id);     formData.append('pageSize', 10);
    // var opts = {         method: "POST", //请求方法         body: formData, //请求体
    //     credentials: 'include'     }     fetch(serverSrc.__proto__.serverSrc +
    // "admin/page/query", opts).then((response) => {
    // //你可以在这个时候将Promise对象转换成json对象:response.json() 转换成json对象后return，给下一步的.then处理
    //       return response.json()     }).then((responseText) => {         if
    // (responseText.status == '200') {             console.log(responseText,
    // 66666666666666)             responseText                 .data
    //  .navbar                 .list                 .map(value => {
    //      value.addId = value.id;                 })             responseText
    //            .data                 .banner                 .list
    //  .map(value => {                     value.addId = value.id;
    // })             this.setState({ModaltreeData: responseText.data.temp,
    // adminPageQuery: responseText.data, bannerModaltreeData:
    // responseText.data.navbar.list, bannerAddEditData:
    // responseText.data.navbar.list, navbarModaltreeData:
    // responseText.data.banner.list});         } else {             //
    // message.info(responseText.msg)         }     }).catch((error) => {
    // alert(error)     }) }

    bannerPageEditModal(ev) {
        this.setState({
            bannerdoneImgUrl: ev.image,
            bannerimgVisible: true,
            bannerVisible: true,
            bannerpageEditId: ev.addId,
            bannerpageTitle: '编辑友情链接',
            linkhoverImage: ev.hoverImage
        });

        this
            .props
            .form
            .setFieldsValue({
                linktitle: ev.title,
                linkordering: ev.ordering,
                linkhoverImage: ev.hoverImage,
                linkImage: ev.image,
                linkurl: ev.url,
                linkalt: ev.alt,
                // orgId:ev.orgId,
                linkshared: ev.shared == true
                    ? 1
                    : 0,
                linkpublish: ev.publish == true
                    ? 1
                    : 0
            })
    }

    navbarPageEditModal(ev) {
        console.log(ev)
        this.setState({navbardoneImgUrl: ev.image, navbarimgVisible: true, navbarVisible: true, navbarpageEditId: ev.addId, navbarpageTitle: '编辑备案信息'});

        // 'copyname',         'copyurl',         'copyImage',         'copyshared',
        //     'copypublish',         'copyordering',         'copyalt'
        this
            .props
            .form
            .setFieldsValue({
                copyImage: ev.image,
                copyurl: ev.url,
                copyname: ev.name,
                copyalt: ev.alt,
                copyordering: ev.ordering,

                // orgId:ev.orgId,
                copyshared: ev.shared == true
                    ? 1
                    : 0,
                copypublish: ev.publish == true
                    ? 1
                    : 0
            })
    }
    addbanner() {

        this.setState({bannerVisible: true, bannerpageTitle: '添加友情链接', linkimgVisible: false, bannerimgVisible: false});
        this
            .props
            .form
            .resetFields();
    }

    addNavber() {

        this.setState({navbarVisible: true, navbarpageTitle: '添加备案信息', navbarimgVisible: false});
        this
            .props
            .form
            .resetFields();
    }
    //banner提交
    bannerSubmit(e) {

        e.preventDefault();
        this
            .props
            .form
            .validateFields([
                'linktitle', 'linkurl', 'linkalt',
                // 'linkImage', 'linkhoverImage',
                'linkshared',
                'linkpublish',
                'linkordering'
                // 'siteMetaTitle', 'siteTitleSuffix', 'siteMetaKeyword', 'siteMetaDescription'
            ], (err, values) => {
                if (!err) {
                    if (this.state.bannerpageTitle == "添加友情链接") {
                        var formData = new FormData();
                        const newbannerModaltreeData = this.state.bannerModaltreeData;
                        values.linkImage = this.state.bannerdoneImgUrl
                        values.linkhoverImage = this.state.linkdoneImgUrl
                        this.setState({
                            bannerModaltreeData: [
                                ...newbannerModaltreeData, {
                                    createTime: null,
                                    hoverImage: values.linkhoverImage,
                                    addId: Math.random(),
                                    image: values.linkImage,
                                    ordering: values.linkordering,
                                    pageId: 1,
                                    publish: values.linkpublish==1?true:false,
                                    shared: values.linkshared==1?true:false,
                                    siteId: this.props.siteId,
                                    alt: values.linkalt,

                                    title: values.linktitle,

                                    url: values.linkurl
                                }
                            ],
                            bannerVisible: false,
                            bannerimgVisible: true
                        })
                    } else {
                        const newData = [...this.state.bannerModaltreeData];
                        values.linkImage = this.state.bannerdoneImgUrl
                        values.linkhoverImage = this.state.linkdoneImgUrl

                        const target = newData.filter(item => this.state.bannerpageEditId === item.addId)[0];

                        target.title = values.linktitle
                        target.image = values.linkImage
                        target.ordering = values.linkordering
                        target.hoverImage = values.linkhoverImage
                        target.url = values.linkurl
                        target.shared = values.linkshared==1?true:false
                        target.publish = values.linkpublish==1?true:false
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
    linkDelete(record) {
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

            fetch(serverSrc.__proto__.serverSrc + "admin/link/delete", opts).then((response) => {
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
    copyDelete(record) {
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

        fetch(serverSrc.__proto__.serverSrc + "admin/copy/delete", opts).then((response) => {
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

    //banner提交
    navbarSubmit(e) {

        e.preventDefault();
        // return false;
        this
            .props
            .form
            .validateFields([
                'copyname',
                'copyurl',
                'copyImage',
                'copyshared',
                'copypublish',
                'copyordering',
                'copyalt'
                // 'siteMetaTitle', 'siteTitleSuffix', 'siteMetaKeyword', 'siteMetaDescription'
            ], (err, values) => {
                if (!err) {
                    values.copyImage = this.state.navbardoneImgUrl
                    if (this.state.navbarpageTitle == "添加备案信息") {
                        const newnavbarModaltreeData = this.state.navbarModaltreeData;
                        values.copyImage = this.state.navbardoneImgUrl
                        this.setState({
                            navbarModaltreeData: [
                                ...newnavbarModaltreeData, {
                                    alt: values.copyalt,
                                    createTime: null,
                                    createUid: null,
                                    addId: Math.random(),
                                    image: values.copyImage,
                                    ordering: values.copyordering,
                                    pageId: 1,
                                    publish: values.copypublish==1?true:false,
                                    shared: values.copyshared==1?true:false,
                                    siteId: this.props.siteId,
                                    name: values.copyname,
                                    updateTime: null,
                                    updateUid: null,
                                    url: values.copyurl,
                                    categoryId:1
                                }
                            ],
                            navbarVisible: false,
                            navbarimgVisible: true
                        })
                        console.log(values)
                    } else {

                        const newData = [...this.state.navbarModaltreeData];

                        const target = newData.filter(item => this.state.navbarpageEditId === item.id)[0];
                        values.copyImage = this.state.navbardoneImgUrl

                        target.name = values.copyname
                        target.image = values.copyImage
                        target.ordering = values.copyordering
                        target.alt = values.copyalt
                        target.url = values.copyurl
                        target.shared = values.copyshared==1?true:false
                        target.publish = values.copypublish==1?true:false

                        if (target) {
                            //   delete target.editable;

                            this.setState({navbarModaltreeData: newData, navbarVisible: false, navbarimgVisible: true});
                            //   this.cacheData = newData.map(item => ({ ...item }));
                        }
                        // const newData = [...this.state.bannerModaltreeData];
                        // console.log(newData.filter(item => this.state.bannerpageEditId === item.id))
                        // const target = newData.filter(item => this.state.bannerpageEditId ===
                        // item.id)[0]; target.name = values.bannerName target.icon = values.bannerImage
                        // target.ordering = values.Ordering target.parentId = values.parentid
                        // target.url = values.url target.shared = values.shared target.publish =
                        // values.publish if (target) {     //   delete target.editable;
                        // this.setState({bannerModaltreeData: newData, bannerVisible: false,
                        // bannerimgVisible: true});     //   this.cacheData = newData.map(item => ({
                        // ...item })); }

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

        // const rowSelection = {     selectedRowKeys,     hideDefaultSelections: true,
        //    onChange: this         .onSelectChange         .bind(this),
        // onSelection: this.onSelection };
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

        const bannercolumns = [
            {
                title: '名称',
                dataIndex: 'title',
                className: 'column-center',
                width: 200,
                key: 'title'
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
                title: '图表Alt',
                dataIndex: 'alt',
                className: 'column-center',
                width: 200,
                key: 'alt'
            }, {
                title: '排序',
                dataIndex: 'ordering',
                className: 'column-center',
                width: 200,
                key: 'ordering'
            }, {
                title: '鼠标悬浮图标',
                width: 200,
                className: 'column-center',
                dataIndex: 'hoverImage',
                key: 'hoverImage',
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
                            <Popconfirm title="确认删除该条信息?" onConfirm={() => this.linkDelete(record)}>
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

        // alt : "asd" createTime : null createUid : 1 id : 1 image : "image/123.jpg"
        // ordering : 1 pageId : 1 publish : true shared : 1 siteId : 5 title : "sd"
        // updateTime : 1514370019000 updateUid :

        const navbarcolumns = [
            {
                title: '备案标题',
                dataIndex: 'name',
                className: 'column-center',
                width: 200,
                key: 'name'
            }, {
                title: '链接地址',
                className: 'column-center',
                dataIndex: 'url',
                key: 'url',
                width: 200
            }, {
                title: '备案图标',
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
                title: '图标Alt',
                dataIndex: 'alt',
                className: 'column-center',
                width: 200,
                key: 'alt'
            }, {
                title: '排序',
                dataIndex: 'ordering',
                className: 'column-center',
                width: 200,
                key: 'ordering'
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
                            <Popconfirm title="确认删除该条信息?" onConfirm={() => this.copyDelete(record)}>
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

            <Form
                layout={formLayout}
                onSubmit={this
                .bannernodeSubmit
                .bind(this)}>

                <p
                    style={{
                    fontSize: 16,
                    marginBottom: 5,
                    fontWeight: 500
                }}>友情链接

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

                <Table
                    bordered
                    dataSource={bannerModaltreeData}
                    columns={bannercolumns}
                    size="middle"
                    loading={this.state.loading}
                    rowKey="addId"
                    scroll={{
                    x: true
                }}/>

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

                            <FormItem label="友链名称" {...formItemLayout }>
                                {getFieldDecorator('linktitle', {
                                    rules: [
                                        {
                                            required: true,
                                            message: ''
                                        }
                                    ]
                                })(<Input placeholder=""/>)}
                            </FormItem>
                            <FormItem label="友情链接" {...formItemLayout }>
                                {getFieldDecorator('linkurl', {
                                    rules: [
                                        {
                                            required: true,
                                            message: ''
                                        }
                                    ]
                                })(<Input placeholder=""/>)}
                            </FormItem>
                            <FormItem label="图标alt" {...formItemLayout }>
                                {getFieldDecorator('linkalt', {
                                    rules: [
                                        {
                                            required: true,
                                            message: ''
                                        }
                                    ]
                                })(<Input placeholder=""/>)}
                            </FormItem>

                            <FormItem label="图标" {...formItemLayout }>
                                {getFieldDecorator('linkImage', {
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

                            <FormItem label="鼠标悬浮图标" {...formItemLayout }>
                                {getFieldDecorator('linkhoverImage', {
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
                                            ref="linkupElem"
                                            onChange={this
                                            .linkupfileinput
                                            .bind(this)}
                                            type="file"
                                            placeholder=""/>
                                        <b
                                            className="ant-btn"
                                            onClick={this
                                            .linkUpBtn
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
                                            display: this.state.linkimgVisible
                                                ? 'inline-block'
                                                : 'none'
                                        }}
                                            src={serverSrc.__proto__.serverSrc + this.state.linkdoneImgUrl}></img>
                                    </div>
                                )}
                            </FormItem>

                            <FormItem label="全站共享" {...formItemLayout }>
                                {getFieldDecorator('linkshared', {
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
                                {getFieldDecorator('linkpublish', {
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
                                {getFieldDecorator('linkordering', {
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
                    fontSize: 16,
                    marginBottom: 5,
                    marginTop: 10,
                    fontWeight: 500
                }}>备案信息
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

                            <FormItem label="备案标题" {...formItemLayout }>
                                {getFieldDecorator('copyname', {
                                    rules: [
                                        {
                                            required: true,
                                            message: ''
                                        }
                                    ]
                                })(<Input placeholder=""/>)}
                            </FormItem>
                            <FormItem label="图标alt" {...formItemLayout }>
                                {getFieldDecorator('copyalt', {
                                    rules: [
                                        {
                                            required: true,
                                            message: ''
                                        }
                                    ]
                                })(<Input placeholder=""/>)}
                            </FormItem>
                            <FormItem label="链接地址" {...formItemLayout }>
                                {getFieldDecorator('copyurl', {
                                    rules: [
                                        {
                                            required: true,
                                            message: ''
                                        }
                                    ]
                                })(<Input placeholder=""/>)}
                            </FormItem>
                            <FormItem label="图标" {...formItemLayout }>
                                {getFieldDecorator('copyImage', {
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
                                {getFieldDecorator('copyshared', {
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
                                {getFieldDecorator('copypublish', {
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
                                {getFieldDecorator('copyordering', {
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
                    fontSize: 16,
                    marginBottom: 5,
                    fontWeight: 500
                }}>版权信息


                </p>
                <FormItem label="版权信息" {...formItemLayout }>
                  {getFieldDecorator('copyright', {
                    rules: [
                      {
                        required: true,
                        message: ''
                      }
                    ]
                  })(<TextArea
                    placeholder="版权信息,内容高度自适应"
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
    }
}
SiteFooter = Form.create({})(SiteFooter);
export default SiteFooter