import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import Modal from '@mui/material/Modal';
import { toaster } from 'evergreen-ui';

import { getQuestions, getQuestionsCount, updateQuestion, deleteQuestion, getAllCategory, getAllDifficulty } from './requests';
import SpeedDialer from '../../Components/SpeedDial';


function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};




const Questions = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [totalCount, setTotalCount] = React.useState(0);
  const [rows, setRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [allCategories, setAllCategories] = React.useState([]);
  const [allDifficulties, setAllDifficulties] = React.useState([]);
  const [objId, setObjId] = React.useState('');
  const [question, setQuestion] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [difficulty, setDifficulty] = React.useState('');
  const [option_a, setOption_a] = React.useState('');
  const [option_b, setOption_b] = React.useState('');
  const [option_c, setOption_c] = React.useState('');
  const [option_d, setOption_d] = React.useState('');
  const [answer, setAnswer] = React.useState('');


  const actions = [
    { icon: <LogoutIcon />, name: 'Logout', onClick: () => { localStorage.removeItem('quizUser'); window.location.reload() } },
    // { icon: <h6>Log Out</h6>, name: 'Logout', onClick: () => { localStorage.removeItem('quizUser'); window.location.reload() } },
    { icon: <HomeIcon />, name: 'Home', onClick: () => { window.location.href = '/' } },
    // { icon: <h6>Home</h6>, name: 'Home', onClick: () => { window.location.href = '/' } },
];

  const handleDelete = (questionObj) => {
    const { _id } = questionObj;

    deleteQuestion(_id).then((res) => {
      if (res.status === 200) {
        console.log('Question deleted successfully');
        getQuestionsCount().then((res) => {
          setTotalCount(res.data.count);
        });
      }
    });
  };

  const handleEdit = (questionObj) => {
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
    setObjId(questionObj._id);
    setQuestion(questionObj.question);
    setCategory(questionObj.category);
    setDifficulty(questionObj.difficulty);
    setOption_a(questionObj.options[0]);
    setOption_b(questionObj.options[1]);
    setOption_c(questionObj.options[2]);
    setOption_d(questionObj.options[3]);
    setAnswer(questionObj.answer);
    handleOpen(true);
  };

  const createData = (questionObj) => {
  return {
    id: questionObj._id,
    question: questionObj.question,
    category: questionObj.category,
    difficulty: questionObj.difficulty,
    option_a: questionObj.options[0],
    option_b: questionObj.options[1],
    option_c: questionObj.options[2],
    option_d: questionObj.options[3],
    correct_answer: questionObj.answer,
    edit: <EditIcon onClick={() => handleEdit(questionObj)} sx={{ color: 'green', cursor: 'pointer' }} />,
    delete: <DeleteForeverIcon onClick={() => handleDelete(questionObj)} sx={{ color: 'red', cursor: 'pointer' }} />,
  }
};


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, totalCount - page * rowsPerPage);
  React.useEffect(() => {
    if (totalCount === 0) {
      getQuestionsCount().then((res) => {
        setTotalCount(res.data.count);
      });
    }

    getQuestions(page + 1, rowsPerPage).then((res) => {
      setRows([]);
      res.data.questions.map((question) => {
        setRows((questions) => [...questions, createData(question)]);
      });
    });


  }, [page, rowsPerPage, totalCount, open]);


  const handleUpdateButton = () => {
    const questionObj = {
      question,
      category,
      difficulty,
      options: [option_a, option_b, option_c, option_d],
      answer,
    };
   
    updateQuestion(objId, questionObj).then((res) => {
      if (res.status === 200) {
        console.log(res.data);
        toaster.success('Question updated successfully');
        handleClose();
      }
    });
  };




  return (
    <div style={{ padding: '5%'}}>
      <TableContainer component={Paper} sx={{ minWidth: 500, overflow: 'auto', height: '58.5vh', border: '1px solid #000' }} aria-label="sticky table">
        <Table sx={{ minWidth: 500 }} stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>Question</TableCell>
              <TableCell align="left">Category</TableCell>
              <TableCell align="left">Difficulty</TableCell>
              <TableCell align="left">Option A</TableCell>
              <TableCell align="left">Option B</TableCell>
              <TableCell align="left">Option C</TableCell>
              <TableCell align="left">Option D</TableCell>
              <TableCell align="left">Correct Answer</TableCell>
              <TableCell align="left"></TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                {
                  Object.keys(row).map((key, index) => {
                    if (key !== 'id') {
                      return (
                        <TableCell component="th" scope="row" key={row.id + index}>
                          {row[key]}
                        </TableCell>
                      )
                    }
                  })
                }
              </TableRow>
            ))}
            {
              emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={8} />
                </TableRow>
              )
            }

          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Table>
          <TableBody>
          <TableRow>
          <TablePagination
            rowsPerPageOptions={[5, 10, { label: 'All', value: totalCount }]}
            colSpan={10}
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            SelectProps={{
            inputProps: {
                'aria-label': 'rows per page',
              },
              native: false,
            }}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
            />
            </TableRow>
            </TableBody>
        </Table>
      </div>
      <SpeedDialer actions={actions} />

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
              <FormControl sx={{ width: '80%', margin: 'auto', marginTop: '2vh', marginLeft: '4vw' }} variant="outlined">
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
                  label="Option A"
                  variant="outlined"
                  value={option_a}
                  onChange={(e) => setOption_a(e.target.value)}
                  sx={{ width: '45%' }}
                />

                <TextField
                  id="outlined-basic"
                  label="Option B"
                  variant="outlined"
                  value={option_b}
                  onChange={(e) => setOption_b(e.target.value)}
                  sx={{ width: '45%' }}
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '2vh', marginLeft: '4vw', marginRight: '4vw' }}>
              <TextField
                id="outlined-basic"
                label="Option C"
                variant="outlined"
                value={option_c}
                onChange={(e) => setOption_c(e.target.value)}
                sx={{ width: '45%' }}
              />

              <TextField
                id="outlined-basic"
                label="Option D"
                variant="outlined"
                value={option_d}
                onChange={(e) => setOption_d(e.target.value)}
                sx={{ width: '45%' }}
              />
            </div>

            <FormControl sx={{ width: '80%', margin: 'auto', marginTop: '2vh', marginLeft: '4vw' }} variant="outlined">
              <TextField
                  id="outlined-basic"
                  label="Answer"
                  variant="outlined"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  sx={{ width: '100%' }}
                />
            </FormControl>

            <FormControl sx={{ width: '80%', margin: 'auto', marginTop: '2vh', marginLeft: '4vw' }} variant="outlined">
              <InputLabel id="demo-simple-select-outlined-label">Category</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
              >
                {[...new Set(allCategories)].map((category) => (
                  <MenuItem value={category} key={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ width: '80%', margin: 'auto', marginTop: '2vh', marginLeft: '4vw' }} variant="outlined">
              <InputLabel id="demo-simple-select-outlined-label">Difficulty</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                label="Difficulty"
              >
                { [ ...new Set(allDifficulties) ].map((difficulty) => (
                  <MenuItem value={difficulty} key={difficulty}>{difficulty}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ width: '80%', margin: 'auto', marginTop: '2vh', marginLeft: '4vw' }} variant="outlined">
              <Button variant="contained" onClick={handleUpdateButton}>Update Question</Button>
            </FormControl>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Questions;