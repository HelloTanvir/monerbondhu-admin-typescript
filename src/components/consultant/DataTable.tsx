/* eslint-disable no-alert */
/* eslint-disable no-nested-ternary */
import { FormControl, MenuItem, Select, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { DeleteForever } from '@material-ui/icons';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import ImageIcon from '@material-ui/icons/Image';
import parse from 'html-react-parser';
import React, { useState } from 'react';
import axios from '../../utils/axios';
import EditBigContent from '../../utils/EditBigContent';
import Loader from '../../utils/Loader';
import ShowFullContent from '../../utils/ShowFullContent';
import AddForm from './addForm/AddForm';
import { ConsultantData } from './Consultant';
import EditService from './EditService';
import EditVisitingDays from './EditVisitingDays';
import Image from './Image';
import ShowService from './ShowService';

interface Props {
    apiData: ConsultantData[];
    designations: string[];
    services: string[];
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
    position: number,
    image: string,
    name: string,
    designation: string,
    visitingDays: string[],
    timeFrom: string,
    timeTo: string,
    review: number | string,
    reviewCount: number,
    description: string,
    service: [
        {
            _id?: string;
            name: string;
            fee: number | string;
            mode: string;
            duration: string;
        }
    ]
) => ({
    id,
    image,
    name,
    position,
    designation,
    visitingDays,
    timeFrom,
    timeTo,
    review,
    reviewCount,
    description,
    service,
});

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 700,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        '& > *': {
            marginTop: '0px !important',
        },
    },
    button: {
        margin: theme.spacing(1),
        fontSize: 10,
        paddingLeft: 10,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    textField: {
        '& > *': {
            fontSize: 13,
        },
    },
    description: {
        width: 80,
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

const DataTable: React.FC<Props> = ({
    apiData,
    designations,
    services,
    forceUpdate,
}): React.ReactElement => {
    const classes = useStyles();

    const [isEditing, setIsEditing] = useState(false);
    const [editingIdx, setEditingIdx] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);

    const [image, setImage] = useState<File | null>(null);
    const [name, setName] = useState('');
    const [designation, setDesignation] = useState('');
    const [visitingDays, setVisitingDays] = useState<string[]>([]);
    const [timeFrom, setTimeFrom] = useState('');
    const [timeTo, setTimeTo] = useState('');
    const [description, setDescription] = useState('');
    const [position, setPosition] = useState<number>(0);
    const [newServices, setNewServices] = useState<
        {
            _id?: string;
            name: string;
            fee: number | string;
            mode: string;
            duration: string;
        }[]
    >([]);

    const handleClose = () => {
        setIsEditing(false);
        setEditingIdx(-1);
    };

    const clearAll = () => {
        setImage(null);
        setName('');
        setDesignation('');
        setVisitingDays([]);
        setTimeFrom('');
        setTimeTo('');
        setDescription('');
        setNewServices([]);
        setPosition(0);
    };

    const handleDelete = async (id: string) => {
        // eslint-disable-next-line no-restricted-globals
        if (!confirm('Are you sure you want to delete this element?')) {
            return;
        }

        setIsLoading(true);

        const token = `Bearer ${localStorage.getItem('token')}`;

        try {
            const response = await axios.delete('/consultent', {
                headers: { Authorization: token },
                data: {
                    id,
                },
            });

            if (response) {
                setIsLoading(false);
                // eslint-disable-next-line no-alert
                alert('Deleted Successfully');
                forceUpdate();
            }
        } catch (err) {
            setIsLoading(false);
            // @ts-ignore
            alert(err?.response?.data?.message ?? 'Something went wrong');
        }
    };

    const handleEdit = async (id: string) => {
        if (
            !name ||
            !designation ||
            !visitingDays.length ||
            !timeFrom ||
            !timeTo ||
            !description ||
            !position
        ) {
            // eslint-disable-next-line no-alert
            alert('Empty field is not taken');
            return;
        }

        setIsEditing(false);
        setEditingIdx(-1);
        setIsLoading(true);

        const token = `Bearer ${localStorage.getItem('token')}`;

        let imageUrl = '';

        if (image !== null) {
            const formData = new FormData();
            formData.append('image', image);

            const response = await axios.post('/upload', formData, {
                headers: { Authorization: token },
            });

            imageUrl = response.data.image;
        }

        const updateData: {
            position: number;
            name: string;
            designation: string;
            visitingDays: string;
            timeFrom: string;
            timeTo: string;
            description: string;
            service: any[];
            image?: string;
        } = {
            name,
            designation,
            visitingDays: JSON.stringify(visitingDays),
            timeFrom,
            timeTo,
            description,
            service: newServices,
            position,
        };

        if (imageUrl) {
            updateData.image = imageUrl;
        }

        try {
            const response = await axios.patch(`/consultent/${id}`, updateData, {
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
            designation: string;
            visitingDays: string[];
            timeFrom: string;
            timeTo: string;
            description: string;
            position: number;
        },
        idx: number
    ) => {
        setIsEditing(true);
        setEditingIdx(idx);
        setPosition(editedData.position);
        setName(editedData.name);
        setDesignation(editedData.designation);
        setVisitingDays(editedData.visitingDays);
        setTimeFrom(editedData.timeFrom);
        setTimeTo(editedData.timeTo);
        setDescription(editedData.description);
    };

    const rows = apiData.map((data) =>
        createData(
            // eslint-disable-next-line no-underscore-dangle
            data._id,
            data.position,
            data.image,
            data.name,
            data.designation,
            data.visitingDays,
            data.timeFrom,
            data.timeTo,
            data.review,
            data.reviewCount,
            data.description,
            data.service
        )
    );

    return (
        <>
            <Loader open={isLoading} />

            <AddForm
                designations={designations}
                serviceOptions={services}
                forceUpdate={forceUpdate}
            />

            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Position</StyledTableCell>
                            <StyledTableCell>Image</StyledTableCell>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell>Designation</StyledTableCell>
                            <StyledTableCell>Visiting Days</StyledTableCell>
                            <StyledTableCell>Time From</StyledTableCell>
                            <StyledTableCell>Time To</StyledTableCell>
                            <StyledTableCell>Review</StyledTableCell>
                            <StyledTableCell>Review Count</StyledTableCell>
                            <StyledTableCell>Description</StyledTableCell>
                            <StyledTableCell>Services</StyledTableCell>
                            <StyledTableCell align="right">Edit</StyledTableCell>
                            <StyledTableCell align="right">Delete</StyledTableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows.map((row, idx) => (
                            <StyledTableRow key={row.id}>
                                <StyledTableCell>
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
                                        // idx + 1
                                    )}
                                </StyledTableCell>
                                <StyledTableCell>
                                    {isEditing && editingIdx === idx ? (
                                        <span style={{ display: 'block', marginTop: 15 }}>
                                            <input
                                                color="primary"
                                                accept="image/*"
                                                type="file"
                                                onChange={(e) => {
                                                    if (
                                                        e.target.files &&
                                                        e.target.files.length > 0
                                                    ) {
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
                                                    style={{
                                                        textTransform: 'capitalize',
                                                        margin: 'unset',
                                                    }}
                                                >
                                                    Change Image
                                                </Button>
                                            </label>
                                        </span>
                                    ) : (
                                        <Image name={row.name} image={row.image} />
                                    )}
                                </StyledTableCell>

                                <StyledTableCell>
                                    {isEditing && editingIdx === idx ? (
                                        <TextField
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className={classes.textField}
                                        />
                                    ) : (
                                        row.name
                                    )}
                                </StyledTableCell>

                                <StyledTableCell>
                                    {isEditing && editingIdx === idx ? (
                                        <FormControl className={classes.formControl}>
                                            <Select
                                                value={designation}
                                                onChange={(e) => {
                                                    if (typeof e.target.value === 'string') {
                                                        setDesignation(e.target.value);
                                                    }
                                                }}
                                                displayEmpty
                                                className={classes.selectEmpty}
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                style={{ fontSize: 13 }}
                                            >
                                                {designations.map((des) => (
                                                    <MenuItem key={des} value={des}>
                                                        {des}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    ) : (
                                        row.designation
                                    )}
                                </StyledTableCell>

                                <StyledTableCell>
                                    {isEditing && editingIdx === idx ? (
                                        <EditVisitingDays
                                            availableDays={JSON.parse(row.visitingDays[0])}
                                            setVisitingDays={setVisitingDays}
                                        />
                                    ) : (
                                        row.visitingDays.map((dayNames) => (
                                            <ul key={dayNames}>
                                                {[...JSON.parse(dayNames)].map((day) => (
                                                    <li key={day}>{day}</li>
                                                ))}
                                            </ul>
                                        ))
                                    )}
                                </StyledTableCell>

                                <StyledTableCell>
                                    {isEditing && editingIdx === idx ? (
                                        <TextField
                                            id="timeFrom"
                                            type="time"
                                            defaultValue={timeFrom}
                                            className={classes.textField}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            inputProps={{
                                                step: 300, // 5 min
                                            }}
                                            value={timeFrom}
                                            onChange={(e) => setTimeFrom(e.target.value)}
                                        />
                                    ) : (
                                        row.timeFrom
                                    )}
                                </StyledTableCell>

                                <StyledTableCell>
                                    {isEditing && editingIdx === idx ? (
                                        <TextField
                                            id="timeTo"
                                            type="time"
                                            defaultValue={timeTo}
                                            className={classes.textField}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            inputProps={{
                                                step: 300, // 5 min
                                            }}
                                            value={timeTo}
                                            onChange={(e) => setTimeTo(e.target.value)}
                                        />
                                    ) : (
                                        row.timeTo
                                    )}
                                </StyledTableCell>

                                <StyledTableCell>{row.review}</StyledTableCell>

                                <StyledTableCell>{row.reviewCount}</StyledTableCell>

                                <StyledTableCell>
                                    {isEditing && editingIdx === idx ? (
                                        <EditBigContent
                                            contentTitle="Description"
                                            bigContent={description}
                                            setBigContent={setDescription}
                                        />
                                    ) : row.description?.length > 12 ? (
                                        <>
                                            <div className={classes.description}>
                                                {parse(row.description || '')}
                                            </div>
                                            <ShowFullContent
                                                title="Description"
                                                content={parse(row.description || '')}
                                            />
                                        </>
                                    ) : (
                                        <div className={classes.description}>
                                            {parse(row.description || '')}
                                        </div>
                                    )}
                                </StyledTableCell>

                                <StyledTableCell>
                                    {isEditing && editingIdx === idx ? (
                                        <EditService
                                            services={row.service}
                                            serviceOptions={services}
                                            newServices={newServices}
                                            setNewServices={setNewServices}
                                        />
                                    ) : (
                                        <ShowService services={row.service} />
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
                                                        name: row.name,
                                                        designation: row.designation,
                                                        visitingDays: JSON.parse(
                                                            row.visitingDays[0]
                                                        ),

                                                        position: row.position,
                                                        timeFrom: row.timeFrom,
                                                        timeTo: row.timeTo,
                                                        description: row.description,
                                                    },
                                                    idx
                                                )
                                            }
                                        />
                                    )}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <DeleteForever
                                        color="secondary"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleDelete(row.id)}
                                    />
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default DataTable;
