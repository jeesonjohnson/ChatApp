import React, { Component } from "react";
import '../Auth.css';
import { Modal, Button } from 'react-materialize';
import CompanyForm from './signUpCompany.js';

class SignUpCompany extends Component {
   
  render() {
    return (
      <Modal
      style={{backgroundColor: "#36393f"}}
      bottomSheet={false}
      id="Modal-0"
      open={false}
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
        startingTop: '4%'
      }}
      trigger={<Button node="button" className="btn btn-large waves-effect waves-light hoverable blue accent-3 pulse">COMPANY</Button>}
      >
      <CompanyForm/>  
    </Modal>
    );
  }

  
}

export default SignUpCompany;