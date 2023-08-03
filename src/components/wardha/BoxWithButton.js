import React from 'react';
import './BoxWithButton.css';

const BoxWithButton = () => {
  const handleClick = () => {
    window.location.href = 'https://wardha.hetadatain.com/AUTO_DAILY_WARDHA_SOLAR.xlsx';
  };

  return (
    <div className="box-container">
      <p className="box-title-solar">Click below to download the Solar Report</p>
      <button className="button" onClick={handleClick}>Download</button>
    </div>
  );
};

export default BoxWithButton;
