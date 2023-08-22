import React, { useState, useEffect } from 'react';
import './billerstates.css'; // Import the CSS file
import { fetchHosts, fetchMeters, fetchData_bar } from "./api";
import BASE_URL from './api';

const EventTable = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");
  const [selectedHost, setSelectedHost] = useState("");
  const [hosts, setHosts] = useState([]);
  const [isLoadingHosts, setIsLoadingHosts] = useState(true);
  const [retryDelay, setRetryDelay] = useState(5000); // 5 s
  const maxRetries = 5; // Maximum number of retries

  useEffect(() => {
    // Get and format the current date in 'dd-mm-yyyy' format
    const dateObj = new Date();
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    setCurrentDate(formattedDate);
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoadingHosts(true);
        const hostsData = await fetchHosts();
        setHosts(hostsData);
        setIsLoadingHosts(false);
      } catch (error) {
        console.error("Error fetching hosts:", error);
        setIsLoadingHosts(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchDataWithRetry = async () => {
      let retries = 0;

      const interval = setInterval(async () => {
        try {
          if (retries >= maxRetries) {
            console.error('Exceeded maximum retries. Stopping further attempts.');
            setIsLoading(false);
            clearInterval(interval);
            return;
          }

          setIsLoading(true);
          const response = await fetch(`${BASE_URL}/meter-status/${selectedHost}/${currentDate}`);
          // const response = await fetch(`http://127.0.0.1:8000/api/meter-status/${selectedHost}/01-08-2023`);

          const data = await response.json();

          if (data) {
            setData(data);
            setIsLoading(false);
            clearInterval(interval);
          } else {
            retries++;
            console.log('Retrying API call...');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          retries++;
          console.log('Retrying API call...');
        }
      }, retryDelay); // Retry interval (e.g., 5000 ms)

      return () => clearInterval(interval);
    };

    if (selectedHost && currentDate) {
      fetchDataWithRetry();
    }
  }, [selectedHost, currentDate, retryDelay]);

  const handleHostChange = (event) => {
    setSelectedHost(event.target.value);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginRight: "10px", backgroundColor: "rgb(156 152 255)", padding: "5px", borderRadius: "10px", width: "21vw", marginLeft: "2vw" }}>
        <label htmlFor="select_host" style={{ marginRight: '10px', fontWeight: 'bold', fontFamily: 'Comic Sans MS', color: "#ffffff" }}>
          Select Host:
        </label>
        <select
          id="select_host"
          value={selectedHost}
          onChange={handleHostChange}
          style={{
            padding: '5px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            outline: 'none',
            fontFamily: 'Comic Sans MS',
            fontSize: '14px',
            minWidth: '200px',
          }}
        >
          <option value="">Select Host</option>
          {isLoadingHosts ? (
            <option value="" disabled>Loading hosts...</option>
          ) : (
            hosts.map(host => (
              <option key={host.client_id} value={host.client_id}>
                {host.client_name}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="page-container">
        {isLoading ? (
          <div className="loading-bar">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="square-container">
            {data.map((event, index) => (
              <div
                key={index}
                className={`event-box ${
                  event[10] === 1
                    ? 'green'
                    : event[10] === 2
                    ? 'yellow'
                    : event[10] === 3
                    ? 'orange'
                    : 'red'
                }`}
              >
                <p className="event-text">{event[2]}</p>
                <div className="tooltip">
                  <span className="tooltip-text">
                    <strong>Hostel:</strong> {event[1]}, <strong>Floor No:</strong> {event[7]}
                    <hr className="horizontal-line" />
                    <span>Device ID: {event[2]}</span><br />
                    <span>Device is live at: {event[0]}</span><br />
                    <span>Last Data is Before: {event[9]}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventTable;
