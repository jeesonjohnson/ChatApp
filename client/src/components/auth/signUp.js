import React, { Component } from "react";
import { Link } from "react-router-dom";
import './Auth.css';
import BackButton from "./components/homeBackButton.js";

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
                            <Link to="/sign_up/company" style={{width: "140px", borderRadius: "3px", letterSpacing: "1.5px"}} className="btn btn-large waves-effect waves-light hoverable blue accent-3 pulse">Company</Link>
                        </div>
                        <div className="col s6">
                            <Link to="/sign_up/user" style={{width: "140px", borderRadius: "3px", letterSpacing: "1.5px"}} className="btn btn-large btn-flat waves-effect white black-text pulse">User</Link>
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