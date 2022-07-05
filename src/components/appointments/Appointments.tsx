import { useEffect, useState } from 'react';
import AppLayout from '../../container/appLayout/AppLayout';
import axios from '../../utils/axios';
import Loader from '../../utils/Loader';
import DataTable from './DataTable';

export interface AppointmentData {
    _id: string;
    userPhoneNumber: string;
    state: string;
    position: number;
    name: string;
    givenMobileNumber: string;
    appointmentDate: string;
    appointmentTime: string;
    gender: string;
    dob: string;
    story: string;
    consultantName: string;
    service: string;
}

export interface ConsultantData {
    name: string;
    visitingDays: [string];
    timeFrom: string;
    timeTo: string;
    service: [
        {
            name: string;
            fee: string | number;
            mode: string;
            duration: string;
        }
    ];
}

const Appointments = () => {
    const [apiData, setApiData] = useState<AppointmentData[]>([]);
    const [consultants, setConsultants] = useState<ConsultantData[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    const [update, setUpdate] = useState(0);

    const forceUpdate = () => setUpdate((i) => i + 1);

    useEffect(() => {
        const apiResponse = async () => {
            const token = `Bearer ${localStorage.getItem('token')}`;

            setIsLoading(true);

            try {
                const response1 = await axios.get('/consultent/appointment', {
                    headers: { Authorization: token },
                });

                const response2 = await axios.get('/consultent', {
                    headers: { Authorization: token },
                });

                if (response1 && response2) setIsLoading(false);

                setApiData([...response1.data].reverse());
                setConsultants([...response2.data.data].reverse());
            } catch (err) {
                setIsLoading(false);
                // eslint-disable-next-line no-alert
                // @ts-ignore
                alert(err?.response?.data?.message ?? 'Something went wrong');
            }
        };
        apiResponse();
    }, [update]);
    console.log(apiData);
    return (
        <AppLayout consultantOpen dawerOpen>
            <Loader open={isLoading} />
            <DataTable apiData={apiData} consultants={consultants} forceUpdate={forceUpdate} />
        </AppLayout>
    );
};

export default Appointments;
