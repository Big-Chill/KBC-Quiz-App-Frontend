import React from 'react';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import moment from 'moment';
import Chart from './Chart';

import { useLocation } from 'react-router-dom';

import {
  getAllCategory,
  getAllDifficulty,
  getStat,
  getCategoryStat,
  getDifficultyStat,
  getCategoryDifficultyStat,
} from './requests';

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Category Stats',
    },
    legend: {
      display: true,
      position: 'bottom',
    },
  },
}

const Home = () => {

  const location = useLocation();
  const email = (location.state != undefined) ? location.state.email : JSON.parse(localStorage.getItem('quizUser')).email;
  const [category, setCategory] = React.useState([]);
  const [difficulty, setDifficulty] = React.useState([]);
  const [currentCategory, setCurrentCategory] = React.useState('');
  const [currentDifficulty, setCurrentDifficulty] = React.useState('');
  const [time, setTime] = React.useState([]);
  const [totalCorrect, setTotalCorrect] = React.useState([]);
  const [totalIncorrect, setTotalIncorrect] = React.useState([]);
  const [totalQuestions, setTotalQuestions] = React.useState([]);
  const [percentage, setPercentage] = React.useState([]);
  const [typeOfChart, setTypeOfChart] = React.useState('line');

  const fetchAllategories = () => {
    console.log('Category fetched')
    if (category.length > 0) return;

    setCategory([]);

    getAllCategory().then((res) => {
      let category_set = new Set();
      res.data.categories.filter((category) => category.name !== 'Any Category').map((category) =>
        category_set.add(category.name)
      );
      category_set.add('Any Category');
      setCategory([...category_set]);
      setCurrentCategory('Any Category');
    });
  };

  const fetchAllDifficulties = () => {
    if (difficulty.length > 0) return;

    console.log('Difficulty fetched')

    setDifficulty([]);

    getAllDifficulty().then((res) => {
      res.data['difficulties'].map((item) => {
        return setDifficulty((prev) => [...prev, item.name]);
      }
      );
      setCurrentDifficulty('Any Difficulty');
    });
  };


  const fetchStats = () => {
    if (currentCategory == '' || currentDifficulty == '') return;


    var userId = '';

    if (location.state != undefined) {
      userId = location.state.userId;
    } else {
      userId = JSON.parse(localStorage.getItem('quizUser')).userId;
    }


    setTime([]);
    setTotalCorrect([]);
    setTotalIncorrect([]);
    setTotalQuestions([]);
    setPercentage([]);


    if (currentCategory === 'Any Category' && currentDifficulty === 'Any Difficulty') {
      getStat(userId).then((res) => {

        var months = [];

        res.data['stats'].map((item) => {
          setTotalCorrect((prev) => [...prev, item.totalCorrect]);
          setTotalIncorrect((prev) => [...prev, item.totalIncorrect]);
          setTotalQuestions((prev) => [...prev, item.totalQuestions]);
          setPercentage((prev) => [...prev, item.marksPercentage]);
          months.push(parseInt(item.date))
        });

        return months;
      }).then((months) => {

        months.forEach((item) => {
          const curr_date = new Date(item);
          setTime((prev) => [...prev, moment(curr_date).format('YYYY-MM-DD HH:mm:ss')]);
        });

      });
    }
    else if (currentCategory !== 'Any Category' && currentDifficulty === 'Any Difficulty') {

      getCategoryStat(userId, currentCategory).then((res) => {

        var months = [];

        res.data['stats'].map((item) => {
          setTotalCorrect((prev) => [...prev, item.totalCorrect]);
          setTotalIncorrect((prev) => [...prev, item.totalIncorrect]);
          setTotalQuestions((prev) => [...prev, item.totalQuestions]);
          setPercentage((prev) => [...prev, item.marksPercentage]);
          months.push(parseInt(item.date))
        });

        return months;
      }).then((months) => {

        months.forEach((item) => {
          const curr_date = new Date(item);
          setTime((prev) => [...prev, moment(curr_date).format('YYYY-MM-DD HH:mm:ss')]);
        });

      });
    }
    else if (currentCategory === 'Any Category' && currentDifficulty !== 'Any Difficulty') {
        getDifficultyStat(userId, currentDifficulty).then((res) => {

          var months = [];

          res.data['stats'].map((item) => {
            setTotalCorrect((prev) => [...prev, item.totalCorrect]);
            setTotalIncorrect((prev) => [...prev, item.totalIncorrect]);
            setTotalQuestions((prev) => [...prev, item.totalQuestions]);
            setPercentage((prev) => [...prev, item.marksPercentage]);
            months.push(parseInt(item.date))
          });

          return months;
        }).then((months) => {

          months.forEach((item) => {
            const curr_date = new Date(item);
            setTime((prev) => [...prev, moment(curr_date).format('YYYY-MM-DD HH:mm:ss')]);
          });

        });
    }
    else if (currentCategory !== 'Any Category' && currentDifficulty !== 'Any Difficulty') {

      getCategoryDifficultyStat(userId, currentCategory, currentDifficulty).then((res) => {

        var months = [];

        res.data['stats'].map((item) => {
          setTotalCorrect((prev) => [...prev, item.totalCorrect]);
          setTotalIncorrect((prev) => [...prev, item.totalIncorrect]);
          setTotalQuestions((prev) => [...prev, item.totalQuestions]);
          setPercentage((prev) => [...prev, item.marksPercentage]);
          months.push(parseInt(item.date))
        });

        return months;
      }).then((months) => {

        months.forEach((item) => {
          const curr_date = new Date(item);
          setTime((prev) => [...prev, moment(curr_date).format('YYYY-MM-DD HH:mm:ss')]);
        });

      });
    }
  };


  const linecategoryData = {
    labels: time,
    datasets: [
      {
        label: 'Percentage',
        data: percentage,
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      }
    ],
  };


  const barcategoryData = {
    labels: time,
    datasets: [
      {
        label: 'Total Correct',
        data: totalCorrect,
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Total Incorrect',
        data: totalIncorrect,
        fill: false,
        backgroundColor: 'rgb(255, 205, 86)',
        borderColor: 'rgba(255, 205, 86, 0.2)',
      },
      {
        label: 'Total Questions',
        data: totalQuestions,
        fill: false,
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgba(54, 162, 235, 0.2)',
      }
    ],
  };

  React.useEffect(() => {

    if( category.length === 0)
      fetchAllategories();
    if( difficulty.length === 0)
      fetchAllDifficulties();

    fetchStats();
  }, [currentCategory, currentDifficulty]);



  return (
    <div>
      <div>
        <FormControl sx={{ width: '30%', margin: 'auto', marginTop: '2vh', marginLeft: '1vw' }}>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={currentCategory}
            onChange={(e) => setCurrentCategory(e.target.value)}
          >
            {
              [...new Set(category)].map((item) => {
                return <MenuItem value={item} key={item}>{item}</MenuItem>
              })
            }
          </Select>
        </FormControl>

        <FormControl sx={{ width: '30%', margin: 'auto', marginTop: '2vh', marginLeft: '3vw' }}>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={currentDifficulty}
            onChange={(e) => setCurrentDifficulty(e.target.value)}
          >
            {
              [ ...new Set(difficulty) ].map((item) => {
                return <MenuItem value={item} key={item}>{item}</MenuItem>
              })
            }
          </Select>
        </FormControl>

        <FormControl sx={{ width: '30%', margin: 'auto', marginTop: '2vh', marginLeft: '3vw' }}>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={typeOfChart}
            onChange={(e) => setTypeOfChart(e.target.value)}
          >
            <MenuItem value={'line'}>Line</MenuItem>
            <MenuItem value={'bar'}>Bar</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div>
        {
          <Chart options={options} data={typeOfChart === 'line' ? linecategoryData : barcategoryData} type={typeOfChart} email={email} />
        }
      </div>

      
    </div>
  )
};

export default Home;




