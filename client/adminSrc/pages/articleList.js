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
// import Ueditor from './Ueditor'
const {TextArea} = Input;
import {connect} from 'react-redux';
import serverSrc from '../../../public/config';
import createHistory from 'history/createHashHistory';

const history = createHistory();
import fetch from '../component/fetch';
import {ArticleFn,} from "../actions/index.redux";


class ArticleList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            formLayout: 'horizontal',

            loading: false,

            ModaltreeData: [],
            addTreeSelect: [],

            treeData: [],
            visible: false,
            tableData:[],
            dataSource: [],
            productClassifyData: [],
            localToken: localStorage.getItem('token'),
            loading: true,
            onSelectLength: 10,
            submitLoading: false,
            ModalTitle: '',
            treeEvent: '',
            editModal: false,
            //上传状态
            fileList: [],
            defaultFileList: [],
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
            filtersArr: null,
        };


    }

    componentWillMount() {
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

    componentWillReceiveProps() {

    }

    componentDidMount() {
        this.searchSite()

    }

    onDelete(key) {
        this.props.ArticleFn('delete', {_id: key}).then(data => {
            message.info(data.msg);
            this.searchSite()
        })
    }

    // 添加按钮
    addCate() {
        this
            .props
            .form
            .resetFields();
        console.log(this.state.fileList)
        this.setState({
            submitLoading: false,
            visible: true,
            ModalTitle: '添加文章',
            fileList: []
        }, function () {

            // UE
            //   .getEditor('contentProduct')
            //   .ready(function () {
            //     UE
            //       .getEditor('contentProduct')
            //       .setContent('请输入内容。。。')
            //   })

        });
    }

    //树形删除机构


    searchSite(id) {
        this.setState({loading: true})
        var _thisState = this
        this.props.ArticleFn('query').then(data => {
            data.status != 'ok' ? message.info(data.msg) : null;
            this.setState({loading: false,tableData:this.props.state.userLogin.tableData})
        })
    }

    //自动上传方法，原ANT 上传组件跨域存在问题 添加机构
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
                    console.log(values, formData)
                    this.setState({submitLoading: true});
                    if (this.state.ModalTitle == "编辑文章") {
                        if (values.image.file !== undefined) {
                            values.image = values.image.file.response.name
                        }
                        fetch('article', Object.assign({
                            type: 'edit',
                            _id: this.state.setSiteId,
                            updatedAt:new Date()
                        }, values)).then(data => {
                            message.info(data.msg);
                            this.setState({submitLoading: false, visible: false});
                            this.searchSite()
                        })
                    } else {
                        values != undefined ? values.image = values.image.file.response.name : null;
                        fetch('article', Object.assign({type: 'add',createdAt:new Date()}, values)).then(data => {
                            message.info(data.msg);
                            this.setState({submitLoading: false, visible: false});
                            this.searchSite()
                        })
                    }
                }
            })
    }

    renderTreeNodes(data) {
        return data.map((item) => {
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

        // this.setState({loading: true})
        //
        // var formData = new FormData();
        // formData.append('siteId', id);
        // formData.append("token", this.state.localToken);
        // formData.append('type', 'article');
        // var opts = {
        //   method: "POST", //请求方法
        //   body: formData, //请求体
        //   credentials: 'include'
        // }

        // fetch(serverSrc.__proto__.serverSrc + "admin/cate/query", opts).then((response) => {
        //   //你可以在这个时候将Promise对象转换成json对象:response.json() 转换成json对象后return，给下一步的.then处理
        //   return response.json()
        // }).then((responseText) => {
        //   this.setState({loading: false})
        //   if (responseText.status == '200') {
        //
        //     this.setState({selectdataSource: responseText.data});
        //
        //   } else {
        //     // message.info(responseText.msg)
        //   }
        // }).catch((error) => {
        //   alert(error)
        // })
    }

    //编辑 分类
    editModal(ev) {
        const fileList = [{
            uid: -1,
            name: ev.image,
            status: 'done',
            url: serverSrc.url + 'serverPublic/images/' + ev.image,
            thumbUrl: serverSrc.url + 'serverPublic/images/' + ev.image,
        }];
        this.props.form.setFieldsValue({
            // categoryId: ev.categoryId, orgId:ev.orgId, description: ev.description,
            title: ev.title,
            shortDescription: ev.shortDescription,
            url: ev.url,
            author: ev.author,
            image: ev.image,
            ordering: ev.ordering,
            keyword: ev.keyword,
            publish: ev.publish
        })


        this.setState({
            submitLoading: false,
            visible: true,
            imgVisible: true,
            setSiteId: ev._id,
            fileList: [...fileList],
            defaultFileList: [...fileList],
            ModalTitle: '编辑文章'
        }, function () {
            UE
                .getEditor('contentProduct')
                .ready((ueditor) => {
                    UE
                        .getEditor('contentProduct')

                        .setContent(ev.content)
                });
        });

    }

    //树形 操作
    onSelect(ev, event, a, b) {
        this.setState({onSelectLength: ev})
        if (ev.length > 0) {
            this.searchSite(ev[0]);
            this.setState({treeEvent: event.selectedNodes[0].props.dataRef})
            var _this = this;
            setTimeout(function () {
                _this.selectClass(ev[0]);
            }, 500)
        }

    }

    handleCancel() {
        // UM.delEditor('contentProduct');
        this.setState({previewVisible: false, visible: false, tableImagesVisible: false})
        // document.getElementsByClassName('ant-upload-list')[0].innerHTML="";
    }

    showImages(e, iamgeSrc) {
        this.setState({previewImage: e.target.src, tableImagesVisible: true});
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
        this.setState({searchText: e.target.value});
        // console.log(thiis.state.searchText)
    }

    onSearch() {
        const {searchText} = this.state;
        const reg = new RegExp(searchText, 'gi');
        if (searchText == '') {
            this.searchSite()
        } else {
            this.setState({
                filterDropdownVisible: false,
                filtered: !!searchText,
                loading: true
                // dataSource: this.state.dataSource.map((record) => { const match = record.title.match(reg);
                //     if (!match) {
                //       return null;
                //     }
                //     return record;
                //   })
                //   .filter(record => !!record)
            });
            // console.log(this.state.searchText)
            this.props.ArticleFn('search', {search: this.state.searchText}).then(data => {
                this.setState({
                    loading: false
                })
            })
        }
    }

    handleTableChange(pagination, filters, sorter) {
        this.setState({loading: true});
        console.log(this.state.searchText,pagination.current)
        if (this.state.searchText === undefined
        ) {

            this.props.ArticleFn('query', {current: pagination.current}).then(res => {
                this.setState({loading: false,tableData:this.props.state.userLogin.tableData});
            })
        } else {
            this.props.ArticleFn('search', {current: pagination.current, search: this.state.searchText}).then(res => {
                this.setState({loading: false,tableData:this.props.state.userLogin.tableData});
            })
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
                    span: 18
                },
                sm: {
                    span: 18
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
                title: '标题',
                dataIndex: 'title',
                className: 'column-center',
                width: 150,
                key: 'title',
                filterDropdown: (
                    <div className="custom-filter-dropdown" ref="DropdownVb">
                        <Input
                            ref={ele => this.searchInput = ele}
                            placeholder="Search title"
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
                title: '简介',
                dataIndex: 'shortDescription',
                className: 'column-center',
                width: 180,
                render: (text) => {
                    return (
                        <div
                            style={{
                                textOverflow: 'ellipsis',
                                display: 'inline-block',
                                height: '30.5px',
                                overflow: 'hidden',
                                padding: '6px 8px',
                                lineHeight:'20px'
                                // width: '180px',
                                // whiteSpace: 'nowrap'
                            }}>
                            {text}
                        </div>
                    )
                },
                key: 'shortDescription'
            }, {
                title: '标题图片',
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
                        src={serverSrc.url + 'serverPublic/images/' + record.image}/>);
                }
            }, {
                title: '作者',
                dataIndex: 'author',
                className: 'column-center',
                width: 150,
                key: 'author',
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
                }
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
                title: '显示日期',
                dataIndex: 'date',
                className: 'column-center',
                width: 200,
                key: 'date'
            }, {
                title: '关键词',
                className: 'column-center',
                dataIndex: 'keyword',
                width: 180,
                key: 'keyword',
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
                // sorter: (a, b) => {     if (a.permission_date === undefined) {
                // a.permission_date = ' '     };     if (b.permission_date === undefined) {
                // b.permission_date = ' '     };     return a.permission_date.length -
                // b.permission_date.length },
                className: 'column-center',
                dataIndex: 'ordering',
                width: 150,
                key: 'ordering'
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
                dataIndex: 'operation1',
                className: 'column-center',
                width: 120,
                fixed: 'right',
                key: 'operation1',
                render: (text, record) => {
                    if (record.siteId == this.state.onSelectLength[0]) {
                        return (
                            <div>
                                <Popconfirm title="确认删除该条信息?" onConfirm={() => this.onDelete(record._id)}>
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
        var _this = this
        const props2 = {
            action: '//127.0.0.1:3333/upload',
            accept: 'image/*',
            listType: 'picture',
            fileList: this.state.fileList,
            defaultFileList: this.state.defaultFileList,
            className: 'upload-list-inline',
            onRemove() {
                _this.props.form.setFieldsValue({
                    image: undefined,
                })
                _this.setState({fileList: []});
            },
            // defaultFileList:this.state.fileList,
            onChange(info) {
                // console.log(info.fileList ,111)
                // if (info.file.status !== 'uploading') {
                //
                // }
                // if (info.file.status === 'done') {
                //     message.success(`${info.file.name} file uploaded successfully`);
                //     // this.setState({
                //     //     fileList:info.fileList
                //     // })
                //     // info.fileList=[];
                // } else if(info.file.status === 'error') {
                //     message.error(`${info.file.name} file upload failed.`);
                // }
                let fileList = info.fileList;

                // 1. Limit the number of uploaded files
                //    Only to show two recent uploaded files, and old ones will be replaced by the new
                fileList = fileList.slice(-1);

                // 2. read from response and show file link
                fileList = fileList.map((file) => {
                    if (file.response) {
                        // Component will show file.url as link
                        file.url = file.response.url;
                    }
                    return file;
                });

                // 3. filter successfully uploaded files according to response from server
                // fileList = fileList.filter((file) => {
                //     if (file.response) {
                //         return file.response.status === 'success';
                //     }
                //     return true;
                // });
                console.log(info)
                _this.setState({fileList: fileList});
            },
        };
        const hasSelected = this.state.onSelectLength > 0;
        return (
            <Row>
                <Col span={24}>
                    <Button.Group>
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

                    </Button.Group>
                    <Modal
                        onCancel={this
                            .handleCancel
                            .bind(this)}
                        title={this.state.ModalTitle}
                        visible={this.state.visible}
                        // width={1000}
                        footer={null}>
                        <div ref="bbbbbb">
                            <Form
                                layout={formLayout}
                                onSubmit={this
                                    .nodeSubmit
                                    .bind(this)}>
                                <FormItem label="文章标题" {...formItemLayout}>
                                    {getFieldDecorator('title', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入名称!'
                                            }
                                        ]
                                    })(<Input placeholder=""/>)}
                                </FormItem>
                                <FormItem label="文章简介" {...formItemLayout}>
                                    {getFieldDecorator('shortDescription', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入名称文章简介'
                                            }
                                        ]
                                    })(<TextArea
                                        placeholder="description"
                                        autosize={{
                                            minRows: 2,
                                            maxRows: 6
                                        }}/>)}
                                </FormItem>
                                <FormItem label="文章链接" {...formItemLayout}>
                                    {getFieldDecorator('url', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入文章跳转地址'
                                            }
                                        ]
                                    })(<Input placeholder=""/>)}
                                </FormItem>
                                <FormItem label="文章作者" {...formItemLayout}>
                                    {getFieldDecorator('author', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入文章作者!'
                                            }
                                        ]
                                    })(<Input placeholder=""/>)}
                                </FormItem>
                                <FormItem label="标题图片" {...formItemLayout}>
                                    {getFieldDecorator('image', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请上传标题图片!'
                                            }
                                        ]
                                    })(
                                        <Upload {...props2}>
                                            <Button>
                                                <Icon type="upload"/> upload
                                            </Button>
                                        </Upload>
                                    )}
                                </FormItem>
                                <FormItem label="显示日期" {...formItemLayout}>
                                    {getFieldDecorator('date', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '!'
                                            }
                                        ]
                                    })(<DatePicker/>)}
                                </FormItem>
                                <FormItem label="排序" {...formItemLayout}>
                                    {getFieldDecorator('ordering', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入排序!'
                                            }
                                        ]
                                    })(<Input placeholder=""/>)}
                                </FormItem>
                                <FormItem label="文章标签" {...formItemLayout}>
                                    {getFieldDecorator('keyword', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入文章标签!'
                                            }
                                        ]
                                    })(<Input placeholder="格式：蒹葭萋萋，白露未晞"/>)}
                                </FormItem>
                                <FormItem label="是否显示" {...formItemLayout}>
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
                                <FormItem {...buttonItemLayout}>
                                    <Button type="primary" loading={this.state.submitLoading} htmlType="submit">
                                        提交
                                    </Button>
                                </FormItem>
                            </Form>
                        </div>
                    </Modal>
                    <Table
                        bordered
                        dataSource={this.state.tableData}
                        columns={columns}
                        size="small"
                        pagination={{total: this.props.state.userLogin.total}}
                        onChange={this.handleTableChange.bind(this)}
                        loading={this.state.loading}
                        rowKey="_id"
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


