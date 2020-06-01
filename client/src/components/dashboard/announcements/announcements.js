import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import store from '../../../store';
import axios from 'axios';

import {Timeline, TimelineEvent} from 'react-event-timeline'

import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import AnnouncementIcon from "@material-ui/icons/Announcement";
import HighlightOff from '@material-ui/icons/HighlightOff';
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

    const testEvents = [
        {time: "2020-09-12 10:06 PM", user: "Jack", isOwner: false, isAdmin: false, content: "This is a test message"},
        {time: "2020-09-12 10:08 PM", user: "Jack", isOwner: false, isAdmin: false, content: "This is a test message"},
        {time: "2020-09-12 10:10 PM", user: "Jim", isOwner: true, isAdmin: false, content: "This is a test message"},
        {time: "2020-09-12 10:20 PM", user: "June", isOwner: false, isAdmin: true, content: "This is a test message"}
    ]

    const loadTimeLineEvent = (event) => {
        var userColour = "#a0f3d7"
        
        if(event.isAdmin){
            userColour = "#725bda"
        }

        if(event.isOwner){
            userColour = "#f1b92e"
        }
        
        return(
        <TimelineEvent // title="John Doe sent a SMS" 
        createdAt={event.time} 
        subtitle={event.user}
        subtitleStyle={{color: '#2962FF'}}
      
        icon={<AnnouncementIcon style={{color: userColour}}/>} 
        iconColor={userColour} 
        bubbleStyle={{backgroundColor: '#2f3136'}}

        contentStyle={{backgroundColor: '#2f3136',color: '#fff'}}
        >
            <Typography variant="caption text" >{event.content}</Typography>
        </TimelineEvent>
        )
    }

    return(
        <div>
            <IconButton style={{ marginLeft:15}}>
                <Sync style={{color: "#f1b92e"}}/>
            </IconButton>

            <Timeline  lineStyle={{background: '#a0f3d7',width: 3}}>
                {testEvents.map((event) =>(
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