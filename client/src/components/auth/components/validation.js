import React, { Component } from "react";
export default function handleValidation(newUser, isCompany){
    // let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    let company=newUser.companies;
    let email=newUser.email;
    let password=newUser.password;
    let password_confirm=newUser.password_confirm;
    if(isCompany){
    //Company
    if(!company){
       formIsValid = false;
       errors["companies"] = "Cannot be empty";
    }
  
    if(typeof company !== "undefined"){
       if(!company.match(/^[a-zA-Z]+$/)){
          formIsValid = false;
          errors["companies"] = "Only letters";
       }        
    }};
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    //Email
    if(!re.test(String(email).toLowerCase())){
       formIsValid = false;
       errors["email"] = "Cannot be empty";
    }
    if(password!=password_confirm){    
    // if(fields["password"].value!=fields["password_confirm"].value){
      formIsValid = false;
      errors["password"] = "Passwords do not match";
    }
    if(password.length<8){
      formIsValid = false;
      errors["password"] =errors["password"]+ "Passwords does not satisfy min length of 8 criteria";
    }
    if(typeof email !== "undefined"){
       let lastAtPos = email.lastIndexOf('@');
       let lastDotPos = email.lastIndexOf('.');
  
       if (!(lastAtPos < lastDotPos && lastAtPos > 0 && email.indexOf('@@') == -1 && lastDotPos > 2 && (email.length - lastDotPos) > 2)) {
          formIsValid = false;
          errors["email"] = "Email is not valid";
        }
   }  
  
//    this.setState({errors: errors});
//    this.state.errors=errors;
   return [formIsValid, errors];
  };