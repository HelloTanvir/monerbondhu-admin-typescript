import { FormControl, MenuItem, Select, TextField } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import React, { useState } from 'react';
import axios from '../../utils/axios';
import Loader from '../../utils/Loader';
import { ProductsData } from '../products/Products';
import AddForm from './AddForm';
import OrderedProduct from './OrderedProduct';
import { OrdersData } from './Orders';

interface Props {
    apiData: OrdersData[];
    products: ProductsData[];
    forceUpdate: () => void;
}

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const createData = (
    id: string,
    name: string,
    givenNumber: string,
    address: string,
    paymentMethod: string,
    paymentStatus: string,
    orderStatus: string,
    orderTime: string,
    quantity: number | string,
    userNumber: string,
    position: number,
    product: {
        _id: string;
        name: string;
        dis: string;
        price: number | string;
        image: string;
        position: number;
    }
) => ({
    id,
    name,
    givenNumber,
    address,
    paymentMethod,
    paymentStatus,
    orderStatus,
    orderTime,
    quantity,
    userNumber,
    product,
    position,
});

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 700,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    textField: {
        '& > *': {
            fontSize: 13,
        },
    },
}));

const DataTable: React.FC<Props> = ({ apiData, products, forceUpdate }): React.ReactElement => {
    const classes = useStyles();

    const [isEditing, setIsEditing] = useState(false);
    const [editingIdx, setEditingIdx] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);
    const [isSumbit, setIsSubmit] = useState(false);

    const [position, setPosition] = useState(0);
    const [name, setName] = useState('');
    const [givenNumber, setGivenNumber] = useState('');
    const [address, setAddress] = useState('');
    const [qty, setQty] = useState<number | string>('');
    const [userNumber, setUserNumber] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [orderStatus, setOrderStatus] = useState('');
    const [updatedProduct, setUpdatedProduct] = useState<string | ProductsData | null>(null);

    const handleClose = () => {
        setIsEditing(false);
        setEditingIdx(-1);
        // setOrderStatus('');
    };

    const clearAll = () => {
        setName('');
        setGivenNumber('');
        setAddress('');
        setQty('');
        setUserNumber('');
        setPaymentMethod('');
        setPaymentStatus('');
        setOrderStatus('');
        setUpdatedProduct(null);
        setIsSubmit(false);
        setPosition(0);
    };

    const handleEdit = async (id: string) => {
        setIsSubmit(true);

        if (
            !name ||
            !givenNumber ||
            !address ||
            !qty ||
            !userNumber ||
            !paymentMethod ||
            !paymentStatus ||
            !orderStatus ||
            !updatedProduct ||
            !position
        )
            return;

        setIsEditing(false);
        setEditingIdx(-1);
        setIsLoading(true);

        const updateData = {
            name,
            position,
            givenNumber,
            address,
            qty,
            userNumber,
            paymentMethod: paymentMethod === 'online' ? 'aonline' : paymentMethod,
            paymentStatus,
            orderStatus,
            product:
                typeof updatedProduct === 'string' ? JSON.parse(updatedProduct) : updatedProduct,
        };

        const token = `Bearer ${localStorage.getItem('token')}`;

        try {
            const response = await axios.patch(`/shop/order/${id}`, updateData, {
                headers: { Authorization: token },
            });

            if (response) {
                setIsLoading(false);

                forceUpdate();

                clearAll();
            }
        } catch (err) {
            setIsLoading(false);

            clearAll();

            // eslint-disable-next-line no-alert
            // @ts-ignore
            alert(err?.response?.data?.message ?? 'Something went wrong');
        }
    };

    const editButtonHandler = (
        editedData: {
            name: string;
            givenNumber: string;
            address: string;
            quantity: number | string;
            userNumber: string;
            paymentMethod: string;
            paymentStatus: string;
            orderStatus: string;
            product: ProductsData;
            position: number;
        },
        idx: number
    ) => {
        setIsEditing(true);
        setEditingIdx(idx);

        setPosition(editedData.position);
        setName(editedData.name);
        setGivenNumber(editedData.givenNumber);
        setAddress(editedData.address);
        setQty(editedData.quantity);
        setUserNumber(editedData.userNumber);
        setPaymentMethod(editedData.paymentMethod);
        setPaymentStatus(editedData.paymentStatus);
        setOrderStatus(editedData.orderStatus);
        setUpdatedProduct(editedData.product);
    };

    const rows = apiData.map((data) =>
        createData(
            // eslint-disable-next-line no-underscore-dangle
            data._id,
            data.name,
            data.givenNumber,
            data.address,
            data.paymentMethod.toLowerCase(),
            data.paymentStatus.toLowerCase(),
            data.orderStatus.toLowerCase(),
            data.orderTime,
            data.qty,
            data.userNumber,
            data.position,
            data.product
        )
    );

    return (
        <>
            <Loader open={isLoading} />

            <AddForm products={products} forceUpdate={forceUpdate} />

            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Position</StyledTableCell>
                            <StyledTableCell>Product</StyledTableCell>
                            <StyledTableCell align="right">Name</StyledTableCell>
                            <StyledTableCell align="right">Given Number</StyledTableCell>
                            <StyledTableCell align="right">User Number</StyledTableCell>
                            <StyledTableCell align="right">Address</StyledTableCell>
                            <StyledTableCell align="right">Payment Method</StyledTableCell>
                            <StyledTableCell align="right">Payment Status</StyledTableCell>
                            <StyledTableCell align="right">Order Status</StyledTableCell>
                            <StyledTableCell align="right">Order Time</StyledTableCell>
                            <StyledTableCell align="right">QTY</StyledTableCell>
                            <StyledTableCell align="right">Edit</StyledTableCell>
                            {/* <StyledTableCell align="right">Delete</StyledTableCell> */}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows.map((row, idx) => (
                            <StyledTableRow key={row.id}>
                                {/* <StyledTableCell component="th" scope="row"> */}
                                <StyledTableCell>
                                    {isEditing && editingIdx === idx ? (
                                        <FormControl className="">
                                            <input
                                                color="primary"
                                                type="number"
                                                onChange={(e) =>
                                                    setPosition(Number(e.target.value))
                                                }
                                            />
                                        </FormControl>
                                    ) : (
                                        row.position
                                    )}
                                </StyledTableCell>
                                <StyledTableCell>
                                    <OrderedProduct
                                        product={row.product}
                                        isEditing={isEditing && editingIdx === idx}
                                        allProducts={products}
                                        updatedProduct={updatedProduct}
                                        setUpdatedProduct={setUpdatedProduct}
                                    />
                                </StyledTableCell>

                                <StyledTableCell align="right">
                                    {isEditing && editingIdx === idx ? (
                                        <TextField
                                            autoFocus
                                            error={isSumbit && !name}
                                            helperText={isSumbit && !name ? 'empty !' : ''}
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className={classes.textField}
                                        />
                                    ) : (
                                        row.name
                                    )}
                                </StyledTableCell>

                                <StyledTableCell align="right">
                                    {isEditing && editingIdx === idx ? (
                                        <TextField
                                            error={isSumbit && !givenNumber}
                                            helperText={isSumbit && !givenNumber ? 'empty !' : ''}
                                            value={givenNumber}
                                            onChange={(e) => setGivenNumber(e.target.value)}
                                            className={classes.textField}
                                            type="tel"
                                        />
                                    ) : (
                                        row.givenNumber
                                    )}
                                </StyledTableCell>

                                <StyledTableCell align="right">
                                    {isEditing && editingIdx === idx ? (
                                        <TextField
                                            error={isSumbit && !userNumber}
                                            helperText={isSumbit && !userNumber ? 'empty !' : ''}
                                            value={userNumber}
                                            onChange={(e) => setUserNumber(e.target.value)}
                                            className={classes.textField}
                                            type="tel"
                                        />
                                    ) : (
                                        row.userNumber
                                    )}
                                </StyledTableCell>

                                <StyledTableCell align="right">
                                    {isEditing && editingIdx === idx ? (
                                        <TextField
                                            error={isSumbit && !address}
                                            helperText={isSumbit && !address ? 'empty !' : ''}
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className={classes.textField}
                                        />
                                    ) : (
                                        row.address
                                    )}
                                </StyledTableCell>

                                <StyledTableCell align="right">
                                    {/* eslint-disable-next-line no-nested-ternary */}
                                    {isEditing && editingIdx === idx ? (
                                        <FormControl className={classes.formControl}>
                                            <Select
                                                value={paymentMethod}
                                                onChange={(e) => {
                                                    if (typeof e.target.value === 'string') {
                                                        setPaymentMethod(e.target.value);
                                                    }
                                                }}
                                                displayEmpty
                                                className={classes.textField}
                                                inputProps={{ 'aria-label': 'Without label' }}
                                            >
                                                {['online', 'COD'].map((i) => (
                                                    <MenuItem key={i} value={i}>
                                                        {i}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    ) : row.paymentMethod === 'aonline' ? (
                                        'online'
                                    ) : (
                                        row.paymentMethod
                                    )}
                                </StyledTableCell>

                                <StyledTableCell align="right">
                                    {isEditing && editingIdx === idx ? (
                                        <FormControl className={classes.formControl}>
                                            <Select
                                                value={paymentStatus}
                                                onChange={(e) => {
                                                    if (typeof e.target.value === 'string') {
                                                        setPaymentStatus(e.target.value);
                                                    }
                                                }}
                                                displayEmpty
                                                className={classes.textField}
                                                inputProps={{ 'aria-label': 'Without label' }}
                                            >
                                                {['paid', 'unpaid'].map((i) => (
                                                    <MenuItem key={i} value={i}>
                                                        {i}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    ) : (
                                        row.paymentStatus
                                    )}
                                </StyledTableCell>

                                <StyledTableCell align="right">
                                    {isEditing && editingIdx === idx ? (
                                        <FormControl className={classes.formControl}>
                                            <Select
                                                value={orderStatus}
                                                onChange={(e) => {
                                                    if (typeof e.target.value === 'string') {
                                                        setOrderStatus(e.target.value);
                                                    }
                                                }}
                                                displayEmpty
                                                className={classes.textField}
                                                inputProps={{ 'aria-label': 'Without label' }}
                                            >
                                                {[
                                                    'pending',
                                                    'picked',
                                                    'shipped',
                                                    'delivered',
                                                    'cancelled',
                                                ].map((i) => (
                                                    <MenuItem key={i} value={i}>
                                                        {i}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    ) : (
                                        row.orderStatus
                                    )}
                                </StyledTableCell>

                                <StyledTableCell align="right">
                                    <span style={{ fontWeight: 'bold' }}>Date: </span>
                                    {new Date(row.orderTime).toLocaleDateString('en-US')}
                                    <div>
                                        <span style={{ fontWeight: 'bold' }}>Time: </span>
                                        {new Date(row.orderTime).toLocaleTimeString('en-US')}
                                    </div>
                                </StyledTableCell>

                                <StyledTableCell align="right">
                                    {isEditing && editingIdx === idx ? (
                                        <TextField
                                            error={isSumbit && !qty}
                                            helperText={isSumbit && !qty ? 'empty !' : ''}
                                            value={qty}
                                            onChange={(e) => setQty(e.target.value)}
                                            className={classes.textField}
                                        />
                                    ) : (
                                        row.quantity
                                    )}
                                </StyledTableCell>

                                <StyledTableCell align="right">
                                    {isEditing && editingIdx === idx ? (
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <ClearIcon
                                                style={{
                                                    cursor: 'pointer',
                                                    color: 'red',
                                                    marginRight: 7,
                                                }}
                                                onClick={() => handleClose()}
                                            />
                                            <CheckIcon
                                                style={{ cursor: 'pointer', color: 'green' }}
                                                onClick={() => handleEdit(row.id)}
                                            />
                                        </div>
                                    ) : (
                                        <EditIcon
                                            style={{ cursor: 'pointer' }}
                                            onClick={() =>
                                                editButtonHandler(
                                                    {
                                                        position: row.position,
                                                        name: row.name,
                                                        givenNumber: row.givenNumber,
                                                        address: row.address,
                                                        quantity: row.quantity,
                                                        userNumber: row.userNumber,
                                                        paymentMethod: row.paymentMethod,
                                                        paymentStatus: row.paymentStatus,
                                                        orderStatus: row.orderStatus,
                                                        product: row.product,
                                                    },
                                                    idx
                                                )
                                            }
                                        />
                                    )}
                                </StyledTableCell>
                                {/* <StyledTableCell align="right">
                  <DeleteForeverIcon />
                </StyledTableCell> */}
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default DataTable;
