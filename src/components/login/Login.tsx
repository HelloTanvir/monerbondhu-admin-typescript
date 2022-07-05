import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from '../../utils/axios';
import Loader from '../../utils/Loader';
import Classes from './Login.module.css';

const Copyright = () => (
    <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://facebook.com/tanvir.stmz">
            Moner Bondhu
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
    </Typography>
);

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const Login: React.FC = (): React.ReactElement => {
    const history = useHistory();

    const [errorMsg, setErrorMsg] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [isSumbit, setIsSubmit] = useState(false);

    const classes = useStyles();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmit(true);

        if (!username || !password) return;

        setIsLoading(true);

        try {
            const response = await axios.post('/admin/login', {
                username,
                password,
            });

            if (response) {
                setErrorMsg('');
                setIsSubmit(false);
                setIsLoading(false);
            }

            localStorage.setItem('token', response.data.token);

            history.push('/dashboard');
        } catch (err) {
            // @ts-ignore
            setErrorMsg(err?.response?.data?.message ?? 'Something went wrong');
            setIsSubmit(false);
            setIsLoading(false);
            // @ts-ignore
            // alert(err?.response?.data?.message ?? 'Something went wrong');
        }
    };

    return (
        <>
            <Loader open={isLoading} />
            <Container component="main" maxWidth="xs" className={Classes.loginBox}>
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Log in
                    </Typography>
                    <form className={classes.form} noValidate onSubmit={submitHandler}>
                        <TextField
                            variant="outlined"
                            error={isSumbit && !username}
                            helperText={isSumbit && !username ? 'Empty username' : ''}
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="User Name"
                            name="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        {errorMsg ? <div className={Classes.error_msg}>{errorMsg}</div> : ''}
                        <TextField
                            variant="outlined"
                            error={isSumbit && !password}
                            helperText={isSumbit && !password ? 'Empty password' : ''}
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errorMsg ? <div className={Classes.error_msg}>{errorMsg}</div> : ''}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Log In
                        </Button>
                    </form>
                </div>
                <Box mt={8}>
                    <Copyright />
                </Box>
            </Container>
        </>
    );
};

export default Login;
