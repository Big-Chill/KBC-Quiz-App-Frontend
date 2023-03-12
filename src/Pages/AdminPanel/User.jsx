import React from 'react';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Person2Icon from '@mui/icons-material/Person2';
import { toaster } from 'evergreen-ui';
import SaveIcon from '@mui/icons-material/Save';
import Fab from '@mui/material/Fab';
import PasswordIcon from '@mui/icons-material/Password';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import FormGroup from '@mui/material/FormGroup';
import Modal from '@mui/material/Modal';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { useHistory } from 'react-router-dom';


import { getAllUser, addAdmin, deleteAdmin, getUserId, deleteUser, changePassword } from './requests';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const User = () => {

  const history = useHistory();
  const [users, setUsers] = React.useState([]);
  const [checked, setChecked] = React.useState(true);
  const [initialCheckStatus, setInitialCheckStatus] = React.useState({});
  const [finalCheckStatus, setFinalCheckStatus] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event, email) => {
    setChecked(event.target.checked);

    let oldData = finalCheckStatus;
    oldData[email] = event.target.checked;
    setFinalCheckStatus(oldData);
  };

  const handleSaveButtonClick = () => {
    for (let email in finalCheckStatus) {
      if (initialCheckStatus[email] !== finalCheckStatus[email]) {
        if (finalCheckStatus[email]) {
          addAdmin({ "email": email }).then((res) => {
            toaster.success('Admin added successfully');
          });
        } else {
          deleteAdmin({ data: { "email": email } }).then((res) => {
            toaster.success('Admin deleted successfully');
          });
        }
      }
    }

    window.location.reload();
  };

  const handleMenuClick = (email) => {
    getUserId(email).then((res) => {
      const userId = res.data.userId;
      history.push({
        pathname: '/stats',
        state: { userId: userId, email: email }
      });
    });
  };




  React.useEffect(() => {
    getAllUser().then((res) => {
      setUsers(res.data.users);

      res.data.users.forEach((user) => {
        initialCheckStatus[user.email] = user.isAdmin;
        finalCheckStatus[user.email] = user.isAdmin;
      });
    });
  }, []);


  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
        <List component='nav'>
          {users.map((user, index) => {
            return (
              <ListItem
                key={index}
                alignItems='center'
                button={true}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <Person2Icon />
                  </ListItemIcon>
                  <ListItemText primary={user.email} onClick={() => handleMenuClick(user.email)}/>
                  <FormGroup>
                    <FormControlLabel
                      control={<Switch defaultChecked={user.isAdmin} onChange={(event) => handleChange(event, user.email)} />}
                      label='Admin'
                    />
                  </FormGroup>
                </ListItemButton>
                <PasswordIcon sx={{ mr: '3%'}} onClick={() => {handleOpen(); setEmail(user.email)}}/>
                {/* <Button variant='contained' onClick={() => {handleOpen(); setEmail(user.email)}}>Change Password</Button> */}
                <PersonRemoveIcon onClick={() => deleteUser(user.email).then((res) => { window.location.reload(); })} />
                {/* <Button variant='contained' onClick={() => deleteUser(user.email).then((res) => { window.location.reload(); })}>Delete</Button> */}
              </ListItem>
            );
          })}
        </List>
        <Fab color='primary' aria-label='save' sx={{ ml: '90%', mt: '42%', position: 'sticky' }}>
        <SaveIcon />
      </Fab>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div >
            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              sx={{ width: '100%' }}
              disabled
            />

            <TextField
              id="outlined-basic"
              label="Password"
              variant="outlined"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              sx={{ width: '100%', marginTop: '2vh' }}
            />

            <TextField
              id="outlined-basic"
              label="Confirm Password"
              variant="outlined"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              sx={{ width: '100%', marginTop: '2vh' }}
            />
            <Button variant="contained" sx={{ width: '100%', marginTop: '2vh' }} onClick={() => {
              changePassword(email, password, confirmPassword).
                then((res) => { toaster.success('Password changed successfully') }).
                catch((err) => { toaster.danger('Password change failed') });
              setPassword('');
              setConfirmPassword('');
              handleClose();
            }}>
              Change Password
            </Button>
          </div>
        </Box>
      </Modal>
      </div>
  )
};

export default User;