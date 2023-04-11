import { Button, Form, Input, message } from 'antd'
import React from 'react'
import "./Login.css"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function Login() {

    const navigate = useNavigate();

    const onFinish = (values) => {
        axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res => {
            if (res.data.length === 0) {
                message.error("登录失败!")
            } else {
                setTimeout(() => {
                    localStorage.setItem("token", JSON.stringify(res.data[0]))
                    navigate("/home");
                    message.success("登录成功!")
                }, 0)
            }
        })

    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className='loginBox'>
            <div className='formBox'>
                <div className='topBox'>全球新闻发布系统</div>
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={{
                        maxWidth: 600,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="用户名"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入密码!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
