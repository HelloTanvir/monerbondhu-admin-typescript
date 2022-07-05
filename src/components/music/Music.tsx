import React, { useEffect, useState } from 'react';
import AppLayout from '../../container/appLayout/AppLayout';
import withTab from '../../container/tabLayout/TabLayout';
import axios from '../../utils/axios';
import Loader from '../../utils/Loader';
import DataTable from './DataTable';

export interface MusicData {
    [key: string]: {
        free: {
            _id: string;
            name: string;
            category: string;
            subType: string;
            image: string;
            mp3: string;
            musicKey: string;
        }[];

        paid: {
            _id: string;
            name: string;
            category: string;
            subType: string;
            image: string;
            mp3: string;
            musicKey: string;
        }[];
    };
}

const Music = () => {
    const [apiData, setApiData] = useState<MusicData>({});

    const [isLoading, setIsLoading] = useState(false);

    const [update, setUpdate] = useState(0);

    const forceUpdate = () => setUpdate((i) => i + 1);

    useEffect(() => {
        const apiResponse = async () => {
            const token = `Bearer ${localStorage.getItem('token')}`;

            setIsLoading(true);

            try {
                const response = await axios.get('/music', {
                    headers: { Authorization: token },
                });

                if (response) setIsLoading(false);

                if (typeof response.data[Object.keys(response.data)[0]] !== 'object') {
                    delete response.data[Object.keys(response.data)[0]];
                }

                setApiData(response.data);
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
            {withTab(
                Object.keys(apiData),
                Object.keys(apiData).map((musicCategory) => {
                    const DataTableComponent: React.FC = (): React.ReactElement => (
                        <DataTable apiData={apiData[musicCategory]} forceUpdate={forceUpdate} />
                    );
                    return DataTableComponent;
                })
            )}
        </AppLayout>
    );
};

export default Music;
