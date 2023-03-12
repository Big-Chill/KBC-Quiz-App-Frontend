import React from 'react';
import Card from '@mui/material/Card';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';

import SpeedDialer from '../../Components/SpeedDial';

import Home from './Home';


const actions = [
    { icon: <LogoutIcon />, name: 'Logout', onClick: () => { localStorage.removeItem('quizUser'); window.location.reload() } },
    // { icon: <h6>Log Out</h6>, name: 'Logout', onClick: () => { localStorage.removeItem('quizUser'); window.location.reload() } },
    { icon: <HomeIcon />, name: 'Home', onClick: () => { window.location.href = '/' } },
    // { icon: <h6>Home</h6>, name: 'Home', onClick: () => { window.location.href = '/' } },
];

const Stat = () => {
  return (
    <Card raised={true} sx={{ width: '80vw', height: '90vh', margin: 'auto', marginTop: '5vh' }}>
        <Home />
      <SpeedDialer actions={actions} />
    </Card>
  )
};

export default Stat;