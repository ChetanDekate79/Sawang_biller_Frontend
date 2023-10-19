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

  // console.log("SelectedDeviceName2 for kw", SelectedDeviceName2);
  const deviceNames = SelectedDeviceName2.split(',');

  // Assign values to separate variables
  const variable1 = deviceNames[0];
  const variable2 = deviceNames[1];
  const variable3 = deviceNames[2];
  const variable4 = deviceNames[3];

  // console.log(variable2);

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

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true); // Set loading state to true before fetching data
      try {
        const data = await fetchData_csv(selectedHost, selectedDate, selectedDevice);
        setData(data);
        setIsLoadingData(false); // Set loading state to false after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoadingData(false); // Set loading state to false if an error occurs
      }
    };
  
    fetchData();
  }, [selectedDevice, selectedDate, selectedHost,selectedColumnsY]); // Include selectedDevice, selectedDate, and selectedHost in dependency array
  

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
          // console.log("columnIndices", columnIndices);

          const hasNonNullValue = yValues.some((value) => value !== null && !isNaN(value));

          if (hasNonNullValue) {
            const nonNullValues = yValues.map((value) => (value !== null && !isNaN(value)) ? [value] : null);
            // console.log("the first ", nonNullValues[0]);

            // Print the elements inside columnIndices
            const elements = columnIndices.map((index) => row[index]);
            // console.log("Elements inside columnIndices:", elements);

            return {
              c:  columnIndices,
              x:  formattedTime,
              y:  nonNullValues[0],
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
      console.log("c", 'c');
      const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = 'x';
      categoryAxis.fontFamily = "Comic Sans MS";

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.fontFamily ="Comic Sans MS";

      const series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.categoryX = 'x';
      series.dataFields.valueY = 'y';
      series.strokeWidth = 2;
      series.minBulletDistance = 30; // Increase the value to increase the distance
      series.tooltipText = "{y}";
      series.fill = am4core.color("#28a745");
      series.stroke = am4core.color("#28a745");
      series.name = variable1;

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
      series2.name = variable3;

      const series3 = chart.series.push(new am4charts.LineSeries());
      series3.strokeWidth = 2;
      series3.minBulletDistance = 10;
      series3.dataFields.categoryX = 'x';
      series3.dataFields.valueY = 'y3';
      series3.tooltipText = "{y3}";
      series3.fontFamily = "Comic Sans MS";
      series3.fill = am4core.color("#008FFB");
      series3.stroke = am4core.color("#008FFB");
      series3.name = variable4;

      const title = chart.titles.create();
      title.text = SelectedHostName2 + " / " + SelectedDevice2Name + " - " + selectedDate;
      title.fontSize = 20;
      title.marginBottom = 20;
      title.fontFamily = "Comic Sans MS";

      chart.legend = new am4charts.Legend();
      chart.legend.useDefaultMarker = true;
      chart.legend.position = "bottom";
      chart.legend.fontFamily = "Comic Sans MS";

      return () => {
        chart.dispose();
      };
    }
  }, [data, selectedColumnX, selectedColumnsY]);

  return (
    <div>
      <div style={{ display: "flex", marginBottom: "10px", marginTop: "2vh", marginLeft: "2vh" }}>
        <div style={{ alignItems: "center", marginRight: "2px", backgroundColor: "#e4da85", padding: "2px", borderRadius: "10px" }}>
          <label htmlFor="columnSelectY" style={{ fontWeight: "bold", display: "block", fontFamily: "Comic Sans MS", color: "#ffffff" }}>
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
              fontFamily: "Comic Sans MS",
              fontSize: "13px",
            }}
          >
            <option value="">Select Parameters</option>
            <option value={['3', '4', '5', '6']}>W_Total, Wr, Wy, Wb</option>
            <option value='7'>PF_Ave</option>
            <option value='8'>VA_total</option>
            <option value={['9', '10', '11', '12']}>VLL_average, Vry, Vyb, Vbr</option>
            <option value={['13', '14', '15', '16']}>VLN Average, Vr, Vy, Vb</option>
            <option value={['17', '18', '19', '20']}>Current Total, Ir, Iy, Ib</option>
           <option value="21">Frequency</option>
            <option value="22">Wh_Received</option>
            <option value="23">VAh_Received</option>
            <option value="24">Wh_Delivered</option>

            <option value={['25', '26', '27']}>Wh_Im-R, Wh_Im-Y, Wh_Im-B</option>
          </select>
        </div>
        <div style={{ alignItems: "center", marginRight: "2px", backgroundColor: "rgb(156 152 255)", padding: "2px", borderRadius: "10px" }}>
          <label htmlFor="select_host" style={{ fontWeight: "bold", display: "block", fontFamily: "Comic Sans MS", color: "#ffffff" }}>
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
              fontFamily: "Comic Sans MS",
              marginRight: "15px",
              fontSize: "13px",
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
        <div style={{ alignItems: "center", marginRight: "2px", backgroundColor: "rgb(97 194 194)", padding: "2px", borderRadius: "10px" }}>
          <label htmlFor="select_device" style={{ fontWeight: "bold", display: "block" }}>
            <span style={{ fontFamily: "Comic Sans MS", color: "#ffffff" }}>Device:</span>
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

        <div style={{ alignItems: "center", marginRight: "2px", backgroundColor: "rgb(200 96 224 / 79%)", padding: "2px", borderRadius: "10px" }}>

          <label htmlFor="datePicker" style={{ fontWeight: "bold", display: "block" }}>
            <span style={{ fontFamily: "Comic Sans MS", color: "#ffffff" }}>Date:</span>
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
              fontSize: "13px",
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
          data.length === 0 ? (
          <div className="loading">No data available</div>
        ) : (
          <div id="chartdiv_g" style={{ width: "100%", // Set the chart width to 100% of its container
          height: "75vh",
          backgroundColor: "#ffffff",
          borderRadius: "10px"}} />
        ))}
      </div>
    </div>
  );
};

export default LineChart_csv;
