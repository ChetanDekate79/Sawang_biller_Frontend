import React from 'react';
import './too_bar.css';
import Login from './Login_old';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { fetchData, logout } from './api';

function Top_Bar() {
  const handleLogout = () => {
    // Perform any logout logic if necessary

    // Redirect to Login component
    window.location.href = 'https://wardha.hetadatain.com';
  };

  return (<div><div>
    <img src="log.png" alt="Logo Left" className="logoLeft" />
    </div>
    <div className="container-top">
      <h1 className="title">Energy Monitoring System for Sawangi Campus</h1>
      <div className="logoutContainer" onClick={handleLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} className="logoutIcon" />
        <p className="logouttext">Log Out</p>
      </div>
      <img src="down.png" alt="Logo Right" className="logoRight" />
    </div>
    </div>
  );
}

export default Top_Bar;
