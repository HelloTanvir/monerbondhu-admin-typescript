import { FormControl, InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';

interface Props {
    serviceOptions: string[];
    services: {
        _id?: string;
        name: string;
        fee: number | string;
        mode: string;
        duration: string;
    }[];
    setServices: React.Dispatch<
        React.SetStateAction<
            {
                _id?: string;
                name: string;
                fee: number | string;
                mode: string;
                duration: string;
            }[]
        >
    >;
}

const useStyles = makeStyles(() => ({
    serviceContainer: {
        display: 'flex',
        alignItems: 'flex-end',
        '& > div': {
            marginBottom: 0,
        },
        '& > label > span': {
            paddingBottom: 0,
            paddingTop: 0,
        },
    },
}));

const SelectService: React.FC<Props> = ({
    serviceOptions,
    services,
    setServices,
}): React.ReactElement => {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);

    const [openNameSelect, setOpenNameSelect] = useState(false);
    const [openModeSelect, setOpenModeSelect] = useState(false);
    const [openDurationSelect, setOpenDurationSelect] = useState(false);

    const serviceDuration = ['30M', '1H', '2H', '3H', '4H'];

    const [name, setName] = useState('');
    const [mode, setMode] = useState('');
    const [duration, setDuration] = useState('');
    const [fee, setFee] = useState('');

    const clearAll = () => {
        setName('');
        setMode('');
        setDuration('');
        setFee('');
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);

        clearAll();
    };

    const handleDone = () => {
        if (!name || !mode || !duration || !fee) {
            // eslint-disable-next-line no-alert
            alert('Please fill up the form');
            return;
        }

        // eslint-disable-next-line no-restricted-syntax
        for (const i of services) {
            if (i.name === name && i.mode === mode) {
                // eslint-disable-next-line no-alert
                alert('Already added, delete existing and recreate one to update');
                clearAll();
                setOpen(false);
                return;
            }
        }

        setOpen(false);
        setServices((prev) => {
            // eslint-disable-next-line no-restricted-syntax
            for (const i of prev) {
                if (i.name === name && i.mode === mode) return prev;
            }
            return [...prev, { name, fee, mode, duration }];
        });

        clearAll();
    };

    return (
        <div>
            <Button
                variant="text"
                color="primary"
                size="medium"
                style={{ paddingLeft: 0, paddingBottom: 0, marginTop: 10, textTransform: 'none' }}
                onClick={handleClickOpen}
            >
                {`Add ${services.length === 0 ? 'a' : 'another'} service`}
            </Button>
            <Dialog
                open={open}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle id="alert-dialog-slide-title">Service</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        <div className={classes.serviceContainer}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-controlled-open-select-label">
                                    Package
                                </InputLabel>
                                <Select
                                    labelId="demo-controlled-open-select-label"
                                    id="demo-controlled-open-select"
                                    open={openNameSelect}
                                    onClose={() => setOpenNameSelect(false)}
                                    onOpen={() => setOpenNameSelect(true)}
                                    value={name}
                                    onChange={(e) => {
                                        if (typeof e.target.value === 'string') {
                                            setName(e.target.value);
                                        }
                                    }}
                                >
                                    {serviceOptions.map((i, idx) => (
                                        // eslint-disable-next-line react/no-array-index-key
                                        <MenuItem key={idx} value={i}>
                                            {i}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth style={{ marginLeft: 12 }}>
                                <InputLabel id="demo-controlled-open-select-label">Mode</InputLabel>
                                <Select
                                    labelId="demo-controlled-open-select-label"
                                    id="demo-controlled-open-select"
                                    open={openModeSelect}
                                    onClose={() => setOpenModeSelect(false)}
                                    onOpen={() => setOpenModeSelect(true)}
                                    value={mode}
                                    onChange={(e) => {
                                        if (typeof e.target.value === 'string') {
                                            setMode(e.target.value);
                                        }
                                    }}
                                >
                                    {['online', 'offline'].map((i) => (
                                        <MenuItem key={i} value={i}>
                                            {i}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth style={{ margin: '0 12px' }}>
                                <InputLabel id="demo-controlled-open-select-label">
                                    Duration
                                </InputLabel>
                                <Select
                                    labelId="demo-controlled-open-select-label"
                                    id="demo-controlled-open-select"
                                    open={openDurationSelect}
                                    onClose={() => setOpenDurationSelect(false)}
                                    onOpen={() => setOpenDurationSelect(true)}
                                    value={duration}
                                    onChange={(e) => {
                                        if (typeof e.target.value === 'string') {
                                            setDuration(e.target.value);
                                        }
                                    }}
                                >
                                    {serviceDuration.map((i) => (
                                        <MenuItem key={i} value={i}>
                                            {i}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                autoFocus
                                type="number"
                                InputProps={{ inputProps: { min: 0 } }}
                                margin="dense"
                                name="fee"
                                label="Fee"
                                fullWidth
                                value={fee}
                                onChange={(e) => {
                                    if (typeof e.target.value === 'string') {
                                        setFee(e.target.value);
                                    }
                                }}
                            />
                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                    <Button onClick={handleDone} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SelectService;
