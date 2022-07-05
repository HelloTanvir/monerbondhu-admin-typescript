import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Close, Edit, Send } from '@material-ui/icons';
import parse from 'html-react-parser';
import React, { useEffect, useState } from 'react';
import AppLayout from '../../container/appLayout/AppLayout';
import axios from '../../utils/axios';
import Loader from '../../utils/Loader';
import RichTextEditor from '../../utils/RichTextEditor';

const PrivacyAndPolicy = () => {
    const [apiData, setApiData] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [update, setUpdate] = useState(0);

    const forceUpdate = () => setUpdate((i) => i + 1);

    useEffect(() => {
        const apiResponse = async () => {
            const token = `Bearer ${localStorage.getItem('token')}`;

            setIsLoading(true);

            try {
                const response = await axios.get('/privacy', {
                    headers: { Authorization: token },
                });

                if (response) setIsLoading(false);

                setApiData(response.data.data.content);
            } catch (err) {
                setIsLoading(false);
                // eslint-disable-next-line no-alert
                // @ts-ignore
                alert(err?.response?.data?.message ?? 'Something went wrong');
            }
        };
        apiResponse();
    }, [update]);

    const handleEdit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        if (!apiData) {
            // eslint-disable-next-line no-alert
            alert('Please fillup the form');
            return;
        }

        setIsLoading(true);

        const token = `Bearer ${localStorage.getItem('token')}`;

        try {
            const response = await axios.put(
                '/privacy',
                { content: apiData },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            if (response) {
                setIsLoading(false);

                setIsEditing(false);

                forceUpdate();
            }
        } catch (err) {
            setIsLoading(false);

            setIsEditing(false);

            // eslint-disable-next-line no-alert
            // @ts-ignore
            alert(err?.response?.data?.message ?? 'Something went wrong');
        }
    };

    const editButtonHandler = (content: string) => {
        setIsEditing(true);
        setApiData(content);
    };

    return (
        <AppLayout dawerOpen>
            <Loader open={isLoading} />

            <div
                style={{
                    height: 'calc(100vh - 112px)',
                }}
            >
                <div
                    style={{
                        padding: 10,
                        height: '100%',
                        borderRadius: 12,
                        backgroundColor: '#c4d9eb',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <div style={{ flex: 1, overflow: 'auto' }}>
                        {isEditing ? (
                            <RichTextEditor text={apiData} setText={setApiData} />
                        ) : (
                            <Typography gutterBottom variant="h6" component="h2">
                                {parse(apiData || '')}
                            </Typography>
                        )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {isEditing ? (
                            <>
                                <Button
                                    color="secondary"
                                    endIcon={<Close />}
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </Button>
                                <Button color="primary" endIcon={<Send />} onClick={handleEdit}>
                                    Submit
                                </Button>
                            </>
                        ) : (
                            <Button
                                size="small"
                                color="primary"
                                startIcon={<Edit />}
                                onClick={() => editButtonHandler(apiData)}
                            >
                                Edit
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default PrivacyAndPolicy;
