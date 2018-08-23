import React from "react";
import { List,Row,Col ,Carousel,Button,Icon } from 'antd';
export default class Homeindex extends React.Component{
    componentWillUnmount  () {

    }
    render(){
        const data = [
            'Racing car sprays burning fuel into crowd.',
            'Japanese princess to wed commoner.',
            'Australian walks 100km after outback crash.',
            'Man charged over missing wedding girl.',
            'Los Angeles battles huge wildfires.',
            'Man charged over missing wedding girl.',
            'Los Angeles battles huge wildfires.',
        ];
        console.log(this.props)
        return (
            <div className="gutter-example">
                <div className="centerContainer">
                    <div style={{paddingTop:'15px'}}>
                        <Row>
                            <Col  span={5}>
                                <List
                                    header={<div>Header</div>}
                                    footer={<div>Footer</div>}
                                    bordered
                                    dataSource={data}
                                    renderItem={item => (<List.Item>{item}</List.Item>)}
                                />
                            </Col>

                            <Col  span={5}>
                                <div className="ant-list-bordered" style={{height:'413px',overflow:'hidden',padding:'0 15px'}}>
                                    <div style={{lineHeight:'80px',height:'80px'}}>

                                        <div style={{paddingLeft:'15px',display:'inline-block',lineHeight:'14px',verticalAlign:' middle'}}>
                                            <p>
                                                你好as654
                                            </p>
                                            <p>
                                                欢迎来到某某0000
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{margin:'15px auto',display:'inline-block',lineHeight:'14px',verticalAlign:' middle'}}>
                                        <Button.Group >
                                            <Button type="primary">
                                                登录
                                            </Button>
                                            <Button type="primary">
                                                注册
                                            </Button>
                                        </Button.Group>
                                    </div>
                                    <div style={{margin:'15px auto',display:'inline-block',lineHeight:'14px',verticalAlign:' middle'}}>
                                        <Button.Group >
                                            <Button type="primary">
                                                发布货源
                                            </Button>
                                            <Button type="primary">
                                                发布软件
                                            </Button>
                                            <Button type="primary">
                                                发布文章
                                            </Button>
                                        </Button.Group>
                                    </div>
                                    <ul className='listStyle'>
                                        <li>
                                            <h2>规则信息</h2>
                                        </li>
                                        <li>
                                            <a href="javascript:;">规则信息</a>
                                        </li>
                                        <li>
                                            <a href="javascript:;">规则信息</a>
                                        </li>
                                        <li>
                                            <a href="javascript:;">规则信息</a>
                                        </li>
                                        <li>
                                            <a href="javascript:;">规则信息</a>
                                        </li>
                                        <li>
                                            <a href="javascript:;">规则信息</a>
                                        </li>
                                        <li>
                                            <a href="javascript:;">规则信息</a>
                                        </li>
                                        <li>
                                            <a href="javascript:;">规则信息</a>
                                        </li>

                                    </ul>

                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        )
    }
}