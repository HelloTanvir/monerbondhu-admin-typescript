import { useEffect, useState } from 'react';
import AppLayout from '../../container/appLayout/AppLayout';
import axios from '../../utils/axios';
import Loader from '../../utils/Loader';
import DataTable from './DataTable';

export interface TipsAndTricksData {
    date: string;
    viewCount: number | string;
    isVideo: boolean;
    _id: string;
    title: string;
    content: string;
    videoLink: string;
    image: string;
    position: number;
}

const TipsAndTricks = () => {
    const [apiData, setApiData] = useState<TipsAndTricksData[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    const [update, setUpdate] = useState(0);

    const forceUpdate = () => setUpdate((i) => i + 1);

    useEffect(() => {
        const apiResponse = async () => {
            const token = `Bearer ${localStorage.getItem('token')}`;

            setIsLoading(true);

            try {
                const response = await axios.get('/tipsamdtricks', {
                    headers: { Authorization: token },
                });

                if (response) setIsLoading(false);

                setApiData([...response.data.data].reverse());
            } catch (err) {
                setIsLoading(false);
                // eslint-disable-next-line no-alert
                // @ts-ignore
                alert(err?.response?.data?.message ?? 'Something went wrong');
            }
        };
        apiResponse();
    }, [update]);

    return (
        <AppLayout dawerOpen>
            <Loader open={isLoading} />
            <DataTable apiData={apiData} forceUpdate={forceUpdate} />
        </AppLayout>
    );
};

export default TipsAndTricks;
