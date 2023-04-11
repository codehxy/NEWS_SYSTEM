import React, { useEffect, useState } from 'react'
import { PageHeader } from '@ant-design/pro-layout'
import { Descriptions } from 'antd';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment'
import { HeartTwoTone } from '@ant-design/icons';
export default function Detail() {
    const [newsInfo, setnewsInfo] = useState(null)
    const params = useParams()

    useEffect(() => {
        axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(res => {
            setnewsInfo({
                ...res.data,
                view: res.data.view + 1,
            })
            return res
            //同步后端 
        }).then(res => {
            axios.patch(`/news/${params.id}`, {
                view: res.data.view + 1
            })
        })
    }, [params.id])
    const handleStar = () => {
        setnewsInfo({
            ...newsInfo,
            star: newsInfo.star + 1
        })
        axios.patch(`/news/${params.id}`, {
            star: newsInfo.star + 1
        })
    }


    return (
        <div>
            {
                newsInfo && <div>
                    <PageHeader

                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={<div>
                            {newsInfo.category.title}
                            <HeartTwoTone twoToneColor="#eb2f96"
                                style={{ paddingLeft: '5px' }}
                                onClick={() => handleStar()} />
                        </div>}

                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>

                            <Descriptions.Item label="发布时间">{
                                newsInfo.publishTime ? moment(newsInfo.publishTime).format('YYYY/MM//DD HH:mm:ss') : '-'
                            }</Descriptions.Item>
                            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>

                            <Descriptions.Item label="访问数量"><span style={{ color: 'green' }}>{newsInfo.view}</span></Descriptions.Item>
                            <Descriptions.Item label="点赞数量"><span style={{ color: 'green' }}>{newsInfo.star}</span></Descriptions.Item>


                        </Descriptions>
                    </PageHeader>
                    <div dangerouslySetInnerHTML={
                        {
                            __html: newsInfo.content
                        }
                    } style={{ margin: '0 24px' }}>

                    </div>
                </div>

            }
        </div>
    )
}