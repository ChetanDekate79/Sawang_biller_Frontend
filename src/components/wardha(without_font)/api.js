import axios from 'axios';
import bcrypt from 'bcryptjs';


const BASE_URL = "http://127.0.0.1:8001/api"; // Replace with your API base URL

// const BASE_URL = "https://wardha.hetadatain.com/api"; // Replace with your API base URL




export const fetchHosts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/host`);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to fetch hosts");
  }
};

export const fetchMeters = async (host) => {
  try {
    const response = await fetch(`${BASE_URL}/device?client_id=${host}`);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to fetch meters");
  }
};

export const fetchData_bar = async (hostId, deviceId, date) => {
  try {
    const response = await fetch(
      `${BASE_URL}/jnmc_graph?host=${hostId}&device_id=${deviceId}&date=${date}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
};

export const fetchData_csv = async (hostId, date, deviceId ) => {
  try {
    const formattedDate = date.split("-").reverse().join("-");

    const response = await fetch(
      `${BASE_URL}/csv-data/${hostId}/${formattedDate}/${deviceId}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
};

export const fetchReport = async (selectedHost, selectedDevice, selectedDate, Hostname, selectedDeviceName2) => {
  const apiUrl = `${BASE_URL}/api/jnmc_report?host=${selectedHost}&device_id=${selectedDevice}&date=${selectedDate}&hostname=${Hostname}&devicename=${selectedDeviceName2}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const generateReportUrl = (selectedHost, selectedDevice, selectedDate, Hostname, selectedDeviceName2) => {
  const apiUrl = `${BASE_URL}/jnmc_report?host=${selectedHost}&device_id=${selectedDevice}&date=${selectedDate}&hostname=${Hostname}&devicename=${selectedDeviceName2}`;
  return apiUrl;
};

export const loginapi = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/login`);
    return response.data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export const decryptPassword = (plaintextPassword, encryptedPassword) => {
  return bcrypt.compareSync(plaintextPassword, encryptedPassword);
};