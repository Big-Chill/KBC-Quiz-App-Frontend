import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { toaster } from 'evergreen-ui';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import {Chart, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2';


import {
  getAllQuestion,
  getCategoryQuestion,
  getDifficultyQuestion,
  getCategoryDifficultyQuestion,
  addStat
} from './requests';

import SpeedDialer from '../../Components/SpeedDial';


Chart.register(ArcElement, Tooltip, Legend);


const randomizeArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};


const options = {
    title: {
        display: true,
        text: 'Final Marks'
  },
  legend: {
    display: true,
    position: 'right',
    labels: {
      boxWidth: 10,
      fontColor: 'black'
    }
  }
};

const Game = () => {
  const location = useLocation();
  const history = useHistory();
  const [allQuestions, setAllQuestions] = React.useState([]);
  const [scoreForCorrectAnswer, setScoreForCorrectAnswer] = React.useState(1);
  const [scoreForWrongAnswer, setScoreForWrongAnswer] = React.useState(0);
  const [currentQuestion, setCurrentQuestion] = React.useState('');
  const [currentOptions, setCurrentOptions] = React.useState([]);
  const [currentAnswer, setCurrentAnswer] = React.useState('');
  const [currQuestId, setCurrQuestId] = React.useState('');
  const [radioValue, setRadioValue] = React.useState('');
  const [currScore, setCurrScore] = React.useState(0);
  const [gameOver, setGameOver] = React.useState(false);
  const [gameHistory, setGameHistory] = React.useState([]);
  const [pieData, setPieData] = React.useState([]);


  let chartRef = React.useRef(null);


  const actions = [
    { icon: <LogoutIcon />, name: 'Logout', onClick: () => { localStorage.removeItem('quizUser'); window.location.reload() } },
    // { icon: <h6>Log Out</h6>, name: 'Logout', onClick: () => { localStorage.removeItem('quizUser'); window.location.reload() } },
    { icon: <HomeIcon />, name: 'Home', onClick: () => { window.location.href = '/' } },
    // { icon: <h6>Home</h6>, name: 'Home', onClick: () => { window.location.href = '/' } },
];

  const handleRadioChange = (event) => {
    setRadioValue(event.target.value);
  };

  const filterData = (res) => {
    if (res.data.questions.length === 0) {
      toaster.danger('No questions found');
      history.push('/');
    }

    const questions = randomizeArray(res.data.questions);
    const filteredQuestions = questions.map((quest) => {
      let { question, options, answer, id } = quest;
      options = randomizeArray(options);
      return { question, options, answer, id };
    });
    setCurrentQuestion(filteredQuestions[0].question);
    setCurrentOptions(filteredQuestions[0].options);
    setCurrentAnswer(filteredQuestions[0].answer);
    setCurrQuestId(filteredQuestions[0].id);
    return filteredQuestions;
  };


  React.useEffect(() => {
    const { category, difficulty, noOfQuestions, scoreForCorrectAnswer, scoreForIncorrectAnswer } = location.state;

    if (scoreForCorrectAnswer)
      setScoreForCorrectAnswer(scoreForCorrectAnswer)

    if (scoreForIncorrectAnswer)
      setScoreForWrongAnswer(scoreForIncorrectAnswer);


    if (category === 'Any Category' && difficulty === 'Any Difficulty') {
      getAllQuestion(noOfQuestions).then((res) => {
        setAllQuestions(filterData(res));
      });
    } else if (category !== 'Any Category' && difficulty === 'Any Difficulty') {
      getCategoryQuestion(category, noOfQuestions).then((res) => {
        setAllQuestions(filterData(res));
      });
    } else if (category === 'Any Category' && difficulty !== 'Any Difficulty') {
      getDifficultyQuestion(difficulty, noOfQuestions).then((res) => {
        setAllQuestions(filterData(res));
      });
    } else {
      getCategoryDifficultyQuestion(category, difficulty, noOfQuestions).then((res) => {
        setAllQuestions(filterData(res));
      });
    }
  }, []);


  const handleSubmitClick = () => {
    if (radioValue === '') {
      return toaster.warning('Please select an option');
    }

    let flag = false;
    if (radioValue === currentAnswer) {
      toaster.success('Correct Answer');
      setCurrScore(parseInt(currScore) + parseInt(scoreForCorrectAnswer));
      flag = true;
      const temp_data = {
        question: currentQuestion,
        answer: currentAnswer,
        user_answer: radioValue,
        correct: true
      }
      setRadioValue('');
      setGameHistory([...gameHistory, temp_data]);
    } else {
      toaster.danger('Wrong Answer');
      setCurrScore(parseInt(currScore) - parseInt(scoreForWrongAnswer));
      const temp_data = {
        question: currentQuestion,
        answer: currentAnswer,
        user_answer: radioValue,
        correct: false
      }
      setRadioValue('');
      setGameHistory([...gameHistory, temp_data]);
    }

    const nextQuestion = allQuestions.filter((quest) => quest.id !== currQuestId);
    setAllQuestions(nextQuestion);
    if (nextQuestion.length > 0) {
      setCurrentQuestion(nextQuestion[0].question);
      setCurrentOptions(nextQuestion[0].options);
      setCurrentAnswer(nextQuestion[0].answer);
      setCurrQuestId(nextQuestion[0].id);
    } else {
      toaster.success(`Game Over, Your Score is ${currScore + (flag ? parseInt(scoreForCorrectAnswer) : -parseInt(scoreForWrongAnswer))}`);
      setGameOver(true);
      const temp_pie_data = {
        labels: ['Wrong Answers', 'Correct Answers'],
        datasets: [{
          data: [{ label: 'Wrong Answers', value: gameHistory.filter((item) => !item.correct).length + (flag ? 0 : 1) }, { label: 'Correct Answers', value: gameHistory.filter((item) => item.correct).length + (flag ? 1 : 0) }],
          backgroundColor: ['#3e95cd', '#8e5ea2'],
          hoverBackgroundColor: ['#3e95cd', '#8e5ea2'],
          borderColor: ['#3e95cd', '#8e5ea2'],
          hoverBorderColor: ['#3e95cd', '#8e5ea2'],
        }]
      }

      setPieData(temp_pie_data);

      const post_data = {
        category: location.state.category,
        difficulty: location.state.difficulty,
        userScore: currScore + (flag ? parseInt(scoreForCorrectAnswer) : -parseInt(scoreForWrongAnswer)),
        totalScore: (gameHistory.length + 1) * parseInt(scoreForCorrectAnswer),
        totalQuestions: gameHistory.length + 1,
        totalCorrect: gameHistory.filter((item) => item.correct).length + (flag ? 1 : 0),
        totalIncorrect: gameHistory.filter((item) => !item.correct).length + (flag ? 0 : 1),
        date: new Date().getTime()
      }

      const userId = JSON.parse(localStorage.getItem('quizUser')).userId;

      addStat(userId, post_data).then((res) => {
        console.log(res);
      }).catch((err) => {
        console.log('Error :- ', err);
      })
    }
  };

  const generatePdf = (data) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setFont('times');
    doc.text(`REPORT CARD`, 80, 10, null, null)
    doc.setFontSize(16);
    doc.text(`Score: ${currScore}`, 35, 25);
    doc.text(`Total Questions: ${data.length}`, 35, 35);
    doc.text(`Correct Answers: ${data.filter((item) => item.correct).length}`, 35, 45);
    doc.text(`Wrong Answers: ${data.filter((item) => !item.correct).length}`, 35, 55);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 35, 65);
    doc.autoTable({
      head: [['Question', 'Correct Answer', 'Your Answer']],
      body: data.map((item) => [item.question, item.answer, item.user_answer]),
      startY: 80,
      theme: 'grid',
      styles: {
        fontSize: 14,
        overflow: 'linebreak',
        cellWidth: 'wrap',
      },
      didParseCell: (data) => {
        if (data.section === 'body') {
          if (data.column.index === 0) {
            data.cell.styles.cellWidth = 81.8;
          } else if (data.column.index === 1) {
            data.cell.styles.cellWidth = 50;
          } else if (data.column.index === 2) {
            data.cell.styles.cellWidth = 50;
          }
        }
      },
    });

    html2canvas(document.getElementById('chart')).then((canvas) => {
      let previousY = doc.previousAutoTable.finalY;
      let imageHeight = 75;

      if (previousY + imageHeight > doc.internal.pageSize.height) {
        doc.addPage();
        previousY = 10;
      }

      doc.addImage(canvas.toDataURL('image/png'), 'PNG', 65, previousY + 10, 75, 75);
      doc.save(`Report Card ${new Date().getTime()}.pdf`);
    });
  }


  return (
    <>
      {
        !gameOver ?
          (
            <Card raised={true} sx={{ width: '30vw', height: '50vh', margin: 'auto', marginTop: '20vh' }}>
              <FormControl sx={{ width: '80%', margin: 'auto', marginTop: '4vh', marginLeft: '3vw' }}>
                <TextField
                  id="outlined-basic"
                  label="Question"
                  variant="outlined"
                  multiline={true}
                  rows={3}
                  value={currentQuestion}
                  sx={{ width: '100%', fontWeight: 'bold', fontSize: '1.5rem', color: 'black' }}
                />
              </FormControl>

              <FormControl sx={{ width: '80%', margin: 'auto', marginTop: '1vh', marginLeft: '3vw' }}>
                <RadioGroup
                  aria-label="quiz"
                  name="quiz"
                  value={radioValue}
                  onChange={handleRadioChange}
                >
                  {currentOptions.map((option, index) => (
                    <FormControlLabel
                      value={option}
                      control={<Radio />}
                      label={option}
                      sx={{ fontSize: '1.5rem', color: 'black' }}
                      key={index}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              <Button
                variant="contained"
                sx={{ width: '80%', margin: 'auto', marginTop: '1vh', marginLeft: '3vw' }}
                onClick={handleSubmitClick}
              >
                Submit
              </Button>

              <SpeedDialer actions={actions} />
            </Card>
          )
          :
          (
            <div>
                  <Card raised={true} sx={{ width: '40vw', height: '64vh', margin: 'auto', marginTop: '20vh' }}>
                    <FormControl sx={{ width: '84%', margin: 'auto', marginTop: '4vh', marginLeft: '3vw' }}>
                      <TextField
                        id="outlined-basic"
                        label="Question"
                        variant="outlined"
                        value={`Game Over, Your Score is ${currScore}`}
                        sx={{ width: '100%', fontWeight: 'bold', fontSize: '1.5rem', color: 'black' }}
                      />
                    </FormControl>

                <FormControl sx={{ width: '80%', margin: 'auto', marginTop: '1vh', marginLeft: '3vw' }}>
                      <List sx={{ width: '105%', bgcolor: 'background.paper', overflow: 'auto', maxHeight: 350 }}>
                        {gameHistory.map((data, index) => (
                          <ListItem key={index}>
                            <ListItemText
                              primary={data.question}
                              secondary={
                                <React.Fragment>
                                  <Typography
                                    sx={{ display: 'inline', fontWeight: 'bold' }}
                                    component="span"
                                    variant="body2"
                                    color={data.correct ? 'success.main' : 'error.main'}
                                  >
                                    {data.correct ? 'Correct' : 'Wrong'}
                                  </Typography>
                                  {` — Your Answer: ${data.user_answer}, Correct Answer: ${data.answer}`}
                                </React.Fragment>

                              }
                            />
                          </ListItem>
                        ))}
                    <ListItem sx={{ mt: '-10vh' }}>
                      <Pie data={pieData} options={options} id="chart" ref={chartRef} style={{ scale: '0.65' }} />
                    </ListItem>
                    <ListItem sx={{ mt: '-10vh' }}>
                      <Button
                        variant="contained"
                        sx={{ width: '80%', margin: 'auto', marginTop: '2vh', marginLeft: '3vw' }}
                        onClick={() => generatePdf(gameHistory)}
                      >
                        Download Report
                      </Button>
                    </ListItem>
                  </List>
                </FormControl>
                <SpeedDialer actions={actions}/>
              </Card>
              </div>
          )
      }
    </>
  );
};

export default Game;