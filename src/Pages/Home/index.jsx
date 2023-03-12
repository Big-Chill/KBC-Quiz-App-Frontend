import React from 'react';
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

import SpeedDialer from '../../Components/SpeedDial';
import { getAllCategory, getAllDifficulty} from './requests';


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
      <Card raised={true} sx={{ width: '30vw', margin: 'auto', marginTop: '20vh', height: 'auto' }}>
        <FormControl sx={{ width: '80%', margin: 'auto', marginTop: '7vh', marginLeft: '3vw' }}>
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

        <FormControl sx={{ width: '80%', margin: 'auto', marginTop: '7vh', marginLeft: '3vw' }}>
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

        <FormControl sx={{ width: '80%', margin: 'auto', marginTop: '3vh', marginLeft: '3vw' }}>
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
              sx={{ ml: '42%' }}
              />
          </Tooltip>
        </FormControl>

        {
          additionalModifications &&
            <FormControl sx={{ width: '80%', margin: 'auto', marginTop: '3vh', marginLeft: '3vw' }}>
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
          <FormControl sx={{ width: '80%', margin: 'auto', marginTop: '3vh', marginLeft: '3vw' }}>
              <TextField
                id="scoreForCorrectAnswer"
                placeholder="Score for Correct Answer"
                label="Score for Correct Answer"
                type="number"
                value={scoreForCorrectAnswer}
                onChange={(event) => setScoreForCorrectAnswer(event.target.value)}
              />
            </FormControl>
        }

        {
          additionalModifications &&
          <FormControl sx={{ width: '80%', margin: 'auto', marginTop: '3vh', marginLeft: '3vw' }}>
              <TextField
                id="scoreForIncorrectAnswer"
                placeholder="Score for Incorrect Answer"
                label="Score for Incorrect Answer"
                type="number"
                value={scoreForIncorrectAnswer}
                onChange={(event) => setScoreForIncorrectAnswer(event.target.value)}
              />
          </FormControl>
        }


        <FormControl sx={{ width: '80%', margin: 'auto', marginTop: '2vh', marginLeft: '2vw', padding: '2vh' }}>
          <Button variant="contained" sx={{ width: '100%' }} onClick={handleButtonClick}>Start</Button>
        </FormControl>
      </Card>
      <SpeedDialer actions={actions} />
    </>
  )
};

export default Home;