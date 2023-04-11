import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Layout, Dropdown, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { changeCollapsed } from "../../redux/reducers/CollapsedReducer"


const { Header } = Layout;

export default function TopHeader() {

    const isCollapsed = useSelector((state) => state.collapsed.isCollapsed);
    const dispatch = useDispatch()


    const { role: { roleName }, username } = JSON.parse(localStorage.getItem("token"))
    const navigate = useNavigate();
    const items = [
        {
            key: '1',
            label: roleName,
        },
        {
            key: '/login',
            danger: true,
            label: '退出',
        },
    ];
    const changeCollapsed1 = () => {
        dispatch(changeCollapsed());
    }
    const handleClick = (e) => {
        if (e.key === "/login") {
            localStorage.removeItem("token");
            navigate(e.key);
        }
    }
    return (
        <Header className='site-layout-background' style={{
            padding: "0 16px",
        }} >
            {
                isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed1} />
                    : < MenuFoldOutlined onClick={changeCollapsed1} />
            }

            <div style={{ float: "right" }}>
                <span>欢迎<span style={{ color: "#1890ff" }}>{username}</span>回来</span>

                <Dropdown
                    menu={{
                        onClick: handleClick,
                        items
                    }}
                >
                    <Avatar size="large" icon={<UserOutlined />} />

                </Dropdown>
            </div>

        </Header>
    )
}
