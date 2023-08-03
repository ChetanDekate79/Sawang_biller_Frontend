import React from 'react';
import './Total_consumption.css';

const Total_Consumption = () => {
  const handleClick = () => {
    window.location.href = 'https://wardha.hetadatain.com/Total_Consumption.xlsx';
  };

  return (
    <div className="box-container">
      <p className="box-title-solar">Click below to download the Total Consumption Report</p>
      <button className="button" onClick={handleClick}>Download</button>
    </div>
  );
};

export default Total_Consumption;
