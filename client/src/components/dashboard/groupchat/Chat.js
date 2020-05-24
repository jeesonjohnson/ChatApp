import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import queryString from "query-string";
import store from '../../../store';


//None react plugins
import axios from 'axios';
import io from "socket.io-client";

//Styling
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import './chat.css';

// <div className="overall">
//     {console.log(props)}
//     <div>Chat ID: {props._id}</div>
//     <div>Chat Title: {props.title}</div>
//     <div>Workspace ID: {props.workspaceID}</div>
//     {props.users.length > 0 ?
//     props.users.map((user) =>(
//         <div>{user}</div>
//     ))
//     :
//     null
//     }
// </div>



let socket;


function Chat (props) {
    const [name,setName] = useState("");
    const [room,setRoom] = useState("");

    useEffect(()=>{
        const userName = store.getState().user.name;
        const chatID = props._id;
        const chatTitle = props.title;
        
        //Connect to backend
        let SERVERADDRESS = 'localhost:8082';
        socket = io(SERVERADDRESS);
        
        //Initiate chat stream
        socket.emit('chatjoin',{userName,chatID},()=>{

        });

        //Disconnecting a socket connection
        return ()=>{
            socket.emit('disconnect');
            socket.off()
        }

    },[props])




    return(
        <Container maxWidth="sm">

        </Container>
        // <div className="overall">
        //     {console.log(props)}
        //     <div>Chat ID: {props._id}</div>
        //     <div>Chat Title: {props.title}</div>
        //     <div>Workspace ID: {props.workspaceID}</div>
        //     {props.users.length > 0 ?
        //     props.users.map((user) =>(
        //         <div>{user}</div>
        //     ))
        //     :
        //     null
        //     }
        // </div>
        )
}












const mapStateToProps = state => {
    return {selectedCompany: state.selectedCompany, companies: state.companies, workspaces: state.workspaces, selectedWorkspace: state.selectedWorkspace, taskCollectionIDs: state.taskCollectionIDs, workspaceTaskCollections: state.workspaceTaskCollections}
}
      
const mapDispatchToProps = dispatch => {
    return { dispatch }
}
      
export default connect(mapStateToProps, mapDispatchToProps)(Chat)