const mapStatetoProps = (state => {
    return {state}
});
const actionCreators = {ArticleFn}
ArticleList = connect(mapStatetoProps, actionCreators)(ArticleList)
ArticleList = Form.create({})(ArticleList);
export default ArticleList
//
// <Col
// span={5}
// style={{
//     height: 545,
//         overflow: "auto"
// }}>
//
// <Tree
// showLine
// onSelect={this
//     .onSelect
//     .bind(this)}
// defaultExpandAll>
// {this.renderTreeNodes(this.state.ModaltreeData)}
// </Tree>
// </Col>
// <Col span={1}></Col>


// <FormItem label="文章内容" {...ueditorformItemLayout }>
// <Ueditor id="contentProduct"/>
//     </FormItem>


/* <Upload
defaultFileList={this.state.doneList}
action={serverSrc.__proto__.serverSrc+'admin/in/upload'} data={{'token':this.state.localToken,'image':this.state.fileList}} beforeUpload={this.beforeUpload.bind(this)}  onChange={this.onChange.bind(this)} listType='picture'  onRemove={this.UponRemove.bind(this)}>
<Button>
<Icon type="upload" />上传
</Button>
</Upload>         */

/* <b  className="ant-btn"  style={{lineHeight:2.15}}> 上传</b> */
