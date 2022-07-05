import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import axios from '../../utils/axios';
import Loader from '../../utils/Loader';
import RichTextEditor from '../../utils/RichTextEditor';

interface Props {
    forceUpdate: () => void;
}

const AddForm: React.FC<Props> = ({ forceUpdate }): React.ReactElement => {
    const [open, setOpen] = React.useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isSumbit, setIsSubmit] = useState(false);

    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const clearAll = () => {
        setQuestion('');
        setAnswer('');
        setIsSubmit(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        clearAll();
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        if (!question || !answer) return;

        setOpen(false);

        setIsLoading(true);

        const reqData = {
            title: question,
            body: answer,
        };

        const token = `Bearer ${localStorage.getItem('token')}`;

        try {
            const response = await axios.post('/faq', reqData, {
                headers: {
                    Authorization: token,
                },
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
            alert(err.response.data.message || 'Something went wrong');
        }
    };

    return (
        <>
            <Loader open={isLoading} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: 22 }}>
                <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                    create new faq
                </Button>

                <Dialog
                    fullWidth
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="form-dialog-title"
                    //   maxWidth='md'
                    maxWidth="xs"
                >
                    <DialogTitle id="form-dialog-title">Create New FAQ</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Please fill up the form...</DialogContentText>

                        <TextField
                            autoFocus
                            error={isSumbit && !question}
                            helperText={isSumbit && !question ? 'Please add a question' : ''}
                            margin="dense"
                            name="ques"
                            label="Question"
                            fullWidth
                            style={{ marginBottom: 20 }}
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />

                        <div>
                            <Typography color="textSecondary" style={{ marginBottom: 5 }}>
                                Answer
                            </Typography>
                            <RichTextEditor text={answer} setText={setAnswer} />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} color="primary">
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
};

export default AddForm;
