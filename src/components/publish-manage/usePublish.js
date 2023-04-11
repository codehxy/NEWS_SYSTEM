import { notification } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react'

function usePublish(publishState) {

    const [dataSource, setDataSource] = useState([])

    const { username } = JSON.parse(localStorage.getItem("token"));

    useEffect(() => {
        axios.get(`/news?author${username}&publishState=${publishState}&_expand=category`).then(res => {
            setDataSource(res.data)
        })
    }, [username, publishState])

    const handlePublish = (id) => {
        axios.patch(`/news/${id}`, {
            publishState: 2,
            publishDTime: Date.now()
        }).then(
            setDataSource(dataSource.filter(data => data.id !== id))
        ).then(res => {
            notification.info({
                message: '系统通知',
                description: '您可以在【发布管理/已发布】查看您的新闻',
                placement: 'bottomRight'
            })
        })
    }

    const handleSubset = (id) => {
        axios.patch(`/news/${id}`, {
            publishState: 3,
        }).then(res => {
            notification.info({
                message: '系统通知',
                description: '您可以在【发布管理/已下线】查看您的新闻',
                placement: 'bottomRight'
            })
        }).then(
            setDataSource(dataSource.filter(data => data.id !== id))
        )
    }

    const handleDelete = (id) => {
        axios.delete(`/news/${id}`).then(res => {
            notification.info({
                message: '系统通知',
                description: '当前已下线新闻删除成功!',
                placement: 'bottomRight'
            })
        }).then(
            setDataSource(dataSource.filter(data => data.id !== id))
        )
    }

    return {
        dataSource,
        handlePublish,
        handleSubset,
        handleDelete
    }
}

export default usePublish
