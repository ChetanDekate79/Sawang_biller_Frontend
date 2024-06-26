import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import Sidebar_wardha_icon from './components/wardha/side_bar_icon'
import './App.css'
import Login2 from './components/wardha/Login2';
import Monthly_bill from './components/wardha/Monthly_bill';
import Admin from './components/wardha/admin';
import Hostel_report_new from './components/wardha/hostel_report_new';
import Empty_room from './components/wardha/empty_room_report';

function App() { 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Set the duration of the loading delay in milliseconds
  }, []);

  return (
    <div className='main-bc'>
      {isLoading ? (
        <div className="loading-barr">
          <div className="spinnerr"></div>
        </div>
      ) : (
        <>
          {/* <Sidebar_wardha_icon/> */}
          {/* <Admin/> */}
          <Login2/>
        </>
      )}
    </div>
  );
};

export default App;
