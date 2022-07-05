import { FormControl, MenuItem, Select } from '@material-ui/core';
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
import ShowFullContent from '../../utils/ShowFullContent';
import AddForm from './AddForm';
import { AppointmentData, ConsultantData } from './Appointments';

interface Props {
    apiData: AppointmentData[];
    consultants: ConsultantData[];
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
    position: number,
    userNumber: string,
    givenNumber: string,
    consultant: string,
    service: string,
    appointmentDate: string,
    appointmentTime: string,
    state: string,
    story: string,
    dob: string,
    gender: string
) => ({
    id,
    name,
    position,
    userNumber,
    givenNumber,
    consultant,
    service,
    appointmentDate,
    appointmentTime,
    state,
    story,
    dob,
    gender,
});

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 700,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    content: {
        width: 85,
        maxWidth: '100%',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        '& > *': {
            maxWidth: '100%',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            boxSizing: 'border-box',
            margin: 0,
            padding: 0,
        },
    },
}));

const DataTable: React.FC<Props> = ({ apiData, consultants, forceUpdate }): React.ReactElement => {
    const classes = useStyles();

    const [isEditing, setIsEditing] = useState(false);
    const [editingIdx, setEditingIdx] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);

    const [state, setState] = useState('');
    const [position, setPosition] = useState(0);

    const calcAge = (dateString: string): number => {
        const birthday = +new Date(dateString);
        // eslint-disable-next-line no-bitwise
        return ~~((Date.now() - birthday) / 31557600000);
    };

    const handleClose = () => {
        setIsEditing(false);
        setEditingIdx(-1);
        setState('');
    };

    const editButtonHandler = (editedState: string, idx: number) => {
        setIsEditing(true);
        setEditingIdx(idx);
        setState(editedState);
    };

    const handleSubmit = async (id: string) => {
        if (!state) {
            // eslint-disable-next-line no-alert
            alert('Please select a state');
        } else {
            setIsEditing(false);
            setEditingIdx(-1);
            setIsLoading(true);

            const token = `Bearer ${localStorage.getItem('token')}`;

            try {
                const response = await axios.patch(
                    '/consultent/appointment',
                    { id, state, position },
                    {
                        headers: { Authorization: token },
                    }
                );

                if (response) {
                    setIsLoading(false);
                    setState('');
                    forceUpdate();
                }
            } catch (err) {
                setIsLoading(false);
                setState('');
                // eslint-disable-next-line no-alert
                // @ts-ignore
                alert(err?.response?.data?.message ?? 'Something went wrong');
            }
        }
    };

    const rows = apiData.map((data) =>
        createData(
            // eslint-disable-next-line no-underscore-dangle
            data._id,
            data.name,
            data.position,
            data.userPhoneNumber,
            data.givenMobileNumber,
            data.consultantName,
            data.service,
            data.appointmentDate,
            data.appointmentTime,
            data.state,
            data.story,
            data.dob,
            data.gender
        )
    );

    return (
        <>
            <Loader open={isLoading} />

            <AddForm consultants={consultants} forceUpdate={forceUpdate} />

            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Position</StyledTableCell>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell align="left">User Number</StyledTableCell>
                            <StyledTableCell align="left">Consultant</StyledTableCell>
                            <StyledTableCell align="left">Service</StyledTableCell>
                            <StyledTableCell align="left">Appointment Date</StyledTableCell>
                            <StyledTableCell align="left">Appointment Time</StyledTableCell>
                            <StyledTableCell align="left">State</StyledTableCell>
                            <StyledTableCell align="left">Story</StyledTableCell>
                            <StyledTableCell align="left">Age</StyledTableCell>
                            <StyledTableCell align="left">Date of birth</StyledTableCell>
                            <StyledTableCell align="left">Gender</StyledTableCell>
                            <StyledTableCell align="right">Edit</StyledTableCell>
                            {/* <StyledTableCell align="right">Delete</StyledTableCell> */}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows.map((row, idx) => (
                            <StyledTableRow key={row.id}>
                                <StyledTableCell component="th" scope="row">
                                    {isEditing && editingIdx === idx ? (
                                        <FormControl className={classes.formControl}>
                                            <input
                                                color="primary"
                                                type="number"
                                                onChange={(e) =>
                                                    setPosition(
                                                        e.target.value ? Number(e.target.value) : 0
                                                    )
                                                }
                                            />
                                        </FormControl>
                                    ) : (
                                        row.position
                                    )}
                                </StyledTableCell>
                                <StyledTableCell component="th" scope="row">
                                    {row.name}
                                </StyledTableCell>
                                <StyledTableCell align="left">{row.userNumber}</StyledTableCell>
                                <StyledTableCell align="left">{row.consultant}</StyledTableCell>
                                <StyledTableCell align="left">{row.service}</StyledTableCell>
                                <StyledTableCell align="left">
                                    {row.appointmentDate}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                    {row.appointmentTime}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                    {isEditing && editingIdx === idx ? (
                                        <FormControl className={classes.formControl}>
                                            <Select
                                                value={state || row.state}
                                                onChange={(e) => {
                                                    if (typeof e.target.value === 'string') {
                                                        setState(e.target.value);
                                                    }
                                                }}
                                                displayEmpty
                                                className={classes.selectEmpty}
                                                inputProps={{ 'aria-label': 'Without label' }}
                                            >
                                                <MenuItem value="pending">Pending</MenuItem>
                                                <MenuItem value="done">Done</MenuItem>
                                                <MenuItem value="noted">Noted</MenuItem>
                                                <MenuItem value="waitingForReview">
                                                    Waiting For Review
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    ) : (
                                        row.state
                                    )}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                    {row.story.length > 12 ? (
                                        <>
                                            <div className={classes.content}>{row.story}</div>
                                            <ShowFullContent title="Story" content={row.story} />
                                        </>
                                    ) : (
                                        <div className={classes.content}>{row.story}</div>
                                    )}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                    {calcAge(row.dob)} years
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                    {new Date(row.dob).toLocaleDateString('en-US')}
                                </StyledTableCell>
                                <StyledTableCell align="left">{row.gender}</StyledTableCell>
                                <StyledTableCell align="right">
                                    {isEditing && editingIdx === idx ? (
                                        <div>
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
                                                onClick={() => handleSubmit(row.id)}
                                            />
                                        </div>
                                    ) : (
                                        <EditIcon
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => editButtonHandler(row.state, idx)}
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
