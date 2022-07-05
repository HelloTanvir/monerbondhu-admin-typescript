/* eslint-disable no-alert */
import { FormControl, TextField } from '@material-ui/core';
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
import Avatar from '../../assets/Avatar.jpg';
import axios from '../../utils/axios';
import EditBigContent from '../../utils/EditBigContent';
import Loader from '../../utils/Loader';
import ShowFullContent from '../../utils/ShowFullContent';
import AddForm from './AddForm';
import { TipsAndTricksData } from './TipsAndTricks';

interface Props {
    apiData: TipsAndTricksData[];
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
    content: string,
    date: string,
    isVideo: boolean,
    videoLink: string,
    image: string,
    viewCount: number | string,
    position: number
) => ({
    id,
    title,
    content,
    date,
    isVideo,
    videoLink,
    image,
    viewCount,
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
    button: {
        fontSize: 10,
        paddingLeft: 10,
    },
    content: {
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
});

const DataTable: React.FC<Props> = ({ apiData, forceUpdate }): React.ReactElement => {
    const classes = useStyles();

    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingIdx, setEditingIdx] = useState(-1);
    const [position, setPosition] = useState(0);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);

    const handleClose = () => {
        setIsEditing(false);
        setEditingIdx(-1);
    };

    const clearAll = () => {
        setTitle('');
        setContent('');
        setImage(null);
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
            const response = await axios.delete('/tipsamdtricks', {
                headers: { Authorization: token },
                data: {
                    id,
                },
            });

            if (response) {
                setIsLoading(false);
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
        if (!title || !content) {
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
            id: string;
            title: string;
            content: string;
            image?: string;
            position: number;
        } = {
            id,
            title,
            content,
            position,
        };

        if (imageUrl) {
            updateData.image = imageUrl;
        }

        try {
            const response = await axios.patch('/tipsamdtricks', updateData, {
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
            content: string;
            position: number;
        },
        idx: number
    ) => {
        setIsEditing(true);
        setEditingIdx(idx);

        setPosition(editedData.position);
        setTitle(editedData.title);
        setContent(editedData.content);
    };

    const rows = apiData.map((data) =>
        createData(
            // eslint-disable-next-line no-underscore-dangle
            data._id,
            data.title,
            data.content,
            data.date,
            data.isVideo,
            data.videoLink,
            data.image,
            data.viewCount,
            data.position
        )
    );
    console.log(position);

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
                            <StyledTableCell>Date</StyledTableCell>
                            <StyledTableCell>Time</StyledTableCell>
                            <StyledTableCell>View Count</StyledTableCell>
                            <StyledTableCell>Content</StyledTableCell>
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
                                                    setPosition(Number(e.target.value))
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
                                    ) : row.isVideo && row.videoLink ? (
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

                                <StyledTableCell>
                                    {new Date(row.date).toLocaleDateString('en-US')}
                                </StyledTableCell>

                                <StyledTableCell>
                                    {new Date(row.date).toLocaleTimeString('en-US')}
                                </StyledTableCell>

                                <StyledTableCell>{row.viewCount}</StyledTableCell>

                                <StyledTableCell>
                                    {/* eslint-disable-next-line no-nested-ternary */}
                                    {isEditing && editingIdx === idx ? (
                                        <EditBigContent
                                            contentTitle="Content"
                                            bigContent={content}
                                            setBigContent={setContent}
                                        />
                                    ) : row.content?.length > 12 ? (
                                        <ShowFullContent
                                            title="Content"
                                            content={parse(row.content || '')}
                                        />
                                    ) : (
                                        <div className={classes.content}>
                                            {parse(row.content || '')}
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
                                                        title: row.title,
                                                        position: row.position,
                                                        content: row.content,
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
