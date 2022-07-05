import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axios';
import Loader from '../../../utils/Loader';
import DataTable from './DataTable';

export interface DesignationData {
    _id: string;
    designation: string;
}

const Designation = () => {
    const [apiData, setApiData] = useState<DesignationData[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    const [update, setUpdate] = useState(0);

    const forceUpdate = () => setUpdate((i) => i + 1);

    useEffect(() => {
        const apiResponse = async () => {
            const token = `Bearer ${localStorage.getItem('token')}`;

            setIsLoading(true);

            try {
                const response = await axios.get('/consultent/designation', {
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
        <>
            <Loader open={isLoading} />
            <DataTable apiData={apiData} forceUpdate={forceUpdate} />
        </>
    );
};

export default Designation;
