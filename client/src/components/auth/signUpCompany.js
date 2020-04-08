import React, { Component } from "react";
import { Link } from "react-router-dom";
import './Auth.css';
import BackButton from './components/signUpBackButton.js';

class Register extends Component {
  constructor() {
    super();
    this.state = {
        company_name: "",
        name: "",
        email: "",
        password: "",
        password2: "",
        errors: {}
    };
  }
  
  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
  
  onSubmit = e => {
    e.preventDefault();const newUser = {
        company_name: this.state.company_name,
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        password2: this.state.password2
    };
    console.log(newUser);
  };
  
  render() {
    const { errors } = this.state;
    return (
      <div id="body" className="container">
        <div className="row">
          <div className="col s8 offset-s2">
            <BackButton />
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4 style={{ "letter-spacing":"0.5px"}}>
                Register A Company Account
              </h4>
              <p className="grey-text text-darken-1">Already have an account? <Link to="/login">Log in</Link></p>
            </div>
            <form noValidate onSubmit={this.onSubmit}>
                <div className="input-field col s12">
                    <input onChange={this.onChange} value={this.state.name} error={errors.name} id="company_name" type="text"/>
                    <label htmlFor="name">Company Name</label>
                </div>
                <div className="input-field col s12">
                    <input onChange={this.onChange} value={this.state.name} error={errors.name} id="name" type="text"/>
                    <label htmlFor="name">User Name</label>
                </div>
                <div className="input-field col s12">
                    <input onChange={this.onChange} value={this.state.email} error={errors.email} id="email" type="email"/>
                    <label htmlFor="email">Email</label>
                </div>
                <div className="input-field col s12">
                    <input onChange={this.onChange} value={this.state.password} error={errors.password} id="password" type="password"/>
                    <label htmlFor="password">Password</label>
                </div>
                <div className="input-field col s12">
                    <input onChange={this.onChange} value={this.state.password2} error={errors.password2} id="password2" type="password"/>
                    <label htmlFor="password2">Confirm Password</label>
                </div>
                <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                    <button style={{width: "150px", borderRadius: "3px", letterSpacing: "1.5px", marginTop: "1rem"}} type="submit" className="btn btn-large waves-effect waves-light hoverable blue accent-3">Sign up</button>
                </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;