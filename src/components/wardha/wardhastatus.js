import React, { useState, useEffect } from 'react';
import './wardhastatus.css';
import BASE_URL from './api';

function DataDisplay() {
  const [entries, setEntries] = useState([]);
  const [clickedIndex, setClickedIndex] = useState(null);
  const [selectedHost, setSelectedHost] = useState('');
  const [hosts, setHosts] = useState([]);
  const [isLoadingHosts, setIsLoadingHosts] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    fetchHosts();
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedHost]);

  const fetchHosts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/host`);
      const hostsData = await response.json();
      setHosts(hostsData);
      setIsLoadingHosts(false);
    } catch (error) {
      console.error('Error fetching hosts:', error);
      setIsLoadingHosts(false);
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  const fetchData = async () => {
    try {
      if (selectedHost) {
        setIsLoadingData(true);

        const currentDate = new Date();
        const formattedDate = formatDate(currentDate);
        const response = await fetch(`${BASE_URL}/meter-status/${selectedHost}/${formattedDate}`);
        const jsonData = await response.json();
        setEntries(jsonData);

        setIsLoadingData(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoadingData(false);
    }
  };

  const getColor = (status) => {
    if (status === 0) {
      return 'red';
    } else if (status === 1) {
      return 'green';
    } else if (status === 2) {
      return 'yellow';
    } else if (status === 3) {
      return 'orange';
    } else {
      return 'unknown';
    }
  };

  const handleSingleClick = (index) => {
    if (!isActive) {
      setClickedIndex(index);
      setIsActive(true);
      setTimeout(() => {
        setClickedIndex(null);
        setIsActive(false);
      }, 600000);
    }
  };

  const handleDoubleClick = (index) => {
    setClickedIndex(index);
    console.log('Double click on index:', index);
  };

  const handleHostChange = (entry) => {
    setSelectedHost(entry.target.value);
  };

  return (
    <div className="data-background">
      <div className="dropdown-container">
        <div className="dropdown-wrapper">
          <label htmlFor="select_host" className="dropdown-label">Select Host:</label>
          <select
            id="select_host"
            value={selectedHost}
            onChange={handleHostChange}
            className="dropdown-select"
            
          >
            <option value="">Select Host</option>
            {isLoadingHosts ? (
              <option value="" disabled>Loading hosts...</option>
            ) : (
              hosts.map((host) => (
                <option key={host.client_id} value={host.client_id}>
                  {host.client_name}
                </option>
              ))
            )}
          </select>
        </div>
      </div>
      <div className="data-container">
        {isLoadingData ? (
          <div className="loading-container">
            <p className="loading-text">Loading data...</p>
          </div>
        ) : (
          entries.map((entry, index) => (
            <div
              key={index}
              className={`custom-data-box ${getColor(entry[10])}`}
              onClick={() => handleSingleClick(index)}
              onDoubleClick={() => handleDoubleClick(index)}
            >
              <p>{entry[2]}</p>
              {clickedIndex === index && (
                <button className={`custom-button ${isActive ? 'active' : ''}`} onClick={() => console.log('Button clicked')}>
                 <strong>Hostel:</strong> {entry[1]}, <strong>Floor No:</strong> {entry[7]}
                    <hr className="horizontal-line" />
                    <span>Device ID: {entry[2]}</span><br />
                    <span>Device is live at: {entry[0]}</span><br/>
                    <span>Last Data is Before: {entry[9]}</span>
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DataDisplay;
