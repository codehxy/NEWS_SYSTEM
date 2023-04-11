import { Form, Input, Select } from 'antd';
import React, { forwardRef, useEffect, useState } from 'react'


const { Option } = Select;
const UserForm = forwardRef((props, ref) => {

    const [isDisabled, setIsDisabled] = useState(false);
    useEffect(() => {
        setIsDisabled(props.isUpdatDisabled)
    }, [props.isUpdatDisabled])
    const { roleId, region } = JSON.parse(localStorage.getItem("token"));
    const roleIdList = {
        "1": "superadmin",
        "2": "admin",
        "3": "editor"
    }
    const checkRegionDisabled = (item) => {
        if (props.isUpdate) {
            if (roleIdList[roleId] === "superadmin") {
                return false;
            } else {
                return true;
            }
        } else {
            if (roleIdList[roleId] === "superadmin") {
                return false;
            } else {
                return region !== item.value;
            }
        }
    }

    const checkRoleDisabled = (item) => {
        if (props.isUpdate) {
            if (roleIdList[roleId] === "superadmin") {
                return false;
            } else {
                return true;
            }
        } else {
            if (roleIdList[roleId] === "superadmin") {
                return false;
            } else {
                console.log(roleId, item)
                return roleIdList[item.roleType] !== "editor";
            }
        }
    }


    return (
        <Form
            ref={ref}
            layout="vertical"
        >
            <Form.Item
                name="username"
                label="用户名"
                rules={[
                    {
                        required: true,
                        message: '请输入用户名',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[
                    {
                        required: true,
                        message: '请输入密码',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={isDisabled ? [] : [
                    {
                        required: true,
                        message: '请选择区域',
                    },
                ]}
            >
                <Select disabled={isDisabled}>
                    {
                        props.regionList.map(item =>
                            <Option value={item.value}
                                disabled={checkRegionDisabled(item)}
                                key={item.id}>{item.title}</Option>)
                    }
                </Select>
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[
                    {
                        required: true,
                        message: '请选择角色',
                    },
                ]}
            >
                <Select onChange={(value) => {
                    if (value === 1) {
                        setIsDisabled(true)
                        ref.current.setFieldsValue({
                            region: ""
                        })
                    } else {
                        setIsDisabled(false)
                    }
                }}>
                    {
                        props.roleList.map(item =>
                            <Option value={item.id}
                                disabled={checkRoleDisabled(item)}
                                key={item.id}>{item.roleName}</Option>)
                    }
                </Select>
            </Form.Item>
        </Form>
    )
})

export default UserForm