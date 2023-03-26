import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useHistory } from 'react-router-dom';
import Card from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import { FormControlLabel } from '@mui/material';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Groups2Icon from '@mui/icons-material/Groups2';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { toaster } from 'evergreen-ui';
import { styled } from '@mui/material/styles';


import SpeedDialer from '../../Components/SpeedDial';
import { getAllCategory, getAllDifficulty} from './requests';



const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: 'linear-gradient(180deg, #ffffff 0%, #f2f2f2 100%)'
  },
  card: {
    width: '80%',
    maxWidth: '800px',
    margin: 'auto',
    marginTop: '10vh',
    marginBottom: '10vh',
    height: 'auto',
    padding: '20px',
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
  },
  formControl: {
    width: '100%',
    margin: 'auto',
    marginTop: '20px',
    marginBottom: '20px',
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
  textField: {
    width: '100%',
    margin: 'auto',
    marginTop: '20px',
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
};

const Home = () => {

  const [isAdmin, setIsAdmin] = React.useState(false);
  const history = useHistory();
  const [allCategories, setAllCategories] = React.useState([]);
  const [allDifficulties, setAllDifficulties] = React.useState([]);
  const [category, setCategory] = React.useState('');
  const [difficulty, setDifficulty] = React.useState('');
  const [additionalModifications, setAdditionalModifications] = React.useState(false);
  const [noOfQuestions, setNoOfQuestions] = React.useState('All');
  const [scoreForCorrectAnswer, setScoreForCorrectAnswer] = React.useState(1);
  const [scoreForIncorrectAnswer, setScoreForIncorrectAnswer] = React.useState(0);

  const actions = [
    { icon: <LogoutIcon />, name: 'Logout', onClick: () => { localStorage.removeItem('quizUser'); window.location.reload() } },
    // { icon: <h6>Log Out</h6>, name: 'Logout', onClick: () => { localStorage.removeItem('quizUser'); window.location.reload() } },
    isAdmin ? { icon: <AddIcon />, name: 'Add Question', onClick: () => { history.push('/new-question') } } : null,
    // isAdmin ? { icon: <h6>Add Question</h6>, name: 'Add Question', onClick: () => { history.push('/new-question') } } : null,
    isAdmin ? { icon: <AdminPanelSettingsIcon />, name: 'Admin Panel', onClick: () => { history.push('/admin-panel') } } : null,
    // isAdmin ? { icon: <h6>Admin Panel</h6>, name: 'Admin Panel', onClick: () => { history.push('/admin-panel') } } : null,
    // { icon: <h6>Profile</h6>, name: 'Profile', onClick: () => { history.push('/profile') } },
    { icon: <PersonIcon />, name: 'Profile', onClick: () => { history.push('/profile') } },
    // { icon: <h6>Leaderboard</h6>, name: 'Leaderboard', onClick: () => { history.push('/leaderboard') } },
    { icon: <AnalyticsIcon />, name: 'Leaderboard', onClick: () => { history.push('/stats') } },
    // isAdmin ? { icon: <h6>Bulk Upload</h6>, name: 'Bulk Upload', onClick: () => { history.push('/bulk-question') } } : null,
    isAdmin ? { icon: <Groups2Icon />, name: 'Bulk Upload', onClick: () => { history.push('/bulk-question') } } : null,
    // isAdmin ? { icon: <h6>Question List</h6>, name: 'Question List', onClick: () => { history.push('/question-list') } } : null,
    isAdmin ? { icon: <FormatListBulletedIcon />, name: 'Question List', onClick: () => { history.push('/questions') } } : null,
  ]

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  React.useEffect(() => {
    if (localStorage.getItem('quizUser')) {
      setIsAdmin(JSON.parse(localStorage.getItem('quizUser')).isAdmin);
    }

    getAllCategory().then((res) => {
      if (allCategories.length === 0) {

        res.data.categories.filter((category) => category.name !== 'Any Category').map((category) =>
          setAllCategories((allCategories) => [...allCategories, category.name])
        );

        setAllCategories((allCategories) => [...allCategories, 'Any Category']);
        setCategory('Any Category');
      }
    });

    getAllDifficulty().then((res) => {
      if (allDifficulties.length === 0) {
        res.data.difficulties.map((difficulty) => {
        setAllDifficulties((allDifficulties) => [...allDifficulties, difficulty.name]);
        });
        setDifficulty('Any Difficulty');
      }
    });
  }, []);

  const handleButtonClick = () => {
    if (additionalModifications) {
      history.push({
        pathname: '/game',
        state: { category: category, difficulty: difficulty, scoreForCorrectAnswer: scoreForCorrectAnswer, scoreForIncorrectAnswer: scoreForIncorrectAnswer, noOfQuestions: noOfQuestions === 'All' ? undefined : noOfQuestions }
      });
    }
    else {
      history.push({
        pathname: '/game',
        state: { category: category, difficulty: difficulty }
      });
    }
  };

  return (
    <>
      <Box sx={styles.container}>
        <Card raised={true} sx={styles.card}>
          <FormControl sx={styles.formControl}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              value={category}
              label="Category"
              onChange={handleCategoryChange}
            >
              {allCategories.map((category) => {
                return <MenuItem value={category} key={category}>{category}</MenuItem>
              })}
            </Select>
          </FormControl>

          <FormControl sx={styles.formControl}>
            <InputLabel id="difficulty-label">Difficulty</InputLabel>
            <Select
              labelId="difficulty-label"
              id="difficulty"
              value={difficulty}
              label="Difficulty"
              onChange={handleDifficultyChange}
            >
              {allDifficulties.map((difficulty) => {
                return <MenuItem value={difficulty} key={difficulty}>{difficulty}</MenuItem>
              })}
            </Select>
          </FormControl>

          <FormControl sx={styles.formControl}>
            <Tooltip title="Enable/Disable to get more filter options" placement="right">
              <FormControlLabel
                control={
                  <Switch
                    checked={additionalModifications}
                    onChange={() => setAdditionalModifications(!additionalModifications)}
                    name="additionalModifications"
                    color="primary"
                  />
                }
                sx={styles.switch}
                />
            </Tooltip>
          </FormControl>

          {
            additionalModifications &&
              <FormControl sx={styles.formControl}>
                <InputLabel id="noOfQuestions-label">No. of Questions</InputLabel>
                <Select
                  labelId="noOfQuestions-label"
                  id="noOfQuestions"
                  value={noOfQuestions}
                  label="No. of Questions"
                  onChange={(event) => setNoOfQuestions(event.target.value)}
                >
                  {
                    [5, 10, 15, 20, 'All'].map((noOfQuestions) => {
                      return <MenuItem value={noOfQuestions} key={noOfQuestions}>{noOfQuestions}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>
          }

          {
            additionalModifications &&
            <FormControl sx={styles.formControl}>
                <TextField
                  id="scoreForCorrectAnswer"
                  placeholder="Score for Correct Answer"
                  label="Score for Correct Answer"
                  type="number"
                  value={scoreForCorrectAnswer}
                  onChange={(event) => setScoreForCorrectAnswer(event.target.value)}
                  sx={styles.textField}
                />
              </FormControl>
          }

          {
            additionalModifications &&
            <FormControl sx={styles.formControl}>
                <TextField
                  id="scoreForIncorrectAnswer"
                  placeholder="Score for Incorrect Answer"
                  label="Score for Incorrect Answer"
                  type="number"
                  value={scoreForIncorrectAnswer}
                  onChange={(event) => setScoreForIncorrectAnswer(event.target.value)}
                  sx={styles.textField}
                />
            </FormControl>
              }
              <FormControl sx={styles.formControl}>
                  <Button variant="contained" sx={styles.button} onClick={handleButtonClick}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Start Quiz</Typography>
                  </Button>
              </FormControl>
            </Card>
            <SpeedDialer actions={actions} />
      </Box>
    </>
  )
};

export default Home;