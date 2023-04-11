import { Layout, Menu } from 'antd';
import { useEffect, useState } from 'react';
import "./index.css"
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SubMenu from 'antd/es/menu/SubMenu';
import { useSelector } from 'react-redux';


const { Sider } = Layout;

export default function SideMenu() {

    const isCollapsed = useSelector((state) => state.collapsed.isCollapsed);

    const [menuList, setMenuList] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        axios.get("/rights?_embed=children").then(res => {
            setMenuList(res.data)
        }
        )
    }, [])




    const onClick = (e) => {
        navigate(e.key);
    };

    const { role: { rights } } = JSON.parse(localStorage.getItem("token"))

    const checkPagePermission = item => {
        return item.pagepermisson && rights.includes(item.key)
    }
    const renderMenu = (menuList) => {
        return menuList.map(item => {
            if (item.children?.length > 0 && checkPagePermission(item)) {
                return <SubMenu key={item.key} title={item.title}>
                    {renderMenu(item.children)}
                </SubMenu>
            }
            return checkPagePermission(item) && <Menu.Item key={item.key}
                onClick={onClick}>{item.title}</Menu.Item>
        })
    }

    const selecteKey = [location.pathname];
    const openKey = ["/" + location.pathname.split("/")[1]];


    return (
        <Sider trigger={null} collapsed={isCollapsed} collapsible  >
            <div style={{ display: "flex", height: "100%", "flexDirection": "column" }}>
                <div className="logo" >全球新闻发布管理系统</div>
                <div style={{ flex: 1, "overflow": "auto" }}>
                    <Menu theme="dark" mode="inline" selectedKeys={selecteKey}
                        defaultOpenKeys={openKey}>
                        {renderMenu(menuList)}
                    </Menu>
                </div>
            </div>
        </Sider>
    )
}
