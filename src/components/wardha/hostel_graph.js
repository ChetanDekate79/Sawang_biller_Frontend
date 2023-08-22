import React, { useState, useEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { fetchHosts, fetchMeters, fetchData_bar,hostel_graph } from "./api";
import './hostel_graph.css'

am4core.useTheme(am4themes_animated);

const Hostel_graph = () => {
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
      setIsLoadingData(true);
    
      hostel_graph(selectedHost, selectedDate)
        .then((data) => {
          const chartDataWithTime = data.map((dataPoint) => ({
            dt_time: new Date(dataPoint.dt_time).toLocaleTimeString([], {
              // hour: "2-digit",
              // minute: "2-digit",
              // hour12: false,
            }),
            sum_ryb: dataPoint.sum_ryb,
            sum_total: dataPoint.sum_total,
            common_area: dataPoint.common_area,
            hour: dataPoint.HOUR,
          }));
          setChartData(chartDataWithTime);
          setIsLoadingData(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setIsLoadingData(false);
        });
    }, [selectedHost, selectedDate]);
    

    useEffect(() => {
      if (!isLoadingData && chartData.length > 0) { // Check if chartData has been loaded
        const chart = am4core.create("chartdiv", am4charts.XYChart);
  
        chart.data = chartData;

    // Create X axis
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    // Configure category axis
    categoryAxis.dataFields.category = "hour";
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.truncate = true;
    categoryAxis.renderer.labels.template.maxWidth = 120;
    categoryAxis.renderer.labels.template.fontSize = 14;
    categoryAxis.fontFamily = "Comic Sans MS";

 // Create Y axis
 const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
 valueAxis.renderer.minWidth = 50;
//  valueAxis.title.text = "Values";
 valueAxis.renderer.grid.template.location = 0;
 valueAxis.fontFamily = "Comic Sans MS";   

    // Create series for "sum_ryb" column
    const seriesRyb = chart.series.push(new am4charts.ColumnSeries());
    seriesRyb.dataFields.valueY = "sum_ryb";
    seriesRyb.dataFields.categoryX = "hour";
    // seriesRyb.strokeWidth = 2;
    seriesRyb.minBulletDistance = 10;
    seriesRyb.tooltipText = "Room Kwh: {sum_ryb}";
    seriesRyb.name = "Room Kwh";
    seriesRyb.columns.template.fill = am4core.color("#438be7"); // Blue
    seriesRyb.columns.template.stroke = am4core.color("#438be7");
    seriesRyb.stacked = true;

    // Create series for "common_area" column
    const seriesCommon = chart.series.push(new am4charts.ColumnSeries());
    seriesCommon.dataFields.valueY = "common_area";
    seriesCommon.dataFields.categoryX = "hour";
    seriesCommon.strokeWidth = 2;
    seriesCommon.minBulletDistance = 10;
    seriesCommon.tooltipText = "Common Area: {common_area}";
    seriesCommon.name = "Common Area";
    seriesCommon.columns.template.fill = am4core.color("#edff8d"); // Red
    seriesCommon.columns.template.stroke = am4core.color("#edff8d");
    seriesCommon.stacked = true;


 // Create series for "sum_total" column
    const seriesTotal = chart.series.push(new am4charts.ColumnSeries());
    seriesTotal.dataFields.valueY = "sum_total";
    seriesTotal.dataFields.categoryX = "hour";
    seriesTotal.strokeWidth = 2;
    seriesTotal.minBulletDistance = 10;
    seriesTotal.tooltipText = "Net Kwh: {sum_total}";
    seriesTotal.name = "Net Kwh";
    seriesTotal.columns.template.fill = am4core.color("#293e59"); // Green
    seriesTotal.columns.template.stroke = am4core.color("#293e59");
    seriesTotal.columns.template.fillOpacity = 1; // Adjust the opacity value as needed
    seriesTotal.columns.template.strokeOpacity = 1; // Adjust the opacity value as needed
    seriesTotal.stacked = false;



    // Add legend
    chart.legend = new am4charts.Legend();
    chart.legend.position = "bottom";
    chart.legend.fontFamily = "Comic Sans MS";
    
    
    // Add title
    const title = chart.titles.create();
    title.text = selectedHostName+ " - " + selectedDate;
    title.fontSize = 20;
    title.marginBottom = 20;
    title.fontFamily = "Comic Sans MS";
    

    // Add chart cursor
    chart.cursor = new am4charts.XYCursor();

    return () => {
      chart.dispose();
    };
  }
}, [chartData, isLoadingData, selectedDate, selectedHostName, SelectedDeviceName2]);


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
      <div>
      {isLoadingData ? ( 
        <div className="loading">Loading...</div>
      ) : (
        <div id="chartdiv" style={{  marginLeft: "1vw",width: '83vw', height: "75vh", backgroundColor: "#ffffff", borderRadius: "10px"}} />
      )}
    </div>
    </div>
    
  );
};

export default Hostel_graph;