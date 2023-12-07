import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns"; // If you're using date-fns
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { saveAs } from "file-saver"; // For downloading the file
import { utils, writeFile } from "xlsx"; // For Excel file generation
import "./billing_report.css";
import { fetchHostel, fetch_billing_Report,fetchRooms } from "./api";
import BASE_URL from "./api";

am4core.useTheme(am4themes_animated);

const Billing_report = () => {
  const [chartData, setChartData] = useState([]);
  const [selectedHost, setSelectedHost] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");
  const [SelectedDeviceName2, setSelectedDeviceName] = useState("");
  const [reportUrl, setReportUrl] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedDate2, setSelectedDate2] = useState(new Date().toISOString().slice(0, 10));

  const formattedDate = format(new Date(selectedDate), 'dd-MM-yyyy');
  const iframeRef = useRef(null);
  const [hosts, setHosts] = useState([]);
  const [HostName, setHostName] = useState("");
  const [selectedYear, setSelectedYear] = useState(0); // Initialize with an appropriate default value
  const [selectedMonth, setSelectedMonth] = useState(0); // Initialize with an appropriate default value
  const [selectedRate, setSelectedRate] = useState("14"); // Initialize with an appropriate default value
  const [selectedMeter, setSelectedMeter] = useState('');
  const [meters, setMeters] = useState([]);
  const [isLoadingHosts, setIsLoadingHosts] = useState(false);
  const [isLoadingMeters, setIsLoadingMeters] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // New state variable for loading status
  const [initialIframeHeight, setInitialIframeHeight] = useState(null);
  const [SelectedHostName2, setSelectedHostName] = useState("");
  const [SelectedDevice2Name, setSelectedDevice2Name] = useState("");




  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoadingHosts(true);
        const hostsData = await fetchHostel();
        setHosts(hostsData);
        setIsLoadingHosts(false);
      } catch (error) {
        console.error("Error fetching hosts:", error);
        setIsLoadingHosts(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchMetersByHost = async () => {
      try {
        setIsLoadingMeters(true);
        const metersData = await fetchRooms(selectedHost);
        setMeters(metersData);
        setIsLoadingMeters(false);
      } catch (error) {
        console.error("Error fetching meters:", error);
        setIsLoadingMeters(false);
      }
    };

    if (selectedHost) {
      fetchMetersByHost();
    }
  }, [selectedHost]);



  const downloadPdf = async () => {
    try {
      const iframe = iframeRef.current;
  
      if (iframe) {
        // Save the initial height
        setInitialIframeHeight(iframe.style.height);
  
        const contentDocument = iframe.contentDocument || iframe.contentWindow.document;
  
        // Get the full height of the content
        const contentHeight = contentDocument.body.scrollHeight;
  
        // Set the height of the iframe to match the content height
        iframe.style.height = `${contentHeight}px`;
  
        // Wait for a short delay to ensure the iframe height is updated
        await new Promise((resolve) => setTimeout(resolve, 100));
  
        const canvas = await html2canvas(contentDocument.body, { scrollY: -window.scrollY });
  
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'px', [canvas.width, canvas.height]);
        pdf.addImage(imgData, 'PNG', 0, 0);
  
        // Reset the height to the initial height after generating the PDF
        iframe.style.height = initialIframeHeight;
  
        pdf.save(`${selectedHost}_${selectedYear}_${selectedMonth}_Bill.pdf`);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
  
  
  
  
  const handleHostChange = (event) => {
    const selectedOption = event.target.value;
    const selectedOptionName = event.target.options[event.target.selectedIndex].text;

    setSelectedHost(selectedOption);
    setSelectedMeter('');
    setSelectedHostName(selectedOptionName);

    if (selectedOption) {
      fetchRooms(selectedOption);
    } else {
      setMeters([]);
    }
  };

  const onDeviceChange = (event) => {
    const deviceName = event.target.options[event.target.selectedIndex].text;
    const device = event.target.value;
    setSelectedDevice2Name(deviceName);
    setSelectedDevice(device);
  };


  useEffect(() => {
    const fetchDataFromApi = async () => {
      
      setIsLoading(true); // Set loading status to true

      try {
        const data = await fetch_billing_Report(
          selectedHost,
     
          selectedDate,
          selectedDate2,

          selectedRate
        );
        console.log(data);
        setChartData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false); // Set loading status to false
      }
    };
    fetchDataFromApi();
  }, [ selectedHost,selectedDate2,selectedRate,selectedDate]);

  const onGenerateReport = () => {
    const url = generateReportUrl(selectedHost,  formattedDate);
    setReportUrl(url);
  };

    // Access the first row's second_diff_value and last_diff_value
    const firstRow = chartData.length > 0 ? chartData[0] : null;
  const lastRow = chartData.length > 0 ? chartData[chartData.length - 1] : null;
  const firstSecondDiffValue = firstRow ? firstRow.first_wh_R : null;
  const lastLastDiffValue = lastRow ? lastRow.last_wh_R : null;
  
  const handleDeviceChange = (event) => {
    setSelectedDevice(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleDateChange2 = (event) => {
    setSelectedDate2(event.target.value);
  };
  
  
 
 
  const generateReportUrl = () => {
    if (!selectedHost ||  !selectedDate2 || !selectedRate || !selectedDate || !selectedDevice) {
      // Return null if any of the required parameters is missing
      return null;
    }
  
    const url = `${BASE_URL}/billing-report/${selectedHost}/${selectedDevice}/${selectedDate}/${selectedDate2}/${selectedRate}`;
    return url;
  };
  

  useEffect(() => {
    const url = generateReportUrl();
  
    // Only set the report URL if all required parameters are available
    if (url) {
      setReportUrl(url);
    }
  }, [selectedRate, selectedHost, selectedDate,selectedDate2,selectedDevice]);
  
  

  return (
    <div>
      <div style={{ display: "flex",  marginBottom: "10px",marginTop: "2vh",marginLeft: "2vw"}}>
     
      <div style={{width:"15vw",alignItems: "center", marginRight: "10px",backgroundColor: "rgb(156 152 255)",padding: "5px", borderRadius: "10px"  }}>
      <label htmlFor="select_host" style={{ marginRight: '10px', fontWeight: 'bold', fontFamily: 'Comic Sans MS',color:"#ffffff" }}>
  Select Hostel: 
</label>
      <select id="select_host" value={selectedHost} onChange={handleHostChange}style={{
      padding: "5px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      outline: "none",
      fontFamily: "Comic Sans MS",
      fontSize: "14px",
      minWidth: "200px", // Adjust the width as needed
    }}>
      <option value="">Select Hostel</option>
        {isLoadingHosts ? (
          <option value="" disabled>Loading hosts...</option>
        ) : (
          hosts.map(host => (
            <option key={host.client_id} value={host.client_id}>
              {host.hostel_id}
            </option>
          ))
        )}
        
  </select>
      </div>
      <div style={{ alignItems: "center", marginRight: "2px", backgroundColor: "rgb(97 194 194)", padding: "2px", borderRadius: "10px" }}>
          <label htmlFor="select_device" style={{ fontWeight: "bold", display: "block" }}>
            <span style={{ fontFamily: "Comic Sans MS", color: "#ffffff" }}>Room:</span>
          </label>

          <select
            id="select_device"
            value={selectedDevice}
            onChange={onDeviceChange}
            style={{
              padding: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              outline: "none",
              fontFamily: "Comic Sans MS",
              marginRight: "15px",
              fontSize: "13px",
              minWidth: "200px", // Adjust the width as needed
            }}
          >
            <option value="">Select Room</option>
            {isLoadingMeters ? (
              <option value="" disabled>Loading Rooms...</option>
            ) : (
              meters.map(meter => (
                <option key={meter.room_no} value={meter.room_no}>
                  {meter.room_no}
                </option>
              ))
            )}
          </select>
        </div>
      
      <div style={{ width:"10vw", alignItems: "center", marginRight: "10px",backgroundColor: "rgb(200 96 224 / 79%)",padding: "5px", borderRadius: "10px"}}>
<label htmlFor="datePicker" style={{ marginRight: "10px", fontWeight: "bold",color:"#003c96" }}>
  <span style={{ fontFamily: "Comic Sans MS",color:"#ffffff" }}>Start Date:</span> 
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
<div style={{  width:"10vw",alignItems: "center", marginRight: "10px",backgroundColor: "rgb(200 96 224 / 79%)",padding: "5px", borderRadius: "10px"}}>
<label htmlFor="datePicker" style={{ marginRight: "10px", fontWeight: "bold",color:"#003c96" }}>
  <span style={{ fontFamily: "Comic Sans MS",color:"#ffffff" }}>End Date:</span> 
</label>

  <input
    type="date"
    id="datePicker"
    value={selectedDate2}
    onChange={handleDateChange2}
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
<div style={{ alignItems: "center",width:"6vw", marginRight: "10px",backgroundColor: "rgb(200 96 224 / 79%)",padding: "5px", borderRadius: "10px" }}>
      <label htmlFor="datePicker" style={{ marginRight: "10px", fontWeight: "bold" }}>
  <span style={{ fontFamily: "Comic Sans MS",color:"#ffffff" }}>Rate:</span> 
</label>
        <input
          type="number"
          value={selectedRate}
          onChange={(e) => setSelectedRate(Number(e.target.value))}
          style={{
            padding: "5px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            outline: "none",
            fontFamily: "Comic Sans MS",
            fontSize: "14px",
            width:"100%",
          }}
        />
      </div>
      {/* <button onClick={downloadPdf}>Download PDF</button> } */}
      {/* <div className="hostel_button" onClick={downloadPdf} data-tooltip="Hostel Report">
              <div className="hostel_button-wrapper">
                <div className="text">Download</div>
                <span className="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="2em" height="2em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"></path></svg>
                </span>
              </div>
            </div> */}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center", // Center the chart horizontally
          marginTop: "2vh",
          marginLeft: "2vw",
          marginRight: "2vw",
        }}
      >
      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          {reportUrl && (
        <>
          <iframe ref={iframeRef} src={reportUrl} style={{ width: "100%", // Set the chart width to 100% of its container
              height: "72vh",
              backgroundColor: "#ffffff",
              borderRadius: "10px",}} title="Report" />
        </>
      )}
        </>
      )}
    </div>
        </div>
  );
};

export default Billing_report;