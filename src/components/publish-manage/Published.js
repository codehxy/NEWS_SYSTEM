import { Button } from 'antd';
import NewsPublish from '../news-manage/NewsPublish';
import usePublish from './usePublish';

export default function Published() {

    const { dataSource, handleSubset } = usePublish(2);



    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id) => <Button danger
                onClick={() => handleSubset(id)}
            >下线</Button>} />
        </div>
    )
}
