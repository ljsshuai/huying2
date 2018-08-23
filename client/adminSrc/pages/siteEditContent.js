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
import SitePage from './SitePage'
import SiteFooter from './SiteFooter'

const RadioGroup = Radio.Group;
const {TextArea} = Input;
// var otCss = require('../css/footer.css') console.log(FootCss)
class SiteEditContent extends React.Component {
    constructor(...args) {
        super(...args)
        this.state = {
            formLayout: 'horizontal',
            submitLoading: false,
            sstsubmitLoading: false,
            seosubmitLoading: false,
            certsubmitLoading: false,
            imgVisible: false,
            doneImgUrl: '',
            customerVisible: false, //添加客服人员弹出框
            customerdoneImgUrl: '', //客服头像
            customerimgVisible: false,
            setSiteId: '', //客服编辑时候的ID
            ModalTitle: '', //客服添加和编辑的窗口名称由此判断提交那个路径
            certVisible: false,
            certModalTitle: '添加资质信息',
            certdoneImgUrl: null,
            certimgVisible: false,
            certdataSource: [],
            validityBegin: null,
            validityEnd: null,
            isPermanent: true,
            isSite: false, //判断有没有添加有网站信息
            isSiteId: null, //如果有网站信息 把网站信息ID 取出修改信息时候用
            isSeo: false, //判断有没有添加有网站信息
            isSeoId: null, //如果有网站信息 把网站信息ID 取出修改信息时候用
            isOnChangeFn: true
        }
    }
    componentWillMount() {}
    componentDidMount() {
        //获取个人网站基础信息 判断有没有 没有把保存按钮改为添加。
        const formData = new FormData();
        formData.append('token', this.props.localToken);
        formData.append('siteId', this.props.siteId);
        var opts = {
            method: "POST", //请求方法
            body: formData, //请求体
            credentials: 'include'
        }
        fetch(serverSrc.__proto__.serverSrc + "admin/sst/q", opts).then((response) => {
            //你可以在这个时候将Promise对象转换成json对象:response.json() 转换成json对象后return，给下一步的.then处理
            return response.json()
        }).then((responseText) => {
            console.log(responseText, 5555555555555)
            if (responseText.status == '200') {
                this.setState({isSite: true, isSiteId: responseText.data.id, imgVisible: true, doneImgUrl: responseText.data.logo});

                this
                    .props
                    .form
                    .setFieldsValue({
                        siteName: responseText.data.siteName, siteUrl: responseText.data.siteUrl, logo: responseText.data.logo, companyName: responseText.data.companyName,
                        // orgId:ev.orgId,
                        companyAddress: responseText.data.companyAddress,
                        siteAboutUs: responseText.data.siteAboutUs,
                        siteDescription: responseText.data.siteDescription,
                        companyShortDescription: responseText.data.companyShortDescription
                    })
                //判断有没有SEO 信息

                if (responseText.data.siteMetaKeyword == null || responseText.data.siteMetaDescription == null || responseText.data.siteMetaTitle == null) {
                    // message.info(responseText.msg) this.setState({isSite: false});

                } else {
                    this
                        .props
                        .form
                        .setFieldsValue({siteTitleSuffix: responseText.data.siteTitleSuffix, siteMetaKeyword: responseText.data.siteMetaKeyword, siteMetaDescription: responseText.data.siteMetaDescription, siteMetaTitle: responseText.data.siteMetaTitle})
                }

            } else {

                message.info(responseText.msg)
                this.setState({isSite: false});

            }
        }).catch((error) => {
            alert(error)
        })

    }
    //修改网站基本信息状态 提交资质信息表单

