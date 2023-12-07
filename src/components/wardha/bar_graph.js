import React, { useState, useEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { fetchHosts, fetchMeters, fetchData_bar } from "./api";
import './bar_graph.css'

am4core.useTheme(am4themes_animated);

const Bar_graph = () => {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedClientName, setSelectedClientName] = useState('');
  const [hosts, setHosts] = useState([]);

  const [selectedMeter, setSelectedMeter] = useState('');
  const [meters, setMeters] = useState([]);

  const [isLoadingHosts, setIsLoadingHosts] = useState(false);
  const [isLoadingMeters, setIsLoadingMeters] = useState(false);

  const [chartData, setChartData] = useState([]);
  const [selectedHost, setSelectedHost] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [SelectedDeviceName2, setSelectedDeviceName] = useState("");
  const [selectedHostName, setSelectedHostName] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(true); // New state variable for loading screen
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

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

  useEffect(() => {
    const fetchMetersByHost = async () => {
      try {
        setIsLoadingMeters(true);
        const metersData = await fetchMeters(selectedHost);
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

  const onDeviceChange = (event) => {
    const deviceName = event.target.options[event.target.selectedIndex].text;
    const device = event.target.value;
    setSelectedDeviceName(deviceName);
    setSelectedDevice(device);
  };



    // Fetch data from Node.js API and set it to chartData state variable
    useEffect(() => {
      setIsLoadingData(true); // Set loading state to true before fetching data
    
      fetchData_bar(selectedHost, selectedDevice, selectedDate)
        .then((data) => {
          setChartData(data);
          setIsLoadingData(false); // Set loading state to false after data is fetched
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setIsLoadingData(false); // Set loading state to false if an error occurs
        });
    }, [selectedHost,selectedDevice, selectedDate]);



  useEffect(() => {
    // Convert date strings to Date objects and update the dt_time field to hh:mm format
    const chartDataWithTime = chartData.map((dataPoint) => ({
      ...dataPoint,
      dt_time: new Date(dataPoint.dt_time).toLocaleTimeString([], {
        hour: "2-digit",
        hour12: false,
      }),
    }));
  
    // Print the dt_time values
    chartDataWithTime.forEach((dataPoint) => {
      console.log(dataPoint.dt_time);
    });
  
    // Create chart instance
    const chart = am4core.create("chartdiv", am4charts.XYChart);
  
    // Add data to chart
    chart.data = chartDataWithTime;

    // Create X axis
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
   // Configure category axis
  categoryAxis.dataFields.category = "dt_time";
  categoryAxis.renderer.minGridDistance = 30; // Adjust this value as needed
  // categoryAxis.renderer.labels.template.rotation = -45;
  categoryAxis.renderer.labels.template.horizontalCenter = "right";
  categoryAxis.renderer.labels.template.verticalCenter = "middle";
  categoryAxis.renderer.labels.template.truncate = true;
  categoryAxis.renderer.labels.template.maxWidth = 120;
  categoryAxis.renderer.labels.template.fontSize = 14; // Set the desired font size for x-labels
  categoryAxis.fontFamily = "Comic Sans MS";


    // Create Y axis for "value" column
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minWidth = 50;
    valueAxis.title.text = "";
    valueAxis.renderer.grid.template.location = 0;
    valueAxis.fontFamily = "Comic Sans MS";

    // Create Y axis for "value1" column
    const valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis2.renderer.minWidth = 50;
    valueAxis2.title.text = "";
    valueAxis2.renderer.grid.template.location = 0;
    valueAxis2.renderer.opposite = true;

    if (selectedDevice == 31 ){
      const series3 = chart.series.push(new am4charts.ColumnSeries());
      series3.dataFields.valueY = "value0";
      series3.dataFields.categoryX = "dt_time";
      series3.strokeWidth = 2;
      series3.minBulletDistance = 10;
      series3.tooltipText = "{value0}";
      series3.name = "WH R";
      series3.fill = am4core.color("#008FFB");
      series3.stroke = am4core.color("#008FFB");
  
      const series4 = chart.series.push(new am4charts.ColumnSeries());
      series4.dataFields.valueY = "value1";
      series4.dataFields.categoryX = "dt_time";
      series4.strokeWidth = 2;
      series4.minBulletDistance = 10;
      series4.tooltipText = "{value1}";
      series4.fontFamily = "Comic Sans MS";
      series4.name = "WH D";
      series4.fill = am4core.color("#ffc107");
      series4.stroke = am4core.color("#ffc107");
    } else{
// Create series for "value" column
const series = chart.series.push(new am4charts.ColumnSeries());
series.dataFields.valueY = "value2";
series.dataFields.categoryX = "dt_time";
series.strokeWidth = 2;
series.minBulletDistance = 10;
series.tooltipText = "{value2}";
series.name = "WH 1";
series.fill = am4core.color("#2472de");
series.stroke = am4core.color("#2472de");

const series1 = chart.series.push(new am4charts.ColumnSeries());
series1.dataFields.valueY = "value3";
series1.dataFields.categoryX = "dt_time";
series1.strokeWidth = 2;
series1.minBulletDistance = 10;
series1.tooltipText = "{value3}";
series1.name = "WH 2";
series1.fill = am4core.color("#64f7ba");
series1.stroke = am4core.color("#64f7ba");

const series2 = chart.series.push(new am4charts.ColumnSeries());
series2.dataFields.valueY = "value4";
series2.dataFields.categoryX = "dt_time";
series2.strokeWidth = 2;
series2.minBulletDistance = 10;
series2.tooltipText = "{value4}";
series2.name = "WH 3";
series2.fill = am4core.color("#ef4040");
series2.stroke = am4core.color("#ef4040");

    }

    
 

    // Add legend
    chart.legend = new am4charts.Legend();
    chart.legend.useDefaultMarker = true;
    chart.legend.position = "bottom";
    chart.legend.fontFamily = "Comic Sans MS";
    
    
    // Add title
    const title = chart.titles.create();
    title.text = selectedHostName+ " / " +SelectedDeviceName2+ " - " + selectedDate;
    title.fontSize = 20;
    title.marginBottom = 20;
    title.fontFamily = "Comic Sans MS";
    

    // Add chart cursor
    chart.cursor = new am4charts.XYCursor();

    return () =>{
      chart.dispose();
    }
  }, [chartData]);


  const handleHostChange = (event) => {
    const selectedOption = event.target.value;
    const selectedOptionName = event.target.options[event.target.selectedIndex].text;

    setSelectedHost(selectedOption);
    setSelectedMeter('');
    setSelectedHostName(selectedOptionName);


    if (selectedOption) {
      fetchMeters(selectedOption);
    } else {
      setMeters([]);
    }
  };

  const handleMeterChange = (event) => {
    const selectedOption = event.target.value;
    setSelectedMeter(selectedOption);
  };

  const handleDeviceChange = (event) => {
    setSelectedDevice(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };
  
  // const deviceNames = {
  //   40: "JNMC Lecture Feeder",
  //   // Add more mappings for other device values if needed
  // };

 
  return (
    <div>
    <div style={{ display: "flex",  marginBottom: "10px",marginTop: "2vh",marginLeft: "2vw" }}>
        <div style={{display: "flex", alignItems: "center", marginRight: "10px",backgroundColor: "rgb(156 152 255)",padding: "5px", borderRadius: "10px" }}>
        <label htmlFor="select_host" style={{ marginRight: '10px', fontWeight: 'bold', fontFamily: 'Comic Sans MS',color:"#ffffff" }}>
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
          // color:"#003c96",
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

      {/* <p>Selected Client ID: {selectedClientId}</p>
      <p>Selected Client Name: {selectedClientName}</p> */}
    </div>
  

      <div style={{display: "flex", alignItems: "center", marginRight: "10px",backgroundColor: "rgb(97 194 194)",padding: "5px", borderRadius: "10px"}}>
      <label htmlFor="select_device" style={{ marginRight: "10px", fontWeight: "bold", fontFamily: "Comic Sans MS",color:"#ffffff" }}>
  Select Device: 
</label>
      <select id="select_device" value={selectedDevice} onChange={onDeviceChange} style={{
      padding: "5px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      outline: "none",
      fontFamily: "Comic Sans MS",
      fontSize: "14px",
      // color:"#003c96",
      minWidth: "200px", // Adjust the width as needed
    }}>
       <option value="">Select Meter</option>
        {isLoadingMeters ? (
          <option value="" disabled>Loading meters...</option>
        ) : (
          meters.map(meter => (
            <option key={meter.device_id} value={meter.device_id}>
              {meter.device_name}
            </option>
          ))
        )}
      </select>
</div>
<div style={{  display: "flex", alignItems: "center", marginRight: "10px",backgroundColor: "rgb(200 96 224 / 79%)",padding: "5px", borderRadius: "10px"}}>
<label htmlFor="datePicker" style={{ marginRight: "10px", fontWeight: "bold",color:"#003c96" }}>
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
      {isLoadingData ? ( 
        <div className="loading">Loading...</div>
      ) : (
        <div id="chartdiv" style={{ width: "100%", // Set the chart width to 100% of its container
        height: "73vh",
        backgroundColor: "#ffffff",
        borderRadius: "10px"}} />
      )}
    </div>
    </div>
    
  );
};

export default Bar_graph;