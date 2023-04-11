import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../views/login/Login'
import NewsSandBox from '../views/sandbox/NewsSandBox'
import News from '../views/news/News'
import Detail from '../views/news/Detail'


export default function IndexRouter() {


    return (

        <Routes>
            <Route path="/news" element={<News />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="*" element={localStorage.getItem("token") ?
                <NewsSandBox></NewsSandBox> :
                <Navigate to="/login" />
            } />
            <Route path="/login" element={<Login />} />
        </Routes>

    )
}
