import { useEffect, useState } from 'react';
import AppLayout from '../../container/appLayout/AppLayout';
import axios from '../../utils/axios';
import Loader from '../../utils/Loader';
import { ProductsData } from '../products/Products';
import DataTable from './DataTable';

export interface OrdersData {
    paymentMethod: string;
    paymentStatus: string;
    orderStatus: string;
    orderTime: string;
    _id: string;
    valID: string;
    tranID: string;
    name: string;
    address: string;
    givenNumber: string;
    qty: number | string;
    position: number;

    product: {
        _id: string;
        name: string;
        dis: string;
        price: number | string;
        image: string;
        position: number;
    };
    userNumber: string;
}

const Orders = () => {
    const [apiData, setApiData] = useState<OrdersData[]>([]);
    const [products, setProducts] = useState<ProductsData[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    const [update, setUpdate] = useState(0);

    const forceUpdate = () => setUpdate((i) => i + 1);

    useEffect(() => {
        const apiResponse = async () => {
            const token = `Bearer ${localStorage.getItem('token')}`;

            setIsLoading(true);

            try {
                const ordersResponse = await axios.get('/shop/order', {
                    headers: { Authorization: token },
                });

                const productsResponse = await axios.get('/shop', {
                    headers: { Authorization: token },
                });

                if (ordersResponse && productsResponse) setIsLoading(false);

                setApiData([...ordersResponse.data].reverse());
                setProducts(productsResponse.data.data);
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
        <AppLayout dawerOpen shopOpen>
            <Loader open={isLoading} />
            <DataTable apiData={apiData} products={products} forceUpdate={forceUpdate} />
        </AppLayout>
    );
};

export default Orders;
