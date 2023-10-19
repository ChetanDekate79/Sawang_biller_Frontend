// Login.js
import React, { useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';
import './Login.css';
import logo from './Login_old.js';
import Top_Bar from './too_bar';
import Sidebar_wardha from './side_bar';
import Sidebar_wardha_icon from './side_bar_icon';
import TopBar from './Top';
import {loginapi2, decryptPassword } from './api';
import 'bootstrap/dist/css/bootstrap.min.css';


function Login2() {
  const [userType, setUserType] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [apiData, setApiData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsButtonDisabled(!e.target.value);
    setErrorMessage('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const loginResponse = await loginapi2(email, password);

      if (loginResponse && loginResponse.message === 'Login successful') {
        setIsLoggedIn(true);
        setUserType(loginResponse.user_type);

      } else {
        setErrorMessage('Invalid email or password');
      }
    } catch (error) {
      console.error('API request failed:', error);
      setErrorMessage('Invalid email or password');
    }
  };
  

  useEffect(() => {
    if (isLoggedIn) {
      // Perform successful login logic here
      console.log('Successful login');

      // Set a timeout to redirect to login after 1 hour (3600000 milliseconds)
      const timeoutId = setTimeout(() => {
        setIsLoggedIn(false);  // Set login status to false after 1 hour
      }, 3600000);

      // Clear the timeout if the component unmounts or user logs out manually
      return () => clearTimeout(timeoutId);
    }
  }, [isLoggedIn]);

  console.log(userType);

  if (isLoggedIn) {
    return (
      <div>
        <Sidebar_wardha_icon userType={userType} />
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="container-xs p-3 bg-white d-flex flex-column" style={{ width: "50vh"}}>
        <img src="JNMC_LOGO.png" alt="Logo" class="img-fluid" style={{ width: "15vh",alignSelf:"center" }} />
        <p className="h3" style={{ fontFamily: 'Comic Sans MS', textAlign: 'center' }}>Datta Meghe Institute of Higher Education & Research</p>
 
        <form onSubmit={handleSubmit} className="form1">
          <input type="email" placeholder="Email" value={email} onChange={handleEmailChange} />
          <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
          <div >
            <button type="submit" class="btn btn-success" disabled={isButtonDisabled}>
             <p class="h6" style={{ alignSelf:"center" }} >Log in</p> 
            </button>
          </div>
          {errorMessage && (
            <div className="error-container">
              <p className="error-message">{errorMessage}</p>
            </div>
          )}
          <p  className='h6'  style={{fontFamily: "Comic Sans MS"}}>Hostel Room Billing System</p>
          <img src="log.png" alt="Logo Right"  class="img-fluid" style={{ width: "15vh",alignSelf:"center" }} />
        </form>
      </div>
      <div className="bottom-bar">
        <p className='h6'>
          © 2023 Copyright: Conceptualized, Designed, Installed & Maintained
          By <b>Heta Datain</b>
        </p>
      </div>
    </div>
  );
}

export default Login2;
