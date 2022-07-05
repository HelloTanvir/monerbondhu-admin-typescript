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
import { DeleteForever } from '@material-ui/icons';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import parse from 'html-react-parser';
import React, { useState } from 'react';
import axios from '../../utils/axios';
import EditBigContent from '../../utils/EditBigContent';
import Loader from '../../utils/Loader';
import ShowFullContent from '../../utils/ShowFullContent';
import AddForm from './AddForm';
import { FaqData } from './FAQ';

interface Props {
    apiData: FaqData[];
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

const createData = (id: string, question: string, answer: string) => ({
    id,
    question,
    answer,
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
    content: {
        width: '100%',
        maxWidth: 700,
        maxHeight: 60,
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
});

const DataTable: React.FC<Props> = ({ apiData, forceUpdate }): React.ReactElement => {
    const classes = useStyles();

    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingIdx, setEditingIdx] = useState(-1);
    //   const [isSumbit, setIsSubmit] = useState(false);

    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const handleClose = () => {
        setIsEditing(false);
        setEditingIdx(-1);
    };

    const clearAll = () => {
        setQuestion('');
        setAnswer('');
        // setIsSubmit(false);
    };

    const handleDelete = async (id: string) => {
        // eslint-disable-next-line no-restricted-globals
        if (!confirm('Are you sure you want to delete this element?')) {
            return;
        }

        setIsLoading(true);

        const token = `Bearer ${localStorage.getItem('token')}`;

        try {
            const response = await axios.delete('/faq', {
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
            alert(err.response.data.message || 'Something went wrong');
        }
    };

    const handleEdit = async (id: string) => {
        if (!question || !answer) return;

        setIsEditing(false);
        setEditingIdx(-1);
        setIsLoading(true);

        const updateData = {
            title: question,
            body: answer,
        };

        const token = `Bearer ${localStorage.getItem('token')}`;

        try {
            const response = await axios.put(`/faq/${id}`, updateData, {
                headers: { Authorization: token },
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

    const editButtonHandler = (
        editedData: {
            question: string;
            answer: string;
        },
        idx: number
    ) => {
        setIsEditing(true);
        setEditingIdx(idx);

        setQuestion(editedData.question);
        setAnswer(editedData.answer);
    };

    const rows = apiData.map((data) =>
        // eslint-disable-next-line no-underscore-dangle
        createData(data._id, data.title, data.body)
    );

    return (
        <>
            <Loader open={isLoading} />

            <AddForm forceUpdate={forceUpdate} />

            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Question</StyledTableCell>
                            <StyledTableCell>Answer</StyledTableCell>
                            <StyledTableCell align="right">Edit</StyledTableCell>
                            <StyledTableCell align="right">Delete</StyledTableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows.map((row, idx) => (
                            <StyledTableRow key={row.id}>
                                <StyledTableCell>
                                    {isEditing && editingIdx === idx ? (
                                        <TextField
                                            value={question}
                                            onChange={(e) => setQuestion(e.target.value)}
                                            className={classes.textField}
                                        />
                                    ) : (
                                        row.question
                                    )}
                                </StyledTableCell>

                                <StyledTableCell>
                                    {/* eslint-disable-next-line no-nested-ternary */}
                                    {isEditing && editingIdx === idx ? (
                                        <EditBigContent
                                            contentTitle="Answer"
                                            bigContent={answer}
                                            setBigContent={setAnswer}
                                        />
                                    ) : row.answer?.length > 12 ? (
                                        <>
                                            <div className={classes.content}>
                                                {parse(row.answer || '')}
                                            </div>
                                            <ShowFullContent
                                                title="Content"
                                                content={parse(row.answer || '')}
                                            />
                                        </>
                                    ) : (
                                        <div className={classes.content}>
                                            {parse(row.answer || '')}
                                        </div>
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
                                                        question: row.question,
                                                        answer: row.answer,
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
