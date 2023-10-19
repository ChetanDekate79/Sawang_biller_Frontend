import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import Bar_graph from './components/wardha/bar_graph'
import Report_wardha from './components/wardha/report_wardha'
import Sidebar_wardha from './components/wardha/side_bar'
import Sidebar_wardha_icon from './components/wardha/side_bar_icon'

import Top_Bar from './components/wardha/too_bar'
// import './components/wardha/report_wardha.css'
import Login from './components/wardha/Login_old';
import TopBar from './components/wardha/Top';
import './App.css'
import Pump from './components/wardha/pump';
import CsvBillerComponent from './components/wardha/csvbiller';
import MyTableauDashboard from './components/wardha/TableauViz';
import Login2 from './components/wardha/Login2';
import Billerstatus from './components/wardha/billerstates'
import Hostel_graph from './components/wardha/hostel_graph'
import Hostel_report from './components/wardha/hostel_report';
import Hostel_report_excel from './components/wardha/hostel_report_excel';
import Bill from './components/wardha/bill';
import Admin from './components/wardha/admin';

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
          <Login2/>
        </>
      )}
    </div>
  );
};

export default App;
