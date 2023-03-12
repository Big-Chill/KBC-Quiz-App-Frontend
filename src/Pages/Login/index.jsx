import React from 'react';
import Card from '@mui/material/Card';
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

import {userLogin, userSignup} from './requests'


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
    <>
      <Card raised={true} sx={{ width: '30vw', height: '50vh', margin: 'auto', marginTop: '20vh' }}>
        <FormControl sx={{ width: '80%', margin: 'auto', marginTop: '10vh', marginLeft: '3vw' }}>
          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            sx={{ width: '100%' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl sx={{ width: '80%', margin: 'auto', marginTop: '2vh', marginLeft: '3vw' }}>
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
          />
        </FormControl>

          <FormControlLabel
            control={<Switch checked={checked} onChange={handleChange} color={typeOfAuth === 'login' ? 'success' : 'secondary'} />}
            sx={{ width: '80%', margin: 'auto', marginTop: '2vh', justifyContent: 'center', marginLeft: '3vw' }}
          />

        <FormControl sx={{ width: '80%', margin: 'auto', marginTop: '2vh', marginLeft: '3vw' }}>
          <Button variant="contained" sx={{ width: '100%', marginTop: '2vh' }} color={typeOfAuth === 'login' ? 'success' : 'secondary'} onClick={handleButtonClick}>
            {typeOfAuth === 'login' ? 'Login' : 'Sign Up'}
          </Button>
        </FormControl>
      </Card>
    </>
  )
};

export default Login;