    certSubmit(e) {
       
        e.preventDefault();
        this
            .props
            .form
            .validateFields([
                'certTitle',
                'certImage',
                'validityBegin',
                'validityEnd',
                'certshared',
                'certpublish',
                'isPermanent'
            ], (err, values) => {
                console.log(values.isPermanent)
                if (!err) {

                    this.setState({certsubmitLoading: true})
                    var formData = new FormData();
                    if (this.state.certModalTitle == "添加资质信息") {

                        formData.append('title', values.certTitle);
                        formData.append('image', this.state.certdoneImgUrl);

                        if (!this.state.isPermanent) {
                            formData.append('validityBegin', values.validityBegin.format('YYYY-MM-DD'));
                            formData.append('validityEnd', values.validityEnd.format('YYYY-MM-DD'));
                        }

                        formData.append('shared', values.certshared);
                        formData.append('token', this.props.localToken);
                        formData.append('publish', values.certpublish);
                        formData.append('siteId', this.props.siteId);
                        formData.append('isPermanent', values.isPermanent);

                        var opts = {
                            method: "POST", //请求方法
                            body: formData, //请求体
                            credentials: 'include'
                        }
                        fetch(serverSrc.__proto__.serverSrc + "admin/cert/add", opts).then((response) => {
                            //你可以在这个时候将Promise对象转换成json对象:response.json() 转换成json对象后return，给下一步的.then处理
                            return response.json()
                        }).then((responseText) => {
                            console.log(responseText)
                            this.setState({certsubmitLoading: false})
                            if (responseText.status == '200') {
                                var _this = this
                                _this
                                    .props
                                    .form
                                    .resetFields();
                                _this.certgetSitedata();
                                this.setState({certVisible: false});
                                message.info('成功添加', 3, function () {})

                            } else {
                                message.info(responseText.msg)
                            }
                        }).catch((error) => {
                            alert(error)
                        })
                    } else if (this.state.certModalTitle == "编辑资质信息") {
                        formData.append('title', values.certTitle);
                        formData.append('image', this.state.certdoneImgUrl);
                        if (!this.state.isPermanent) {
                            formData.append('validityBegin', values.validityBegin.format('YYYY-MM-DD'));
                            formData.append('validityEnd', values.validityEnd.format('YYYY-MM-DD'));
                        }
                        formData.append('shared', values.certshared);
                        formData.append('token', this.props.localToken);
                        formData.append('publish', values.certpublish);
                        formData.append('siteId', this.props.siteId);
                        formData.append('isPermanent', values.isPermanent);
                        formData.append('id', this.state.setSiteId);
                        var opts = {
                            method: "POST", //请求方法
                            body: formData, //请求体
                            credentials: 'include'
                        }
                        fetch(serverSrc.__proto__.serverSrc + "admin/cert/update", opts).then((response) => {
                            //你可以在这个时候将Promise对象转换成json对象:response.json() 转换成json对象后return，给下一步的.then处理
                            return response.json()
                        }).then((responseText) => {
                            console.log(responseText)
                            this.setState({certsubmitLoading: false})
                            if (responseText.status == '200') {
                                var _this = this
                                _this
                                    .props
                                    .form
                                    .resetFields();
                                _this.certgetSitedata();
                                this.setState({certVisible: false});
                                message.info('修改成功', 3, function () {})

                            } else {
                                message.info(responseText.msg)
                            }
                        }).catch((error) => {
                            alert(error)
                        })

                        // formData.append('name', values.name); formData.append('qq', values.qq);
                        // formData.append('phone', values.phone); formData.append('siteId',
                        // this.props.siteId); formData.append('image', this.state.customerdoneImgUrl);
                        // formData.append('shared', values.shared); formData.append('token',
                        // this.props.localToken); formData.append('publish', values.publish);
                        // formData.append('ordering', values.ordering);
                        // formData.append('id',this.state.setSiteId); var opts = {     method: "POST",
                        // //请求方法     body: formData, //请求体     credentials: 'include' }
                        // fetch(serverSrc.__proto__.serverSrc + "admin/customer/update",
                        // opts).then((response) => {     //你可以在这个时候将Promise对象转换成json对象:response.json()
                        // 转换成json对象后return，给下一步的.then处理     return response.json()
                        // }).then((responseText) => {     this.setState({sstsubmitLoading: false}) if
                        // (responseText.status == '200') {         message.info('修改成功')         this
                        //          .props             .form             .resetFields();
                        // this.getSitedata();         //   this.setState({doneImgUrl:
                        // responseText.data,imgVisible:true});     } else {         //
                        // message.info(responseText.msg)     } }).catch((error) => {     alert(error)
                        // })

                    }

                }
            })

    }
    seoSubmit(e) {
        e.preventDefault();
        this
            .props
            .form
            .validateFields([
                'siteMetaTitle', 'siteTitleSuffix', 'siteMetaKeyword', 'siteMetaDescription'
            ], (err, values) => {
                if (!err) {
                    this.setState({seosubmitLoading: true})
                    var formData = new FormData();
                    formData.append('siteId', this.props.siteId);
                    formData.append('siteMetaTitle', values.siteMetaTitle);
                    formData.append('siteTitleSuffix', values.siteTitleSuffix);
                    formData.append('siteMetaKeyword', values.siteMetaKeyword);
                    formData.append('token', this.props.localToken);
                    formData.append('siteMetaDescription', values.siteMetaDescription);
                    // this.state.isSeo == true ? formData.append('id', this.state.isSeoId) : null;
                    var opts = {
                        method: "POST", //请求方法
                        body: formData, //请求体
                        credentials: 'include'
                    }
                    fetch(serverSrc.__proto__.serverSrc + "admin/seo/addOrUpdate", opts).then((response) => {
                        //你可以在这个时候将Promise对象转换成json对象:response.json() 转换成json对象后return，给下一步的.then处理
                        return response.json()
                    }).then((responseText) => {
                        this.setState({seosubmitLoading: false})
                        if (responseText.status == '200') {
                            console.log(responseText)
                            message.info('修改成功')
                            this
                                .props
                                .form
                                .resetFields();
                            //   this.setState({doneImgUrl: responseText.data,imgVisible:true});
                        } else {

                            message.info(responseText.msg)
                        }
                    }).catch((error) => {
                        alert(error)
                    })
                }
            })
    }
    sstSubmit(e) {
        e.preventDefault();
        console.log(this.state.isSite)
        this
            .props
            .form
            .validateFields([
                'siteName',
                'siteUrl',
                'logo',
                'companyName',
                'companyAddress',
                'siteAboutUs',
                'siteDescription',
                'companyShortDescription'
            ], (err, values) => {
                if (!err) {
                    this.setState({sstsubmitLoading: true})
                    var formData = new FormData();
                    formData.append('siteId', this.props.siteId);
                    formData.append('siteName', values.siteName);
                    formData.append('siteUrl', values.siteUrl);
                    formData.append('logo', this.state.doneImgUrl);
                    formData.append('token', this.props.localToken);
                    formData.append('companyName', values.companyName);
                    formData.append('siteAboutUs', values.siteAboutUs);
                    formData.append('companyAddress', values.companyAddress);
                    formData.append('siteDescription', values.siteDescription);
                    formData.append('companyShortDescription', values.companyShortDescription);
                    this.state.isSite == true
                        ? formData.append('id', this.state.isSiteId)
                        : null;
                    var opts = {
                        method: "POST", //请求方法
                        body: formData, //请求体
                        credentials: 'include'
                    }

                    //
                    fetch(serverSrc.__proto__.serverSrc + (!this.state.isSite
                        ? "admin/sst/add"
                        : "admin/sst/update"), opts).then((response) => {
                        //你可以在这个时候将Promise对象转换成json对象:response.json() 转换成json对象后return，给下一步的.then处理
                        return response.json()
                    }).then((responseText) => {
                        this.setState({sstsubmitLoading: false})
                        if (responseText.status == '200') {
                            message.info('修改成功')
                            this
                                .props
                                .form
                                .resetFields();
                            this.setState({doneImgUrl: responseText.data, imgVisible: false});
                        } else {
                            message.info(responseText.msg)

                            fetch(serverSrc.__proto__.serverSrc + "admin/sst/update", opts).then((response) => {
                                //你可以在这个时候将Promise对象转换成json对象:response.json() 转换成json对象后return，给下一步的.then处理
                                return response.json()
                            }).then((responseText) => {
                                this.setState({sstsubmitLoading: false})
                                if (responseText.status == '200') {

                                    message.info('修改成功')
                                    this
                                        .props
                                        .form
                                        .resetFields();
                                    //   this.setState({doneImgUrl: responseText.data,imgVisible:true});
                                } else {
                                    message.info(responseText.msg)

                                }
                            }).catch((error) => {
                                alert(error)
                            })

                        }
                    }).catch((error) => {
                        alert(error)
                    })
                }
            })
    }
    //添加客服人员
    customerSubmit(e) {
        e.preventDefault();
        this
            .props
            .form
            .validateFields([
                'name',
                'image',
                'qq',
                'phone',
                'shared',
                'publish',
                'ordering'
            ], (err, values) => {
                if (!err) {
                    this.setState({sstsubmitLoading: true})
                    var formData = new FormData();
                    if (this.state.ModalTitle == "添加客服信息") {

                        formData.append('name', values.name);
                        formData.append('qq', values.qq);
                        formData.append('phone', values.phone);
                        formData.append('siteId', this.props.siteId);
                        formData.append('image', this.state.customerdoneImgUrl);
                        formData.append('shared', values.shared);
                        formData.append('token', this.props.localToken);
                        formData.append('publish', values.publish);
                        formData.append('ordering', values.ordering);
                        var opts = {
                            method: "POST", //请求方法
                            body: formData, //请求体
                            credentials: 'include'
                        }
                        fetch(serverSrc.__proto__.serverSrc + "admin/customer/add", opts).then((response) => {
                            //你可以在这个时候将Promise对象转换成json对象:response.json() 转换成json对象后return，给下一步的.then处理
                            return response.json()
                        }).then((responseText) => {
                            this.setState({sstsubmitLoading: false,customerVisible:false})
                            if (responseText.status == '200') {

                                message.info('成功添加')
                                this
                                    .props
                                    .form
                                    .resetFields();
                                this.getSitedata();
                                //   this.setState({doneImgUrl: responseText.data,imgVisible:true});
                            } else {
                                message.info(responseText.msg)
                            }
                        }).catch((error) => {
                            alert(error)
                        })
                    } else if (this.state.ModalTitle == "编辑客服信息") {

                        formData.append('name', values.name);
                        formData.append('qq', values.qq);
                        formData.append('phone', values.phone);
                        formData.append('siteId', this.props.siteId);
                        formData.append('image', this.state.customerdoneImgUrl);
                        formData.append('shared', values.shared);
                        formData.append('token', this.props.localToken);
                        formData.append('publish', values.publish);
                        formData.append('ordering', values.ordering);
                        formData.append('id', this.state.setSiteId);

                        var opts = {
                            method: "POST", //请求方法
                            body: formData, //请求体
                            credentials: 'include'
                        }

                        fetch(serverSrc.__proto__.serverSrc + "admin/customer/update", opts).then((response) => {
                            //你可以在这个时候将Promise对象转换成json对象:response.json() 转换成json对象后return，给下一步的.then处理
                            return response.json()
                        }).then((responseText) => {
                            this.setState({sstsubmitLoading: false,customerVisible:false})
                            if (responseText.status == '200') {

                                message.info('修改成功')
                                this
                                    .props
                                    .form
                                    .resetFields();
                                this.getSitedata();
                                //   this.setState({doneImgUrl: responseText.data,imgVisible:true});
                            } else {
                                // message.info(responseText.msg)
                            }
                        }).catch((error) => {
                            alert(error)
                        })

                    }

                }
            })
    }
    //获取客服信息
    componentWillMount() {

        this.getSitedata();

    }

