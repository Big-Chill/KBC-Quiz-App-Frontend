import React from 'react';
import Card from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import TextField from '@mui/material/TextField';
import { OutTable, ExcelRenderer } from "react-excel-renderer";
import { toaster } from 'evergreen-ui';
import './Bulk.css';
import XLSX from "xlsx";
import SpeedDialer from '../../Components/SpeedDial';

import { addBulkQuestion } from './requests';

const BulkQuestion = () => {

  const actions = [
    { icon: <LogoutIcon />, name: 'Logout', onClick: () => { localStorage.removeItem('quizUser'); window.location.reload() } },
    // { icon: <h6>Log Out</h6>, name: 'Logout', onClick: () => { localStorage.removeItem('quizUser'); window.location.reload() } },
    { icon: <HomeIcon />, name: 'Home', onClick: () => { window.location.href = '/' } },
    // { icon: <h6>Home</h6>, name: 'Home', onClick: () => { window.location.href = '/' } },
];

  const [excelFile, setExcelFile] = React.useState(null);
  const [rows, setRows] = React.useState(null);
  const [cols, setCols] = React.useState(null);
  const [headers, setHeaders] = React.useState(null);

  const handleFileChange = (event) => {
    setExcelFile(event.target.files[0]);

    ExcelRenderer(event.target.files[0], (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        console.log(resp);
        const [firstRow, ...rest] = resp.rows;
        if (firstRow.length !== 8 || firstRow[0] !== 'Question' || firstRow[1] !== 'Category' || firstRow[2] !== 'Difficulty' || firstRow[3] !== 'Option A' || firstRow[4] !== 'Option B' || firstRow[5] !== 'Option C' || firstRow[6] !== 'Option D' || firstRow[7] !== 'Correct Answer') {
          toaster.danger('Invalid Excel File');
          setExcelFile(null);
          return;
        }
        setHeaders(firstRow);
        setRows(rest);
        setCols(resp.cols);
      }
    });
  };

  const handleCellChange = (event, rowIndex, cellIndex) => {
    const newRows = [...rows];
    newRows[rowIndex][cellIndex] = event.target.value;
    setRows(newRows);
  };

  const handleSubmit = () => {
    const sheetname = 'Sheet1'
    let data = [headers, ...rows];
    const worksheet = XLSX.utils.aoa_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetname);

    const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const formData = new FormData();
    formData.append('file', blob, excelFile.name);

    addBulkQuestion(formData)
      .then(res => {
        setExcelFile(null);
        setRows(null);
        setCols(null);
        setHeaders(null);
        toaster.success('Questions added successfully');
      })
      .catch(err => {
        toaster.danger('Something went wrong');
        console.log(err);
      })
  };




  return (
    <div>
      <Card raised={true} sx={{ width: excelFile ? '90vw' : '35vw', height: excelFile ? '90vh' : '25vh', margin: 'auto', marginTop: '5vh', overflowY: 'auto', overflowX: 'auto' }}>
        <FormControl sx={{ width: excelFile ?'88%':'70%', margin: 'auto', marginTop: '5vh', marginLeft: '5vw' }}>
          <Button variant="contained" component="label" sx={{ width: '100%' }}>
            Upload Excel File
            <input
              type="file"
              accept=".xlsx, .csv"
              hidden
              onChange={handleFileChange}
            />
          </Button>

          {
            excelFile && (

              <Card raised={true} sx={{ width: '100%', height: '50vh', margin: 'auto', marginTop: '5vh', overflowY: 'auto', overflowX: 'auto' }}>
              {
                rows && (
                  // <OutTable data={rows} columns={cols} tableClassName="ExcelTable2007" tableHeaderRowClass="heading" />
                    <table className="excel-table" id="excel-table-js">
                      <thead>
                        <tr>
                        {
                          headers.map((header, index) => (
                            <th key={index}>{header}</th>
                          ))
                          }
                        </tr>
                      </thead>

                      <tbody>
                        {rows.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex}>
                                <TextField
                                  id="outlined-basic"
                                  label={headers[cellIndex]}
                                  variant="outlined"
                                  value={cell}
                                  onChange={(e) => handleCellChange(e, rowIndex, cellIndex)}
                                  sx={{ width: '100%' }}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                )
              }
          </Card>
            )
          }
          <Button variant="contained" sx={{ width: '100%', marginTop: '5vh' }} onClick={handleSubmit}>
            Submit
          </Button>
        </FormControl>
      </Card>
      <SpeedDialer actions={actions} />
    </div>
  )
};

export default BulkQuestion;