import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import store from '../../../store';
import axios from 'axios';

import {Timeline, TimelineEvent} from 'react-event-timeline'

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';


import AnnouncementIcon from "@material-ui/icons/Announcement";
import Sync from '@material-ui/icons/Sync';

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

function Announcements ( props ) {   
    const classes = useStyles();
    const [events, setEvents] = React.useState([]);
    const [load, setLoad] = React.useState(false);

    useEffect(() => {
        if(!load){
            loadEvents()
        }
    }, []);

    const loadEvents = () => {
        axios.get(`/announcements/`, {params:{
            company_id: store.getState().selectedCompany,
            }
        })
        .then(res =>(
            setEvents(res.data.data)
        ))
    }

    const addEvent = (e) => {
        if(e.key === "Enter"){

            let admin = false
            
            for(var i in store.getState().allSelectedWorkspaceData.admins){
                if(store.getState().allSelectedWorkspaceData.admins[i] === store.getState().user._id){
                    admin = true
                }
            }
        
            axios.post(`/announcements/`, {
                company_id: store.getState().selectedCompany,
                user: store.getState().user.name + " (" + store.getState().user.email + ")",
                isOwner: store.getState().user.owner,
                isAdmin: admin,
                time: Date.now(),
                content: document.getElementById('message_text').value
            })
            .then(res =>(
                setEvents(res.data.data)
            ))
        }
    };

    const deleteEvent = (event_id) => {
        axios.delete(`/announcements/${event_id}`, {params: {company_id: store.getState().selectedCompany}})
        .then(res => {
            setEvents(res.data.data)
        })
    }

    const loadTimeLineEvent = (event) => {
        var userColour = "#a0f3d7"
        
        if(event.isAdmin){
            userColour = "#725bda"
        }

        if(event.isOwner){
            userColour = "#f1b92e"
        }

        return(
        <TimelineEvent
        createdAt={event.time} 
        subtitle={event.user}
        subtitleStyle={{color: '#2962FF'}}
        
        icon={<AnnouncementIcon  style={{color: userColour}}/>} 
        iconColor={userColour} 
        buttons={<AnnouncementIcon onClick={e => deleteEvent(e.currentTarget.parentNode.parentNode.parentNode.childNodes[2].childNodes[0].id)} />}
        bubbleStyle={{backgroundColor: '#2f3136'}}

        contentStyle={{backgroundColor: '#2f3136',color: '#fff'}}
        >
            <Typography id={event._id} variant="caption text" >{event.content}</Typography>
        </TimelineEvent>
        )
    }

    //Reset the new collection name text field when click detected outside textfield
    function unfocusCollection(e){
        e.value = ""
    }

    return(
        <div>        
            <IconButton style={{ marginLeft:15}} onClick={loadEvents}>
                <Sync style={{color: "#f1b92e"}}/>
            </IconButton>

            <TextField id="message_text" size="small" onBlur={e => unfocusCollection(e.currentTarget)} fullwidth onKeyPress={e => addEvent(e)} label="Message" variant="outlined" color="secondary" style={{display:"inline-block"}}/>

            <Timeline  lineStyle={{background: '#a0f3d7',width: 3}}>
                {events.map((event) =>(
                        loadTimeLineEvent(event)
                ))}
            </Timeline>
        </div>)
}

    
const mapStateToProps = state => {
    return {selectedCompany: state.selectedCompany, companies: state.companies, workspaces: state.workspaces, selectedWorkspace: state.selectedWorkspace, taskCollectionIDs: state.taskCollectionIDs, workspaceTaskCollections: state.workspaceTaskCollections}
}
      
const mapDispatchToProps = dispatch => {
    return { dispatch }
}
      
export default connect(mapStateToProps, mapDispatchToProps)(Announcements)