import React, { Component } from "react";
import {  Button } from 'react-materialize';

class BackButton extends Component {
  render() {
    return (
        <Button modal="close" style={{margin: 10}}>Close</Button>
    );
  }
}

export default BackButton;