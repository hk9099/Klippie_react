import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import PasswordStrengthBar from 'react-password-strength-bar';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    container: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        background: '#fff', // Blue color
    },
    form: {
        width: '100%',
        maxWidth: '400px',
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '#fff',
    },
    input: {
        '&:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 1000px white inset',
        },
        '&:disabled': {
            backgroundColor: 'black',
            color: 'white',
        },
    },
    button: {
        width: '100%',
    },
    passwordStrength: {
        marginTop: '8px',
    },
});

const EmailForm = () => {
     const classes = useStyles();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // New state variable for loading

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setIsValidEmail(true);
        setEditMode(false);
        setPassword('');
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setError(false);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true); // Set loading to true when form is submitted

        if (!editMode) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isValid = emailRegex.test(email);
            setIsValidEmail(isValid);

            if (isValid) {
                setEditMode(true);
            }
        } else {
            if (password.trim() === '') {
                setError(true);
            } else {
                console.log('Email submitted:', email);
                console.log('Password submitted:', password);
                // Simulate an asynchronous action, e.g., API call
                await new Promise((resolve) => setTimeout(resolve, 2000));
            }
        }

        setIsLoading(false); // Set loading to false after the form submission is complete
    };

    const handleEditClick = () => {
        setEditMode(false);
        setPassword('');
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
        <div className={classes.container}>
            <Typography variant="h4" color="primary" gutterBottom style={{ color: 'black' }}>
                Login to ChatGPT
            </Typography>

            <form className={classes.form} onSubmit={handleFormSubmit}>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    // color="secondary"
                    value={email}
                    onChange={handleEmailChange}
                    error={!isValidEmail && !editMode}
                    helperText={!isValidEmail && !editMode ? 'Please enter a valid email address' : ''}
                    disabled={editMode}
                    InputProps={{
                        endAdornment: editMode && (
                            <Button onClick={handleEditClick} disabled={!editMode} color="primary">
                                Edit
                            </Button>
                        ),
                        classes: {
                            input: classes.input,
                        },
                    }}
                />

                {isValidEmail && editMode && (
                    <div className='mt-2'>
                        <TextField
                            label="Password"
                            variant="outlined"
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            error={error}
                            helperText={error ? 'Please enter a password' : ''}
                            onChange={handlePasswordChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleTogglePasswordVisibility}>
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                classes: {
                                    input: classes.input,

                                },
                            }}
                        />
                        <PasswordStrengthBar password={password} minLength={8} className={classes.passwordStrength} />
                    </div>
                )}
               <div className='mt-3'>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        width="100%"
                        disabled={isLoading} // Disable the button when loading
                    >
                        {isLoading ? 'Loading...' : editMode ? 'Submit' : 'Next'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EmailForm;
