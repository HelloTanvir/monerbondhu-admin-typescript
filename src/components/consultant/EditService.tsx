import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import React, { useEffect, useState } from 'react';
import SelectService from './addForm/SelectService';

interface Props {
    services: [
        {
            _id?: string;
            name: string;
            fee: number | string;
            mode: string;
            duration: string;
        }
    ];
    serviceOptions: string[];
    newServices: {
        _id?: string;
        name: string;
        fee: number | string;
        mode: string;
        duration: string;
    }[];

    setNewServices: React.Dispatch<
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

const EditService: React.FC<Props> = ({
    services,
    serviceOptions,
    newServices,
    setNewServices,
}): React.ReactElement => {
    const [open, setOpen] = useState(false);

    const [name, setName] = useState('');
    const [fee, setFee] = useState<number | string>('');
    const [mode, setMode] = useState('');
    const [duration, setDuration] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    const [editingIdx, setEditingIdx] = useState(-1);

    const [openNameSelect, setOpenNameSelect] = useState(false);
    const [openModeSelect, setOpenModeSelect] = useState(false);
    const [openDurationSelect, setOpenDurationSelect] = useState(false);

    const serviceDuration = ['30M', '1H', '1H 15M', '1H 30M', '2H'];

    useEffect(() => {
        setNewServices(services);
    }, [services, setNewServices]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleServiceRemove = (idx: number) => {
        setNewServices((prev) => {
            const prevService = [...prev];
            prevService.splice(idx, 1);
            return [...prevService];
        });
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingIdx(-1);
    };

    const editButtonHandler = (
        editedData: {
            name: string;
            fee: string | number;
            mode: string;
            duration: string;
        },
        idx: number
    ) => {
        setIsEditing(true);
        setEditingIdx(idx);

        setName(editedData.name);
        setFee(editedData.fee);
        setMode(editedData.mode);
        setDuration(editedData.duration);
    };

    const handleEdit = (idx: number) => {
        setNewServices((prev) => {
            const modifiedArr = [...prev];

            modifiedArr[idx].name = name;
            modifiedArr[idx].fee = fee;
            modifiedArr[idx].mode = mode;
            modifiedArr[idx].duration = duration;

            return modifiedArr;
        });

        handleCancelEdit();
    };

    return (
        <div>
            <Button
                color="primary"
                size="small"
                variant="text"
                style={{ paddingLeft: 0, paddingRight: 0, textTransform: 'none' }}
                onClick={handleClickOpen}
            >
                Edit
            </Button>
            <Dialog
                open={open}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                fullWidth
                maxWidth="md"
            >
                <DialogTitle id="alert-dialog-slide-title">Services</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        <SelectService
                            serviceOptions={serviceOptions}
                            services={newServices}
                            setServices={setNewServices}
                        />
                        <TableContainer component={Paper}>
                            <Table aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Name</StyledTableCell>
                                        <StyledTableCell>Fee</StyledTableCell>
                                        <StyledTableCell>Mode</StyledTableCell>
                                        <StyledTableCell>Duration</StyledTableCell>
                                        <StyledTableCell align="right">Edit</StyledTableCell>
                                        <StyledTableCell align="right">Delete</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {newServices.map((service, index) => (
                                        // eslint-disable-next-line no-underscore-dangle
                                        <StyledTableRow key={service._id}>
                                            <StyledTableCell component="th" scope="row">
                                                {isEditing && editingIdx === index ? (
                                                    <FormControl fullWidth>
                                                        <InputLabel id="demo-controlled-open-select-label">
                                                            Name
                                                        </InputLabel>
                                                        <Select
                                                            labelId="demo-controlled-open-select-label"
                                                            id="demo-controlled-open-select"
                                                            open={openNameSelect}
                                                            onClose={() => setOpenNameSelect(false)}
                                                            onOpen={() => setOpenNameSelect(true)}
                                                            value={name}
                                                            onChange={(e) => {
                                                                if (
                                                                    typeof e.target.value ===
                                                                    'string'
                                                                ) {
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
                                                ) : (
                                                    service.name
                                                )}
                                            </StyledTableCell>

                                            <StyledTableCell>
                                                {isEditing && editingIdx === index ? (
                                                    <TextField
                                                        autoFocus
                                                        type="number"
                                                        InputProps={{ inputProps: { min: 0 } }}
                                                        margin="dense"
                                                        name="fee"
                                                        label="Fee"
                                                        value={fee}
                                                        onChange={(e) => {
                                                            if (
                                                                typeof e.target.value === 'string'
                                                            ) {
                                                                setFee(e.target.value);
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    service.fee
                                                )}
                                            </StyledTableCell>

                                            <StyledTableCell>
                                                {isEditing && editingIdx === index ? (
                                                    <FormControl fullWidth>
                                                        <InputLabel id="demo-controlled-open-select-label">
                                                            Mode
                                                        </InputLabel>
                                                        <Select
                                                            labelId="demo-controlled-open-select-label"
                                                            id="demo-controlled-open-select"
                                                            open={openModeSelect}
                                                            onClose={() => setOpenModeSelect(false)}
                                                            onOpen={() => setOpenModeSelect(true)}
                                                            value={mode}
                                                            onChange={(e) => {
                                                                if (
                                                                    typeof e.target.value ===
                                                                    'string'
                                                                ) {
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
                                                ) : (
                                                    service.mode
                                                )}
                                            </StyledTableCell>

                                            <StyledTableCell>
                                                {isEditing && editingIdx === index ? (
                                                    <FormControl fullWidth>
                                                        <InputLabel id="demo-controlled-open-select-label">
                                                            Duration
                                                        </InputLabel>
                                                        <Select
                                                            labelId="demo-controlled-open-select-label"
                                                            id="demo-controlled-open-select"
                                                            open={openDurationSelect}
                                                            onClose={() =>
                                                                setOpenDurationSelect(false)
                                                            }
                                                            onOpen={() =>
                                                                setOpenDurationSelect(true)
                                                            }
                                                            value={duration}
                                                            onChange={(e) => {
                                                                if (
                                                                    typeof e.target.value ===
                                                                    'string'
                                                                ) {
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
                                                ) : (
                                                    service.duration
                                                )}
                                            </StyledTableCell>

                                            <StyledTableCell align="right">
                                                {isEditing && editingIdx === index ? (
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'flex-end',
                                                        }}
                                                    >
                                                        <CheckIcon
                                                            style={{
                                                                cursor: 'pointer',
                                                                color: 'green',
                                                                marginBottom: 5,
                                                            }}
                                                            onClick={() => handleEdit(index)}
                                                        />

                                                        <ClearIcon
                                                            style={{
                                                                cursor: 'pointer',
                                                                color: 'red',
                                                            }}
                                                            onClick={() => handleCancelEdit()}
                                                        />
                                                    </div>
                                                ) : (
                                                    <EditIcon
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() =>
                                                            editButtonHandler(
                                                                {
                                                                    name: service.name,
                                                                    fee: service.fee,
                                                                    mode: service.mode,
                                                                    duration: service.duration,
                                                                },
                                                                index
                                                            )
                                                        }
                                                    />
                                                )}
                                            </StyledTableCell>

                                            <StyledTableCell align="right">
                                                <DeleteIcon
                                                    color="secondary"
                                                    fontSize="small"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleServiceRemove(index)}
                                                />
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Done
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default EditService;
