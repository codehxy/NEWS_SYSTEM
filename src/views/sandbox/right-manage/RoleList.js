import { Button, Table, Modal, Tree } from 'antd'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons'

const { confirm } = Modal;

export default function RoleList() {

    const [dataSource, setDataSource] = useState([]);
    const [rightSource, setRightSource] = useState([]);
    const [currentRights, setCurrentRights] = useState([]);
    const [currentId, setCurrentId] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isModalVisibel, setIsModalVisibel] = useState(false);


    useEffect(() => {
        axios.get("/roles").then(res => {
            setDataSource(res.data)
        })
    }, [])

    useEffect(() => {
        axios.get("/rights?_embed=children").then(res => {
            setRightSource(res.data)
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
            title: '角色名称',
            dataIndex: 'roleName',
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
                            setIsModalVisibel(true)
                            setCurrentRights(item.rights)
                            setCurrentId(item.id)
                        }}
                        icon={<EditOutlined />}>
                    </Button>
                    <Modal title="权限分配" open={isModalVisibel}
                        onOk={handleOk} onCancel={handleCancel}>

                        <Tree checkable
                            checkedKeys={currentRights}
                            onCheck={onCheck}
                            checkStrictly={true}
                            treeData={rightSource}
                        />
                    </Modal>

                </div>
            }
        }

    ]

    const confirmMethod = (item) => {
        confirm({
            title: '系统提示',
            icon: <ExclamationCircleFilled />,
            content: '你确定要删除当前角色吗？',
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
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.delete(`/roles/${item.id}`)

    }


    const handleOk = () => {
        setIsModalVisibel(false);
        setDataSource(dataSource.map(item => {
            if (item.id === currentId) {
                return {
                    ...item,
                    rights: currentRights
                }
            }
            return item;
        }))

        axios.patch(`/roles/${currentId}`, {
            rights: currentRights
        });

        console.log(currentRights)

    };
    const handleCancel = () => {
        setIsModalVisibel(false);
    };

    const onCheck = (checkedKeys) => {
        setCurrentRights(checkedKeys.checked)
    }


    return (
        <div>
            <Table dataSource={dataSource} columns={columns} loading={loading} pagination={{ pageSize: 5 }}
                rowKey={(item) => item.id}></Table>
        </div>
    )
}
