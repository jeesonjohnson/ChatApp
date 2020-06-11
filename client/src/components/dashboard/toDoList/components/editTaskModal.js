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

import { Delete, PlaylistAdd } from '@material-ui/icons';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { getCompanies, checkIfAdmin, getAllWorkspaceSpecificData, getTaskCollections } from '../../DataLoading.js';

import DeleteTaskModal from './deleteTaskModal.js';

const PrettoSlider = withStyles({
    root: {
      color: '#f1b92e',
      height: 8,
    },
    thumb: {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      marginTop: -8,
      marginLeft: -12,
      '&:focus, &:hover, &$active': {
        boxShadow: 'inherit',
      },
    },
    active: {},
    valueLabel: {
      left: 'calc(-50% + 4px)',
    },
    track: {
      height: 8,
      borderRadius: 4,
    },
    rail: {
      height: 8,
      borderRadius: 4,
    },
  })(Slider);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };


const EditTaskModal = ( { classes, collection, taskDetails, reloadTodo, setReloadTodo } ) => {
    const [open, setOpen] = React.useState(false)    
    const [users, setUsers] = React.useState([]);
    const [selectedUsers, setSelectedUsers] = React.useState([]);
    const [newTask, setNewTask] = useState({})
    const [selectedCreationDate, setSelectedCreationDate] = React.useState(new Date(Date.now()));
    const [selectedDueDate, setSelectedDueDate] = React.useState(null);
    const [selectedCollection, setSelectedCollection] = React.useState(collection.title);
    const [selectedTodo, setTodo] = React.useState({});

    const handleAddTaskOpen = async (e, title) => {
        // console.log(e, title)
        // setSelectedCollection(title) //Store the title for the selected collection 
        
        setNewTask({
            name: "",
            description: "",
            progress_status: 0,
            creation_date: new Date(Date.now()),
            due_date : null,
            collectionID: e.id
        }) //Reset the new task when opening task modal
        
        setOpen(true); //Open Add Task Modal
        loadUsers()
      };
    
    const handleAddTaskClose = () => {
        setOpen(false);
        setReloadTodo(true)
    };

    const loadUsers = async () => {
        let loadedUsers = []
        
        for(var i in store.getState().allSelectedWorkspaceData.users){
            await axios.get(`/users/${store.getState().allSelectedWorkspaceData.users[i]}`, {
                params: {
                    id : store.getState().allSelectedWorkspaceData.users[i]
                } 
            })
            .then(res => {
                loadedUsers.push({
                    id: res.data.data._id,
                    name: res.data.data.name,
                    email: res.data.data.email
                })
            })

        }
        setUsers(loadedUsers)

        let user_list = []
        for(var i in loadedUsers){
            for(var j in taskDetails.assigned_users){
                if(loadedUsers[i].id === taskDetails.assigned_users[j]){
                    user_list.push(loadedUsers[i])
                }
            }
        }
        setSelectedUsers(user_list)
    }

    const handleChange = (event) => {
        setSelectedUsers(event.target.value);
    };

    const handleChangeMultiple = (event) => {
        const { options } = event.target;
        const value = [];
        for (let i = 0, l = options.length; i < l; i += 1) {
          if (options[i].selected) {
            value.push(options[i].value);
          }
        }
        setSelectedUsers(value);
      };

    const dueDatePickedBeforeCreationDate = (e) => {
        setSelectedCreationDate(e); 
        setSelectedDueDate(e);
    }

    const creationDatePickedAfterDueDate = (e) => {
        setSelectedCreationDate(e); 
        setSelectedDueDate(e);
    }

    /* TASK FUNCTIONS */
    function editTask(){
        let assigned_users = []
        
        for(var i in selectedUsers){
            assigned_users.push(selectedUsers[i].id)
        }
        
        let title = document.getElementById('new_task_title').value
        let description = document.getElementById('new_task_description').value

        if(title !== undefined && title !== ""){
            axios.patch('/todo/', {
                todoid: taskDetails._id,
                title: title,
                description: description,
                assigned_users: assigned_users,
                progress_status: document.getElementById('slider').childNodes[2].value,
                creation_date: document.getElementById('creation-date-picker-dialog').value,
                collection_id: collection._id,
                due_date: document.getElementById('due-date-picker-dialog').value //NEED TO SORT
            })
            .then(res => {
                setOpen(false) //Close Add Task modal
                setReloadTodo(true)
                getTaskCollections(store.getState().selectedWorkspace)
            })
            
        }  
    }

    return(
        <div style={{float:"right", marginLeft:"auto"}}>
            <IconButton aria-label="settings" variant="contained" id={collection._id} onClick={e => handleAddTaskOpen(e.currentTarget, collection.title)}>
                <MoreVertIcon style={{color: "#f1b92e"}} />
            </IconButton>
            
            <Modal 
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleAddTaskClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{timeout: 500}}
            >
            <Fade in={open}>
                <Grid container xs={4} className={classes.paper}>
                    <Grid item container xs={12} >
                        <Typography item variant="h6">Edit Task to {collection.title}</Typography>
                        {taskDetails !== undefined ? 
                            <DeleteTaskModal item  {...{ classes, collection, taskDetails, setOpen, reloadTodo, setReloadTodo }} />
                            :
                            null
                        }
                    </Grid>
    
                    {/*title text field*/}
                    <Grid item  xs={12} style={{marginTop:20}}>
                        <TextField style={{width:"100%"}} defaultValue={taskDetails.title} id="new_task_title" size="small" label="Task Name" variant="outlined" color="secondary" onChange={e => newTask["title"] = e.currentTarget.value}  /> {/*style={{display:"inline-block"}}*/}
                    </Grid>
                    {/* description text field */}
                    
                    <Grid item xs={12} style={{marginTop:10}}>
                        <TextField style={{width:"100%"}} defaultValue={taskDetails.description} rowsMax={5} multiline id="new_task_description" size="small" label="Description" variant="outlined" color="secondary" onChange={e => newTask["description"] = e.currentTarget.value}/>
                    </Grid>
                    {/* users multiple select field */}

                    {/* progress status scale  */}
                    <Grid item xs={12} style={{marginTop:10}}>
                        <Typography variant="body2" align="center">Progress Status</Typography>
                        <PrettoSlider item id="slider" valueLabelDisplay="auto" aria-label="pretto slider" defaultValue={taskDetails.progress_status}  />
                    </Grid>
            
                    <Grid item container xs={12} style={{marginTop:10}}>
                    {/* creation date date field */}
                        <MuiPickersUtilsProvider item utils={DateFnsUtils} xs={6} item style={{marginTop:10, width:"50%"}}>
                            <KeyboardDatePicker margin="normal" id="creation-date-picker-dialog" label="Start Date" format="dd/MM/yyyy" 
                                value={selectedCreationDate} onChange={e => e > selectedDueDate ? creationDatePickedAfterDueDate(e) : setSelectedCreationDate(e)} KeyboardButtonProps={{'aria-label': 'change date'}} />
                        </MuiPickersUtilsProvider>

                    {/* Due date date field */}
                        <MuiPickersUtilsProvider item utils={DateFnsUtils} xs={6} item style={{marginTop:10, width:"50%"}}>
                            <KeyboardDatePicker margin="normal" id="due-date-picker-dialog" label="Due Date" format="dd/MM/yyyy" 
                                value={selectedDueDate} onChange={e => e <= selectedCreationDate ? dueDatePickedBeforeCreationDate(e) : setSelectedDueDate(e)} KeyboardButtonProps={{'aria-label': 'change date'}} />
                        </MuiPickersUtilsProvider>
                    </Grid>

                    <Grid item container xs={12} style={{marginTop:10, width:"100%"}}>
                        <FormControl item className={classes.formControl} style={{marginTop:10,  width:"100%"}}>
                            <InputLabel id="chip-label">Assigned Users</InputLabel>
                            <Select
                                style={{ width:"100%"}}
                                labelId="chip-label"
                                id="demo-mutiple-chip"
                                multiple
                                value={selectedUsers}
                                onChange={handleChange}
                                input={<Input id="select-multiple-chip" />}
                                renderValue={(selected) => (
                                    <div className={classes.chips}>
                                    {selected.map((value) => (
                                        <Chip key={value.id} label={value.name} className={classes.chip} />
                                    ))}
                                    </div>
                                )}
                                MenuProps={MenuProps}
                                >
                                    {users.map((user, index) => (
                                        <MenuItem key={user._id} value={user}> {/*id: user._id, name: user.name*/}
                                            {user.name+ " (" + user.email + ")"}
                                        </MenuItem>
                                        )
                                    )
                                }
                            </Select>
                        </FormControl>
                    </Grid>
    
                    <Grid item xs={12}>
                        <Button onClick={editTask}>Ok</Button> {/*addTask(document.getElementById("new_task_title"))  */}
                        <Button onClick={handleAddTaskClose}>Cancel</Button>
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(EditTaskModal)
  
  