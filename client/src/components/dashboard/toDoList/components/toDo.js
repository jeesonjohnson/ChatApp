import React, { useState, useEffect } from 'react';

import { connect, useSelector } from 'react-redux';
import store from '../../../../store';
import axios from 'axios';

import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { Checkbox } from 'react-materialize';

import EditTaskModal from './editTaskModal.js';
import {PieChart, Pie, Cell, Label} from 'recharts';

function Todo ( {classes, collection, todo, reloadTodo, setReloadTodo, loadedCollections} ) {    
    const colors = [ "#a0f3d7", "#52776c" ] //Light and Dark teal
    const [taskDetails, setTaskDetails] = React.useState({})
    const [toDoChecked, setToDoChecked] = React.useState(true);
    const taskCollections = useSelector(state=> state.allSelectedWorkspaceData.task_collections);

    const loadToDoElement = async () => {
        await axios.get('/todo/', { params: { todo_id: todo } })
        .then(res => {
            setTaskDetails(res.data.data.todoDetails)
            if(res.data.data.todoDetails.progress_status === 100){
                setToDoChecked(true)
            }
            else{
                setToDoChecked(false)
            }
        })
        
    }
    
    useEffect( () => {
        if(taskDetails !== undefined && reloadTodo){
            loadToDoElement( todo )
            setReloadTodo(false)
        }
    }, [taskCollections, reloadTodo])
    
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
            <PieChart width={75} height={75}>
                <Pie data={progress_data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={20} outerRadius={30} >
                    <Label id="percentage" value={`${taskDetails.progress_status}%`} offset={0} position="center" />
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

    const getName = (id) => {
        let name = []
         axios.get(`/users/${id}`)
        .then(res => (
            name.push(res.data.data.name)
        ))
        return(name[0])
    }

    // const getUserAvatars = () =>{
    //     let user_list =[]
    //     for(var i in taskDetails.assigned_users){
    //         axios.get(`/users/${taskDetails.assigned_users[i]}`)
    //         .then(res =>(
    //             user_list.push(res.data.data.name[0])
    //         ))
    //     }
        
    //     return(user_list)
    // }

    return(
    <Paper style={{marginTop: 10, maxWidth:220}} id={"task_card_"+ taskDetails._id}>
        {taskDetails === {} ?
            null
            :
            <Grid container >
                <Grid item container xs={12} className="valign-wrapper" style={{marginLeft:10}} > 
                    <Checkbox disabled style={{float:"left", marginRight:"auto"}} checked={toDoChecked} filledIn id={`Checkbox_${todo}`} label={taskDetails.title} onChange={e=> handleToDoChecked(e)} />
                    <EditTaskModal {...{classes, collection, taskDetails, reloadTodo, setReloadTodo}} />
                </Grid>

                {!toDoChecked ? 
                    <Grid item xs={12} align="center">
                        {loadPieChart()}
                    </Grid>
                : null}

                {!toDoChecked ?
                    <Grid item xs={12}>
                        <Typography id="description" style={{overflow:"auto"}}>{taskDetails.description}</Typography>
                    </Grid>
                : null}

                {!toDoChecked ?
                    <Grid item xs={12} >
                        <MuiPickersUtilsProvider utils={DateFnsUtils} item>
                            <Grid item>
                                <KeyboardDatePicker disabled margin="normal" id="creation-date-picker-dialog" type="datatime-local" label="Start Date" format="dd/MM/yyyy" value={taskDetails.creation_date} />
                            </Grid>
                            <Grid item>
                                <KeyboardDatePicker disabled margin="normal" id="due-date-picker-dialog" type="datatime-local" label="Due Date" format="dd/MM/yyyy" value={taskDetails.due_date}  />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </Grid>
                : null}

                {!toDoChecked ?
                    <Grid item container xs={12} >
                        <AvatarGroup max={4} xs={12} item>
                            {/* {taskDetails.assigned_users !== undefined ? */}
                                {/* taskDetails.assigned_users.length > 0 ? */}
                                    {/* // getUserAvatars().map(user =>( */}
                                    {/* //     <Avatar alt="assigned_user" src="" style={{width:30, height:30}}>{user}</Avatar> */}
                                    {/* // )) */}
                                {/* // taskDetails.assigned_users.map(async id => ( */}
                                        {/* // <Avatar alt="assigned_user" src="" style={{width:30, height:30}}>{getName(id)[0] !== undefined ? getName(id)[0] : null}</Avatar> */}
                                    {/* // )) */}
                                    {/* : */}
                                    {/* null */}
                                {/* : */}
                                {/* null */}
                            {/* } */}
                        </AvatarGroup>
                    </Grid>
                : null}
            </Grid>
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
        workspaceTaskCollections: state.workspaceTaskCollections,
        allSelectedWorkspaceData: state.allSelectedWorkspaceData
    }
}
      
const mapDispatchToProps = dispatch => {
    return { dispatch }
}
      
export default connect(mapStateToProps, mapDispatchToProps)(Todo)