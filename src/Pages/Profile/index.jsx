import React from 'react';
import Card from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { toaster } from 'evergreen-ui';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import { useHistory } from 'react-router-dom';

import SpeedDialer from '../../Components/SpeedDial';
import { getProfile, isProfilePresent, addProfile, updateProfile} from './requests';

const Profile = () => {

  const history = useHistory();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phoneNo, setPhoneNo] = React.useState('');
  const [image, setImage] = React.useState(null);
  const [buttonText, setButtonText] = React.useState('Save');
  const [profileImage, setProfileImage] = React.useState('https://f7v4.c13.e2-2.dev/quiz-app/Profile Images/no profile photo.jpg');
  const [oldImgUrl, setOldImgUrl] = React.useState('https://f7v4.c13.e2-2.dev/quiz-app/Profile Images/no profile photo.jpg');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setProfileImage(URL.createObjectURL(e.target.files[0]));
  };



  const actions = [
    { icon: <LogoutIcon />, name: 'Logout', onClick: () => { localStorage.removeItem('quizUser'); window.location.reload() } },
    // { icon: <h6>Log Out</h6>, name: 'Logout', onClick: () => { localStorage.removeItem('quizUser'); window.location.reload() } },
    { icon: <HomeIcon />, name: 'Home', onClick: () => { window.location.href = '/' } },
    // { icon: <h6>Home</h6>, name: 'Home', onClick: () => { window.location.href = '/' } },
];


  React.useEffect(() => {
    const email = JSON.parse(localStorage.getItem('quizUser')).email;
    const userId = JSON.parse(localStorage.getItem('quizUser')).userId;

    isProfilePresent(email).then((res) => {
      const message = res.data['message'];
      if (message === 'Profile found') {
        getProfile(userId).then((res) => {
          const profile = res.data['profile'];
          setName(profile.name);
          setEmail(profile.email);
          setPhoneNo(profile.phoneNo);
          setProfileImage(profile.image);
          setOldImgUrl(profile.image);
          setButtonText('Update');
        });
      } else {
        const email = JSON.parse(localStorage.getItem('quizUser')).email;
        setEmail(email);
      }
    });
  }, []);




  const handleButtonClick = () => {

    if (buttonText === 'Save') {
      const profile = {
        name,
        email,
        phoneNo
      };

      const formData = new FormData();
      formData.append('profileImage', image);
      formData.append('profile', JSON.stringify(profile));


      addProfile(formData).then((res) => {
        toaster.notify(res.data['message']);
        history.push('/profile');
      })
        .catch((err) => {
          toaster.notify(err.response.data['message']);
        });
    } else {
      const userId = JSON.parse(localStorage.getItem('quizUser')).userId;
      const profile = {
        phoneNo,
        oldImgUrl: oldImgUrl
      };

      const formData = new FormData();
      formData.append('profileImage', image);
      formData.append('profile', JSON.stringify(profile));

      updateProfile(formData,userId).then((res) => {
        toaster.notify(res.data['message']);
        history.push('/profile');
      })
        .catch((err) => {
          toaster.notify(err.response.data['message']);
        });
    }
  };



  return (
    <Card raised={true} sx={{ width: '35vw', height: '75vh', margin: 'auto', marginTop: '15vh' }}>
      {
        <>
          <input
            accept="image/*"
            id="avatar-input"
            type="file"
            hidden
            onChange={handleImageChange}
          />

          <label htmlFor="avatar-input">
            <Avatar
            alt="Profile Image"
            src={profileImage}
            sx={{ width: 156, height: 156, margin: 'auto', marginTop: '5vh', cursor: 'pointer' }}
          />
          </label>
        </>
      }

      <FormControl sx={{ width: '70%', margin: 'auto', marginTop: '5vh', marginLeft: '5vw' }}>
        <TextField
          id="outlined-basic"
          label="Name"
          variant="outlined"
          value={name}
          disabled = { buttonText === 'Save' ? false : true }
          onChange= { buttonText === 'Save' ? (e) => setName(e.target.value) : (e) => () => {} }
          sx={{ width: '100%' }}
        />
      </FormControl>

      <FormControl sx={{ width: '70%', margin: 'auto', marginTop: '2vh', marginLeft: '5vw' }}>
        <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          value={email}
          disabled = { true }
          sx={{ width: '100%' }}
        />
      </FormControl>

      <FormControl sx={{ width: '70%', margin: 'auto', marginTop: '2vh', marginLeft: '5vw' }}>
        <TextField
          id="outlined-basic"
          label="Phone No."
          variant="outlined"
          value={phoneNo}
          onChange={(e) => setPhoneNo(e.target.value)}
          sx={{ width: '100%' }}
        />
      </FormControl>

      {
        !profileImage && (
          <FormControl sx={{ width: '70%', margin: 'auto', marginTop: '2vh', marginLeft: '5vw' }}>
            <Button variant="contained" component="label" sx={{ width: '100%' }}>
              Upload Profile Image
              <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            </Button>
          </FormControl>
        )
      }

      <Button variant="contained" sx={{ width: '70%', margin: 'auto', marginTop: '5vh', marginLeft: '5vw' }} onClick={handleButtonClick}>
        {buttonText}
      </Button>

      <SpeedDialer actions={actions} />
    </Card>
  )
};

export default Profile;