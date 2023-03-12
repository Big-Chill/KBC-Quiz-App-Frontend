import React from 'react';
import Card from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import LibraryAddSharpIcon from '@mui/icons-material/LibraryAddSharp';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import HomeIcon from '@mui/icons-material/Home';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { toaster } from 'evergreen-ui';

import { getAllCategory, getAllDifficulty, addCategory, addDifficulty, addQuestion } from './requests';
import SpeedDialer from '../../Components/SpeedDial';



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

const NewQuestion = () => {

  const [question, setQuestion] = React.useState('');
  const [option1, setOption1] = React.useState('');
  const [option2, setOption2] = React.useState('');
  const [option3, setOption3] = React.useState('');
  const [option4, setOption4] = React.useState('');
  const [answer, setAnswer] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [difficulty, setDifficulty] = React.useState('');
  const [newCategory, setNewCategory] = React.useState('');
  const [newDifficulty, setNewDifficulty] = React.useState('');

  const [allCategories, setAllCategories] = React.useState([]);
  const [allDifficulties, setAllDifficulties] = React.useState([]);
  const [currentModalState, setCurrentModalState] = React.useState('category');
  const [open, setOpen] = React.useState(false);
  const handleCategoryOpen = () => { setCurrentModalState('category'); setOpen(true); };
  const handleDifficultyOpen = () => { setCurrentModalState('difficulty'); setOpen(true); };
  const handleClose = () => setOpen(false);



  const actions = [
    { icon: <LogoutIcon />, name: 'Logout', onClick: () => { localStorage.removeItem('quizUser'); window.location.reload() } },
    // { icon: <h6>Log Out</h6>, name: 'Logout', onClick: () => { localStorage.removeItem('quizUser'); window.location.reload() } },
    { icon: <HomeIcon />, name: 'Home', onClick: () => { window.location.href = '/' } },
    // { icon: <h6>Home</h6>, name: 'Home', onClick: () => { window.location.href = '/' } },
    { icon: <LibraryAddSharpIcon />, name: 'Add Category', onClick: () => { handleCategoryOpen() } },
    // { icon: <h6>Add Category</h6>, name: 'Add Category', onClick: () => { handleCategoryOpen() } },
    { icon: <ControlPointIcon />, name: 'Add Difficulty', onClick: () => { handleDifficultyOpen() } },
    // { icon: <h6>Add Difficulty</h6>, name: 'Add Difficulty', onClick: () => { handleDifficultyOpen() } },
];

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  React.useEffect(() => {
    getAllCategory().then((res) => {
      if (allCategories.length === 0) {
        res.data.categories.filter((category) => {
          return category.name !== 'Any Category';
        }).map((category) => {
          setAllCategories((allCategories) => [...allCategories, category.name]);
        });
      }
    });
    getAllDifficulty().then((res) => {
      if (allDifficulties.length === 0) {
        res.data.difficulties.filter((difficulty) => {
          return difficulty.name !== 'Any Difficulty';
        }).map((difficulty) => {
          setAllDifficulties((allDifficulties) => [...allDifficulties, difficulty.name]);
        });
      }
    });
  }, []);

  const handleAddCategory = () => {
    addCategory({ 'name': newCategory }).then((res) => {
      setAllCategories((allCategories) => [...allCategories, newCategory]);
      handleClose();
    });
  };

  const handleAddDifficulty = () => {
    addDifficulty({ 'name': newDifficulty }).then((res) => {
      setAllDifficulties((allDifficulties) => [...allDifficulties, newDifficulty]);
      handleClose();
    });
  };

  const handleAddQuestion = () => {

    if (question === '' || option1 === '' || option2 === '' || option3 === '' || option4 === '' || answer === '' || category === '' || difficulty === '') {
      toaster.danger('Please fill all the fields');
      return;
    }


    const temp_data = {
      'question': question,
      'options': [option1, option2, option3, option4],
      'answer': answer,
      'category': category,
      'difficulty': difficulty
    }

    addQuestion(temp_data).then((res) => {
      toaster.success('Question Added Successfully');
      setQuestion('');
      setOption1('');
      setOption2('');
      setOption3('');
      setOption4('');
      setAnswer('');
      setCategory('');
      setDifficulty('');
    });
  };


  return (
    <Card raised={true} sx={{ width: '40vw', height: '75vh', margin: 'auto', marginTop: '15vh' }}>
      <FormControl sx={{ width: '80%', margin: 'auto', marginTop: '7vh', marginLeft: '4vw' }}>
        <TextField
          id="outlined-basic"
          label="Question"
          variant="outlined"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          sx={{ width: '100%' }}
        />
      </FormControl>

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '2vh', marginLeft: '4vw', marginRight: '4vw' }}>
        <TextField
          id="outlined-basic"
          label="Option 1"
          variant="outlined"
          value={option1}
          onChange={(e) => setOption1(e.target.value)}
          sx={{ width: '45%' }}
        />

        <TextField
          id="outlined-basic"
          label="Option 2"
          variant="outlined"
          value={option2}
          onChange={(e) => setOption2(e.target.value)}
          sx={{ width: '45%' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '2vh', marginLeft: '4vw', marginRight: '4vw' }}>
        <TextField
          id="outlined-basic"
          label="Option 3"
          variant="outlined"
          value={option3}
          onChange={(e) => setOption3(e.target.value)}
          sx={{ width: '45%' }}
        />

        <TextField
          id="outlined-basic"
          label="Option 4"
          variant="outlined"
          value={option4}
          onChange={(e) => setOption4(e.target.value)}
          sx={{ width: '45%' }}
        />
      </div>

      <FormControl sx={{ width: '80%', margin: 'auto', marginTop: '2vh', marginLeft: '4vw' }}>
        <TextField
          id="outlined-basic"
          label="Answer"
          variant="outlined"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          sx={{ width: '100%' }}
        />
      </FormControl>

      <FormControl sx={{ width: '80%', margin: 'auto', marginTop: '2vh', marginLeft: '4vw' }}>
        <InputLabel id="demo-simple-select-label">Category</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={category}
          label="Category"
          onChange={handleCategoryChange}
        >
          {allCategories.map((category) => (
            <MenuItem value={category} key={category}>{category}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ width: '80%', margin: 'auto', marginTop: '2vh', marginLeft: '4vw' }}>
        <InputLabel id="demo-simple-select-label">Difficulty</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={difficulty}
          label="Difficulty"
          onChange={handleDifficultyChange}
        >
          {allDifficulties.map((difficulty) => (
            <MenuItem value={difficulty} key={difficulty}>{difficulty}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ width: '80%', margin: 'auto', marginTop: '3vh', marginLeft: '4vw' }}>
        <Button variant="contained" sx={{ width: '100%' }} onClick={handleAddQuestion}>Add Question</Button>
      </FormControl>

      <SpeedDialer actions={actions} />

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
              label={currentModalState === 'category' ? 'Category' : 'Difficulty'}
              variant="outlined"
              value={currentModalState === 'category' ? newCategory : newDifficulty}
              onChange={(e) => currentModalState === 'category' ? setNewCategory(e.target.value) : setNewDifficulty(e.target.value)}
              sx={{ width: '100%' }}
            />

            <Button variant="contained" sx={{ width: '100%', marginTop: '2vh' }} onClick={currentModalState === 'category' ? handleAddCategory : handleAddDifficulty}>Add {currentModalState === 'category' ? 'Category' : 'Difficulty'}</Button>
          </div>
        </Box>
      </Modal>
    </Card>
  )
};

export default NewQuestion;