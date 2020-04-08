import React, { Component } from "react";
import { Link } from "react-router-dom";

class BackButton extends Component {
  render() {
    return (
        <Link to="/sign_up" className="btn-flat waves-effect">
            <i className="material-icons left">keyboard_backspace</i> Back to Sign Up
        </Link>
    );
  }
}

export default BackButton;