import { useState, React } from 'react';
import {
  TextField, Stack, Box, Typography,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import logo from '../images/chatkitty.png';
import whiteLogo from '../images/chatkitty-white.png';
import chatting from '../images/chatting.jpg';

function Auth(props) {
  const { cb, loading } = props;

  const [moniker, setMoniker] = useState('');
  const [password, setPassword] = useState('');
  const [usernameInvalid, setUsernameInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [usernameHelperText, setUsernameHelperText] = useState('');
  const [passwordHelperText, setPasswordHelperText] = useState('');

  const validateUsername = (inputMoniker) => {
    const invalid = !/^[a-zA-Z0-9]{6,}$/.test(inputMoniker);
    setUsernameInvalid(invalid);
    if (invalid) {
      setUsernameHelperText('Username is required and can only contain alphanumeric characters with a min length of 6');
    } else {
      setUsernameHelperText('');
    }
    return invalid;
  };

  const validatePassword = (inputPassword) => {
    const invalid = !/^.{6,}$/.test(inputPassword);
    setPasswordInvalid(invalid);
    if (invalid) {
      setPasswordHelperText('Password is required and must be at least 6-character long');
    } else {
      setPasswordHelperText('');
    }
    return invalid;
  };

  const handleSubmitForm = () => {
    const pInvalid = validatePassword(password);
    const uInvalid = validateUsername(moniker);
    if (pInvalid || uInvalid) {
      return;
    }
    cb({ moniker, password });
  };

  return (
    <Stack direction="row" alignItems="stretch" height="100%">
      <Stack
        justifyContent="center"
        sx={{
          flexBasis: {
            xs: '100%',
            sm: '100%',
            md: '80%',
            lg: '50%',
          },
          p: {
            xs: 4,
            sm: 8,
            md: 8,
          },
        }}
        alignItems="center"
      >
        <Stack width="80%">
          <Stack direction="row" spacing={2} alignItems="center" marginBottom={2}>
            <Box
              component="img"
              alt="Chat Kitty Icon"
              src={logo}
              sx={{
                maxHeight: 35,
                maxWidth: 35,
              }}
            />
            <Typography variant="h2">Chatkitty</Typography>
          </Stack>
          <Stack marginBottom={2}>
            <Typography variant="h1">Create an Account</Typography>
            <Typography variant="subtitle1">Join the Chatkitty community</Typography>
          </Stack>
          <Stack spacing={2}>
            <TextField
              value={moniker}
              onChange={(e) => (setMoniker(e.target.value) || usernameInvalid)
                && validateUsername(e.target.value)}
              onBlur={(e) => validateUsername(e.target.value)}
              error={usernameInvalid}
              id="username"
              label="Username"
              variant="standard"
              helperText={usernameHelperText}
            />
            <TextField
              value={password}
              onChange={(e) => (setPassword(e.target.value) || passwordInvalid)
                && validatePassword(e.target.value)}
              onBlur={(e) => validatePassword(e.target.value)}
              error={passwordInvalid}
              id="password"
              label="Password"
              type="password"
              variant="standard"
              helperText={passwordHelperText}
            />
            <LoadingButton
              onClick={handleSubmitForm}
              id="login"
              label="Login"
              variant="contained"
              loading={loading}
            >
              <Typography variant="button">Sign In or Sign Up</Typography>
            </LoadingButton>
          </Stack>
        </Stack>
      </Stack>
      <Box
        sx={{
          flexGrow: 1,
          p: 2,
        }}
        display={{
          sm: 'none',
          xs: 'none',
          md: 'block',
        }}
      >
        <Box sx={{
          height: '100%',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${chatting})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          borderRadius: 4,
          p: 4,
        }}
        >
          <Stack justifyContent="flex-end" height="100%">
            <Box
              component="img"
              alt="Chatkitty logo white"
              src={whiteLogo}
              sx={{
                maxHeight: 35,
                maxWidth: 35,
              }}
              marginBottom="auto"
            />
            <Typography
              variant="h3"
              sx={{
                color: 'white',
                fontSize: {
                  md: '1.1em',
                  xl: '1.5em',
                },
                fontWeight: 'bold',
                lineHeight: '1.5',
                mb: 2,
              }}
            >
              &quot;
              <br />
              Chatkitty connects you with people all around the world.
              You will not believe how much others have in common with you.
            </Typography>
            <Typography variant="subtitle1" color="white" fontWeight="bold">
              Richard
            </Typography>
            <Typography variant="subtitle2" color="white" fontWeight="bold">
              Founder, Chatkitty
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
}

export default Auth;
