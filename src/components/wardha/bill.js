import React, { useState } from "react";
import Billing_report from "./billing_report";
import Billing_report_monthly from "./billing_report_monthly";
// import './bill.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Bill = () => {
    const [isComponent1Displayed, setIsComponent1Displayed] = useState(false);

    const handleToggle1 = () => {
        setIsComponent1Displayed(true);
      };
    
      const handleToggle2 = () => {
        setIsComponent1Displayed(false);
      };
    return (
        <div>
            <div className="container-fluid d-flex ">
       <button class="btn btn-info m-1" onClick={handleToggle1}> <p class="h6">Monthly</p></button>
      <button  class="btn btn-info m-1" onClick={handleToggle2}> <p class="h6">Summary</p></button>
      </div>
      <div >
      {isComponent1Displayed ? <Billing_report /> : <Billing_report_monthly />}
      </div></div>
    );
}

export default Bill;