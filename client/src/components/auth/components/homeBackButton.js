import React, { Component } from "react";
import { Link } from "react-router-dom";

class BackButton extends Component {
  render() {
    return (
        <Link to="/" className="btn-flat waves-effect">
            <i className="material-icons left"></i> Back to Home
        </Link>
    );
  }
}

export default BackButton;