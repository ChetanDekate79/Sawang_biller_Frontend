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
import { fetchHostel, fetch_billing_Report_monthly,fetchRooms } from "./api";
import BASE_URL from "./api";
import { createPortal } from 'react-dom';


am4core.useTheme(am4themes_animated);

const Monthly_bill = () => {
  const [chartData, setChartData] = useState([]);
  const [selectedHost, setSelectedHost] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");
  const [SelectedDeviceName2, setSelectedDeviceName] = useState("");
  const [reportUrl, setReportUrl] = useState("");
  const [selectedDate2, setSelectedDate2] = useState(new Date().toISOString().slice(0, 10));
  const [data, setData] = useState([]);
  const iframeRef = useRef(null);
  const [hosts, setHosts] = useState([]);
  const [HostName, setHostName] = useState("");
  const [selectedRate, setSelectedRate] = useState("14"); // Initialize with an appropriate default value
  const [selectedCA, setSelectedCA] = useState("10"); // Initialize with an appropriate default value
  const [initialIframeHeight, setInitialIframeHeight] = useState(null);
  const [selectedMeter, setSelectedMeter] = useState('');
  const [meters, setMeters] = useState([]);
  const [isLoadingHosts, setIsLoadingHosts] = useState(false);
  const [isLoadingMeters, setIsLoadingMeters] = useState(false);
  const [SelectedHostName2, setSelectedHostName] = useState("");
  const [SelectedDevice2Name, setSelectedDevice2Name] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  // const formattedDate = format(new Date(selectedDate), 'dd-MM-yyyy');
  const [selectedYear, selectedMonth] = selectedDate.split('-');

  const PrintableContent = ({ content }) => {
    const container = document.getElementById('print-container');
  
    if (container) {
      return createPortal(content, container);
    }
  
    return null;
  };
  

  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
  
    const content = document.getElementById('print-container');
  
    html2canvas(content, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 size
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      // Set the PDF size to match the content size
      pdf.internal.pageSize.height = imgHeight;
      pdf.internal.pageSize.width = imgWidth;
  
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  
      // Save the PDF with a dynamic filename
      pdf.save(`${selectedHost}-${selectedDevice}-${selectedYear}-${selectedMonth}.pdf`);
    });
  };
  



  const handleDownloadCSV = () => {
    // Find the table element in the DOM
    const tableElement = document.getElementById('print_table');
  
    // Check if the table element exists
    if (!tableElement) {
      console.error('Table element not found');
      return;
    }
  
    // Extract headers from the table
    const headers = Array.from(tableElement.querySelectorAll('thead th')).map(th => th.innerText);
  
    // Extract data rows from the table body
    const bodyRows = Array.from(tableElement.querySelectorAll('tbody tr')).map(row => {
      const rowData = Array.from(row.querySelectorAll('td')).map(td => td.innerText);
      return rowData.join(',');
    });
  
    // Extract data rows from the table footer
    const footerRows = Array.from(tableElement.querySelectorAll('tfoot tr')).map(row => {
      const rowData = Array.from(row.querySelectorAll('td')).map(td => td.innerText);
      return rowData.join(',');
    });
  
    // Combine body and footer rows
    const allRows = [...bodyRows, ...footerRows];
  
    // Create CSV content
    const csvContent = [headers.join(','), ...allRows].join('\n');
  
    // Create a Blob with the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
  
    // Create a temporary anchor element and trigger the download
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${selectedHost}-${selectedDevice}-${selectedYear}-${selectedMonth}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  

  


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
    // Set isLoading to true before making the API request
    setIsLoading(true);

    fetch(`${BASE_URL}/monthly-bill/${selectedHost}/${selectedDevice}/${selectedMonth}/${selectedYear}/${selectedRate}/${selectedCA}`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setIsLoading(false); // Set isLoading to false when data is received
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false); // Set isLoading to false in case of an error
      });
  }, [selectedDevice, selectedDate,selectedHost,selectedRate,selectedCA]);



  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };



  return (
    <div>
      <div style={{ display: "flex",  marginBottom: "10px",marginTop: "2vh",marginLeft: "2vw"}}>
     
      <div style={{ width:'15vw', alignItems: "center", marginRight: "10px",backgroundColor: "rgb(156 152 255)",padding: "5px", borderRadius: "10px"  }}>
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
      <div style={{ width:'12vw', alignItems: "center", marginRight: "10px",backgroundColor: "rgb(200 96 224 / 79%)",padding: "5px", borderRadius: "10px"}}>
<label htmlFor="datePicker" style={{ marginRight: "10px", fontWeight: "bold",color:"#003c96" }}>
  <span style={{ fontFamily: "Comic Sans MS",color:"#ffffff" }}>Month:</span> 
</label>

  <input
    type="month"
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

      <div style={{ width:'10vw', alignItems: "center",width:"10vw", marginRight: "10px",backgroundColor: "rgb(200 96 224 / 79%)",padding: "5px", borderRadius: "10px" }}>
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
      <div style={{ width:'10vw', alignItems: "center",width:"10vw", marginRight: "10px",backgroundColor: "rgb(200 96 224 / 79%)",padding: "5px", borderRadius: "10px" }}>
      <label htmlFor="datePicker" style={{ marginRight: "10px", fontWeight: "bold" }}>
  <span style={{ fontFamily: "Comic Sans MS",color:"#ffffff" }}>Common Area:</span> 
</label>
        <input
          type="number"
          value={selectedCA}
          onChange={(e) => setSelectedCA(Number(e.target.value))}
          style={{
            padding: "5px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            outline: "none",
            fontFamily: "Comic Sans MS",
            fontSize: "14px",
            width: "100%",
          }}
        />
      </div>

      </div>
       
      <div className='container-fluid rounded mt-2 border border-dark border-3'  style={{ maxHeight: '70vh', overflowY: 'auto',backgroundColor:"white" }}>
        <div className="container-fluid d-flex flex-nowrap">
  <button className="btn btn-danger p-2 m-2" onClick={handleDownloadPDF} >
    Download PDF
  </button>
  <button className="btn btn-success p-2 m-2" onClick={handleDownloadCSV} >
    Download CSV
  </button>
</div>


{isLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (

        <div id="print-container">
      <div className="container-fluid d-flex justify-content-between" style={{ backgroundColor: "#d1fec5" }}>
        <img src="log.png" alt="Logo Right" className="img-fluid" style={{ width: "120px", alignSelf: "center" }} />
        <img src="JNMC_LOGO.png" alt="Logo Right" className="img-fluid" style={{ width: "80px", alignSelf: "center" }} />
      </div>

      <div className="container-fluid mt-3" style={{fontFamily: "Comic Sans MS"}}>
        <h2 className="text-center" >{selectedHost} - {selectedDevice} Report for Date {selectedYear}/{selectedMonth} </h2>
        {/* <p className="text-center">The .table-bordered class adds borders on all sides of the table and the cells:</p> */}

        <table id="print_table" className="table table-bordered">
          <thead class="table-success">
            <tr>
              <th>Hostel</th>
              <th>Room No.</th>
              <th>Student Id</th>
              <th>Total Units</th>
              <th>Rate</th>
              <th>Sum</th>
              <th>Common Area (Rs)</th>
              <th>Total Days</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
          {Object.values(data).map((item) => (
  <tr key={item.student_id}>
    <td>{item.hostel_id}</td>
    <td>{item.room_no}</td>
    <td>{item.student_id}</td>
    <td>{item.Units}</td>
    <td>{item.rate}</td>
    <td>{item.SUM}</td>
    <td>{item.common_area}</td>
    <td>{item.total_days}</td>
    <td>{item.Total_Amount}</td>
  </tr>
))}
          </tbody>
          <tfoot className="table-secondary" style={{ fontWeight: 'bold' }}>
          <tr>
            <td>Total</td>
            <td></td>
            <td></td>
            <td>{data.sum_units}</td>
            <td></td>
            <td>{data.sum_total}</td>
            <td></td>
            <td></td>
            <td>{data.Amount_total}</td>
          </tr>
  </tfoot>
        </table>
      </div>
    </div>
   )}
    </div>
        </div>
  );
};

export default Monthly_bill;