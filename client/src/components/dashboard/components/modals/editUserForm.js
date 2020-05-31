import React, { Component } from 'react';
import ReactDOM from 'react-dom'

import '../../../auth/Auth.css';

import store from './../../../../store/index'
import Button from '@material-ui/core/Button';

import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import axios from 'axios' 

class EditUser extends Component
{
    constructor(){
        super()
        this.state = {
            name: "",
            email: "",
            current_password: "",
            new_password: "",
            confirm_password: "",
            delete_name: ""
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value 
        })
        
    }

    handleClick = () => {
        if(this.state.new_password.length < 8){
            ReactDOM.render("New password requires minimum of 8 characters", document.getElementById('error-display'))
        }else if(this.state.new_password !== this.state.confirm_password){
            ReactDOM.render("Passwords do not match", document.getElementById('error-display'))
        }else if(this.state.current_password === this.state.new_password){
            ReactDOM.render("New password cannot be same as the current password", document.getElementById('error-display'))
        }else{
            const userData = {
                email: this.state.email,
                current_password: this.state.current_password,
                new_password: this.state.new_password
            }
            axios.patch(`/users/${store.getState().user._id}`,userData)
            .then(res => {
                if(res.data.status === "success"){
                    console.log(res.data.data)
                    axios('/users/logout')
                    .then(res => {
                        window.location.href = "/"
                        window.alert("Password changed successfully.\nPlease log back in again")
                    })
                }

            }).catch(err => {
                ReactDOM.render("Credentials provided for the account is invalid", document.getElementById('error-display'))
            })
        }
       
    }
   

    render() {
        
        return(
            <div className={this.props.classes.paper}>
                <Typography component="h1" variant="h5" color="inherit" noWrap>Account Details</Typography>
                <Divider />
                <div><h6 id= "error-display" style = {{color: "#c91714"}}></h6></div>
                <Grid container >
                    <Grid container item xs={12} md={12} lg={12}>
                    <TextField id="email" label="Email" onChange = {this.handleChange}/>
                    </Grid>

                    <Grid item xs={12} md={8} lg={9}>
                    <TextField id="current_password" label="Current Password" onChange = {this.handleChange}/>
                    <TextField type= "password" id="new_password" label="New Password" onChange = {this.handleChange}/>
                    <TextField type= "password" id="confirm_password" label="Confirm Password" onChange = {this.handleChange}/>
                    </Grid>

                    <Grid item xs={12} md={8} lg={9}>
                    <Button onClick= {this.handleClick} variant="contained" color="secondary">Confirm</Button>
                    </Grid>

                    <Grid item xs={12} md={8} lg={9}>
                    <Divider style={{marginTop:20, marginBottom:20}}/>
                    <TextField id="standard-basic" label="NAME" />
                    <Button variant="contained" style={{backgroundColor:"#af0000", color:"#ffffff"}}>Delete Account</Button>
                    </Grid>
                </Grid>
                </div>
                

        )

       
    }

}

export default EditUser