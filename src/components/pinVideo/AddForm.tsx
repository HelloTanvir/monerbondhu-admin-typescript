import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import axios from '../../utils/axios';
import Loader from '../../utils/Loader';

interface Props {
    forceUpdate: () => void;
}

const AddForm: React.FC<Props> = ({ forceUpdate }): React.ReactElement => {
    const [open, setOpen] = React.useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isSumbit, setIsSubmit] = useState(false);

    const [position, setPosition] = useState(0);
    const [name, setName] = useState('');
    const [ytlink, setYtlink] = useState('');

    const clearAll = () => {
        setName('');
        setYtlink('');
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

        if (!name || !ytlink || !position) return;

        setOpen(false);

        setIsLoading(true);

        const token = `Bearer ${localStorage.getItem('token')}`;

        try {
            const response = await axios.post(
                '/pinvideo',
                { name, ytlink, position },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
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
                    create new pin video
                </Button>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="form-dialog-title"
                    maxWidth="xs"
                >
                    <DialogTitle id="form-dialog-title">Create New Pin Video</DialogTitle>
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

                        <TextField
                            error={isSumbit && !ytlink}
                            helperText={isSumbit && !ytlink ? 'Please add youtube link' : ''}
                            margin="dense"
                            name="ytlink"
                            label="Youtube Link"
                            fullWidth
                            value={ytlink}
                            onChange={(e) => setYtlink(e.target.value)}
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
