import React, { useState, useEffect } from "react";
import Bar_graph from "./bar_graph";
import { FaChartBar, FaFileCsv, FaFileAlt, FaSun, FaSignOutAlt,FaHome  } from 'react-icons/fa';
import { IoMdDocument } from 'react-icons/io'; // Import the IoMdDocument icon from react-icons
import Report_wardha from "./report_wardha";
import './side_bar.css';
import LineChart_csv from './GraphComponent2'
import BoxWithButton from './BoxWithButton';
import Total_Consumption from "./Total_consumption";
import Home from "./home";

const Sidebar_wardha = () => {
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const handleLogout = () => {
    // Perform any logout logic if necessary

    // Redirect to Login component
    window.location.href = 'https://wardha.hetadatain.com';
  };
  useEffect(() => {
    // Simulate a loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Set the duration of the loading delay in milliseconds
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Home />;
      case "graph":
        return <Bar_graph />;
      case "graph_csv":
        return <LineChart_csv />;
      case "report_wardha":
        return <Report_wardha />;
      case "solar":
        return <BoxWithButton />;
      case "report":
        return <Total_Consumption />;
      default:
        return null;
    }
  };


  return (
    <div className="sidebar">
      <div className="icons-container">
      <div
          className={`icon-container ${activeTab === "home" ? "active" : ""}`}
          onClick={() => setActiveTab("home")}
          title="Home"
        >
          <FaHome size={24} />
        </div>
        <div
          className={`icon-container ${activeTab === "graph" ? "active" : ""}`}
          onClick={() => setActiveTab("graph")}
          title="Hourly Graph"
        >
          <FaChartBar size={24} />
        </div>
        <div
          className={`icon-container ${activeTab === "graph_csv" ? "active" : ""}`}
          onClick={() => setActiveTab("graph_csv")}
          title="Individual Parameter"
        >
          <FaFileCsv size={24} />
        </div>
       
        <div
          className={`icon-container ${activeTab === "report_wardha" ? "active" : ""}`}
          onClick={() => setActiveTab("report_wardha")}
          title="Hourly Report"
        >
          <FaFileAlt size={24} />
        </div>
        <div
          className={`icon-container ${activeTab === "solar" ? "active" : ""}`}
          onClick={() => setActiveTab("solar")}
          title="Solar Report"
        >
          <FaSun size={24} />
        </div>
        <div
          className={`icon-container ${activeTab === "report" ? "active" : ""}`}
          onClick={() => setActiveTab("report")}
          title="Total Consumption Report"
        >
          <IoMdDocument size={24} />
        </div>
        <div className="log">
          <div className="icon-container" onClick={handleLogout} title="Logout Tooltip Text">
            <FaSignOutAlt size={24} />
          </div>
        </div>
      </div>

      <div className="content">
        {isLoading ? (
          <div className="loading-bar">
            <div className="spinner"></div>
            Loading...
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default Sidebar_wardha;
