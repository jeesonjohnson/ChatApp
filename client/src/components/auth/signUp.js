import React, { Component } from "react";
import { Link } from "react-router-dom";
import './Auth.css';
import BackButton from "./components/homeBackButton.js";
import CompanySignUpModal from './components/signUpCompanyModal.js';
import UserSignUpModal from './components/signUpUserModal.js';

class Register extends Component {  
  render() {
    return (
      <div id="body" className="container">
        <div className="row">
            <div className="col s8 offset-s2">
                <BackButton/>
                <div className="row">
                    <div className="col s12 center-align">
                        <h4>Register</h4>
                        <p className="flow-text grey-text text-darken-1">Please select the type of account</p>
                        <p className="grey-text text-darken-1">Already have an account? <Link to="/login">Log in</Link></p>
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
        </div>
      </div>
    );
  }
}

export default Register;