    getSitedata() {
        console.log(11111)
        var _thisState = this
        jsonp({
            url: 'admin/customer/q',
            key: 'callback',
            data: {
                token: _thisState.props.localToken,
                pageSize: 10,
                siteId: _thisState.props.siteId
            },
            callback: function (ret) {
                console.log(ret, 66666)
                if (ret.status == '200') {
                    for (var i = 1, tableArray = []; i <= ret.data.totalPage; i++) {
                        jsonp({
                            url: 'admin/customer/q',
                            key: 'callback',
                            data: {
                                token: _thisState.props.localToken,
                                currentPage: i,
                                pageSize: 10,
                                siteId: _thisState.props.siteId
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
                                console.log(tableArray, 5555555555555)
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

    //资质证明表格

    certgetSitedata() {
        console.log(11111)
        var _thisState = this
        jsonp({
            url: 'admin/cert/q',
            key: 'callback',
            data: {
                token: _thisState.props.localToken,
                pageSize: 10,
                siteId: _thisState.props.siteId
            },
            callback: function (ret) {
                console.log(ret, 999999999999)
                if (ret.status == '200') {
                    for (var i = 1, tableArray = []; i <= ret.data.list.totalPage; i++) {
                        jsonp({
                            url: 'admin/cert/q',
                            key: 'callback',
                            data: {
                                token: _thisState.props.localToken,
                                currentPage: i,
                                pageSize: 10,
                                siteId: _thisState.props.siteId
                            },
                            callback: function (retList) {
                                if (ret.status == '200') {
                                    for (var l = 0; l < retList.data.list.list.length; l++) {

                                        // retList.data.list[l].sex == 1     ? retList.data.list[l].sex = '男'     :
                                        // retList.data.list[l].sex = '女'
                                        tableArray.push(retList.data.list.list[l])
                                    }
                                }
                                console.log(tableArray, 222222222222)
                                _thisState.setState({certdataSource: tableArray, loading: false})
                            }
                        })
                    }
                } else {
                    //  message.error(ret.msg);
                }
            }
        }) //jsonp end

    }
    //LOGO 上传

    upfileinput(e) {
        console.log(this.refs.upElem.refs.input.files[0])
        if (this.refs.upElem.refs.input.files[0] != undefined) {
            var formData = new FormData();

            // this.refs.upElem.refs.input.files.FileList.forEach((file) => {
            // formData.append('image', file); });
            formData.append("token", this.props.localToken);
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

    //选项卡切换事件

    TabsOnChange(e) {
        console.log(e)
        if (e == 4) {
            this.certgetSitedata()
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

    customerUpBtn() {

        this
            .refs
            .customerUpElem
            .refs
            .input
            .click()
    }

    //客服头像上传
    customerupfileinput(e) {

        if (this.refs.customerUpElem.refs.input.files[0] != undefined) {
            var formData = new FormData();

            // this.refs.upElem.refs.input.files.FileList.forEach((file) => {
            // formData.append('image', file); });
            formData.append("token", this.props.localToken);
            formData.append('image', this.refs.customerUpElem.refs.input.files[0]);
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
                    this.setState({customerdoneImgUrl: responseText.data, customerimgVisible: true});
                } else {
                    message.info(responseText.msg)
                }
            }).catch((error) => {
                alert(error)
            })
        }

    }

    //网站资质上传文件
    certUpBtn() {

        this
            .refs
            .certUpElem
            .refs
            .input
            .click()
    }

    certupfileinput(e) {

        if (this.refs.certUpElem.refs.input.files[0] != undefined) {
            var formData = new FormData();

            // this.refs.upElem.refs.input.files.FileList.forEach((file) => {
            // formData.append('image', file); });
            formData.append("token", this.props.localToken);
            formData.append('image', this.refs.certUpElem.refs.input.files[0]);
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
                    this.setState({certdoneImgUrl: responseText.data, certimgVisible: true});
                } else {
                    message.info(responseText.msg)
                }
            }).catch((error) => {
                alert(error)
            })
        }

    }

    handleCancel(e) {
        this.setState({customerVisible: false, certVisible: false});
    }

    //添加客服人员信息
    addCustomer() {
        this.props.form.resetFields();
        this.setState({customerVisible: true, ModalTitle: '添加客服信息', customerimgVisible: false});
        this
            .props
            .form
            .setFieldsValue({shared: 1,publish: 1})
    }
    //添加资质
    addcert() {
        this.props.form.resetFields();

        this.setState({certVisible: true,isPermanent: true, certModalTitle: '添加资质信息', certimgVisible: false});
        this
            .props
            .form
            .setFieldsValue({isPermanent:true, certshared: 1, certpublish: 1})
    }

    onDelete(key) {
        // const dataSource = [...this.state.dataSource];
        var _thisState = this
        jsonp({
            url: 'admin/customer/delete',
            key: 'callback',
            data: {
                token: _thisState.props.localToken,
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
        //
    }

    certonDelete(key) {

        // const dataSource = [...this.state.dataSource];
        var _thisState = this
        jsonp({
            url: 'admin/cert/delete',
            key: 'callback',
            data: {
                token: _thisState.props.localToken,
                id: key
            },
            callback: function (ret) {

                if (ret.status == '200') {
                    _thisState.certgetSitedata();
                    message.info("删除成功", 3, function () {});
                } else {
                    message
                        .info(ret.msg, 3, function () {});
                }

            }
        }) //jsonp end
        //

    }
    //编辑客服
    editCustomer(setSiteId, ev) {

        console.log(ev)
        this.setState({customerVisible: true,customerimgVisible:true, setSiteId: setSiteId, ModalTitle: '编辑客服信息', customerdoneImgUrl: ev.image});
        this
            .props
            .form
            .setFieldsValue({
                name: ev.name, phone: ev.phone, image: ev.image, qq: ev.qq,
                // orgId:ev.orgId,
                shared: ev.shared == true
                    ? 1
                    : 0,
                publish: ev.publish == true
                    ? 1
                    : 0,
                ordering: ev.ordering
            })
    };

    editCert(setSiteId, ev) {

        console.log(ev, 1111)
        this.setState({
            isPermanent: ev.isPermanent,
            certVisible: true,
            setSiteId: setSiteId,
            certModalTitle: '编辑资质信息',
            certdoneImgUrl: ev.image,
            certimgVisible: true
        });

        this
            .props
            .form
            .setFieldsValue({

                certTitle: ev.title, certImage: ev.image,
                // validityBegin:ev.validityBegin, validityEnd:2017-11-11, orgId:ev.orgId,
                certshared: ev.shared == true
                    ? 1
                    : 0,
                certpublish: ev.publish == true
                    ? 1
                    : 0,
                // isPermanent:ev.isPermanent,

            })

    }
    //永久显示 屏蔽 手选开始时间和结束时间
    onCancelFn(e) {

        
        
  this.setState({isOnChangeFn: e.target.checked?true:false,isPermanent:e.target.checked})
   

    }

    // //修改客服要不要显示 SwitchonChange (id,e){     var _thisState=this     jsonp({ url:
    // 'admin/site/update/status',      key: 'callback',      data: {
    // token:_thisState.state.localToken,siteId:id,status:e?1:0},      callback:
    // function(ret) {        if(ret.status=='200'){
    // message.info("成功修改状态",3,function(){                _thisState.getSitedata();
    //         });           }else{             message.info(ret.msg,5,function(){
    //         });           }      }    })//jsonp end   }
    render() {
        const {getFieldDecorator} = this.props.form;
        const {isOnChangeFn,formLayout, dataSource, certdataSource, isPermanent} = this.state;
   
        //初始化false;
        const buttonItemLayout = {
            wrapperCol: {
                offset: 12,
                span: 1
            }
        }
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
                title: '名称',
                dataIndex: 'name',
                className: 'column-center',
                width: 150,
                // sorter: (a, b) => {     if (a.user_name === undefined) {         a.user_name
                // = ' '     };     if (b.user_name === undefined) {         b.user_name = ' '
                // };     return a.user_name.length - b.user_name.length },
                key: 'name'
            }, {
                title: 'qq',
                className: 'column-center',
                dataIndex: 'qq',
                key: 'qq'
            }, {
                title: '电话',
                width: 150,
                className: 'column-center',
                dataIndex: 'phone',
                key: 'phone',
             
            }, {
                title: '头像',
                // sorter: (a, b) => {     return a.phone - b.phone },<a href="#">删除</a>
                className: 'column-center',
                dataIndex: 'image',
                key: 'image',
                width: 100,
                render: (text, record) => {

                    return (<img
                        key={text}
                        style={{
                        width: 20,
                        height: 20,
                        marginLeft: 10,
                        cursor: 'pointer'
                    }}
                        src={serverSrc.__proto__.serverSrc + text}/>)
                    // if (text == 0) {   return (     <span>已启用</span>   ) } else {   return (
                    // <span>冻结中</span>   ) }

                }
            }, {
                title: '排序',
                // sorter: (a, b) => {     return a.phone - b.phone },<a href="#">删除</a>
                className: 'column-center',
                dataIndex: 'ordering',
                key: 'ordering',
                width: 50
            }, {
                title: '是否显示',
                // sorter: (a, b) => {     return a.phone - b.phone },<a href="#">删除</a>
                className: 'column-center',
                dataIndex: 'publish',
                key: 'publish',
                render: (text, record) => {

                    if (text == 1) {
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
                title: '全站共享',
                // sorter: (a, b) => {     return a.phone - b.phone },<a href="#">删除</a>
                className: 'column-center',
                dataIndex: 'shared',
                key: 'shared',
                render: (text, record) => {

                    if (text == 1) {
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
                render: (text, record) => {
                    if(this.props.siteId==record.siteId){
                    return ((
                        <div>
                            <Popconfirm title="确认删除该客服?" onConfirm={() => this.onDelete(record.id)}>
                                <a
                                    href="#"
                                    style={{
                                    marginRight: 10
                                }}>删除</a>
                            </Popconfirm>

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
                                .editCustomer
                                .bind(this, record.id, record)}>编辑</a>

                        </div>

                    ));
                }
                }
            }

        ];

        const certcolumns = [
            {
                title: '证书名称',
                dataIndex: 'title',
                className: 'column-center',
                width: 150,
                // sorter: (a, b) => {     if (a.user_name === undefined) {         a.user_name
                // = ' '     };     if (b.user_name === undefined) {         b.user_name = ' '
                // };     return a.user_name.length - b.user_name.length },
                key: 'title'
            }, {
                title: '证书图片',
                // sorter: (a, b) => {     return a.phone - b.phone },<a href="#">删除</a>
                className: 'column-center',
                dataIndex: 'image',
                key: 'image',
                width: 100,
                render: (text, record) => {

                    return (<img
                        key={text}
                        style={{
                        width: 20,
                        height: 20,
                        marginLeft: 10,
                        cursor: 'pointer'
                    }}
                        src={serverSrc.__proto__.serverSrc + text}/>)
                    // if (text == 0) {   return (     <span>已启用</span>   ) } else {   return (
                    // <span>冻结中</span>   ) }

                }
            }, {
                title: '开始时间',
                width: 150,
                className: 'column-center',
                dataIndex: 'validityBegin',
                key: 'validityBegin'
            }, {
                title: '结束时间',
                width: 150,
                className: 'column-center',
                dataIndex: 'validityEnd',
                key: 'validityEnd'
            }, {
                title: '永久显示',
                // sorter: (a, b) => {     return a.phone - b.phone },<a href="#">删除</a>
                className: 'column-center',
                dataIndex: 'isPermanent',
                key: 'isPermanent',
                width: 50,
                render: (text, record) => {

                    if (text == true) {
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
                render: (text, record) => {

                    if (text == 1) {
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
                title: '全站共享',
                // sorter: (a, b) => {     return a.phone - b.phone },<a href="#">删除</a>
                className: 'column-center',
                dataIndex: 'shared',
                key: 'shared',
                render: (text, record) => {

                    if (text == 1) {
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
                render: (text, record) => {
                    if(this.props.siteId==record.siteId){
                        return ((
                            <div>
                                <Popconfirm title="确认删除该网站资质?" onConfirm={() => this.certonDelete(record.id)}>
                                    <a
                                        href="#"
                                        style={{
                                        marginRight: 10
                                    }}>删除</a>
                                </Popconfirm>
    
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
                                    .editCert
                                    .bind(this, record.id, record)}>编辑</a>
                            </div>
                        ));
                    }
              
                }
            }

        ];
        // console.log(FootCss) console.log(this.props)
        return <div>
            <Tabs
                animated={true}
                onChange={this
                .TabsOnChange
                .bind(this)}
                tabPosition="top">
                <TabPane tab="网站基础信息" key="1">
                    <Form
                        layout={formLayout}
                        onSubmit={this
                        .sstSubmit
                        .bind(this)}>
                        <FormItem label="网站名称" {...formItemLayout }>
                            {getFieldDecorator('siteName', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入网站名称!'
                                    }
                                ]
                            })(<Input placeholder=""/>)}
                        </FormItem>

                        <FormItem label="网站地址" {...formItemLayout } help="格式  http://www.***.com.">
                            {getFieldDecorator('siteUrl', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入网站地址!'
                                    }
                                ]
                            })(<Input placeholder=""/>)}
                        </FormItem>
                        <FormItem label="logo" {...formItemLayout }>
                            {getFieldDecorator('logo', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'logo!'
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

                        <FormItem label="公司名称" {...formItemLayout }>
                            {getFieldDecorator('companyName', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入公司名称!'
                                    }
                                ]
                            })(<Input placeholder=""/>)}
                        </FormItem>

                        <FormItem label="公司地址" {...formItemLayout }>
                            {getFieldDecorator('companyAddress', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入公司地址!'
                                    }
                                ]
                            })(<Input placeholder=""/>)}
                        </FormItem>
                        <FormItem label="关于我们" {...formItemLayout }>
                            {getFieldDecorator('siteAboutUs', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入关于我们!'
                                    }
                                ]
                            })(<TextArea
                                placeholder="网站详情,内容高度自适应"
                                autosize={{
                                minRows: 2,
                                maxRows: 6
                            }}/>)}
                        </FormItem>
                        <FormItem label="网站详情" {...formItemLayout }>
                            {getFieldDecorator('siteDescription', {
                                rules: [
                                    {
                                        required: false,
                                        message: ''
                                    }
                                ]
                            })(<TextArea
                                placeholder="网站详情,内容高度自适应"
                                autosize={{
                                minRows: 2,
                                maxRows: 6
                            }}/>)}

                        </FormItem>

                        <FormItem label="公司简介" {...formItemLayout }>
                            {getFieldDecorator('companyShortDescription', {
                                rules: [
                                    {
                                        required: false,
                                        message: ''
                                    }
                                ]
                            })(<TextArea
                                placeholder="网站详情,内容高度自适应"
                                autosize={{
                                minRows: 2,
                                maxRows: 6
                            }}/>)}

                        </FormItem>

                        <FormItem {...buttonItemLayout }>
                            <Button type="primary" loading={this.state.sstsubmitLoading} htmlType="submit">
                                保存
                            </Button>
                        </FormItem>
                    </Form>
                </TabPane>

                < TabPane tab="SEO设置" key="2">
                    <Form
                        layout={formLayout}
                        onSubmit={this
                        .seoSubmit
                        .bind(this)}>
                        <FormItem label="网站标题" {...formItemLayout }>
                            {getFieldDecorator('siteMetaTitle', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入网站标题!'
                                    }
                                ]
                            })(<Input placeholder=""/>)}
                        </FormItem>

                        <FormItem label="网站后缀" {...formItemLayout }>
                            {getFieldDecorator('siteTitleSuffix', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入网站后缀!'
                                    }
                                ]
                            })(<Input placeholder=""/>)}
                        </FormItem>
                        <FormItem label="网站关键词" {...formItemLayout }>
                            {getFieldDecorator('siteMetaKeyword', {
                                rules: [
                                    {
                                        required: true,
                                        message: '网站关键词!'
                                    }
                                ]
                            })(<Input placeholder=""/>)}
                        </FormItem>

                        <FormItem label="网站描述" {...formItemLayout }>
                            {getFieldDecorator('siteMetaDescription', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入网站描述!'
                                    }
                                ]
                            })(<TextArea
                                placeholder="网站详情,内容高度自适应"
                                autosize={{
                                minRows: 2,
                                maxRows: 6
                            }}/>)}
                        </FormItem>

                        <FormItem {...buttonItemLayout }>
                            <Button type="primary" loading={this.state.seosubmitLoading} htmlType="submit">
                                保存
                            </Button>
                        </FormItem>
                    </Form>
                </TabPane>

                < TabPane tab="页面设置" key="3">

                    <SitePage localToken={this.props.localToken} siteId={this.props.siteId}/>

                </TabPane>

                < TabPane tab="网站资质证明" key="4">

                    <Button
                        style={{
                        marginBottom: 10
                    }}
                        type="primary"
                        onClick={this
                        .addcert
                        .bind(this)}>
                        添加
                    </Button>
                    <Table
                        bordered
                        dataSource={certdataSource}
                        columns={certcolumns}
                        size="middle"
                        loading={this.state.loading}
                        width={1000}
                        scroll={{
                        x: true
                    }}
                        rowKey="id"/>

                    <Modal
                        onCancel={this
                        .handleCancel
                        .bind(this)}
                        title={this.state.certModalTitle}
                        visible={this.state.certVisible}
                        footer={null}>
                        <div>
                            <Form
                                layout={formLayout}
                                // key={Math.random()}
                                onSubmit={this
                                .certSubmit
                                .bind(this)}>
                                <FormItem label="证书名称" {...formItemLayout }>
                                    {getFieldDecorator('certTitle', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入证书名称!'
                                            }
                                        ]
                                    })(<Input placeholder=""/>)}
                                </FormItem>
                                <FormItem label="证书文件" {...formItemLayout }>
                                    {getFieldDecorator('certImage', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请上传图片!'
                                            }
                                        ]
                                    })(

                                        <div>
                                            <Input
                                                style={{
                                                display: 'none'
                                            }}
                                                ref="certUpElem"
                                                onChange={this
                                                .certupfileinput
                                                .bind(this)}
                                                type="file"
                                                placeholder=""/>
                                            <b
                                                className="ant-btn"
                                                onClick={this
                                                .certUpBtn
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
                                                display: this.state.certimgVisible
                                                    ? 'inline-block'
                                                    : 'none'
                                            }}
                                                src={serverSrc.__proto__.serverSrc + this.state.certdoneImgUrl}></img>
                                        </div>

                                    )}
                                </FormItem>
                                <FormItem label="开始时间" {...formItemLayout }>
                                    {getFieldDecorator('validityBegin', {
                                        rules: [
                                            {
                                                required: !isOnChangeFn,
                                                message: '请选择开始时间!'
                                            }
                                        ]
                                    })(<DatePicker disabled={isOnChangeFn}/>)}

                                </FormItem>
                                <FormItem label="结束时间" {...formItemLayout }>
                                    {getFieldDecorator('validityEnd', {
                                        rules: [
                                            {
                                                required: !isOnChangeFn,
                                                message: '请选择结束时间!'
                                            }
                                        ]
                                    })(<DatePicker disabled={isOnChangeFn}/>)}

                                </FormItem>

                                <FormItem label="永久显示" {...formItemLayout }>
                                    {getFieldDecorator('isPermanent', {
                                        rules: [
                                            {
                                                required: false,
                                                message: ''
                                            }
                                        ]
                                    })(
                                        <Checkbox
                                            style={{
                                            paddingTop: '10px'
                                        }}
                                            defaultChecked={this.state.isPermanent}
                                            onChange={this
                                            .onCancelFn
                                            .bind(this)}></Checkbox>
                                    )}

                                </FormItem>

                                <FormItem label="全站共享" {...formItemLayout }>
                                    {getFieldDecorator('certshared', {
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
                                    {getFieldDecorator('certpublish', {
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

                                <FormItem {...buttonItemLayout }>
                                    <Button type="primary" loading={this.state.submitLoading} htmlType="submit">
                                        提交
                                    </Button>
                                </FormItem>
                            </Form>
                        </div>
                    </Modal>

                </TabPane>

                < TabPane tab="客服信息" key="5">

                    <Button
                        style={{
                        marginBottom: 10
                    }}
                        type="primary"
                        onClick={this
                        .addCustomer
                        .bind(this)}>
                        添加
                    </Button>
                    <Table
                        bordered
                        dataSource={dataSource}
                        columns={columns}
                        size="middle"
                        loading={this.state.loading}
                        width={1000}
                        scroll={{
                        x: true
                    }}
                        rowKey="id"/>

                    <Modal
                        onCancel={this
                        .handleCancel
                        .bind(this)}
                      
                        title={this.state.ModalTitle}
                        visible={this.state.customerVisible}
                        footer={null}>
                        <div>
                            <Form
                                layout={formLayout}
                                onSubmit={this
                                .customerSubmit
                                .bind(this)}>
                                <FormItem label="客服名称" {...formItemLayout }>
                                    {getFieldDecorator('name', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入域名!'
                                            }
                                        ]
                                    })(<Input placeholder=""/>)}
                                </FormItem>
                                <FormItem label="头像" {...formItemLayout }>
                                    {getFieldDecorator('serverName', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入服务器名!'
                                            }
                                        ]
                                    })(

                                        <div>
                                            <Input
                                                style={{
                                                display: 'none'
                                            }}
                                                ref="customerUpElem"
                                                onChange={this
                                                .customerupfileinput
                                                .bind(this)}
                                                type="file"
                                                placeholder=""/>
                                            <b
                                                className="ant-btn"
                                                onClick={this
                                                .customerUpBtn
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
                                                display: this.state.customerimgVisible
                                                    ? 'inline-block'
                                                    : 'none'
                                            }}
                                                src={serverSrc.__proto__.serverSrc + this.state.customerdoneImgUrl}></img>
                                        </div>

                                    )}
                                </FormItem>
                                <FormItem label="Qq" {...formItemLayout }>
                                    {getFieldDecorator('qq', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入ip!'
                                            }
                                        ]
                                    })(<Input placeholder=""/>)}

                                </FormItem>

                                <FormItem label="手机" {...formItemLayout }>
                                    {getFieldDecorator('phone', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '手机!'
                                            }
                                        ]
                                    })(<Input placeholder=""/>)}

                                </FormItem>
                                <FormItem label="排序" {...formItemLayout }>
                                    {getFieldDecorator('ordering', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择上级机构!'
                                            }
                                        ]
                                    })(<Input placeholder=""/>)}

                                </FormItem>
                                <FormItem label="全站共享" {...formItemLayout }>
                                    {getFieldDecorator('shared', {
                                        rules: [
                                            {
                                                required: false,
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
                                                required: false,
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

                                <FormItem {...buttonItemLayout }>
                                    <Button type="primary" loading={this.state.submitLoading} htmlType="submit">
                                        提交
                                    </Button>
                                </FormItem>
                            </Form>
                        </div>
                    </Modal>
                </TabPane>
                < TabPane tab="网站底部" key="6">
                    <SiteFooter localToken={this.props.localToken} siteId={this.props.siteId}/>
                </TabPane>
            </Tabs>
        </div>
    }
}
SiteEditContent = Form.create({})(SiteEditContent);
export default SiteEditContent