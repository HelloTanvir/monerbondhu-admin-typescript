import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import axios from '../../../utils/axios';
import Loader from '../../../utils/Loader';

interface Props {
    forceUpdate: () => void;
}

const AddForm: React.FC<Props> = ({ forceUpdate }): React.ReactElement => {
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSumbit, setIsSubmit] = useState(false);

    const [service, setService] = useState('');
    const [description, setDescription] = useState('');

    const clearAll = () => {
        setService('');
        setDescription('');
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

        if (!service || !description) return;

        setOpen(false);

        setIsLoading(true);

        const token = `Bearer ${localStorage.getItem('token')}`;

        const data = {
            name: service,
            dis: description,
        };

        try {
            const response = await axios.post('/consultent/service', data, {
                headers: { Authorization: token },
            });

            if (response) {
                forceUpdate();
                setIsLoading(false);
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

    return (
        <>
            <Loader open={isLoading} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: 22 }}>
                <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                    create new service
                </Button>
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Create New Service</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Please fill up the form...</DialogContentText>
                        <TextField
                            autoFocus
                            error={isSumbit && !service}
                            helperText={isSumbit && !service ? 'Please provide a service' : ''}
                            margin="dense"
                            name="service"
                            label="Service"
                            fullWidth
                            value={service}
                            onChange={(e) => setService(e.target.value)}
                        />

                        <TextField
                            error={isSumbit && !description}
                            helperText={
                                isSumbit && !description ? 'Please provide a description' : ''
                            }
                            margin="dense"
                            name="description"
                            label="Description"
                            fullWidth
                            multiline
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
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
