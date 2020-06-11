import React, { useEffect, useState } from 'react';
import axios from 'axios'
import store from '../../../../store';
import { connect } from 'react-redux';

import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';

import DeleteIcon from '@material-ui/icons/Delete';

import { getCompanies, checkIfAdmin } from '../../DataLoading.js';

const DeleteTaskModal = ( { classes, collection, taskDetails, setOpen, reloadTodo, setReloadTodo } ) => {
    const [thisOpen, setThisOpen] = React.useState(false);

    const handleDeleteTaskOpen = () => {
        setThisOpen(true);
    };

    const handleDeleteTaskClose = () => {
        setThisOpen(false);
    };

    /* TASK FUNCTIONS */
    function deleteTask(){
        //Delete task in database
        axios.delete(`/todo/`, {params:{
                todo_id: taskDetails._id
        }})

        //Close delete task modal
        handleDeleteTaskClose()
        setOpen(false)
        setReloadTodo(true)
    }

    return(
        <div>
            <IconButton aria-label="settings" variant="contained" id={taskDetails._id} onClick={e => handleDeleteTaskOpen(e.currentTarget, collection.title)}>
                <DeleteIcon  style={{color: "#af0000"}} />
            </IconButton>
            
            <Modal 
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={thisOpen}
            onClose={handleDeleteTaskClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{timeout: 500}}
            >
            <Fade in={thisOpen}>
                <Grid container xs={4} className={classes.paper}>
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center">Are you sure you want to delete task: <span color="secondary">{taskDetails.title}</span></Typography>
                    </Grid>
    
                    <Grid item xs={12} align="center">
                        <Button onClick={deleteTask}>Ok</Button> {/*addTask(document.getElementById("new_task_title"))  */}
                        <Button onClick={handleDeleteTaskClose}>Cancel</Button>
                    </Grid>
                </Grid>
            </Fade>
    </Modal>
        </div>
    )
}

const mapStateToProps = state => {
    return {
      selectedCompany: state.selectedCompany, 
      companies: state.companies, 
      workspaces: state.workspaces, 
      selectedWorkspace: state.selectedWorkspace, 
      user: state.user, 
      selectedPanel: state.selectedPanel, 
      allSelectedWorkspaceData: state.allSelectedWorkspaceData, 
      taskCollectionIDs: state.taskCollectionIDs, 
      workspaceTaskCollections: state.workspaceTaskCollections}
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      dispatch
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(DeleteTaskModal)
  
  