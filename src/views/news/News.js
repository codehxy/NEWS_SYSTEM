import { PageHeader } from '@ant-design/pro-layout'
import { Card, Col, List, Row } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import _ from "lodash"

export default function News() {
    const [list, setlist] = useState([])
    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category').then(res => {
            // console.log(Object.entries(_.groupBy(res.data,item=>item.category.title)));
            setlist(Object.entries(_.groupBy(res.data, item => item.category.title)))
        })
    }, [])
    return (
        <div>
            <PageHeader
                className="site-page-header"
                // onBack={() => null}
                title="全球大新闻"
                subTitle="查看新闻"
            />
            <div className="site-card-wrapper" style={{
                width: '95%',
                margin: '0 auto'
            }}>
                <Row gutter={[16, 16]}>
                    {
                        list.map(item =>
                            <Col span={8} key={item[0]}>
                                <Card title={item[0]} bordered={false} hoverable={true}>
                                    <List
                                        size="small"
                                        bordered={false}
                                        dataSource={item[1]
                                        }
                                        renderItem={data => <List.Item>
                                            <a href={`/detail/${data.id}`}>{data.title}</a>
                                        </List.Item>}
                                        pagination={{
                                            pageSize: 5
                                        }}
                                    />
                                </Card>
                            </Col>)
                    }

                </Row>
            </div>
        </div>
    )
}
