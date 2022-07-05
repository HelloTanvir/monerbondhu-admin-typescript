/* eslint-disable no-alert */
import { TextField } from '@material-ui/core';
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
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import React, { useState } from 'react';
import axios from '../../../utils/axios';
import Loader from '../../../utils/Loader';
import AddForm from './AddForm';
import { DesignationData } from './Designation';

interface Props {
    apiData: DesignationData[];
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

const createData = (id: string, designation: string) => ({ id, designation });

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
    textField: {
        '& > *': {
            fontSize: 13,
        },
    },
}));

const DataTable: React.FC<Props> = ({ apiData, forceUpdate }): React.ReactElement => {
    const classes = useStyles();

    const [isLoading, setIsLoading] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editingIdx, setEditingIdx] = useState(-1);
    const [designation, setDesignation] = useState('');

    const handleClose = () => {
        setIsEditing(false);
        setEditingIdx(-1);
    };

    const clearAll = () => {
        setDesignation('');
    };

    const handleDelete = async (id: string) => {
        // eslint-disable-next-line no-restricted-globals
        if (!confirm('Are you sure you want to delete this element?')) {
            return;
        }

        setIsLoading(true);

        const token = `Bearer ${localStorage.getItem('token')}`;

        try {
            const response = await axios.delete('/consultent/designation', {
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
        if (!designation) {
            // eslint-disable-next-line no-alert
            alert('Empty field is not taken');
            return;
        }

        setIsEditing(false);
        setEditingIdx(-1);
        setIsLoading(true);

        const token = `Bearer ${localStorage.getItem('token')}`;

        try {
            const response = await axios.patch(
                `/consultent/designation/${id}`,
                { designation },
                {
                    headers: { Authorization: token },
                }
            );

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
            designation: string;
        },
        idx: number
    ) => {
        setIsEditing(true);
        setEditingIdx(idx);

        setDesignation(editedData.designation);
    };

    // eslint-disable-next-line no-underscore-dangle
    const rows = apiData.map((data) => createData(data._id, data.designation));

    return (
        <>
            <Loader open={isLoading} />
            <AddForm forceUpdate={forceUpdate} />
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Designation</StyledTableCell>
                            <StyledTableCell align="right">Edit</StyledTableCell>
                            <StyledTableCell align="right">Delete</StyledTableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows.map((row, idx) => (
                            <StyledTableRow key={row.id}>
                                <StyledTableCell component="th" scope="row">
                                    {isEditing && editingIdx === idx ? (
                                        <TextField
                                            value={designation}
                                            onChange={(e) => setDesignation(e.target.value)}
                                            className={classes.textField}
                                        />
                                    ) : (
                                        row.designation
                                    )}
                                </StyledTableCell>

                                <StyledTableCell align="right">
                                    {isEditing && editingIdx === idx ? (
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'flex-end',
                                            }}
                                        >
                                            <ClearIcon
                                                style={{
                                                    cursor: 'pointer',
                                                    color: 'red',
                                                    marginRight: 7,
                                                }}
                                                onClick={() => handleClose()}
                                            />
                                            <CheckIcon
                                                style={{
                                                    cursor: 'pointer',
                                                    color: 'green',
                                                }}
                                                onClick={() => handleEdit(row.id)}
                                            />
                                        </div>
                                    ) : (
                                        <EditIcon
                                            style={{ cursor: 'pointer' }}
                                            onClick={() =>
                                                editButtonHandler(
                                                    {
                                                        designation: row.designation,
                                                    },
                                                    idx
                                                )
                                            }
                                        />
                                    )}
                                </StyledTableCell>

                                <StyledTableCell align="right">
                                    <DeleteForeverIcon
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
