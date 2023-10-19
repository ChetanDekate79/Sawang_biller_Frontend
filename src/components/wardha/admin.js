import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchHosts, Generate_Hourly_data_all } from "./api";



const Admin = () => {
  const [isLoadingHosts, setIsLoadingHosts] = useState(false);
  const [hosts, setHosts] = useState([]);
  const [selectedHostName, setSelectedHostName] = useState("");
  const [selectedHost, setSelectedHost] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0); // New state variable for loading progress

  const handleHostChange = (event) => {
    const selectedOption = event.target.value;
    const selectedOptionName = event.target.options[event.target.selectedIndex].text;

    setSelectedHost(selectedOption);
    setSelectedHostName(selectedOptionName);
  };

  const handleClick = () => {
    window.location.href = "https://sawangibiller.hetadatain.com/login_data.csv";
  }

  const LoadingSpinner = () => {
    return (<div>
      <div className="spinner-border" role="status">
      </div>
      <p className="h6">Uploading Data for <b>{selectedHost} </b>of Date <b>{selectedDate}</b></p></div>
    );
  };

  // Sort function to sort data based on dt_time
  const sortByTime = (data) => {
    return data.slice().sort((a, b) => a.dt_time.localeCompare(b.dt_time));
  }

  const formatDateToDDMMYYYY = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    setIsLoadingData(true);
    setLoadingProgress(0);

    // Format the date in "dd-mm-yyyy" format
    const formattedDate = formatDateToDDMMYYYY(selectedDate);
    const formattedHost = selectedHost.toLowerCase();

    Generate_Hourly_data_all(formattedHost, formattedDate)
      .then((data) => {
        // ... (rest of the code)
        setIsLoadingData(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoadingData(false);
      });
  }, [selectedHost, selectedDate]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoadingHosts(true);
        const hostsData = await fetchHosts();
        setHosts(hostsData);
        setIsLoadingHosts(false);
      } catch (error) {
        console.error("Error fetching hosts:", error);
        setIsLoadingHosts(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <div className="container-fluid m-2 d-flex justify-content-around" >
      <div>
        <h4>Update Hourly Data from CSV Files</h4>
      <div className="container-fluid d-flex">
        <div style={{ display: "flex", alignItems: "center", marginRight: "10px", backgroundColor: "rgb(156 152 255)", padding: "5px", borderRadius: "10px" }}>
          <label htmlFor="select_host" style={{ marginRight: '10px', fontWeight: 'bold', fontFamily: 'Comic Sans MS', color: "#ffffff" }}>
            Select Host:
          </label>
          <select
            id="select_host"
            value={selectedHost}
            onChange={handleHostChange}
            style={{
              padding: '5px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              outline: 'none',
              fontFamily: 'Comic Sans MS',
              fontSize: '14px',
              minWidth: '200px',
            }}
          >
            <option value="">Select Host</option>
            {isLoadingHosts ? (
              <option value="" disabled>Loading hosts...</option>
            ) : (
              hosts.map(host => (
                <option key={host.client_id} value={host.client_id}>
                  {host.client_name}
                </option>
              ))
            )}
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginRight: "10px", backgroundColor: "rgb(200 96 224 / 79%)", padding: "5px", borderRadius: "10px" }}>
          <label htmlFor="datePicker" style={{ marginRight: "10px", fontWeight: "bold", color: "#003c96" }}>
            <span style={{ fontFamily: "Comic Sans MS", color: "#ffffff" }}>Select Date:</span>
          </label>
          <input
            type="date"
            id="datePicker"
            value={selectedDate}
            onChange={handleDateChange}
            style={{
              padding: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              outline: "none",
              fontFamily: "Comic Sans MS",
              fontSize: "14px",
            }}
          />
        </div>
      </div>
      <div className="container d-flex justify-content-center align-self-center mt-2" >
      {isLoadingData && <LoadingSpinner />}
      </div>
      </div>
      <div className="bg-white p-4 my-10 d-inline-block">
  <h4 className="text-center">Login Data</h4>
  <button className='btn btn-primary' onClick={handleClick}><h6>Download</h6></button>
</div>

    </div>
  );
}

export default Admin;
