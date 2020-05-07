import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import '../Auth.css';
import BackButton from './signUpBackButton.js';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      companies: [],
      avatar: "",
      owner: false,
      name: "",
      email: "",
      password: "",
      password_confirm: "",
      errors: {}
    };
  }
  
  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
  
  onSubmit = e => {
    e.preventDefault();
    const newUser = {
      companies: this.state.companies,
      avatar: this.state.avatar,
      owner: this.state.owner,
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password_confirm: this.state.password_confirm
    };

    axios.post('/users/signup', {newUser})
    .then(res => {
      console.log(res.data.status)
      if(res.data.status === "success"){
        window.location.href = '/login'
      }
    })
  };
  
  render() {
    const { errors } = this.state;
    return (
      <div id="form" className="container">
        <div className="row">
          <div className="col s8 offset-s2">
            <BackButton />
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <h4 style={{ letterSpacing:"0.5px"}}>
                    Register A User Account
                </h4>
              <p className="grey-text text-darken-1">Already have an account? <Link to="/login">Log in</Link></p>
            </div>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="input-field col s12">
                <input onChange={this.onChange} value={this.state.name} error={errors.name} id="name" type="text"/>
                <label htmlFor="name">Name</label>
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
                <input onChange={this.onChange} value={this.state.password_confirm} error={errors.password_confirm} id="password_confirm" type="password"/>
                <label htmlFor="password_confirm">Confirm Password</label>
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