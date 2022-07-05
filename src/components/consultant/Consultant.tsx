import { useEffect, useState } from 'react';
import AppLayout from '../../container/appLayout/AppLayout';
import axios from '../../utils/axios';
import Loader from '../../utils/Loader';
import DataTable from './DataTable';

export interface ConsultantData {
    position: number;
    review: number | string;
    reviewCount: number;
    _id: string;
    name: string;
    description: string;
    visitingDays: [string];
    timeFrom: string;
    timeTo: string;
    designation: string;
    image: string;
    service: [
        {
            _id: string;
            name: string;
            fee: number | string;
            mode: string;
            duration: string;
        }
    ];
}

const Consultant = () => {
    const [apiData, setApiData] = useState<ConsultantData[]>([]);
    const [designations, setDesignations] = useState<string[]>([]);
    const [services, setServices] = useState<string[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    const [update, setUpdate] = useState(0);

    const forceUpdate = () => setUpdate((i) => i + 1);
    // console.log(apiData);

    useEffect(() => {
        const apiResponse = async () => {
            const token = `Bearer ${localStorage.getItem('token')}`;

            setIsLoading(true);

            try {
                const response = await axios.get('/consultent', {
                    headers: { Authorization: token },
                });

                if (response) setIsLoading(false);

                setApiData([...response.data.data].reverse());

                setDesignations(response.data.designations);
                setServices(response.data.services);
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
        <AppLayout dawerOpen consultantOpen>
            <Loader open={isLoading} />
            <DataTable
                apiData={apiData}
                designations={designations}
                services={services}
                forceUpdate={forceUpdate}
            />
        </AppLayout>
    );
};

export default Consultant;
