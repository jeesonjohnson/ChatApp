import React, { Component } from "react";
import '../Auth.css';
import { Modal, Button } from 'react-materialize';
import UserForm from './signUpUser.js';

class Register extends Component {
  render() {
    return (
      <Modal
      className=""
      style={{backgroundColor: "#36393f"}}
      id="Modal-0"
      open={false}
      fixedFooter={false}
      bottomSheet={false}
      options={{
        dismissible: true,
        endingTop: '10%',
        inDuration: 250,
        onCloseEnd: null,
        onCloseStart: null,
        onOpenEnd: null,
        onOpenStart: null,
        opacity: 0.5,
        outDuration: 250,
        preventScrolling: true,
        startingTop: '0%'
      }}
      trigger={<Button node="button" className="btn btn-large btn-flat waves-effect waves-light white black-text pulse" >USER</Button>}
      >
      
      <UserForm/>

    </Modal>
    );
  }



}
export default Register;