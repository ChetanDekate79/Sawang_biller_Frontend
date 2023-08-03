import React from 'react';
import './pump_report.css';

const Pump_report = () => {
  const handleClick = () => {
    window.location.href = 'https://wardha.hetadatain.com/pump_report.xlsx';
  };

  return (
    <div className="box-container">
      <p className="box-title-solar">Click below to download the Pump Report</p>
      <button className="button comic-sans" onClick={handleClick}>Download</button>

    </div>
  );
};

export default Pump_report;
