import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

import './csvbiller.css'; // Import your custom CSS file

const CsvBillerComponent = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [id, setId] = useState('');
  const [data, setData] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(false);


  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleIdChange = (event) => {
    setId(event.target.value);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const formattedDate = format(selectedDate, 'dd-MM-yyyy');
      const apiUrl = `https://rawdata.hetadatain.com/api/csv-biller/Durga/${formattedDate}/${id}`;
      const response = await fetch(apiUrl);
      const jsonData = await response.json();
      setData(jsonData);
      setLoading(false);
    } catch (error) {
      console.log('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };

  const handleSort = () => {
    const sortedData = [...data].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[0].localeCompare(b[0]);
      } else {
        return b[0].localeCompare(a[0]);
      }
    });
    setData(sortedData);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="csv-biller-container">
      <h1>Data from CSV Biller:</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Select Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
          />
        </div>
        <div>
          <label>Enter ID:</label>
          <input type="text" value={id} onChange={handleIdChange} />
        </div>
        <button type="submit">Fetch Data</button>
      </form>
      <div className="data-container">
      {loading ? (
          <div className="loading-screen">
            <div className="loader"></div>
            <p>Loading...</p>
          </div>
        ) : (
        <table>
          <thead>
            <tr>
              <th onClick={handleSort}>Date</th>
              <th>Host</th>
              <th>ID</th>
              <th>W Total</th>
              <th>W_R</th>
              <th>W_Y</th>
              <th>W_B</th>
              <th>PF Ave</th>
              <th>VA Total</th>
              <th>VLL Average</th>
              <th>Vry Phase</th>
              <th>Vyb Phase</th>
              <th>Vbr Phase</th>
              <th>VLN Average</th>
              <th>V R</th>
              <th>V Y</th>
              <th>V B</th>
              <th>Current Total</th>
              <th>Current R</th>
              <th>Current Y</th>
              <th>Current B</th>
              <th>Frequency</th>
              <th>Wh Received</th>
              <th>VAh Received</th>
              <th>Wh Delivered</th>
              <th>Wh Received - R Phase</th>
              <th>Wh Received - Y Phase</th>
              <th>Wh Received - B Phase</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
};

export default CsvBillerComponent;
