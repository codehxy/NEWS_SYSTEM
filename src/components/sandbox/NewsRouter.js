import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../../views/sandbox/home/Home'
import UserList from '../../views/sandbox/user-manage/UserList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import RightList from '../../views/sandbox/right-manage/RightList'
import NoPermission from '../../views/sandbox/nopermission/NoPermission'
import NewsAdd from '../../components/news-manage/NewsAdd'
import NewsDraft from '../../components/news-manage/NewsDraft'
import NewsCategory from '../../components/news-manage/NewsCategory'
import AuditList from '../../components/audit-manage/AuditList'
import Audit from '../../components/audit-manage/Audit'
import Unpublished from '../../components/publish-manage/Unpublished'
import Published from '../../components/publish-manage/Published'
import Sunset from '../../components/publish-manage/Sunset'
import NewsPreview from '../../components/news-manage/NewsPreview'
import NewsUpdate from '../../components/news-manage/NewsUpdate'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Spin } from 'antd'
import { useSelector } from 'react-redux'



const LocalRouterMap = {
    "/home": <Home />,
    "/user-manage/list": <UserList />,
    "/right-manage/role/list": <RoleList />,
    "/right-manage/right/list": <RightList />,
    "/news-manage/add": <NewsAdd />,
    "/news-manage/draft": <NewsDraft />,
    "/news-manage/preview/:id": <NewsPreview />,
    "/news-manage/update/:id": <NewsUpdate />,
    "/news-manage/category": <NewsCategory />,
    "/audit-manage/audit": <Audit />,
    "/audit-manage/list": <AuditList />,
    "/publish-manage/unpublished": <Unpublished />,
    "/publish-manage/published": <Published />,
    "/publish-manage/sunset": <Sunset />
}

export default function NewsRouter() {



    const [BackRouteList, setBackRouteList] = useState()

    useEffect(() => {
        Promise.all([
            axios.get("/rights"),
            axios.get("/children"),
        ]).then(res => {
            setBackRouteList([...res[0].data, ...res[1].data])
            // console.log([...res[0].data, ...res[1].data]);
        })
    }, [])

    const { role: { rights } } = JSON.parse(localStorage.getItem("token"))

    const loading = useSelector((state) => state.loading.isLoading)

    const checkRoute = (item) => {
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }

    const checkuUserPermission = (item) => {
        return rights.includes(item.key)
    }

    return (
        <Spin size='large' spinning={loading}>
            <Routes>
                {
                    BackRouteList?.map(item => {

                        if (checkRoute(item) && checkuUserPermission(item)) {
                            // console.log(item.key);
                            return <Route path={item.key} key={item.key} element={LocalRouterMap[item.key]} />

                        } else {
                            return null
                        }
                    })
                }
                <Route path="/" element={<Navigate to="/home" />} />
                {
                    BackRouteList?.length > 0 && <Route path="*" element={<NoPermission />} />
                }
            </Routes>
        </Spin>
    )
}
