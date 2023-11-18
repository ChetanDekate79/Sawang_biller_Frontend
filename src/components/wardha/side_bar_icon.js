import React, { useState, useEffect } from "react";
import Bar_graph from "./bar_graph";
import { FaChartBar, FaFileCsv, FaFileAlt, FaSun,FaExternalLinkAlt, FaSignOutAlt,FaHome,FaWater   } from 'react-icons/fa';
import { IoMdDocument } from 'react-icons/io';
import Report_wardha from "./report_wardha";
import './side_bar.css';
import LineChart_csv from './GraphComponent2'
import BoxWithButton from './BoxWithButton';
import Total_Consumption from "./Total_consumption";
import Home from "./home";
import Pump from "./pump";
import Pump_report from "./pump_report";
import Hostel_graph from'./hostel_graph';
// import Billerstatus from "./billerstates";
import EventTable from "./billerstates";
import DataDisplay from './wardhastatus'
import Hostel_report from './hostel_report'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'; // Import the icons for visibility
import { IoIosArrowDropleft, IoIosArrowDropright } from 'react-icons/io'; // Import icons for visibility
import Hostel_report_excel from "./hostel_report_excel";
import Billing_report from "./billing_report";
import Billing_report_monthly from "./billing_report_monthly";
import Bill from "./bill";
import Admin from "./admin";
import Monthly_Consumption_Report from "./monthly_consumption_report";
const Sidebar_wardha_icon = (props) => {
  const { userType } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("graph");
  const [showIconNames, setShowIconNames] = useState(true); // State variable to control visibility


  const handleOpenLink = () => {
    window.open("https://sawangibillernewstudent.hetadatain.com", "_blank"); // Replace with your desired link
  };

  const handleLogout = () => {
    // Perform any logout logic if necessary

    // Redirect to Login component
    window.location.href = 'https://sawangibiller.hetadatain.com';
  };

  const getCurrentDateTime = () => {
   
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = currentDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;   
    const formattedTime = currentDate.toLocaleTimeString();  
    return `${formattedDate} ${formattedTime}`;
  };

  useEffect(() => {
    // Simulate a loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      // case "home":
      //   return <Home />;
      case "graph":
        return <Bar_graph />;
      case "graph_csv":
        return <LineChart_csv />;
      case "meter_status":
        return <EventTable />;
        case "meter_status2":
          return <DataDisplay />;
      case "solar":
        return <BoxWithButton />;
      case "report":
        return <Total_Consumption />;
      case "pump":
        return <Pump/>;
      case "pump_report":
        return <Pump_report/>;
      case "hostel_graph":
        return <Hostel_graph/>;
        case "hostel_report":
        return <Hostel_report/>;
      case 'hostel_report_excel':
        return <Hostel_report_excel/>;
      case 'billing_report':
        return <Billing_report/>;
      case 'billing_report_monthly':
        return <Billing_report_monthly/>;
      case 'bill':
        return <Bill/>;
      case 'admin':
        return <Admin/>;
        case 'Monthly_consumption_report':
        return <Monthly_Consumption_Report/>;
      default:
        return null;
    }
  };

  // Define the common icon for toggling
 const toggleIcon = showIconNames ? <img src={`${process.env.PUBLIC_URL}/icons/minimize.png`} alt="Hostel Icon" width={24} /> : <MdVisibility />;
 // Define an array of objects containing icon-related information
 const iconContainers = [
   {
     tabName: "graph",
     tabTitle: "Hourly Graph",
     icon: <img src={`${process.env.PUBLIC_URL}/icons/statistics.png`} alt="Hostel Icon" width={24} />,
     iconName: "Hourly Graph",
   },
   {
     tabName: "hostel_graph",
     tabTitle: "Hostel Graph",
     icon: <img src={`${process.env.PUBLIC_URL}/icons/hostel.png`} alt="Hostel Icon" width={24} />,
     iconName: "Hostel Graph",
   },
   {
    tabName: "hostel_report",
    tabTitle: "Hostel Report",
    icon: <img src={`${process.env.PUBLIC_URL}/icons/report.png`} alt="Hostel Icon" width={24} />,
    iconName: "Hostel Report",
  },
  {
    tabName: "hostel_report_excel",
    tabTitle: " Daily Hostel Report",
    icon: <img src={`${process.env.PUBLIC_URL}/icons/download.png`} alt="Hostel Icon" width={24} /> ,
    iconName: " Daily Hostel Report",
  },  
  {
    tabName: "Monthly_consumption_report",
    tabTitle: " Monthly Report",
    icon: <img src={`${process.env.PUBLIC_URL}/icons/report.png`} alt="Hostel Icon" width={24} /> ,
    iconName: " Monthly Report",
  },  
   {
     tabName: "graph_csv",
     tabTitle: "Individual Parameter",
     icon: <img src={`${process.env.PUBLIC_URL}/icons/line-chart.png`} alt="Hostel Icon" width={24} />,
     iconName: "Individual Parameter",
   },
   {
     tabName: "meter_status2",
     tabTitle: "Meter Status",
     icon: <img src={`${process.env.PUBLIC_URL}/icons/electric-meter.png`} alt="Hostel Icon" width={24} />,
     iconName: "Meter Status",
   },
   {
    tabName: "billing_report", 
    tabTitle: "Billing Report",
    icon: <img src={`${process.env.PUBLIC_URL}/icons/bill.png`} alt="Hostel Icon" width={24} />,
    iconName: "Billing Report",
  },
  {
    tabName: "billing_report_monthly",
    tabTitle: "Billing Report Monthly",
    icon: <img src={`${process.env.PUBLIC_URL}/icons/monthly-bill.png`} alt="Hostel Icon" width={24} />,
    iconName: "Billing Report Monthly",
  },
  userType === "admin" && {
    tabName: "admin",
    tabTitle: "Admin Tools",
    icon: <img src={`${process.env.PUBLIC_URL}/icons/settings.png`} alt="Hostel Icon" width={24} />,
    iconName: "Admin Tools",
  },
  // {
  //   tabName: "bill",
  //   tabTitle: "Bill",
  //   icon: <img src={`${process.env.PUBLIC_URL}/icons/monthly-bill.png`} alt="Hostel Icon" width={24} />,
  //   iconName: "Bill",
  // }
   
   
 ].filter(Boolean);;

  return (
    <div className="sidebar">
      <div className="icons-container">
      {showIconNames && (
          <div className="box">
            <img src="log.png" alt="Left Image" className="logo-left" />
          </div>
        )}
    
        {/* <div
          className={`icon-container ${activeTab === "home" ? "active" : ""}`}
          onClick={() => setActiveTab("home")}
          title="Home"
        >
          <FaHome size={24} />
          <span className="icon-name">Home</span>
        </div> */}
        {/* <div
          className={`icon-container ${activeTab === "graph" ? "active" : ""}`}
          onClick={() => setActiveTab("graph")}
          title="Hourly Graph"
        >
          <FaChartBar size={24} />
          <span className="icon-name">Hourly Graph</span>
        </div>
        <div
          className={`icon-container ${activeTab === "hostel_graph" ? "active" : ""}`}
          onClick={() => setActiveTab("hostel_graph")}
          title="Hostel Graph"
        >
          <FaChartBar size={24} />
          <span className="icon-name">Hostel Graph</span>
        </div>
        <div
          className={`icon-container ${activeTab === "graph_csv" ? "active" : ""}`}
          onClick={() => setActiveTab("graph_csv")}
          title="Individual Parameter"
        >
          <FaFileCsv size={24} />
          <span className="icon-name">Parameter Graph</span>
        </div> */}
        {/* <div
          className={`icon-container ${activeTab === "meter_status" ? "active" : ""}`}
          onClick={() => setActiveTab("meter_status")}
          title="Hourly Report"
        >
          <FaFileAlt size={24} />
          <span className="icon-name">Meter Status</span>
        </div> */}

{/* <div
          className={`icon-container ${activeTab === "meter_status2" ? "active" : ""}`}
          onClick={() => setActiveTab("meter_status2")}
          title="Hourly Report"
        >
          <FaFileAlt size={24} />
          <span className="icon-name">Meter Status</span>
        </div>
        <div
          className="icon-container"
          onClick={handleOpenLink}
          title="Open Link in New Tab"
        >
          <FaExternalLinkAlt size={24} />
          <span className="icon-name">Student Record</span>
        </div> */}
      
        {/* <div
          className={`icon-container ${activeTab === "solar" ? "active" : ""}`}
          onClick={() => setActiveTab("solar")}
          title="Solar Report"
        >
          <FaSun size={24} />
          <span className="icon-name">Solar Report</span>
        </div> */}
        {/* <div
          className={`icon-container ${activeTab === "report" ? "active" : ""}`}
          onClick={() => setActiveTab("report")}
          title="Total Consumption Report"
        >
          <IoMdDocument size={24} />
          <span className="icon-name">Energy Report</span>
        </div> */}

        {/* <div
          className={`icon-container ${activeTab === "pump" ? "active" : ""}`}
          onClick={() => setActiveTab("pump")}
          title="Pump Status"
        >
          <FaWater size={24} />
          <span className="icon-name">Pump Status</span>
        </div>
        <div
          className={`icon-container ${activeTab === "pump_report" ? "active" : ""}`}
          onClick={() => setActiveTab("pump_report")}
          title="Pump Report"
        >
          <IoMdDocument size={24} />
          <span className="icon-name">Pump Report</span>
        </div> */}
        <div
          className="toggle-icon-name"
          onClick={() => setShowIconNames(!showIconNames)}
        >
          {showIconNames ? <IoIosArrowDropleft /> : <IoIosArrowDropright />}
        </div>

         {iconContainers.map((iconContainer, index) => (
          <div
            key={index}
            className={`icon-container ${
              activeTab === iconContainer.tabName ? "active" : ""
            }`}
            onClick={() => setActiveTab(iconContainer.tabName)}
            title={iconContainer.tabTitle}
          >
            <>
              {iconContainer.icon}
              {showIconNames && (
                <span className="icon-name">{iconContainer.iconName}</span>
              )}
            </>
          </div>
        ))}
        {/* Common toggle icon */}
        <div
          className={`icon-container ${
            activeTab === "handleOpenLink" ? "active" : ""
          }`}
          onClick={handleOpenLink}
          title="Student Record"
        >
          <img src={`${process.env.PUBLIC_URL}/icons/forwarding.png`} alt="Hostel Icon" width={24} />
          {showIconNames && <span className="icon-name">Student Record</span>}
        </div>
        <div
          className={`icon-container ${
            activeTab === "logout" ? "active" : ""
          }`}
          onClick={handleLogout}
          title="Logout"
        >
          <img src={`${process.env.PUBLIC_URL}/icons/logout.png`} alt="Hostel Icon" width={24} />
          {showIconNames && <span className="icon-name">Logout</span>}
        </div>


        {/* <div className="log">
          <div className="icon-container" onClick={handleLogout} title="Logout">
            <FaSignOutAlt size={24} />
            <span className="icon-name">Logout</span>
          </div>
        </div> */}
      </div>

      <div className="content">
        <div className="top-bar">
          <span className="top-title" style={{ fontFamily: 'Comic Sans MS' }}>Hostel Room Billing for <b style={{ color: "#dc2e2e"}}>Sawangi Campus</b></span>
          <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              // backgroundColor: 'rgba(255, 255, 255, 0.5)', // Transparent white background
              borderRadius: '4px', // Rounded corners for the box
              padding: '5px', // Add some padding to the box
            }}
          >
            <span style={{ fontSize: '1vw', color: 'black', cursor: 'pointer' }}>
              🗓️ {getCurrentDateTime()}
            </span>
          </div>
        </div>
          
          <img src="JNMC_LOGO.png" alt="Right Image" className="logo-right"/>
        </div>
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

export default Sidebar_wardha_icon;
