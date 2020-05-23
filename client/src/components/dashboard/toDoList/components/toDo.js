import React, { Component, useState, useEffect } from 'react';

import PropTypes from 'prop-types'

import { connect } from 'react-redux';
import store from '../../../../store';

import Paper from '@material-ui/core/Paper';

import axios from 'axios';


function loadToDoElement(todoID) {
    axios.get('/todo/', { params: { todo_id: todoID } })
    .then(res => {
        return res.data.data.todoDetails
    })
}


function Todo ( props ) {    
    const [taskDetails, setTaskDetails] = useState({})
    
    axios.get('/todo/', { params: { todo_id: props.task_id } })
    .then(res => {
        setTaskDetails(res.data.data.todoDetails)
    })

    return(
    <Paper style={{marginTop: 10}} >
        {taskDetails.title}
    </Paper>
)}

const mapStateToProps = state => {
    return {selectedCompany: state.selectedCompany, companies: state.companies, workspaces: state.workspaces, selectedWorkspace: state.selectedWorkspace, taskCollectionIDs: state.taskCollectionIDs, workspaceTaskCollections: state.workspaceTaskCollections}
}
      
const mapDispatchToProps = dispatch => {
    return { dispatch }
}
      
export default connect(mapStateToProps, mapDispatchToProps)(Todo)