/* eslint-disable no-alert */
import { FormControl, TextField } from '@material-ui/core';
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
import React, { useState } from 'react';
import Avatar from '../../assets/Avatar.jpg';
import axios from '../../utils/axios';
import Loader from '../../utils/Loader';
import AddForm from './AddForm';
import { LightExerciseData } from './LightExercise';

interface Props {
    apiData: LightExerciseData[];
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
    title: string,
    videoLink: string,
    image: string,
    viewCount: string | number,
    dateTime: string,
    position: number
) => ({
    id,
    title,
    videoLink,
    image,
    viewCount,
    dateTime,
    position,
});

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    table: {
        minWidth: 700,
    },
    textField: {
        '& > *': {
            fontSize: 13,
        },
    },
});

const DataTable: React.FC<Props> = ({ apiData, forceUpdate }): React.ReactElement => {
    const classes = useStyles();

    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingIdx, setEditingIdx] = useState(-1);

    const [position, setPosition] = useState(0);
    const [title, setTitle] = useState('');
    const [youtubeLink, setYoutubeLink] = useState('');

    const handleClose = () => {
        setIsEditing(false);
        setEditingIdx(-1);
    };

    const clearAll = () => {
        setTitle('');
    };

    const handleDelete = async (id: string) => {
        // eslint-disable-next-line no-restricted-globals
        if (!confirm('Are you sure you want to delete this element?')) {
            return;
        }

        setIsLoading(true);

        const token = `Bearer ${localStorage.getItem('token')}`;

        try {
            const response = await axios.delete('/lightexercise', {
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
            // eslint-disable-next-line no-alert
            // @ts-ignore
            alert(err?.response?.data?.message ?? 'Something went wrong');
        }
    };

    const handleEdit = async (id: string) => {
        if (!title) {
            alert('Empty field is not taken');
            return;
        }

        setIsEditing(false);
        setEditingIdx(-1);
        setIsLoading(true);

        const updateData = {
            id,
            name: title,
            ytlink: youtubeLink,
            position,
        };

        const token = `Bearer ${localStorage.getItem('token')}`;

        try {
            const response = await axios.patch('/lightexercise', updateData, {
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
            title: string;
            youtubeLink: string;
            position: number;
        },
        idx: number
    ) => {
        setIsEditing(true);
        setEditingIdx(idx);
        setPosition(editedData.position);
        setTitle(editedData.title);
        setYoutubeLink(editedData.youtubeLink);
    };

    const rows = apiData.map((data) =>
        createData(
            // eslint-disable-next-line no-underscore-dangle
            data._id,
            data.name,
            data.ytlink,
            data.image,
            data.viewCount,
            data.DateTime,
            data.position
        )
    );

    return (
        <>
            <Loader open={isLoading} />

            <AddForm forceUpdate={forceUpdate} />

            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Position</StyledTableCell>
                            <StyledTableCell>Image</StyledTableCell>
                            <StyledTableCell>Title</StyledTableCell>
                            <StyledTableCell>View Count</StyledTableCell>
                            <StyledTableCell>Date</StyledTableCell>
                            <StyledTableCell>Time</StyledTableCell>
                            <StyledTableCell align="right">Edit</StyledTableCell>
                            <StyledTableCell align="right">Delete</StyledTableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows.map((row, idx) => (
                            <StyledTableRow key={row.id}>
                                <StyledTableCell>
                                    {isEditing && editingIdx === idx ? (
                                        <FormControl className="">
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
                                <StyledTableCell>
                                    {/* eslint-disable-next-line no-nested-ternary */}
                                    {isEditing && editingIdx === idx ? (
                                        <TextField
                                            value={youtubeLink}
                                            onChange={(e) => setYoutubeLink(e.target.value)}
                                            className={classes.textField}
                                        />
                                    ) : row.videoLink ? (
                                        <a
                                            target="_blank"
                                            rel="noreferrer"
                                            href={row.videoLink}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <img
                                                src={row.image || Avatar}
                                                alt=""
                                                width="100px"
                                                height="100px"
                                            />
                                        </a>
                                    ) : (
                                        <span
                                            role="button"
                                            tabIndex={0}
                                            // eslint-disable-next-line no-alert
                                            onClick={() => alert('This has no video attached')}
                                        >
                                            <img
                                                src={row.image || Avatar}
                                                alt=""
                                                width="100px"
                                                height="100px"
                                            />
                                        </span>
                                    )}
                                </StyledTableCell>

                                <StyledTableCell>
                                    {isEditing && editingIdx === idx ? (
                                        <TextField
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className={classes.textField}
                                        />
                                    ) : (
                                        row.title
                                    )}
                                </StyledTableCell>

                                <StyledTableCell>{row.viewCount}</StyledTableCell>

                                <StyledTableCell>
                                    {new Date(row.dateTime).toLocaleDateString('en-US')}
                                </StyledTableCell>

                                <StyledTableCell>
                                    {new Date(row.dateTime).toLocaleTimeString('en-US')}
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
                                                        title: row.title,
                                                        youtubeLink: row.videoLink,
                                                        position: row.position,
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
