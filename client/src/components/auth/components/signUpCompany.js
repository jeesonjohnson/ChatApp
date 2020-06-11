import React, { Component } from "react";
import reactDOM from 'react-dom';
import { Link } from "react-router-dom";
import axios from 'axios';
import '../Auth.css';
import BackButton from './signUpBackButton.js';
import handleValidation from './validation.js';

class SignUpCompany extends Component {
  constructor() {
    super();
    this.state = {
      avatar: "",
      company_name: "",
      owner: true,
      name: "",
      email: "",
      password: "",
      password_confirm: "",
      errors: {
        companies: '',
        avatar: '',
        owner: '',
        name: '',
        email: '',
        password: '',
        password_confirm: '',
      }
    };
    this.baseState = this.state;
    console.log(window.location.href);
  }
  
  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
  
  onSubmit = e => {
    e.preventDefault();
    
    const newUser = {
      avatar: this.state.avatar,
      company_name: this.state.company_name,
      owner: this.state.owner,
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password_confirm: this.state.password_confirm,
    };

    // console.log(newUser);

    if( handleValidation(newUser, true)[0]){
      axios.post('/users/signup', {newUser})
      .then(res => {
        console.log(res)
        if(res.data.status === "success"){
          window.location.href = '/login'
        }
      })
      console.log("Valid Created")
  }
  else{
    this.setState({ errors: handleValidation(newUser, true)[1] });
    console.log("Errors");
    console.log(this.state.errors);
    reactDOM.render(this.state.errors.companies, document.getElementById('company-validate'));
    reactDOM.render(this.state.errors.name, document.getElementById('name-validate'));
    reactDOM.render(this.state.errors.email, document.getElementById('email-validate'));
    reactDOM.render(this.state.errors.password, document.getElementById('password-validate'));
    reactDOM.render(this.state.errors.password_confirm, document.getElementById('error-validate'));
  }    
};

  render() {
    const { errors } = this.state;
    return (
      <div id="form"  className="container">
        <div className="row">
          <div className="col s8 offset-s2">
            <BackButton />
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4 style={{ letterSpacing:"0.5px", paddingBottom: 0}}>
                Register A Company Account
              </h4>
              <p className="grey-text text-darken-1" id="">Already have an account? <Link to="/login">Log in</Link></p>
            </div>
            <form noValidate onSubmit={this.onSubmit}>
                <div className="input-field col s12">
                    <input onChange={this.onChange} value={this.state.company_name} error={errors.company_name} id="company_name" type="text"/>
                    <label htmlFor="company_name">Company Name</label>
                </div>
                <div id="company-validate"></div>
                <div className="input-field col s12">
                <input onChange={this.onChange} value={this.state.name} error={errors.name} id="name" type="text"/>
                <label htmlFor="name">Name</label>
              </div>
              <div id="name-validate"></div>
              <div className="input-field col s12">
                <input onChange={this.onChange} value={this.state.email} error={errors.email} id="email" type="email"/>
                <label htmlFor="email">Email</label>
              </div>
              <div id="email-validate"></div>
              <div className="input-field col s12">
                <input onChange={this.onChange} value={this.state.password} error={errors.password} id="password" type="password"/>
                <label htmlFor="password">Password</label>
              </div>
              <div id="password-validate"></div>

              <div className="input-field col s12">
                <input onChange={this.onChange} value={this.state.password_confirm} error={errors.password_confirm} id="password_confirm" type="password"/>
                <label htmlFor="password_confirm">Confirm Password</label>
              </div>
              <div id="error-validate"></div>
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <p>By signing up you are agreeing to our <a target="_blank" href="https://www.termsandconditionsgenerator.com/live.php?token=Tjxm9ZVrLi5BoetvhgEE7rA8qcKFkMrc" style={{ color: 'red' }}><b>Terms and Conditions</b></a></p>
                <button style={{width: "150px", borderRadius: "3px", letterSpacing: "1.5px", marginTop: "1rem"}} type="submit" className="btn btn-large waves-effect waves-light hoverable blue accent-3">Sign up</button>
              </div>              
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUpCompany;