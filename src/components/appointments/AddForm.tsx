import {
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    InputLabel,
    makeStyles,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    // eslint-disable-next-line prettier/prettier
    Typography
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import axios from '../../utils/axios';
import Loader from '../../utils/Loader';
import { ConsultantData } from './Appointments';

interface Props {
    consultants: ConsultantData[];
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
}));

const AddForm: React.FC<Props> = ({ consultants, forceUpdate }) => {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [consultantName, setConsultantName] = useState<any>(null);
    const [date, setDate] = useState<string | null>(null);
    const [time, setTime] = useState<string | null>(null);
    const [service, setService] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [number, setNumber] = useState<string | null>(null);
    const [gender, setGender] = useState<string | null>(null);
    const [dob, setDob] = useState<string | null>(null);
    const [story, setStory] = useState<string | null>(null);

    const [isSumbit, setIsSubmit] = useState(false);

    const [idx, setIdx] = useState<number>(-1);

    const clearAll = () => {
        setConsultantName(null);
        setDate(null);
        setTime(null);
        setService(null);
        setName(null);
        setNumber(null);
        setGender(null);
        setDob(null);
        setStory(null);
        setIdx(-1);
        setIsSubmit(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        clearAll();
    };

    const handleSubmit = async () => {
        setIsSubmit(true);

        if (
            !consultantName ||
            !date ||
            !time ||
            !service ||
            !name ||
            !number ||
            !gender ||
            !dob ||
            !story
        )
            return;

        setOpen(false);

        setIsLoading(true);

        const token = `Bearer ${localStorage.getItem('token')}`;

        const reqData = {
            name,
            userNumber: number,
            appointmentDate: date,
            appointmentTime: time,
            gender,
            dob,
            story,
            consultantName,
            service,
        };

        try {
            const response = await axios.post('/consultent/appointment', reqData, {
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
                    make new appointment
                </Button>
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Make New Appointment</DialogTitle>
                    <DialogContent>
                        <Typography>Appointment Details</Typography>

                        <FormControl fullWidth error={isSumbit && !consultantName}>
                            <InputLabel>Select Consultant</InputLabel>
                            <Select
                                autoFocus
                                value={consultantName}
                                onChange={(e) => {
                                    // setIdx(+e.currentTarget.dataset.id);
                                    setConsultantName(e.target.value);
                                }}
                            >
                                {consultants?.map((c, index) => (
                                    <MenuItem
                                        // eslint-disable-next-line react/no-array-index-key
                                        key={index}
                                        data-id={index}
                                        value={c.name}
                                        onClick={(e) => {
                                            if (
                                                e &&
                                                e.currentTarget &&
                                                e.currentTarget.dataset &&
                                                e.currentTarget.dataset.id
                                            ) {
                                                setIdx(+e.currentTarget.dataset.id);
                                            }
                                        }}
                                    >
                                        {c.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {isSumbit && !consultantName ? (
                                <FormHelperText>Please select a consultant</FormHelperText>
                            ) : (
                                ''
                            )}
                        </FormControl>

                        {consultantName ? (
                            <FormControl fullWidth error={isSumbit && !service}>
                                <InputLabel>Select Service</InputLabel>
                                <Select
                                    value={service}
                                    onChange={(e) => {
                                        if (typeof e.target.value === 'string') {
                                            setService(e.target.value);
                                        }
                                    }}
                                >
                                    {consultants[idx]?.service.map((s, index) => (
                                        // <MenuItem key={index} value={JSON.stringify(s)}>
                                        <MenuItem
                                            // eslint-disable-next-line react/no-array-index-key
                                            key={index}
                                            value={`${s.name}-${s.mode}-${s.duration}-${s.fee}`}
                                        >
                                            {`${s.name}-${s.mode}-${s.duration}-${s.fee}`}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {isSumbit && !service ? (
                                    <FormHelperText>Please select a service</FormHelperText>
                                ) : (
                                    ''
                                )}
                            </FormControl>
                        ) : null}

                        {consultantName ? (
                            <form noValidate>
                                <FormLabel component="div" style={{ marginTop: 25 }}>
                                    Select Date
                                </FormLabel>
                                <RadioGroup
                                    aria-label="gender"
                                    name="controlled-radio-buttons-group"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                >
                                    {consultants[idx] &&
                                        consultants[idx].visitingDays[0] &&
                                        JSON.parse(consultants[idx].visitingDays[0]).map(
                                            (day: string) => (
                                                <FormControlLabel
                                                    key={day}
                                                    value={day}
                                                    control={<Radio size="small" />}
                                                    label={day}
                                                />
                                            )
                                        )}
                                </RadioGroup>
                            </form>
                        ) : null}

                        {consultantName ? (
                            <form className={classes.container} noValidate>
                                <TextField
                                    id="time"
                                    fullWidth
                                    label={
                                        <div
                                            style={{
                                                width: 300,
                                            }}
                                        >
                                            Select Time from
                                            <span style={{ color: 'orangered', margin: '0 5px' }}>
                                                {consultants[idx]?.timeFrom}
                                            </span>
                                            to
                                            <span style={{ color: 'orangered', margin: '0 5px' }}>
                                                {consultants[idx]?.timeTo}
                                            </span>
                                        </div>
                                    }
                                    type="time"
                                    // defaultValue="07:30"
                                    error={isSumbit && !time}
                                    helperText={isSumbit && !time ? 'Please provide a date' : ''}
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        step: 60, // 1 min
                                    }}
                                />
                            </form>
                        ) : null}

                        <Divider style={{ margin: '20px 0' }} />

                        <Typography>Personal Details</Typography>

                        <TextField
                            error={isSumbit && !name}
                            helperText={isSumbit && !name ? 'Please provide your name' : ''}
                            margin="dense"
                            name="name"
                            label="Full Name"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <TextField
                            error={isSumbit && !number}
                            helperText={
                                isSumbit && !number ? 'Please provide your mobile number' : ''
                            }
                            margin="dense"
                            type="tel"
                            name="number"
                            label="Mobile Number"
                            fullWidth
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                        />

                        <FormControl fullWidth error={isSumbit && !gender}>
                            <InputLabel>Select Gender</InputLabel>
                            <Select
                                value={gender}
                                onChange={(e) => {
                                    if (typeof e.target.value === 'string') {
                                        setGender(e.target.value);
                                    }
                                }}
                            >
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem>
                            </Select>
                            {isSumbit && !gender ? (
                                <FormHelperText>Please select your gender</FormHelperText>
                            ) : (
                                ''
                            )}
                        </FormControl>

                        <form className={classes.container} noValidate>
                            <TextField
                                id="date"
                                label="Date of Birth"
                                type="date"
                                // defaultValue="2017-05-24"
                                error={isSumbit && !dob}
                                helperText={
                                    isSumbit && !dob ? 'Please provide your date of birth' : ''
                                }
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </form>

                        <TextField
                            error={isSumbit && !story}
                            helperText={isSumbit && !story ? 'Please a short story' : ''}
                            margin="dense"
                            name="story"
                            label="Short Story"
                            multiline
                            fullWidth
                            value={story}
                            onChange={(e) => setStory(e.target.value)}
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
