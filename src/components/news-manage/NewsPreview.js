import React, { useEffect, useState } from 'react'
import { PageHeader } from '@ant-design/pro-layout'
import { Descriptions } from 'antd';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment/moment';

export default function NewsPreview() {

    const [news, setNews] = useState({})
    const params = useParams();
    const auditList = ["未审核", "审核中", "已通过", "未通过"]
    const publishList = ["未发布", "待发布", "已上线", "以下线"]
    const colorList = ['black', 'orange', 'green', 'red']

    useEffect(() => {
        axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(res => {
            setNews(res.data)
        })
    }, [params.id])

    return (
        <div>
            {
                news && <div>
                    <PageHeader
                        // ghost={false}
                        onBack={() => window.history.back()}
                        title={news.title}
                        subTitle={news.category?.value}
                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者">
                                {news.author}
                            </Descriptions.Item>
                            <Descriptions.Item label="创建时间">
                                {moment(news.createTime).format('yyyy-MM-DD HH:mm:ss')}
                            </Descriptions.Item>
                            <Descriptions.Item label="发布时间">
                                {news.publishTime
                                    ? moment(news.publishTime).format('yyyy-MM-DD HH:mm:ss')
                                    : '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="区域">{news.region}</Descriptions.Item>
                            <Descriptions.Item label="审核状态">
                                <span style={{ color: colorList[news.auditState] }}>
                                    {auditList[news.auditState]}
                                </span>
                            </Descriptions.Item>
                            <Descriptions.Item label="发布状态">
                                <span style={{ color: colorList[news.publishState] }}>
                                    {publishList[news.publishState]}
                                </span>
                            </Descriptions.Item>
                            <Descriptions.Item label="访问数量">
                                <span style={{ color: 'green' }}>{news.view}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="点赞数量">
                                <span style={{ color: 'green' }}>{news.star}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="评论数量">
                                <span style={{ color: 'green' }}>0</span>
                            </Descriptions.Item>
                        </Descriptions>
                    </PageHeader>

                    <div
                        dangerouslySetInnerHTML={{
                            __html: news.content,
                        }}
                        style={{
                            margin: "0 24px",
                            border: "1px solid purple"
                        }}
                    ></div>

                </div>
            }

        </div>
    )
}
