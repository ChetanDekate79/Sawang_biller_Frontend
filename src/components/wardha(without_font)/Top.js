import React from 'react';
import './Top.css'
const TopBar = () => {
  return (
    <div className="top-bar">
      <div className="box">
        <img src="log.png" alt="Left Image" className="logo-left"/>
      </div>
     
        <span className='top-title'>Energy Monitoring System for <b> Sawangi Campus </b></span>
    

        <img src="JNMC_LOGO.png" alt="Right Image" className="logo-right"/>
     
    </div>
  );
};

export default TopBar;
