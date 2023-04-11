import usePublish from './usePublish'
import NewsPublish from '../news-manage/NewsPublish';
import { Button } from 'antd';

export default function Sunset() {
    const { dataSource, handleDelete } = usePublish(3);
    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id) => <Button
                onClick={() => handleDelete(id)}
                danger>删除</Button>} />
        </div>
    )
}
