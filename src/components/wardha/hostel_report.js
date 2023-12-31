import React, { useState, useEffect,useRef } from "react";
import { format } from 'date-fns'; // If you're using date-fns
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import './hostel_report.css'
import { fetchHostel, fetch_hostel_Report } from "./api";
import BASE_URL from "./api";

am4core.useTheme(am4themes_animated);

const Hostel_report = () => {
  const [chartData, setChartData] = useState([]);
  const [selectedHost, setSelectedHost] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");
  const [SelectedDeviceName2, setSelectedDeviceName] = useState("");
  const [reportUrl, setReportUrl] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const formattedDate = format(new Date(selectedDate), 'dd-MM-yyyy');
  const iframeRef = useRef(null);
  const [hosts, setHosts] = useState([]);
  const [HostName, setHostName] = useState("");

  const [selectedMeter, setSelectedMeter] = useState('');
  const [meters, setMeters] = useState([]);

  const [isLoadingHosts, setIsLoadingHosts] = useState(false);
  const [isLoadingMeters, setIsLoadingMeters] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true); // New state variable for loading status

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

  const downloadPdf = async () => {
    try {
      const iframe = iframeRef.current;
  
      if (iframe) {
        const contentDocument = iframe.contentDocument || iframe.contentWindow.document;
        const canvas = await html2canvas(contentDocument.body);
  
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
        pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth - 20, pdfHeight - 20);
        pdf.save('Hoste_Report.pdf');
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
    setHostName(selectedOptionName);


    // if (selectedOption) {
    //   fetch_pump_Meters(selectedOption);
    // } else {
    //   setMeters([]);
    // }
  };

  const onDeviceChange = (event) => {
    const deviceName = event.target.options[event.target.selectedIndex].text;

    setSelectedDevice(event.target.value);
    
    setSelectedDeviceName(deviceName);
  };
  console.log("SelectedDeviceName2",SelectedDeviceName2)


  useEffect(() => {
    const fetchDataFromApi = async () => {
      setIsLoading(true); // Set loading status to true

      try {
        const data = await fetch_hostel_Report(
          selectedHost,
          selectedDate,
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
  }, [ selectedHost, selectedDate]);

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
 
 
  const generateReportUrl = () => {
    const url = `${BASE_URL}/hostel_consumption_report?client_id=${selectedHost}&date=${selectedDate}`;
    return url;
  };


  useEffect(() => {
    const url = generateReportUrl();
    setReportUrl(url);
  }, [ selectedHost, selectedDate]);
  

  return (
    <div>
      <div style={{ display: "flex",  marginBottom: "10px",marginTop: "2vh",marginLeft: "2vw"}}>
     
      <div style={{display: "flex", alignItems: "center", marginRight: "10px",backgroundColor: "rgb(156 152 255)",padding: "5px", borderRadius: "10px"  }}>
      <label htmlFor="select_host" style={{ marginRight: '10px', fontWeight: 'bold', fontFamily: 'Comic Sans MS',color:"#ffffff" }}>
  Select Host: 
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
      <option value="">Select Host</option>
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
      <div style={{ display: "flex", alignItems: "center", marginRight: "10px",backgroundColor: "rgb(200 96 224 / 79%)",padding: "5px", borderRadius: "10px" }}>
      <label htmlFor="datePicker" style={{ marginRight: "10px", fontWeight: "bold" }}>
  <span style={{ fontFamily: "Comic Sans MS",color:"#ffffff" }}>Select Date:</span> 
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
      {/* <button onClick={downloadPdf}>Download PDF</button> */}
      <div className="hostel_button" onClick={downloadPdf} data-tooltip="Hostel Report">
              <div className="hostel_button-wrapper">
                <div className="text">Download</div>
                <span className="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="2em" height="2em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"></path></svg>
                </span>
              </div>
            </div>
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
              height: "75vh",
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

export default Hostel_report;