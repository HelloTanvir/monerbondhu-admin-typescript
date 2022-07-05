/* eslint-disable no-underscore-dangle */
import {
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
    // eslint-disable-next-line prettier/prettier
    Typography
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import ImageIcon from '@material-ui/icons/Image';
import React, { useState } from 'react';
import axios from '../../../utils/axios';
import Loader from '../../../utils/Loader';
import SelectService from './SelectService';

interface Props {
    designations: string[];
    serviceOptions: string[];
    forceUpdate: () => void;
}

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginTop: theme.spacing(2),
        marginRight: theme.spacing(1),
        width: 200,
    },
    button: {
        margin: theme.spacing(1),
    },
    visitingTimeStamp: {
        marginTop: theme.spacing(2),
    },
}));

const AddForm: React.FC<Props> = ({
    designations,
    serviceOptions,
    forceUpdate,
}): React.ReactElement => {
    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const [openSelect, setOpenSelect] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isSumbit, setIsSubmit] = useState(false);
    const [position, setPosition] = useState(0);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState({
        saturday: false,
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
    });
    const [time, setTime] = useState({ startingTime: '', endingTime: '' });
    const [designation, setDesignation] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [services, setServices] = useState<
        {
            _id?: string;
            name: string;
            fee: number | string;
            mode: string;
            duration: string;
        }[]
    >([]);

    const clearAll = () => {
        setName('');
        setDescription('');
        setServices([]);
        setDate({
            saturday: false,
            sunday: false,
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
        });
        setTime({ startingTime: '', endingTime: '' });
        setDesignation('');
        setImage(null);
        setIsSubmit(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        clearAll();
    };

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDate((prev) => ({ ...prev, [event.target.name]: event.target.checked }));
    };

    const handleServiceRemove = (idx: number) => {
        setServices((prev) => {
            const prevService = [...prev];
            prevService.splice(idx, 1);
            return [...prevService];
        });
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setIsSubmit(true);

        // @ts-ignore
        const days = Object.keys(date).filter((day) => date[day]);

        if (
            !name ||
            !description ||
            !services.length ||
            !days.length ||
            !time.startingTime ||
            !time.endingTime ||
            !designation ||
            !image ||
            !position
        )
            return;

        setOpen(false);

        setIsLoading(true);

        const bodyFormData = new FormData();
        bodyFormData.append('name', name);
        bodyFormData.append('position', position.toString());
        bodyFormData.append('description', description);
        bodyFormData.append('visitingDays', JSON.stringify(days));
        bodyFormData.append('timeFrom', time.startingTime);
        bodyFormData.append('timeTo', time.endingTime);
        bodyFormData.append('designation', designation);
        if (image !== null) {
            bodyFormData.append('image', image);
        }
        bodyFormData.append('services', JSON.stringify(services));

        const token = `Bearer ${localStorage.getItem('token')}`;

        try {
            const response = await axios.post('/consultent', bodyFormData, {
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
                    create new consultant
                </Button>

                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="form-dialog-title"
                    // maxWidth="xs"
                >
                    <DialogTitle id="form-dialog-title">Create New Consultant</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Please fill up the form...</DialogContentText>

                        <TextField
                            autoFocus
                            error={isSumbit && !name}
                            helperText={isSumbit && !name ? 'Please provide your name' : ''}
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
                            helperText={isSumbit && !position ? 'Please provide position' : ''}
                            margin="dense"
                            name="position"
                            label="position"
                            fullWidth
                            value={position}
                            onChange={(e) =>
                                setPosition(e.target.value ? Number(e.target.value) : 0)
                            }
                        />

                        <FormControl fullWidth error={isSumbit && !designation}>
                            <InputLabel id="demo-controlled-open-select-label">
                                Designation
                            </InputLabel>
                            <Select
                                labelId="demo-controlled-open-select-label"
                                id="demo-controlled-open-select"
                                open={openSelect}
                                onClose={() => setOpenSelect(false)}
                                onOpen={() => setOpenSelect(true)}
                                value={designation}
                                onChange={(e) => {
                                    if (typeof e.target.value === 'string') {
                                        setDesignation(e.target.value);
                                    }
                                }}
                            >
                                {designations.map((d, idx) => (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <MenuItem key={idx} value={d}>
                                        {d}
                                    </MenuItem>
                                ))}
                            </Select>
                            {isSumbit && !designation ? (
                                <FormHelperText>Please select a designation</FormHelperText>
                            ) : (
                                ''
                            )}
                        </FormControl>

                        <form noValidate>
                            <FormLabel component="div" style={{ marginTop: 25 }}>
                                Select Date
                            </FormLabel>

                            {Object.keys(date).map((day) => (
                                <FormControlLabel
                                    key={day}
                                    value={day}
                                    control={
                                        <Checkbox
                                            name={day}
                                            // @ts-ignore
                                            checked={date[day]}
                                            onChange={handleDateChange}
                                        />
                                    }
                                    label={day}
                                    labelPlacement="end"
                                />
                            ))}
                        </form>

                        <form
                            className={classes.container}
                            style={{ justifyContent: 'space-between' }}
                            noValidate
                        >
                            {/* @ts-ignore */}
                            {Object.keys(time).map((t: 'startingTime' | 'endingTime', index) => (
                                <TextField
                                    key={t}
                                    id={`time-${index}`}
                                    label={`Select ${index === 0 ? 'Starting' : 'Ending'} Time`}
                                    type="time"
                                    // defaultValue="07:30"
                                    error={isSumbit && !time[t]}
                                    helperText={isSumbit && !time[t] ? 'Please provide time' : ''}
                                    value={time[t]}
                                    onChange={(e) =>
                                        setTime((prev) => ({ ...prev, [t]: e.target.value }))
                                    }
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        step: 60, // 1 min
                                    }}
                                />
                            ))}
                        </form>

                        <TextField
                            error={isSumbit && !description}
                            helperText={
                                isSumbit && !description ? 'Please write a description' : ''
                            }
                            margin="dense"
                            name="description"
                            label="Description"
                            multiline
                            fullWidth
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <SelectService
                            serviceOptions={serviceOptions}
                            services={services}
                            setServices={setServices}
                        />
                        {isSumbit && !services.length ? (
                            <Typography
                                color="error"
                                style={{
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.03333em',
                                    fontWeight: 400,
                                }}
                            >
                                Please add service
                            </Typography>
                        ) : (
                            ''
                        )}

                        <Typography>
                            {services.map((service, index) => (
                                <div
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={`${service.name} @ ${index}`}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        margin: '7px 0',
                                    }}
                                >
                                    <div>
                                        {`${service.name} - ${service.mode} - ${service.duration} - ${service.fee}`}
                                    </div>
                                    <DeleteIcon
                                        color="secondary"
                                        fontSize="small"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleServiceRemove(index)}
                                    />
                                </div>
                            ))}
                        </Typography>

                        <span style={{ display: 'block', marginTop: 15 }}>
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
