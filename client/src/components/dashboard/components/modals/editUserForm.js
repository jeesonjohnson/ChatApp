import React, { Component } from 'react';
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
        const userData = {
            id: "5eca648150b7441e705e1617",
            email: "me@email.com",
            password: "Memail123"
        }
        axios.patch(`/users/${store.getState().user._id}`,{userData})
        .then(res => {
            console.log(res.data.data)
        }).catch(err => {
            console.log("Server error" + err)
        })
    }
   

    render() {
        
        return(
            <div className={this.props.classes.paper}>
                <Typography component="h1" variant="h5" color="inherit" noWrap>Account Details</Typography>
                <Divider />
                <Grid container >
                    <Grid container item xs={12} md={12} lg={12}>
                    <TextField id="name" label="Name" onChange = {this.handleChange} />  
                    <TextField id="email" label="Email" onChange = {this.handleChange}/>
                    </Grid>

                    <Grid item xs={12} md={8} lg={9}>
                    <TextField id="current_password" label="Current Password" onChange = {this.handleChange}/>
                    <TextField id="new_password" label="New Password" onChange = {this.handleChange}/>
                    <TextField id="confirm_password" label="Confirm Password" onChange = {this.handleChange}/>
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