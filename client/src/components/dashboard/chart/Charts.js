import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import store from '../../../store';
import axios from 'axios';

import {BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Sector} from 'recharts';

import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import { CheckBoxOutlineBlank } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    paper: {
        marginLeft: theme.spacing(1),
    }
  }));

function Charts ( props ) {   
    const classes = useStyles();
    const [collections, setCollections] = React.useState([]);
    const [tasks, setTasks] = React.useState([]);
    const [loaded, setLoaded] = React.useState(false);

    useEffect(() => {
        if (store.getState().selectedWorkspace !== "" && store.getState().allSelectedWorkspaceData.task_collections !== undefined && 
        store.getState().allSelectedWorkspaceData.task_collections.length > 0){
            loadData()
            console.log("load",collections, tasks)
        }  
    }, [store.getState().selectedCompany ,store.getState().selectedWorkspace, store.getState().selectedPanel]);
    
    function loadData(){
        if(collections.length !== 0){
            setCollections([])
            setTasks([])
        }
        
        for(var collectionIndex in store.getState().allSelectedWorkspaceData.task_collections){
            
            axios.get('/todocollection', {
                params: { 
                collection_id:  store.getState().allSelectedWorkspaceData.task_collections[collectionIndex]
            }
            })
            .then(res => {
                if(res.data.data.collectionDetails !== null) {              
                    collections.push({
                        id: res.data.data.collectionDetails._id,
                        title: res.data.data.collectionDetails.title,
                        number_of_tasks: res.data.data.collectionDetails.to_do_elements.length
                    })
                    let collection_id = res.data.data.collectionDetails._id
        
                    for(var todoIndex in res.data.data.collectionDetails.to_do_elements){
                        axios.get('/todo/', {params: {todo_id: res.data.data.collectionDetails.to_do_elements[todoIndex]}})
                        .then(res => {
                                tasks.push(  {
                                    id: res.data.data.todoDetails._id,
                                    group: collection_id,
                                    title: res.data.data.todoDetails.title,
                                    start_time: new Date (res.data.data.todoDetails.creation_date),
                                    end_time: new Date (res.data.data.todoDetails.due_date),
                                    progress_status: res.data.data.todoDetails.progress_status,
                                    users: res.data.data.todoDetails.assigned_users
                                })
                            })
                    }
                }
            })

        }
    }

    function loadCollectionsData(){
        let data = []
        for(var i in collections){
            data.push({
                "id": collections[i].id,
                "name": collections[i].title,
                "Number of tasks": collections[i].number_of_tasks
            })
        }
        return(data)
    }

    function loadTasksData(){
        let data = []
        for(var i in tasks){
            data.push({
                "name": tasks[i].title,
                "group": tasks[i].group,
                "start_time": tasks[i].start_time,
                "end_time": tasks[i].end_time,
                "progress_status": tasks[i].progress_status,
                "users": tasks[i].users
            })
        }
        return(data)
    }

    function loadCollectionsTasksProgress(){
        let data = []
        
        for (var i in collections){
            data.push({
                "name": collections[i].title,
                "Not Started": 0,
                "In Progress": 0,
                "Completed": 0
            })

            for (var j in tasks){
                if(tasks[j].group === collections[i].id){   
                    if(tasks[j].progress_status === 0){
                        data[i]["Not Started"] += 1
                    }
                    else if (tasks[j].progress_status > 0 && tasks[j].progress_status < 100){
                        data[i]["In Progress"] += 1
                    }
                    else if (tasks[j].progress_status === 100){
                        data[i]["Completed"] += 1
                    }
                }
            }
        }
        return(data)
    }

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value}) => {
       const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
      return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
          {`${name} ${value} Tasks (${(percent * 100).toFixed(0)}%)`}
        </text>
      );
    };


    return(
        <div>
            {console.log(store.getState().chartCategory)}
            {store.getState().chartCategory === "Collections" ?
            <Grid container>         
                { console.log(collections) }
                    <Paper item className={classes.paper}>
                        <Typography>Number of tasks in each collection</Typography>
                        <BarChart width={500} height={250} data={loadCollectionsData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Number of tasks" fill="#f1b92e" />
                        </BarChart>
                    </Paper>
                    
                    <Paper item className={classes.paper}>
                        <Typography>Percentage of tasks for each collection</Typography>                       
                        <PieChart width={300} height={250}>
                            <Pie data={loadCollectionsData()} dataKey="Number of tasks" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#725bda" label={renderCustomizedLabel} />
                        </PieChart>
                    </Paper>

                    <Paper item className={classes.paper}>
                        <Typography>Number of tasks in each collection</Typography>
                        <BarChart width={500} height={250} data={loadCollectionsTasksProgress()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Not Started" fill="#36393f" />
                            <Bar dataKey="In Progress" fill="#f1b92e" />
                            <Bar dataKey="Completed" fill="#52776c" />
                        </BarChart>
                    </Paper>

                </Grid>
                :
                null
            }

            {store.getState().chartCategory === "Deadlines" ?
                <Paper item className={classes.paper}>
                    <Typography>Number of tasks by deadlines</Typography>
                    {/* <BarChart width={730} height={250} data={loadCollectionsData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="pv" fill="#8884d8" />
                        <Bar dataKey="uv" fill="#82ca9d" />
                    </BarChart>

                    <Typography>Percentage of tasks by deadline</Typography>
                    <PieChart width={730} height={250}>
                        <Pie data={loadCollectionsData()} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#8884d8" />
                        <Pie data={loadCollectionsData()} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#82ca9d" label />
                    </PieChart> */}
                </Paper>
                :
                null
            }

        </div>)
}
    
const mapStateToProps = state => {
    return {
        selectedCompany: state.selectedCompany,
        companies: state.companies, 
        workspaces: state.workspaces, 
        selectedWorkspace: state.selectedWorkspace, 
        taskCollectionIDs: state.taskCollectionIDs, 
        workspaceTaskCollections: state.workspaceTaskCollections,
        chartCategory : state.chartCategory 
    }
}
      
const mapDispatchToProps = dispatch => {
    return { dispatch }
}
      
export default connect(mapStateToProps, mapDispatchToProps)(Charts)