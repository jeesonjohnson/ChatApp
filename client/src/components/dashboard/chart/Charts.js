import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import store from '../../../store';
import axios from 'axios';

import {BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, PieChart, Pie} from 'recharts';

import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

function Charts ( props ) {   
    const classes = useStyles();
    const [category, setCategory] = React.useState('');
  
    const handleChange = (event) => {
      setCategory(event.target.value);
    };

    const data = [
        {"name": "Page A", "Not Started": 4, "In Progress": 2, "Completed": 3},
        {"name": "Page B", "Not Started": 3, "In Progress": 1, "Completed": 3},
        {"name": "Page C", "Not Started": 2, "In Progress": 9, "Completed": 3},
        {"name": "Page D", "Not Started": 2, "In Progress": 3, "Completed": 3},
        {"name": "Page E", "Not Started": 1, "In Progress": 4, "Completed": 3},
        {"name": "Page F", "Not Started": 2, "In Progress": 3, "Completed": 3}, 
        {"name": "Page G", "Not Started": 3, "In Progress": 4, "Completed": 3}
    ]

    const data01 = [
        {"name": "Group A", "value": 400},
        {"name": "Group B", "value": 300},
        {"name": "Group C", "value": 300},
        {"name": "Group D", "value": 200},
        {"name": "Group E", "value": 278},
        {"name": "Group F", "value": 189}
    ];

    const data02 = [
        {"name": "Group A", "value": 2400},
        {"name": "Group B", "value": 4567},
        {"name": "Group C", "value": 1398},
        {"name": "Group D", "value": 9800},
        {"name": "Group E", "value": 3908},
        {"name": "Group F", "value": 4800}
    ];

    const dataTasksInCollection = [

    ];

    function loadCollectionNumber(){

    }

    function loadCollectionPercentage(){
        
    }
    
    function loadDeadlineNumber(){
        
    }
    
    function loadDeadlinePercentage(){
        
    }

    return(
        <div>
            {console.log(store.getState())}
            <div>
                <Typography>Select Category To View</Typography>
                <FormControl className={classes.formControl}>
                    <Select
                    value={category}
                    onChange={handleChange}
                    displayEmpty
                    className={classes.selectEmpty}
                    inputProps={{ 'aria-label': 'Without label' }}
                    >
                        <MenuItem value="Collections" >Collections</MenuItem>
                        <MenuItem value="Deadlines" >Deadlines</MenuItem>
                    </Select>
                </FormControl>
            </div>

            {category === "Collections" ?
                <Grid container>
                    <Paper item>
                        <Typography>Number of tasks in each collection</Typography>
                        <BarChart width={500} height={250} data={data}>
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
                    
                    <Paper item>
                        <Typography>Percentage of tasks for each collection</Typography>                       
                        <PieChart width={300} height={250}>
                            <Pie data={data01} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#8884d8" />
                            <Pie data={data02} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#82ca9d" label />
                        </PieChart>
                    </Paper>
                </Grid>
                :
                null
            }

            {category === "Deadlines" ?
                <Paper >
                    {console.log(store.getState())}
                    <Typography>Number of tasks by deadlines</Typography>
                    <BarChart width={730} height={250} data={data}>
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
                        <Pie data={data01} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#8884d8" />
                        <Pie data={data02} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#82ca9d" label />
                    </PieChart>
                </Paper>
                :
                null
            }
        </div>)
}

    
const mapStateToProps = state => {
    return {selectedCompany: state.selectedCompany, companies: state.companies, workspaces: state.workspaces, selectedWorkspace: state.selectedWorkspace, taskCollectionIDs: state.taskCollectionIDs, workspaceTaskCollections: state.workspaceTaskCollections}
}
      
const mapDispatchToProps = dispatch => {
    return { dispatch }
}
      
export default connect(mapStateToProps, mapDispatchToProps)(Charts)