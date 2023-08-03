import React, { useState, useEffect, useRef } from 'react';
import { create as am4coreCreate, useTheme as am4coreUseTheme } from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from "@amcharts/amcharts4/core";
import { fetchHosts, fetchMeters, fetchData_csv } from "./api";

import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

const LineChart_csv = () => {


  const [selectedMeter, setSelectedMeter] = useState('');
  const [meters, setMeters] = useState([]);
  const [hosts, setHosts] = useState([]);

  const [isLoadingHosts, setIsLoadingHosts] = useState(false);
  const [isLoadingMeters, setIsLoadingMeters] = useState(false);

  const chartRef = useRef(null);
  const [data, setData] = useState([]);
  const [selectedColumnsY, setSelectedColumnsY] = useState([]);
  const [selectedColumnsYName, setSelectedColumnsYName] = useState([]);
  const [selectedColumnX, setSelectedColumnX] = useState(0); // Column index for x-axis
  const [selectedColumnY, setSelectedColumnY] = useState([]); // Default column indices for y-axis
  const [SelectedDeviceName2, setSelectedDeviceName] = useState("");
  const [SelectedDevice2Name, setSelectedDevice2Name] = useState("");

  const [SelectedHostName2, setSelectedHostName] = useState("");
  const [selectedHost, setSelectedHost] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true); // New state variable for loading screen
  const [selectedDevice, setSelectedDevice] = useState("");
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
  
  const handleColumnYChange = (event) => {
    const deviceName = event.target.options[event.target.selectedIndex].text;
    const selectedOptions = Array.from(event.target.selectedOptions);
    const selectedValues = selectedOptions.map((option) => option.value);
    const selectedNames = selectedOptions.map((option) => option.getAttribute('name'));
    setSelectedDeviceName(deviceName);
    setSelectedColumnsY(selectedValues);
    setSelectedColumnsYName(selectedNames);
  };
  console.log("SelectedDeviceName2 for kw",SelectedDeviceName2)
  const deviceNames = SelectedDeviceName2.split(',');

  // Assign values to separate variables
  const variable1 = deviceNames[0];
  const variable2 = deviceNames[1];
  const variable3 = deviceNames[2];
  const variable4 = deviceNames[3];


  console.log(variable2)
  // ...
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
  



  const onDeviceChange = (event) => {
    const deviceName = event.target.options[event.target.selectedIndex].text;
    const device = event.target.value;
    setSelectedDevice2Name(deviceName);
    setSelectedDevice(device);
  };
  const handleColumnXChange = (event) => {
    setSelectedColumnX(parseInt(event.target.value));
  };


  
  // const handleHostChange = (event) => {
  //   setSelectedHost(event.target.value);
  // };

  const handleDeviceChange = (event) => {
    setSelectedDevice(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  useEffect(() => {
    fetchData_csv(selectedHost, selectedDate, selectedDevice )
      .then((data) => {
        setData(data);
      setIsLoadingData(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoadingData(false);
      });
  }, [selectedDevice, selectedDate]);
  
  
  useEffect(() => {
    if (data.length > 0) {
      const chart = am4core.create("chartdiv_g", am4charts.XYChart);
  
      // Enable drag-to-zoom
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.behavior = 'zoomX'; // Enable zooming horizontally

      const updateChartData = () => {
  const updatedData = data.map((row) => {
    const dateTimeString = row[selectedColumnX];
    const [datePart, timePart] = dateTimeString.split(' ');

    const [hours, minutes] = timePart.split(':');
    const formattedTime = `${hours}:${minutes}`;

    const columnIndices = selectedColumnsY[0].split(',').map((column) => parseInt(column));

    const yValues = columnIndices.map((index) => parseFloat(row[index]));
    console.log("columnIndices", columnIndices)

    const hasNonNullValue = yValues.some((value) => value !== null && !isNaN(value));

    if (hasNonNullValue) {
      const nonNullValues = yValues.map((value) => (value !== null && !isNaN(value)) ? [value] : null);
      console.log("the first ", nonNullValues[0]);

      // Print the elements inside columnIndices
      const elements = columnIndices.map((index) => row[index]);
      console.log("Elements inside columnIndices:", elements);

      return {
        c: columnIndices,
        x: formattedTime,
        y: nonNullValues[0],
        y1: nonNullValues[1],
        y2: nonNullValues[2],
        y3: nonNullValues[3],
      };
    }

    return null;
  }).filter((dataPoint) => dataPoint !== null);

  chart.data = updatedData;
};

      
        
      updateChartData();
      console.log("c",'c')
      const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = 'x';
      // categoryAxis.title.text = 'X-axis';
  
      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

      // valueAxis.title.text = 'Y-axis';
  
const series = chart.series.push(new am4charts.LineSeries());
series.dataFields.categoryX = 'x';
series.dataFields.valueY = 'y';
series.strokeWidth = 2;
series.minBulletDistance = 30; // Increase the value to increase the distance
series.tooltipText = "{y}";
series.fill = am4core.color("#28a745");
series.stroke = am4core.color("#28a745");
series.name = variable1;
  // Set the legend name for the series
      
      

      const series1 = chart.series.push(new am4charts.LineSeries());
      series1.strokeWidth = 2;
      series1.minBulletDistance = 10;
      series1.dataFields.categoryX = 'x';
      series1.dataFields.valueY = 'y1';
      series1.tooltipText = "{y1}";
      series1.fill = am4core.color("#ef4040");
      series1.stroke = am4core.color("#ef4040");
      series1.name = variable2;
      

      const series2 = chart.series.push(new am4charts.LineSeries());
      series2.strokeWidth = 2;
      series2.minBulletDistance = 10;
      series2.dataFields.categoryX = 'x';
      series2.dataFields.valueY = 'y2';
      series2.tooltipText = "{y2}";
      series2.fill = am4core.color("#ffc107");
      series2.stroke = am4core.color("#ffc107");
      series2.name=variable3;

      const series3 = chart.series.push(new am4charts.LineSeries());
      series3.strokeWidth = 2;
      series3.minBulletDistance = 10;
      series3.dataFields.categoryX = 'x';
      series3.dataFields.valueY = 'y3';
      series3.tooltipText = "{y3}";
      series3.fill = am4core.color("#008FFB");
      series3.stroke = am4core.color("#008FFB");
      series3.name = variable4;


      const title = chart.titles.create();
      title.text = SelectedHostName2+" / "+SelectedDevice2Name+ " - "+ selectedDate;
      title.fontSize = 20;
      title.marginBottom = 20;


  
      chart.legend = new am4charts.Legend();
      chart.legend.useDefaultMarker = true;
      chart.legend.position = "bottom";  
      return () => {
        chart.dispose();
      };
    }
  }, [data,selectedColumnX, selectedColumnsY]);
  
  
  

  return (
    <div>
      <div style={{ display: "flex",  marginBottom: "10px",marginTop: "2vh",marginLeft: "2vw"}}>
      <div style={{ marginBottom: "10px" }}>
  <label htmlFor="columnSelectY" style={{ fontWeight: "bold", display: "block" }}>
    Parameters:
  </label>
  <select
    id="columnSelectY"
    value={selectedColumnsY}
    onChange={handleColumnYChange}
    style={{
      padding: "5px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      outline: "none",
      marginRight: "15px",
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
    }}
  >
          <option value="">Select Parameters</option>
          <option value={['4', '5', '6', '7']}>kW_Total, R-phase, Y-phase, B-phase</option>
          <option value={['8', '9', '10', '11']}>VAR_Total, R-phase, Y-phase, B-phase</option>
    <option value={['12', '13', '14', '15']}>PF_Ave, R-phase, Y-phase, B-phase</option>
    <option value={['16', '17', '18', '19']}>VA_total, R-phase, Y-phase, B-phase</option>
    <option value={['20', '21', '22', '23']}>VLL_average, R-phase, Y-phase, B-phase</option>
    <option value={['24', '25', '26', '27']}>VLN_average,  R-phase, Y-phase, B-phase</option>
    <option value={['28', '29', '30', '31']}>Current_Average, R-phase, Y-phase, B-phase</option>
    <option value={['46', '47', '48']}>Voltage-R-Harm, Voltage-Y-Harm, Voltage-B-Harm</option>
    <option value={['49', '50', '51']}>Current-R-Harm, Current-Y-Harm, Current-B-Harm</option>
    
     <option value="32">Frequency</option>
     <option value="33">kWh_Received</option>
     <option value="34">VAh_Received</option>
     <option value="35">VARh_Ind._Received</option>
     <option value="36">VARh_Cap._Received</option>
     <option value="37">kWh_Delivered</option>
     <option value="38">VAh_Delivered</option>
     <option value="39">VARh_Ind._Delivered</option>
     <option value="40">VARh_Cap._Delivered</option>
     <option value="41">Reserved</option>
     <option value="42">Reserved</option>
     <option value="43">Reserved</option>
     <option value="44">Reserved</option>
     <option value="45">Reserved</option>

     <option value={['52', '53', '54']}>kWh received Phase-R, Phase-Y, Phase-B</option>
     <option value={['55', '56', '57']}>kVAh received Phase-R, Phase-Y, Phase-B</option>
     <option value={['58', '59', '60']}>kVArh inductive received Phase-R, Phase-Y, Phase-B</option>
     <option value={['61', '62', '63']}>kVArh capacitive received Phase-R, Phase-Y, Phase-B</option>
     <option value={['64', '65', '66']}>PF average received Phase-R, Phase-Y, Phase-B</option>
     <option value={['67', '68', '69']}>A average received Phase-R, Phase-Y, Phase-B</option>
     <option value={['70', '71', '72']}>kWh delivered Phase-R, Phase-Y, Phase-B</option>
     <option value={['73', '74', '75']}>kVAh delivered Phase-R, Phase-Y, Phase-B</option>
     <option value={['76', '77', '78']}>kVArh inductive delivered Phase-R, Phase-Y, Phase-B</option>
     <option value={['79', '80', '81']}>kVArh capacitive delivered Phase-R, Phase-Y, Phase-B</option>
  </select>
</div>
<div style={{ marginBottom: "10px" }}>
  <label htmlFor="select_host" style={{ fontWeight: "bold", display: "block" }}>
    Host:
  </label>
  <select
    id="select_host"
    value={selectedHost}
    onChange={handleHostChange}
    style={{
      padding: "5px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      outline: "none",
      fontFamily: "Arial, sans-serif",
      marginRight: "15px",
      fontSize: "14px",
      minWidth: "200px", // Adjust the width as needed
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
<div style={{ marginBottom: "10px" }}>
  <label htmlFor="select_device" style={{ fontWeight: "bold", display: "block" }}>
    Device:
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
      fontFamily: "Arial, sans-serif",
      marginRight: "15px",
      fontSize: "14px",
      minWidth: "200px", // Adjust the width as needed
    }}
  ><option value="">Select Meter</option>
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

     
<div style={{ marginBottom: "10px" }}>
  <label htmlFor="datePicker" style={{ fontWeight: "bold", display: "block" }}>
    Date:
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
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
    }}
  />
</div>

</div>

<div>
      {isLoadingData ? ( 
        <div className="loading">Loading...</div>
      ) : (
        <div id="chartdiv_g" style={{ width: '92vw', height: "74vh"}} />
      )}
    </div>      
  </div>
  );
};

export default LineChart_csv;
