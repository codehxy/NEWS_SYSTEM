import { Button, Table, Modal, Form, Input } from 'antd'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import axios from 'axios'


const { confirm } = Modal;
export default function NewsCategory() {

    const [dataSource, setDataSource] = useState([])

    useEffect(() => {
        axios.get("/categories").then(res => {
            setDataSource(res.data)
        })
    }, [])

    const EditableContext = React.createContext(null);
    const EditableRow = ({ index, ...props }) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };
    const EditableCell = ({
        title,
        editable,
        children,
        dataIndex,
        record,
        handleSave,
        ...restProps
    }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef(null);
        const form = useContext(EditableContext);
        useEffect(() => {
            if (editing) {
                inputRef.current.focus();
            }
        }, [editing]);
        const toggleEdit = () => {
            setEditing(!editing);
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            });
        };
        const save = async () => {
            try {
                const values = await form.validateFields();
                toggleEdit();
                handleSave({
                    ...record,
                    ...values,
                });
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };
        let childNode = children;
        if (editable) {
            childNode = editing ? (
                <Form.Item
                    style={{
                        margin: 0,
                    }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ]}
                >
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                </Form.Item>
            ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{
                        paddingRight: 24,
                    }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
        }
        return <td {...restProps}>{childNode}</td>;
    };

    const handleSave = (row) => {

        setDataSource(dataSource.map(data => {
            if (data.id === row.id) {
                return {
                    id: row.id,
                    title: row.title,
                    value: row.value
                }
            }
            return data
        }))

        axios.patch(`/categories/${row.id}`, {
            title: row.title,
            value: row.value
        })
    }

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            render: (Id) => {
                return <b>{Id}</b>
            }
        },
        {
            title: '栏目名称',
            dataIndex: 'title',
            onCell: (record) => ({
                record,
                editable: true,
                dataIndex: 'title',
                title: '栏目名称',
                handleSave: handleSave,
            }),
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button
                        danger shape='circle'
                        onClick={() => {
                            confirmMethod(item)
                        }}
                        icon={<DeleteOutlined />}>
                    </Button>
                </div>
            }
        },
    ];

    const confirmMethod = (item) => {
        confirm({
            title: '系统提示',
            icon: <ExclamationCircleFilled />,
            content: '你确定要删除当前新闻分类吗？',
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
        axios.delete(`/categories/${item.id}`)
    }



    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }}
                components={{
                    body: {
                        row: EditableRow,
                        cell: EditableCell,
                    },
                }} rowKey={(item) => item.id}></Table>
        </div>
    )
}
