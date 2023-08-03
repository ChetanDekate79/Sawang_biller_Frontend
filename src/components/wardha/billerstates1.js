import React, { useState, useEffect } from 'react';
import './billerstates1.css'; // Import the CSS file

const EventTable = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Get and format the current date in 'dd-mm-yyyy' format
    const dateObj = new Date();
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1
    const year = dateObj.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    setCurrentDate(formattedDate);
  }, []);

  const fetchData = async (client, date) => {
    try {
      const response = await fetch(`https://sawangibiller.hetadatain.com/api/meter-status/durga/${date}`);
      const data = await response.json();
      setData(data);
      setIsLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false); // Set loading to false in case of an error
    }
  };

  useEffect(() => {
    fetchData('Durga', currentDate);
  }, [currentDate]);

  return (
    <div className="page-container">
      {isLoading ? (
        <div className="loading-message">Loading...</div>
      ) : (
        <div className="square-container">
          {data.map((event, index) => (
            <div
              key={index}
              className={event[6] === 1 ? 'event-box green' : 'event-box red'}
            >
              <p className="event-text">{event[2]}</p>
              <div className="tooltip">
                <span className="tooltip-text">
                  <strong>Hostel:</strong> {event[1]}, <strong>Floor No:</strong> {event[3]}
                  <hr className="horizontal-line" />
                  <span>Device ID: {event[2]}</span><br/>
                  <span>Device is live at: {event[4]}</span><br/>
                  <span>Last Data is Before: {event[5]}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventTable;
