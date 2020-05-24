import React, { Component, useState, useEffect } from 'react';

import { connect } from 'react-redux';
import store from '../../../../store';
import axios from 'axios';

import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import {PieChart, Pie, Cell, Label} from 'recharts';

function Todo ( props ) {    
    const [taskDetails, setTaskDetails] = useState({})
    const [toDoChecked, setToDoChecked] = React.useState(false);
    const [selectedDate, setSelectedDate] = React.useState(new Date(Date.now()));

    const loadToDoElement = async () => {
        const response = await axios.get('/todo/', { params: { todo_id: props.todo } })
        .then(res => {
            return res.data.data.todoDetails
        })
        
        setTaskDetails(response)
    }

    useEffect( () => {
        loadToDoElement( props.todo )
    }, [])


    
      const data02 = [
        {
          "name": "Completed",
          "value": taskDetails.progress_status 
        },
        {
          "name": "In Progress",
          "value": 100 - taskDetails.progress_status
        }
      ];

    //   const colors = [ "#f1b92e", "#725bda" ] //Purple and yellow
    const colors = [ "#a0f3d7", "#52776c" ] //Light and Dark teal

    return(
    <Paper style={{marginTop: 10}} xs={4}>
        {taskDetails === {} ?
            null
            :
            <Grid >
                <Grid item container >
                    <Typography item className="valign-wrapper">
                        <Checkbox item checked={taskDetails.progress_status === 100 ? true : false} onChange={e => setToDoChecked(e.target.checked)} inputProps={{ 'aria-label': 'primary checkbox' }} label="tes"/>
                        
                        {taskDetails.title}
                        
                        <IconButton> 
                            {//onClick={e => this.deleteTaskCollection(e.currentTarget)}>
                            }
                            <MoreVertIcon aria-label="delete" style={{color:"#f1b92e"}}/>
                        </IconButton>
                    </Typography>
                    
                    <PieChart width={75} height={75} >
                        <Pie data={data02} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={20} outerRadius={30} >
                            <Label value={`${taskDetails.progress_status}%`} offset={0} position="center" />
                            {
                                data02.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index]} />
                                ))
                            }
                        </Pie>
                    </PieChart>
                </Grid>

                <Grid item >
                        <Typography >{taskDetails.description}</Typography>
                </Grid>

                <Grid item  >
                    <MuiPickersUtilsProvider utils={DateFnsUtils} xs={6} item>
                        <Grid container item>
                            <KeyboardDatePicker margin="normal" id="date-picker-dialog" label="Start Date" format="MM/dd/yyyy" value={taskDetails.creation_date} onChange={e => setSelectedDate(e)} KeyboardButtonProps={{'aria-label': 'change date'}} />
                        </Grid>
                        <Grid container item>
                            <KeyboardDatePicker margin="normal" id="date-picker-dialog" label="Due Date" format="MM/dd/yyyy" value={taskDetails.due_date} onChange={e => setSelectedDate(e)} KeyboardButtonProps={{'aria-label': 'change date'}} />
                        </Grid>
                    </MuiPickersUtilsProvider>

                </Grid>

                <Grid item container >
                    <AvatarGroup max={4} xs={12} item>
                        {
                            ["A","B","C","D","E"].map((name, index) => (
                                <Avatar alt="Remy Sharp" src="" style={{width:30, height:30}}>{name}</Avatar>
                            ))
                        }
                    </AvatarGroup>
                </Grid>

            </Grid>
            //, taskDetails.creation_date, taskDetails.due_date, taskDetails.progress_status, taskDetails.description, taskDetails.assigned_users
        }
    </Paper>
)}

const mapStateToProps = state => {
    return {selectedCompany: state.selectedCompany, companies: state.companies, workspaces: state.workspaces, selectedWorkspace: state.selectedWorkspace, taskCollectionIDs: state.taskCollectionIDs, workspaceTaskCollections: state.workspaceTaskCollections}
}
      
const mapDispatchToProps = dispatch => {
    return { dispatch }
}
      
export default connect(mapStateToProps, mapDispatchToProps)(Todo)