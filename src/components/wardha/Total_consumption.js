import React from 'react';
import './Total_consumption.css';

const Total_Consumption = () => {
  const handleClick = () => {
    window.location.href = 'https://wardha.hetadatain.com/Sawangi_Total_Consumption_Report.xlsx';
  };

  return (
    <div className="box-container">
      <p className="box-title-solar">Click below to download the Total Consumption Report</p>
      <button className="button comic-sans" onClick={handleClick}>Download</button>

    </div>
  );
};

export default Total_Consumption;
