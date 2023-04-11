import { Button, Modal, Table, notification } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled, UploadOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';



const { confirm } = Modal;
export default function NewsDraft() {

    const [dataSource, setDataSource] = useState([])
    const { username } = JSON.parse(localStorage.getItem("token"))
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
            const list = res.data
            setDataSource(list)
        })
    }, [username])


    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            render: (Id) => {
                return <b>{Id}</b>
            }
        },
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title, item) => {
                return <a href={`/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render: (category) => {
                return category.title
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape='circle'
                        onClick={() => {
                            confirmMethod(item)
                        }}
                        icon={<DeleteOutlined />}>
                    </Button>


                    <Button type='primary' shape='circle'
                        onClick={() => {
                            navigate(`/news-manage/update/${item.id}`)
                        }}
                        icon={<EditOutlined />}

                    ></Button>


                    <Button type='primary' shape='circle'
                        onClick={() => handleCheck(item.id)}
                        icon={<UploadOutlined />}

                    ></Button>
                </div>
            }
        },
    ];

    const handleCheck = (id) => {
        axios.patch(`/news/${id}`, {
            auditState: 1
        }).then(res => {
            navigate("/audit-manage/list")

            notification.info({
                message: `通知`,
                description:
                    `您可以到审核列表中查看您的新闻`,
                placement: "bottomRight",
            })

        })
    }

    const confirmMethod = (item) => {
        confirm({
            title: '系统提示',
            icon: <ExclamationCircleFilled />,
            content: '你确定要删除当前草稿吗？',
            cancelText: "取消",
            okText: "确认",
            onOk() {
                deleteMethod(item);
            },
            onCancel() { },
        });
    };

    const deleteMethod = (item) => {

        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.delete(`/news/${item.id}`)
    }


    return (
        <div>
            <Table dataSource={dataSource} columns={columns}
                rowKey={(item) => item.id}></Table>
        </div>
    )
}
