import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import NotificationsIcon from '@material-ui/icons/Notifications';
import React, { useState } from 'react';
import AppLayout from '../../container/appLayout/AppLayout';
import axios from '../../utils/axios';
import Loader from '../../utils/Loader';

const Notification = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [openSelect, setOpenSelect] = React.useState(false);

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [notificationType, setNotificationType] = useState('');

    const clearAll = () => {
        setTitle('');
        setBody('');
        setNotificationType('');
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        if (!title || !body || !notificationType) {
            // eslint-disable-next-line no-alert
            alert('Please fillup the form');
            return;
        }

        setIsLoading(true);

        const token = `Bearer ${localStorage.getItem('token')}`;

        try {
            const response = await axios.post(
                '/fcm',
                { title, body },
                {
                    headers: {
                        Authorization: token,
                    },
                    params: {
                        notificationType,
                    },
                }
            );
            if (response) {
                setIsLoading(false);

                clearAll();

                // eslint-disable-next-line no-alert
                alert(response.data.message || 'Notification sent successfully');
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
        <AppLayout dawerOpen>
            <Loader open={isLoading} />

            <div
                style={{
                    height: 'calc(100vh - 112px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        width: 600,
                        height: 400,
                        backgroundColor: '#c4d9eb',
                        borderRadius: 18,
                        padding: '12px 24px',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <span
                        style={{
                            fontSize: 24,
                            fontWeight: 'bolder',
                            letterSpacing: 1,
                            color: '#101010',
                        }}
                    >
                        Send Notification
                    </span>

                    <div
                        style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        <TextField
                            autoFocus
                            margin="dense"
                            id="title"
                            label="Title"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <TextField
                            margin="dense"
                            id="body"
                            label="Body"
                            multiline
                            fullWidth
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        />

                        <FormControl fullWidth>
                            <InputLabel id="demo-controlled-open-select-label">
                                Notification Type
                            </InputLabel>
                            <Select
                                labelId="demo-controlled-open-select-label"
                                id="demo-controlled-open-select"
                                open={openSelect}
                                onClose={() => setOpenSelect(false)}
                                onOpen={() => setOpenSelect(true)}
                                value={notificationType}
                                onChange={(e) => {
                                    if (typeof e.target.value === 'string') {
                                        setNotificationType(e.target.value);
                                    }
                                }}
                            >
                                {['all', 'free', 'paid'].map((i) => (
                                    <MenuItem key={i} value={i}>
                                        {i}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            onClick={handleSubmit}
                            color="primary"
                            endIcon={<NotificationsIcon />}
                        >
                            Send
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Notification;
