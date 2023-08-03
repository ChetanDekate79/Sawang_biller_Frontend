import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Solar.css';

const Solar = () => {
  const [var1, setVar1] = useState(null);
  const [var2, setVar2] = useState(null);
  const [var3, setVar3] = useState('');
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the payload object
    const payload = {
      var1: var1 ? var1.toISOString().split('T')[0] : null,
      var2: var2 ? var2.toISOString().split('T')[0] : null,
      var3,
    };

    try {
      // Send the POST request to the API endpoint
      const response = await fetch('https://wardha.hetadatain.com/api/execute-python', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Parse the response
      const data = await response.json();

      // Set the response in the state
      setResponse(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container_solar">
      <form onSubmit={handleSubmit} className="form2">
        <div className="form-group">
          <h2>Report will be sent to your email</h2>
          <br></br>
          <label htmlFor="var1">Start Date:</label>
          <DatePicker
            id="var1"
            selected={var1}
            onChange={(date) => setVar1(date)}
            dateFormat="yyyy-MM-dd"
            className="date-picker"
            placeholderText="Select start date"
            calendarClassName="center"
          />
        </div>

        <div className="form-group">
          <label htmlFor="var2">End Date:</label>
          <DatePicker
            id="var2"
            selected={var2}
            onChange={(date) => setVar2(date)}
            dateFormat="yyyy-MM-dd"
            className="date-picker"
            placeholderText="Select end date"
            calendarClassName="center"
          />
        </div>

        <div className="form-group">
          <label htmlFor="var3">Enter Email:</label>
          <input
            type="text"
            id="var3"
            value={var3}
            onChange={(e) => setVar3(e.target.value)}
            className="email-input"
            placeholder="Enter your email"
          />
        </div>

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>

      {response && (
        <div className="response-message">
          {response.status === 'success' ? (
            <h3>Mail Sent Successfully</h3>
          ) : (
            <h3>Email could not be sent</h3>
          )}
        </div>
      )}
    </div>
  );
};

export default Solar;
