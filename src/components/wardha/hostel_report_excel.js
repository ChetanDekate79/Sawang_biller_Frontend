import React from 'react';
import './hostel_report_excel.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Hostel_report_excel = () => {
  const handleClick = () => {
    window.location.href = "https://sawangibiller.hetadatain.com/Hostel_Report.xlsx";
  }

  return (
    <div className="container-fluid  text-center d-flex justify-content-center align-items-center">
      <div className="bg-white p-4 my-10" style={{width: "50%"}}>
        <h4>Hostel Daily Report</h4>
        <button className='btn btn-primary' onClick={handleClick}><h6>Download</h6></button>
      </div>
    </div>
  );
}

export default Hostel_report_excel;
