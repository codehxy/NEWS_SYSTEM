import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, Input, Select, Steps, message, notification } from 'antd';
import style from "./NewsAdd.module.css"
import axios from 'axios';
import NewsEditor from './NewsEditor';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@ant-design/pro-layout';


const { Option } = Select;
export default function NewsAdd() {

    const [current, setCurrent] = useState(0);
    const [categoriesList, setCategoriesList] = useState([]);
    const NewsForm = useRef(null);
    const [formInfo, setFormInfo] = useState({});
    const [content, setContent] = useState("");
    const navigate = useNavigate();

    const User = JSON.parse(localStorage.getItem("token"));
    useEffect(() => {
        axios.get("/categories").then(res => {
            setCategoriesList(res.data)
        })
    }, [])


    const handleNext = () => {
        if (current === 0) {
            NewsForm.current.validateFields().then(res => {
                console.log(res)
                setFormInfo(res);
                setCurrent(current + 1);
            }).catch(error => {
                console.log(error)
            })
        } else {
            if (content === "" || content.trim() === "<p></p>") {
                message.error("新闻内容不能为空!")
            } else {
                setCurrent(current + 1);
            }
        }
    }

    const handleSave = (auditState) => {
        axios.post("/news", {
            ...formInfo,
            "content": content,
            "region": User.region ? User.region : "全球",
            "author": User.username,
            "roleId": User.roleId,
            "auditState": auditState,
            "publishState": 0,
            "createTime": Date.now(),
            "star": 0,
            "view": 0,
            // "publishTime": 0
        }).then(res => {

            auditState === 0 ? navigate("/news-manage/draft") : navigate("/audit-manage/list")


            notification.info({
                message: `通知`,
                description:
                    `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
                placement: "bottomRight",
            })

        })
    }

    return (
        <div>
            <PageHeader
                // ghost={false}
                // onBack={() => window.history.back()}
                title='撰写新闻'
            />
            <Steps
                current={current}
                items={[
                    {
                        title: '基本信息',
                        description: "新闻标题，新闻分类",
                    },
                    {
                        title: '新闻内容',
                        description: "新闻主题内容",
                    },
                    {
                        title: '新闻提交',
                        description: "保存草稿或提交审核",
                    },
                ]}
            />
            <div style={{ marginTop: "50px" }}>

                <div className={current === 0 ? "" : style.active}>
                    <Form
                        ref={NewsForm}
                        name="basic"
                        labelCol={{
                            span: 4,
                        }}
                        wrapperCol={{
                            span: 20,
                        }}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入新闻标题!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="新闻分类"
                            name="categoryId"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择新闻分类!',
                                },
                            ]}
                        >
                            <Select>
                                {
                                    categoriesList.map(item =>
                                        <Option value={item.id} key={item.id}>{item.title}</Option>
                                    )
                                }
                            </Select>
                        </Form.Item>

                    </Form>
                </div>
                <div className={current === 1 ? "" : style.active}>
                    <NewsEditor getContent={(value) => {
                        setContent(value);
                    }} />
                </div>
                <div className={current === 2 ? "" : style.active}>

                </div>
            </div>
            <div style={{ marginTop: "50px" }}>
                {
                    current === 2 && <span>
                        <Button type="primary" onClick={() => {
                            handleSave(0)
                        }}>保存草稿箱</Button>
                        <Button danger onClick={() => {
                            handleSave(1)
                        }}>提交审核</Button>
                    </span>
                }
                {

                    current < 2 && <Button type="primary" onClick={() => {
                        handleNext()
                    }}>下一步</Button>
                }
                {

                    current > 0 && <Button onClick={() => {
                        setCurrent(current - 1);
                    }}>上一步</Button>
                }
            </div>
        </div>
    )
}

