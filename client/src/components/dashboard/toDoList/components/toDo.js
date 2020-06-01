import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import store from '../../../../store';
import axios from 'axios';

import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Checkbox2 from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { Checkbox } from 'react-materialize';

import EditTaskModal from './editTaskModal.js';
import {PieChart, Pie, Cell, Label} from 'recharts';

function Todo ( {classes, collection, todo} ) {    
    const colors = [ "#a0f3d7", "#52776c" ] //Light and Dark teal
    const [taskDetails, setTaskDetails] = React.useState({})
    const [toDoChecked, setToDoChecked] = React.useState(false);
    
    const loadToDoElement = async () => {
        const response = await axios.get('/todo/', { params: { todo_id: todo } })
        .then(res => {
            return res.data.data.todoDetails
        })
        
        setTaskDetails(response)

        if(taskDetails.progress_status === 100){
            setToDoChecked(true)
        }
    }
    
    useEffect( () => {
        loadToDoElement( todo )
        
    }, [])
    
    const loadPieChart = () => {
        const progress_data = [
            {
              "name": "Completed",
              "value": taskDetails.progress_status 
            },
            {
              "name": "In Progress",
              "value": 100 - taskDetails.progress_status
            }
        ]
        
        return(
            <PieChart width={75} height={75} >
                <Pie data={progress_data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={20} outerRadius={30} >
                    <Label value={`${taskDetails.progress_status}%`} offset={0} position="center" />
                    {
                        progress_data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index]} />
                        ))
                    }
                </Pie>
            </PieChart>
        )
    }

    const handleToDoChecked = (event) => {
        setToDoChecked(event.currentTarget.checked);
    };

    return(
    <Paper style={{marginTop: 10, maxWidth:220}} >
        {taskDetails === {} ?
            null
            :
            <Grid container >
                <Grid item container xs={12} className="valign-wrapper" style={{marginLeft:10}} > 
                    <Checkbox item xs={11} checked={toDoChecked} filledIn id={`Checkbox_${todo}`} label={taskDetails.title} onChange={e=> handleToDoChecked(e)} />
                    <EditTaskModal item xs={1} {...{classes, collection, todo}} style={{right:0}} />
                </Grid>

                {!toDoChecked ? 
                    <Grid item xs={12}>
                        {loadPieChart()}
                    </Grid>
                : null}

                {!toDoChecked ?
                    <Grid item xs={12}>
                        <Typography style={{noWrap:"pre", overflow:"auto"}}>{taskDetails.description}</Typography>
                    </Grid>
                : null}

                {!toDoChecked ?
                    <Grid item xs={12} >
                        <MuiPickersUtilsProvider utils={DateFnsUtils} item>
                            <Grid item>
                                <KeyboardDatePicker disabled margin="normal" id="date-picker-dialog" type="datatime-local" label="Start Date" format="dd/MM/yyyy" value={taskDetails.creation_date} />
                            </Grid>
                            <Grid item>
                                <KeyboardDatePicker disabled margin="normal" id="date-picker-dialog" type="datatime-local" label="Due Date" format="dd/MM/yyyy" value={taskDetails.due_date}  />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </Grid>
                : null}

                {!toDoChecked ?
                    <Grid item container xs={12} >
                        <AvatarGroup max={4} xs={12} item>
                            {taskDetails.assigned_users !== undefined ?
                                taskDetails.assigned_users.length > 0 ?
                                    taskDetails.assigned_users.map((name, index) => (
                                        <Avatar alt="assigned_user" src="" style={{width:30, height:30}}>{name[0]}</Avatar>
                                    ))
                                    :
                                    null
                                :
                                null
                            }
                        </AvatarGroup>
                    </Grid>
                : null}

            </Grid>
                
            //, taskDetails.creation_date, taskDetails.due_date, taskDetails.progress_status, taskDetails.description, taskDetails.assigned_users
        }
    </Paper>
)}

const mapStateToProps = state => {
    return {
        selectedCompany: state.selectedCompany, 
        companies: state.companies, 
        workspaces: state.workspaces, 
        selectedWorkspace: state.selectedWorkspace, 
        taskCollectionIDs: state.taskCollectionIDs, 
        workspaceTaskCollections: state.workspaceTaskCollections
    }
}
      
const mapDispatchToProps = dispatch => {
    return { dispatch }
}
      
export default connect(mapStateToProps, mapDispatchToProps)(Todo)