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
import Monthly_bill from "./Monthly_bill";
import Hostel_report_new from "./hostel_report_new";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import BASE_URL from "./api";
import Empty_room from "./empty_room_report";

const Sidebar_wardha_icon = (props) => {
  const { userType } = props;
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("graph");
  const [showIconNames, setShowIconNames] = useState(true); // State variable to control visibility
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleOpenLink = () => {
    window.open("https://sawangibillernewstudent.hetadatain.com", "_blank"); // Replace with your desired link
  };

  useEffect(() => {
    const getWeatherData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/weather/current`
        );
        setWeatherData(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setError(error.message || 'An error occurred while fetching weather data.');
      } finally {
        setLoading(false);
      }
    };

    getWeatherData();
  }, []); // The 

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
        return <Hostel_report_new/>;
      case 'hostel_report_excel':
        return <Hostel_report_excel/>;
      case 'empty_room_report':
        return <Empty_room/>
      case 'billing_report':
        return <Billing_report/>;
      case 'billing_report_monthly':
        return <Monthly_bill/>;
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
     tabTitle: "Any Room Hourly Consumption for any day",
     icon: <img src={`${process.env.PUBLIC_URL}/icons/statistics.png`} alt="Hostel Icon" width={24} />,
     iconName: "Hourly Graph",
   },
   {
     tabName: "hostel_graph",
     tabTitle: "Select any Hostel Input,Commom Area,Hourly Graphs for any Day",
     icon: <img src={`${process.env.PUBLIC_URL}/icons/hostel.png`} alt="Hostel Icon" width={24} />,
     iconName: "Hostel Graph",
   },
   {
    tabName: "hostel_report",
    tabTitle: "Show any Hostel Hourly Input,Room,Common Area table",
    icon: <img src={`${process.env.PUBLIC_URL}/icons/report.png`} alt="Hostel Icon" width={24} />,
    iconName: "Hostel Report",
  },
  {
    tabName: "hostel_report_excel",
    tabTitle: "Download all Hostel Daily Consumption",
    icon: <img src={`${process.env.PUBLIC_URL}/icons/download.png`} alt="Hostel Icon" width={24} /> ,
    iconName: " Daily Hostel Report",
  },  
  {
    tabName: "Monthly_consumption_report",
    tabTitle: "Show any Hostel Total Consumption,Solar Gen, Main Incomer Net,Room Consumption,Common Area Consumption,Room Bill,Common Area Bill for any Month",
    icon: <img src={`${process.env.PUBLIC_URL}/icons/report.png`} alt="Hostel Icon" width={24} /> ,
    iconName: " Monthly Report",
  },  
   {
     tabName: "graph_csv",
     tabTitle: "Show Twenty-five Parameter of any Room for any Day",
     icon: <img src={`${process.env.PUBLIC_URL}/icons/line-chart.png`} alt="Hostel Icon" width={24} />,
     iconName: "Individual Parameter",
   },
   {
     tabName: "meter_status2",
     tabTitle: "For any Hostel Meter Status",
     icon: <img src={`${process.env.PUBLIC_URL}/icons/electric-meter.png`} alt="Hostel Icon" width={24} />,
     iconName: "Meter Status",
   },
   {
    tabName: "empty_room_report",
    tabTitle: "For any Empty Room Status",
    icon: <img src={`${process.env.PUBLIC_URL}/icons/emergency.png`} alt="Hostel Icon" width={24} />,
    iconName: "Empty Rooms",
  },
   userType === "admin" && {
    tabName: "billing_report", 
    tabTitle: "Generate bill for any Room from Start to End in given time period",
    icon: <img src={`${process.env.PUBLIC_URL}/icons/bill.png`} alt="Hostel Icon" width={24} />,
    iconName: "Billing Report",
  },
  userType === "admin" && 
  {
    tabName: "billing_report_monthly",
    tabTitle: "Generate Summary bill for any Room from Start to End in given time period",
    icon: <img src={`${process.env.PUBLIC_URL}/icons/monthly-bill.png`} alt="Hostel Icon" width={24} />,
    iconName: "Billing Report Monthly",
  },
  userType === "admin" && {
    tabName: "admin",
    tabTitle: "Admin Tools",
    icon: <img src={`${process.env.PUBLIC_URL}/icons/settings.png`} alt="Hostel Icon" width={24} />,
    iconName: "Admin Tools",
  },

   
   
 ].filter(Boolean);;

  return (
    <div className="sidebar">
      <div className="icons-container">
      {showIconNames && (
          <div className="box">
            <img src="log.png" alt="Left Image"  width='150' height='30'/>
          </div>
        )}
   
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
            // title={iconContainer.tabTitle}
            data-tooltip={iconContainer.tabTitle} 
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
          data-tooltip="Enter or Update data of any Student"
        >
          <img src={`${process.env.PUBLIC_URL}/icons/forwarding.png`} alt="Hostel Icon" width={24} />
          {showIconNames && <span className="icon-name">Student Record</span>}
        </div>
        <div
          className={`icon-container ${
            activeTab === "logout" ? "active" : ""
          }`}
          onClick={handleLogout}
          data-tooltip ="Logout"
        >
          <img src={`${process.env.PUBLIC_URL}/icons/logout.png`} alt="Hostel Icon" width={24} />
          {showIconNames && <span className="icon-name">Logout</span>}
        </div>
      </div>

      <div className="content">
        <div className="top-bar">
        <h4  style={{ fontFamily: 'Comic Sans MS' }}>Energy Monitoring System for <b style={{ color: "#dc2e2e"}}>Sawangi Campus</b></h4>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              borderRadius: '4px',
              padding: '5px',
            }}
          >
          
            
            {error && <p style={{ color: 'red' }}>{error}</p>}

{weatherData && (
  <div className="weather">
  <p>
    🗓️ {getCurrentDateTime()}
  </p>
  <p>
    <img src={weatherData.current.condition.icon} alt="Weather Icon" width="30" height="30"></img>Temp: <b>{weatherData.current.temp_c}°C</b>  <b>{weatherData.current.condition.text}</b>, Hum: <b>{weatherData.current.humidity}</b>, UV: <b>{weatherData.current.uv}</b>
  </p>
</div>

)}
            
          </div>
        </div>
          
          <img src="JNMC_LOGO.png" alt="Right Image" width="50" height="50"/>
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
