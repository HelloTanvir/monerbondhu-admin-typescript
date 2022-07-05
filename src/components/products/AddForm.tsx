import { makeStyles, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import ImageIcon from '@material-ui/icons/Image';
import React, { useState } from 'react';
import axios from '../../utils/axios';
import Loader from '../../utils/Loader';

interface Props {
    forceUpdate: () => void;
}

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
}));

const AddForm: React.FC<Props> = ({ forceUpdate }): React.ReactElement => {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isSumbit, setIsSubmit] = useState(false);

    const [position, setPosition] = useState(0);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [dis, setDis] = useState('');
    const [image, setImage] = useState<File | null>(null);

    const clearAll = () => {
        setName('');
        setPrice('');
        setDis('');
        setImage(null);
        setIsSubmit(false);
        setPosition(0);
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

        if (!name || !price || !dis || !image || !position) return;

        setOpen(false);

        setIsLoading(true);

        const bodyFormData = new FormData();
        bodyFormData.append('name', name);
        bodyFormData.append('dis', dis);
        bodyFormData.append('position', `${position}`);
        bodyFormData.append('price', price);
        bodyFormData.append('image', image);

        const token = `Bearer ${localStorage.getItem('token')}`;

        try {
            const response = await axios.post('/shop', bodyFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
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
                    create new product
                </Button>

                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="form-dialog-title"
                    maxWidth="xs"
                >
                    <DialogTitle id="form-dialog-title">Create New Product</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Please fill up the form...</DialogContentText>

                        <TextField
                            autoFocus
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
                            autoFocus
                            error={isSumbit && !position}
                            helperText={isSumbit && !position ? 'Please add a name' : ''}
                            margin="dense"
                            name="position"
                            label="Position"
                            fullWidth
                            value={position}
                            onChange={(e) => setPosition(Number(e.target.value))}
                        />

                        <TextField
                            error={isSumbit && !price}
                            helperText={isSumbit && !price ? 'Please add price' : ''}
                            margin="dense"
                            name="price"
                            label="Price"
                            type="number"
                            fullWidth
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />

                        <TextField
                            error={isSumbit && !dis}
                            helperText={isSumbit && !dis ? 'Please add a description' : ''}
                            margin="dense"
                            name="dis"
                            label="Description"
                            multiline
                            fullWidth
                            value={dis}
                            style={{ marginBottom: 36 }}
                            onChange={(e) => setDis(e.target.value)}
                        />

                        <span>
                            <input
                                color="primary"
                                accept="image/*"
                                type="file"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        setImage(e.target.files[0]);
                                    }
                                }}
                                id="icon-button-file"
                                hidden
                            />
                            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                            <label htmlFor="icon-button-file">
                                <Button
                                    variant="contained"
                                    component="span"
                                    className={classes.button}
                                    size="large"
                                    fullWidth
                                    color="primary"
                                    endIcon={<ImageIcon />}
                                    style={{ textTransform: 'capitalize', margin: 'unset' }}
                                >
                                    Image
                                </Button>
                            </label>
                        </span>
                        {isSumbit && !image ? (
                            <Typography
                                color="error"
                                style={{
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.03333em',
                                    fontWeight: 400,
                                }}
                            >
                                Please add an image
                            </Typography>
                        ) : (
                            ''
                        )}
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
