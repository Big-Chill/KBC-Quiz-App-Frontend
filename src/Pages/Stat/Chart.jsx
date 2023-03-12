import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import html2canvas from 'html2canvas';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Chart = ({ options, data, type, email }) => {

  const downloadChart = () => {
    const chart = document.getElementById('lchart');
    html2canvas(chart).then((canvas) => {
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `${email}_${new Date().getTime()}_${type[0].toUpperCase() + type.slice(1)}Chart.png`;
      a.click();
    });
  }


  return (
    <Box sx={{ width: '95%', margin: 'auto', marginTop: '3vh', marginLeft: '3vw', height: '65vh' }}>
      {type === 'line' ? <Line data={data} options={options} id="lchart" /> : <Bar data={data} options={options} id="lchart" />}
      <Button variant="contained" onClick={downloadChart} sx={{ width: '20%', margin: 'auto', marginTop: '3vh',marginLeft: '40%' }}>Download</Button>
    </Box>
  )
};

export default Chart;