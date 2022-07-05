/* eslint-disable no-alert */
import Paper from '@material-ui/core/Paper';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import React, { useState } from 'react';
import withTab from '../../container/tabLayout/TabLayout';
import axios from '../../utils/axios';
import Loader from '../../utils/Loader';
import AddForm from './AddForm';
import EditMusicCard from './EditMusicCard';
import MusicCard from './MusicCard';

interface Props {
    apiData: {
        [key: string]: {
            _id: string;
            name: string;
            category: string;
            subType: string;
            image: string;
            mp3: string;
            musicKey: string;
        }[];
    };
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
    image: string,
    category: string,
    subType: string,
    name: string,
    mp3: string,
    musicKey: string
) => ({ id, image, category, subType, name, mp3, musicKey });

const useStyles = makeStyles(() => ({
    table: {
        minWidth: 700,
    },
}));

const DataTable: React.FC<Props> = ({ apiData, forceUpdate }): React.ReactElement => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <>
            <Loader open={isLoading} />

            <AddForm forceUpdate={forceUpdate} />

            {withTab(
                Object.keys(apiData),
                Object.keys(apiData).map((type) => {
                    const MusicComponent: React.FC = (): React.ReactElement => {
                        const classes = useStyles();

                        const [isEditing, setIsEditing] = useState(false);
                        const [editingIdx, setEditingIdx] = useState(-1);

                        const [name, setName] = useState('');
                        const [category, setCategory] = useState('');
                        const [subType, setSubType] = useState('');
                        const [image, setImage] = useState<File | null>(null);
                        const [music, setMusic] = useState<File | null>(null);

                        const handleClose = () => {
                            setIsEditing(false);
                            setEditingIdx(-1);
                        };

                        const clearAll = () => {
                            setName('');
                            setCategory('');
                            setSubType('');
                            setImage(null);
                            setMusic(null);
                        };

                        const handleDelete = async (id: string) => {
                            // eslint-disable-next-line no-restricted-globals
                            if (!confirm('Are you sure you want to delete this element?')) {
                                return;
                            }

                            setIsLoading(true);

                            const token = `Bearer ${localStorage.getItem('token')}`;

                            try {
                                const response = await axios.delete('/music', {
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
                            if (!name || !category || !subType) {
                                // eslint-disable-next-line no-alert
                                alert('Empty field is not taken');
                                return;
                            }

                            setIsEditing(false);
                            setEditingIdx(-1);
                            setIsLoading(true);

                            const token = `Bearer ${localStorage.getItem('token')}`;

                            let imageUrl = '';
                            let musicUrl = '';

                            if (image !== null) {
                                const formData = new FormData();
                                formData.append('image', image);

                                const response = await axios.post('/upload', formData, {
                                    headers: { Authorization: token },
                                });

                                imageUrl = response.data.image;
                            }

                            if (music !== null) {
                                const formData = new FormData();
                                formData.append('music', music);

                                const response = await axios.post('/upload', formData, {
                                    headers: { Authorization: token },
                                });

                                musicUrl = response.data.music;
                            }

                            const updateData: {
                                name: string;
                                category: string;
                                subType: string;
                                image?: string;
                                music?: string;
                            } = {
                                name,
                                category,
                                subType,
                            };

                            if (imageUrl) {
                                updateData.image = imageUrl;
                            }

                            if (musicUrl) {
                                updateData.music = musicUrl;
                            }

                            try {
                                const response = await axios.patch(`/music/${id}`, updateData, {
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
                                category: string;
                                subtype: string;
                            },
                            idx: number
                        ) => {
                            setIsEditing(true);
                            setEditingIdx(idx);

                            setName(editedData.name);
                            setCategory(editedData.category);
                            setSubType(editedData.subtype);
                        };

                        const data: {
                            _id: string;
                            name: string;
                            category: string;
                            subType: string;
                            image: string;
                            mp3: string;
                            musicKey: string;
                        }[] = apiData[type];

                        const rows = data.map((d) =>
                            createData(
                                // eslint-disable-next-line no-underscore-dangle
                                d._id,
                                d.image,
                                d.category,
                                d.subType,
                                d.name,
                                d.mp3,
                                d.musicKey
                            )
                        );

                        return (
                            <TableContainer
                                component={Paper}
                                key={type}
                                style={{ marginBottom: 50 }}
                            >
                                <Table className={classes.table} aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell>Music</StyledTableCell>
                                            <StyledTableCell align="right">Edit</StyledTableCell>
                                            <StyledTableCell align="right">Delete</StyledTableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {rows.map((row, idx) => (
                                            <StyledTableRow key={row.id}>
                                                <StyledTableCell component="th" scope="row">
                                                    {isEditing && editingIdx === idx ? (
                                                        <EditMusicCard
                                                            id={row.id}
                                                            name={name}
                                                            category={category}
                                                            subType={subType}
                                                            setName={setName}
                                                            setCategory={setCategory}
                                                            setSubType={setSubType}
                                                            setImage={setImage}
                                                            setMusic={setMusic}
                                                            handleSubmit={handleEdit}
                                                            cancel={handleClose}
                                                        />
                                                    ) : (
                                                        <MusicCard
                                                            image={row.image}
                                                            subType={row.subType}
                                                            name={row.name}
                                                            mp3={row.mp3}
                                                        />
                                                    )}
                                                </StyledTableCell>

                                                <StyledTableCell align="right">
                                                    <EditIcon
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() =>
                                                            editButtonHandler(
                                                                {
                                                                    name: row.name,
                                                                    category: row.category,
                                                                    subtype: row.subType,
                                                                },
                                                                idx
                                                            )
                                                        }
                                                    />
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
                        );
                    };

                    return MusicComponent;
                }),
                '#4b87aa'
            )}
        </>
    );
};

export default DataTable;
