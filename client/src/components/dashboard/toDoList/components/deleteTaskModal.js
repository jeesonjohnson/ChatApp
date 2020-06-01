import React, { useEffect, useState } from 'react';
import axios from 'axios'
import store from '../../../../store';
import { connect } from 'react-redux';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Fade from '@material-ui/core/Fade';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Modal from '@material-ui/core/Modal';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';

import DeleteIcon from '@material-ui/icons/Delete';

import { getCompanies, checkIfAdmin } from '../../DataLoading.js';


  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;


const DeleteTaskModal = ( { classes, collection } ) => {
    const [open, setOpen] = React.useState(false);
    const [users, setUsers] = React.useState([]);
    const [addTaskOpen, setAddTaskOpen] = React.useState(false); //Add task modal
    const [newTask, setNewTask] = useState({})
    const [selectedCreationDate, setSelectedCreationDate] = React.useState(new Date(Date.now()));
    const [selectedDueDate, setSelectedDueDate] = React.useState(null);
    const [personName, setPersonName] = React.useState([]);

    const handleDeleteTaskOpen = () => {
        setOpen(true);
    };

    const handleDeleteTaskClose = () => {
        setOpen(false);
    };

    /* TASK FUNCTIONS */
    function deleteTask(){
        //Delete task in database
        axios.delete(`/todo/`, )

        //Remove task element

        //Close delete task modal 

        //Close edit task modal
    }

    return(
        <div>
            <IconButton aria-label="settings" variant="contained" id={collection._id} onClick={e => handleDeleteTaskOpen(e.currentTarget, collection.title)}>
                <DeleteIcon  style={{color: "#af0000"}} />
            </IconButton>
            
            <Modal 
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleDeleteTaskClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{timeout: 500}}
            >
            <Fade in={open}>
                <Grid container xs={4} className={classes.paper}>
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center">Are you sure you want to delete task {collection.title}</Typography>
                    </Grid>
    
                    <Grid item xs={12}>
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
  
  