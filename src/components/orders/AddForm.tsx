import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import axios from '../../utils/axios';
import Loader from '../../utils/Loader';
import { ProductsData } from '../products/Products';

interface Props {
    products: ProductsData[];
    forceUpdate: () => void;
}

const AddForm: React.FC<Props> = ({ products, forceUpdate }): React.ReactElement => {
    const [open, setOpen] = React.useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isSumbit, setIsSubmit] = useState(false);

    const [position, setPosition] = useState(0);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [givenNumber, setGivenNumber] = useState('');
    const [tranID, setTranID] = useState(nanoid(8));
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [qty, setQty] = useState<number | string>('');
    const [product, setProduct] = useState<string | null>(null);

    const clearAll = () => {
        setName('');
        setAddress('');
        setGivenNumber('');
        setQty('');
        setTranID('');
        setPaymentMethod('');
        setPaymentStatus('');
        setProduct(null);
        setIsSubmit(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        clearAll();
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setIsSubmit(true);

        if (
            !tranID ||
            !paymentMethod ||
            !paymentStatus ||
            !name ||
            !address ||
            !givenNumber ||
            !qty ||
            !product ||
            !position
        )
            return;

        setOpen(false);

        setIsLoading(true);

        const token = `Bearer ${localStorage.getItem('token')}`;

        const reqData = {
            tranID,
            paymentMethod: paymentMethod === 'online' ? 'aonline' : paymentMethod,
            paymentStatus,
            name,
            address,
            givenNumber,
            qty,
            position,
            product: JSON.parse(product),
        };

        try {
            const response = await axios.post('/shop/order', reqData, {
                headers: {
                    Authorization: token,
                },
            });
            if (response) {
                setIsLoading(false);

                clearAll();

                forceUpdate();
            }
        } catch (err) {
            setIsLoading(false);

            clearAll();

            // eslint-disable-next-line no-alert
            // @ts-ignore
            alert(err?.response?.data?.message ?? 'Something went wrong');
        }
    };

    return (
        <>
            <Loader open={isLoading} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: 22 }}>
                <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                    create new order
                </Button>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="form-dialog-title"
                    maxWidth="xs"
                >
                    <DialogTitle id="form-dialog-title">Create New Order</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Please fill up the form...</DialogContentText>
                        <TextField
                            autoFocus
                            error={isSumbit && !tranID}
                            helperText={isSumbit && !tranID ? 'Please add a transaction ID' : ''}
                            margin="dense"
                            name="tranID"
                            label="Transaction ID"
                            fullWidth
                            value={tranID}
                            onChange={(e) => setTranID(e.target.value)}
                        />
                        <TextField
                            autoFocus
                            error={isSumbit && !position}
                            helperText={isSumbit && !position ? 'Please add a position' : ''}
                            margin="dense"
                            name="position"
                            label="Position"
                            fullWidth
                            value={position}
                            onChange={(e) =>
                                setPosition(e.target.value ? Number(e.target.value) : 0)
                            }
                        />

                        <FormControl fullWidth error={isSumbit && !paymentMethod}>
                            <InputLabel>Select payment method</InputLabel>
                            <Select
                                value={paymentMethod}
                                onChange={(e) => {
                                    if (typeof e.target.value === 'string') {
                                        setPaymentMethod(e.target.value);
                                    }
                                }}
                            >
                                {['COD', 'online'].map((p, index) => (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <MenuItem key={index} value={p}>
                                        {p}
                                    </MenuItem>
                                ))}
                            </Select>
                            {isSumbit && !paymentMethod ? (
                                <FormHelperText>Please select a payment method</FormHelperText>
                            ) : (
                                ''
                            )}
                        </FormControl>

                        <FormControl fullWidth error={isSumbit && !paymentStatus}>
                            <InputLabel>Select payment status</InputLabel>
                            <Select
                                value={paymentStatus}
                                onChange={(e) => {
                                    if (typeof e.target.value === 'string') {
                                        setPaymentStatus(e.target.value);
                                    }
                                }}
                            >
                                {['paid', 'unpaid'].map((p, index) => (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <MenuItem key={index} value={p}>
                                        {p}
                                    </MenuItem>
                                ))}
                            </Select>
                            {isSumbit && !paymentStatus ? (
                                <FormHelperText>Please select a payment status</FormHelperText>
                            ) : (
                                ''
                            )}
                        </FormControl>

                        <TextField
                            error={isSumbit && !name}
                            helperText={isSumbit && !name ? 'Please add a name' : ''}
                            margin="dense"
                            name="name"
                            label="Name"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <TextField
                            error={isSumbit && !address}
                            helperText={isSumbit && !address ? 'Please add address' : ''}
                            margin="dense"
                            name="address"
                            label="Address"
                            fullWidth
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />

                        <TextField
                            error={isSumbit && !givenNumber}
                            helperText={isSumbit && !givenNumber ? 'Please add given number' : ''}
                            margin="dense"
                            name="givenNumber"
                            label="Given Number"
                            fullWidth
                            value={givenNumber}
                            onChange={(e) => setGivenNumber(e.target.value)}
                        />

                        <TextField
                            error={isSumbit && !qty}
                            helperText={isSumbit && !qty ? 'Please add quantity' : ''}
                            margin="dense"
                            name="qty"
                            label="Quantity"
                            fullWidth
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                        />

                        <FormControl fullWidth error={isSumbit && !product}>
                            <InputLabel>Select a product</InputLabel>
                            <Select
                                value={product}
                                onChange={(e) => {
                                    if (typeof e.target.value === 'string') {
                                        setProduct(e.target.value);
                                    }
                                }}
                            >
                                {products.map((p, index) => (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <MenuItem key={index} value={JSON.stringify(p)}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <img src={p.image} alt="" width={50} height={50} />
                                            <span style={{ marginLeft: 10 }}>{p.name}</span>
                                        </div>
                                    </MenuItem>
                                ))}
                            </Select>
                            {isSumbit && !product ? (
                                <FormHelperText>Please select a product</FormHelperText>
                            ) : (
                                ''
                            )}
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} color="primary">
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
};

export default AddForm;
