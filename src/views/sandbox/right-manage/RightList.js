import { Button, Modal, Popover, Switch, Table, Tag } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons'

const { confirm } = Modal;

export default function RightList() {


    const [dataSource, setDataSource] = useState([])
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get("/rights?_embed=children").then(res => {
            const list = res.data
            list.forEach(item => {
                if (item.children.length === 0) {
                    item.children = ""
                }
            });
            setDataSource(list)
        })
    }, [])


    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            render: (Id) => {
                return <b>{Id}</b>
            }
        },
        {
            title: '权限名称',
            dataIndex: 'title'
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render: (key) => {
                return <Tag color='orange'>{key}</Tag>
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

                    <Popover content={<div style={{ textAlign: "center" }}>
                        <Switch checked={item.pagepermisson} onChange={() => switchMethod(item)}></Switch></div>}
                        title="页面配置置顶" trigger={item.pagepermisson === undefined ? "" : "click"}>

                        <Button type='primary' shape='circle'
                            disabled={item.pagepermisson === undefined}
                            icon={<EditOutlined />}

                        ></Button>
                    </Popover>
                </div>
            }
        },
    ];

    const switchMethod = (item) => {
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
        setDataSource([...dataSource])
        if (item.grade === 1) {
            axios.patch(`/rights/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        } else {
            axios.patch(`/children/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        }
    }

    const confirmMethod = (item) => {
        confirm({
            title: '系统提示',
            icon: <ExclamationCircleFilled />,
            content: '你确定要删除当前权限吗？',
            cancelText: "取消",
            okText: "确认",
            onOk() {
                setLoading(true)
                deleteMethod(item);
                setLoading(false)
            },
            onCancel() {
                setLoading(false)

            },
        });
    };

    const deleteMethod = (item) => {
        console.log(item)
        if (item.grade === 1) {
            setDataSource(dataSource.filter(data => data.id !== item.id))
            axios.delete(`/rights/${item.id}`)
        } else {
            let list = dataSource.filter(data => data.id === item.rightId)
            list[0].children = list[0].children.filter(data => data.id !== item.id)
            setDataSource([...dataSource])
            axios.delete(`/children/${item.id}`)
        }
    }

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} loading={loading} pagination={{ pageSize: 5 }} />
        </div>
    )
}
