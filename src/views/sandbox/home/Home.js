import { Card, Col, Drawer, List, Row } from 'antd'
import { PieChartOutlined, EllipsisOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import * as Echarts from "echarts"
import _ from "lodash"


const { Meta } = Card;
export default function Home() {

    const [viewList, setViewList] = useState([])
    const [starList, setStarList] = useState([])
    const [allList, setAllList] = useState([])
    const [visible, setVisible] = useState(false)
    const [pieChart, setPieChart] = useState(null);
    const barRef = useRef()
    const pieRef = useRef()
    useEffect(() => {
        axios
            .get(
                '/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6'
            )
            .then((res) => {
                setViewList(res.data)
            })
        axios
            .get(
                '/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6'
            )
            .then((res) => {
                setStarList(res.data)
            })

        axios.get('/news?publishState=2&_expand=category').then((res) => {
            renderBarView(_.groupBy(res.data, (item) => item.category.title))
            setAllList(res.data)
        })

        return () => {
            window.onresize = null
        }
    }, [])
    const renderBarView = (obj) => {
        var myChart = Echarts.init(barRef.current)

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '新闻分类图示',
            },
            tooltip: {},
            legend: {
                data: ['数量'],
            },
            xAxis: {
                data: Object.keys(obj),
                axisLabel: {
                    interval: 0,
                    rotate: '45',
                },
            },
            yAxis: {
                minInterval: 1,
            },
            series: [
                {
                    name: '数量',
                    type: 'bar',
                    data: Object.values(obj).map((item) => item.length),
                },
            ],
        }

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option)
        window.onresize = () => {
            myChart.resize()
        }
    }
    const renderPieView = () => {
        let currentList = allList.filter((data) => data.author === username);
        let groupObj = _.groupBy(currentList, (item) => item.category.title);
        let list = [];
        for (let i in groupObj) {
            list.push({
                name: i,
                value: groupObj[i].length,
            });
        }

        var myChart
        if (!pieChart) {
            myChart = Echarts.init(pieRef.current);
            setPieChart(myChart);
        } else {
            myChart = pieChart;
        }

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '当前用户新闻分类图示',
                // subtext: 'Fake Data',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: '发布数量',
                    type: 'pie',
                    radius: '50%',
                    data: list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        option && myChart.setOption(option);
    }

    const {
        username,
        region,
        role: { roleName },
    } = JSON.parse(localStorage.getItem('token'))
    return (
        <div className="site-card-wrapper">
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="用户最常浏览" bordered={false}>
                        <List
                            size="small"
                            dataSource={viewList}
                            renderItem={(item) => (
                                <List.Item>
                                    <a href={`/news-manage/preview/${item.id}`}>{item.title}</a>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户点赞最多" bordered={false}>
                        <List
                            size="small"
                            dataSource={starList}
                            renderItem={(item) => (
                                <List.Item>
                                    <a href={`/news-manage/preview/${item.id}`}>{item.title}</a>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <PieChartOutlined key="setting" onClick={() => {
                                setVisible(true)
                                setTimeout(() => {
                                    renderPieView()
                                }, 0);
                            }} />,
                            //   <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                            //   avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                            title={username}
                            description={
                                <div>
                                    <b style={{ marginRight: '10px' }}>
                                        {region === '' ? '全球' : region}
                                    </b>
                                    <span>{roleName}</span>
                                </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>

            <Drawer
                width="500px"
                title="个人新闻分类"
                placement="right"
                onClose={() => setVisible(false)}
                open={visible}
            >
                <div
                    ref={pieRef}
                    style={{ marginTop: '30px', width: '100%', height: '400px' }}
                ></div>
            </Drawer>

            <div
                ref={barRef}
                style={{ marginTop: '30px', width: '100%', height: '400px' }}
            ></div>
        </div>
    )
}
