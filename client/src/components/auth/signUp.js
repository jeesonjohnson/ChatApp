import React, { Component } from "react";
import { Link } from "react-router-dom";
import './Auth.css';
import CompanySignUpModal from './components/signUpCompanyModal.js';
import UserSignUpModal from './components/signUpUserModal.js';
import Navbar from "../layout/Navbar.js";
import Footer from "../layout/Footer.js";

class Register extends Component {  
  render() {
    return (
      <div id="body">
        <Navbar/>
        <div style={{ height: "75vh" }} className="container valign-wrapper">
          <div className="col s12 row">
            <div className="col s12 center-align">
              <h4><b>Register</b> below</h4>
              <p className="grey-text text-darken-1">Already have an account? <Link to="/login">Log in</Link></p>
              <p className="flow-text grey-text text-darken-1">Please select the type of account</p>
              <br />
              <div className="col s6">
                <CompanySignUpModal/>
              </div>
              <div className="col s6">
                <UserSignUpModal/>
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}

export default Register;