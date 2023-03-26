import React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import { toaster } from 'evergreen-ui';
import { useHistory } from 'react-router-dom'

import { userLogin, userSignup } from './requests';



const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: 'linear-gradient(180deg, #ffffff 0%, #f2f2f2 100%)'
  },

  card: {
  width: '90%',
  maxWidth: '600px',
  margin: 'auto',
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0px 0px 40px rgba(0, 0, 0, 0.15)',
  border: '2px solid #f2f2f2',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0px 10px 50px rgba(0, 0, 0, 0.2)',
  },
},

  header: {
    textAlign: 'center',
    marginBottom: '20px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    marginBottom: '20px',
  },

  button: {
  width: '100%',
  marginBottom: '20px',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 'bold',
  background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
  color: '#FFF',
  transition: '0.3s',
  '&:hover': {
    background: 'linear-gradient(45deg, #FE4A4A 30%, #FF7B3D 90%)',
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
    color: '#FFF',
  },
},

  switch: {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '20px',
  '& .MuiSwitch-thumb': {
    backgroundColor: '#FF6B6B',
    '&.Mui-checked': {
      backgroundColor: '#4CAF50',
    },
  },
  '& .MuiSwitch-track': {
    backgroundColor: '#e0e0e0',
  },
  '& .MuiTypography-root': {
    color: '#A5A5A5',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  '& .Mui-checked .MuiTypography-root': {
    color: '#4CAF50',
  },
},
};


const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [typeOfAuth, setTypeOfAuth] = React.useState('login');
  const [checked, setChecked] = React.useState(typeOfAuth === 'login' ? false : true);
  const history = useHistory();

  const handleChange = (event) => {
    setChecked(event.target.checked);
    setTypeOfAuth(event.target.checked ? 'signup' : 'login');
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const generateToaster = (type, message) => {
    switch (type) {
      case 'success':
        toaster.success(message, { duration: 0.7, zIndex: 1000, hasCloseButton: false });
        break;
      case 'danger':
        toaster.danger(message, { duration: 0.7, zIndex: 1000, hasCloseButton: false });
        break;
      default:
        break;
    }
  };

  const handleButtonClick = async() => {
    let response;
    switch (typeOfAuth) {
      case 'login':
        try {
          response = await userLogin({email, password});
          localStorage.setItem('quizUser', JSON.stringify(response.data));
          history.push('/');
          generateToaster('success', 'Login Successful');
        } catch (error) {
          generateToaster('danger', error.response.data.message);
        }
        break;
      case 'signup':
        try {
          response = await userSignup({email, password});
          setTypeOfAuth('login');
          response = await userLogin({ email, password });
          localStorage.setItem('quizUser', JSON.stringify(response.data));
          history.push('/');
          generateToaster('success', 'Signup Successful');
        } catch (error) {
          generateToaster('danger', error.response.data.message);
        }
        break;
      default:
        break;
    };
  };

  React.useEffect(() => {
    if (localStorage.getItem('quizUser')) {
      window.location.href = '/'
    }
  }, []);



  return (
    <Box sx={styles.container}>
    <Card raised={true} sx={styles.card}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={styles.header}>
          {typeOfAuth === 'login' ? 'Login' : 'Sign Up'}
        </Typography>
        <FormControl sx={styles.input}>
          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            sx={{ width: '100%', maxWidth: '100%' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl sx={styles.input}>
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ width: '100%', maxWidth: '100%' }}
          />
        </FormControl>

        <FormControlLabel
          control={
            <Switch
              checked={checked}
              onChange={handleChange}
              color={typeOfAuth === 'login' ? 'success' : 'secondary'}
            />
          }
          label={typeOfAuth === 'login' ? 'Remember Me' : 'I agree to the terms'}
          sx={styles.switch}
        />

        <FormControl sx={styles.input}>
          <Button
            variant="contained"
            sx={styles.button}
            color={typeOfAuth === 'login' ? 'success' : 'secondary'}
            onClick={handleButtonClick}
          >
            {typeOfAuth === 'login' ? 'Login' : 'Sign Up'}
          </Button>
        </FormControl>
      </Box>
    </Card>
  </Box>
  )
};

export default Login;