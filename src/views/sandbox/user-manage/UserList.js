import { Button, Modal, Switch, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import UserForm from '../../../components/user-manage/UserForm';

const { confirm } = Modal;

export default function UserList() {


    const [dataSource, setDataSource] = useState([])
    const [loading, setLoading] = useState(false);
    const [isAddVisible, setIsAddVisible] = useState(false);
    const [isUpdateVisible, setIsUpdateVisible] = useState(false);
    const [isUpdatDisabled, setIsUpdatDisabled] = useState(false);
    const [roleList, setRoleList] = useState([]);
    const [regionList, setRegionList] = useState([]);
    const [current, setCurrent] = useState(null);

    const addForm = useRef();
    const updateForm = useRef();

    const { roleId, region, username } = JSON.parse(localStorage.getItem("token"));


    useEffect(() => {
        const roleIdList = {
            "1": "superadmin",
            "2": "admin",
            "3": "editor"
        }
        axios.get("/users?_expand=role").then(res => {
            const list = res.data

            setDataSource(roleIdList[roleId] === "superadmin" ? list : [
                ...list.filter(item => item.username === username),
                ...list.filter(item => item.region === region && roleIdList[item.roleId] === "editor")
            ])
        })
    }, [roleId, region, username])


    useEffect(() => {
        axios.get("/regions").then(res => {
            const list = res.data
            setRegionList(list)
        })
    }, [])


    useEffect(() => {
        axios.get("/roles").then(res => {
            const list = res.data
            setRoleList(list)
        })
    }, [])


    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            filters: [
                {
                    text: "全球",
                    value: ""
                },
                ...regionList.map(item => ({
                    text: item.title,
                    value: item.value
                }))
            ],

            onFilter: (value, item) => item.region === value,

            render: (region) => {
                return <b>{region === "" ? "全球" : region}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render: (role) => {
                return role.roleName
            }
        },
        {
            title: '用户名',
            dataIndex: 'username'
        },
        {
            title: '用户状态',
            dataIndex: 'roleState',
            render: (roleState, item) => {
                return <Switch checked={roleState} disabled={item.default}
                    onChange={() => handleChange(item)}></Switch>
            }

        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape='circle'
                        disabled={item.default}
                        onClick={() => confirmMethod(item)}
                        icon={<DeleteOutlined />}>
                    </Button>

                    <Button type='primary' shape='circle'
                        disabled={item.default}
                        onClick={() =>
                            handleUpdate(item)
                        }
                        icon={<EditOutlined />}>

                    </Button>
                </div>
            }
        },
    ];

    const handleChange = (item) => {
        item.roleState = !item.roleState;
        setDataSource([...dataSource]);
        axios.patch(`/users/${item.id}`, {
            roleState: item.roleState
        })
    }


    const confirmMethod = (item) => {
        confirm({
            title: '系统提示',
            icon: <ExclamationCircleFilled />,
            content: '你确定要删除当前用户吗？',
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
        axios.delete(`/users/${item.id}`)
    }

    const addFormOk = () => {
        addForm.current.validateFields().then(values => {
            setIsAddVisible(false);
            addForm.current.resetFields();
            axios.post(`/users/`, {
                ...values,
                "roleState": true,
                "default": false
            }).then(res => {
                setDataSource([...dataSource, {
                    ...res.data,
                    role: roleList.filter(item => item.id === values.roleId)[0]
                }])
            })

        }).catch(err => {
            console.log(err)
        })

    }

    const handleUpdate = (item) => {
        setIsUpdateVisible(true)
        if (item.roleId === 1) {
            setIsUpdatDisabled(true);
        } else {
            setIsUpdatDisabled(false);
        }
        setTimeout(() => {
            updateForm.current.setFieldsValue(item)
        }, 0)
        setCurrent(item)
    }

    const updateFormOk = () => {
        updateForm.current.validateFields().then(values => {
            setIsUpdateVisible(false);

            setDataSource(dataSource.map(item => {
                if (item.id === current.id) {
                    return {
                        ...item,
                        ...values,
                        role: roleList.filter(data => data.id === values.roleId)[0]
                    }
                }
                return item
            }))
            setIsUpdatDisabled(!isUpdatDisabled)

            axios.patch(`/users/${current.id}`, values)

        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <div>
            <Button type='primary' onClick={() => { setIsAddVisible(true) }}>添加用户</Button>
            <Table dataSource={dataSource} columns={columns} loading={loading}
                pagination={{ pageSize: 5 }} rowKey={item => item.id} />


            <Modal
                open={isAddVisible}
                title="添加用户"
                okText="确认"
                cancelText="取消"
                onCancel={() => {
                    addForm.current.resetFields();
                    setIsAddVisible(false)
                }}
                onOk={() => {
                    addFormOk()
                }}
            >
                <UserForm ref={addForm} roleList={roleList} regionList={regionList}></UserForm>
            </Modal>


            <Modal
                open={isUpdateVisible}
                title="更该用户"
                okText="确认"
                cancelText="取消"
                onCancel={() => {
                    setIsUpdatDisabled(!isUpdatDisabled)
                    setIsUpdateVisible(false)
                }}
                onOk={() => {
                    updateFormOk()
                }}
            >
                <UserForm isUpdatDisabled={isUpdatDisabled} ref={updateForm}
                    roleList={roleList} isUpdate={true} regionList={regionList}></UserForm>
            </Modal>

        </div>
    )
}
