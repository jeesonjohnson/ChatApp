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

import { PlaylistAdd } from '@material-ui/icons';

import { getCompanies, checkIfAdmin, updateTaskPanel } from '../../DataLoading.js';

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


const AddTaskModal = ( { classes, collection, reloadTodo, setReloadTodo } ) => {
    const [users, setUsers] = React.useState([]);
    const [addTaskOpen, setAddTaskOpen] = React.useState(false); //Add task modal
    const [newTask, setNewTask] = useState({})
    const [selectedCreationDate, setSelectedCreationDate] = React.useState(new Date(Date.now()));
    const [selectedDueDate, setSelectedDueDate] = React.useState(null);
    const [personName, setPersonName] = React.useState([]);

    const handleChange = (event) => {
        setPersonName(event.target.value);
    };

    let loadWorkspaceUsers = async() => {
        let usersList = []
        for( var i in store.getState().allSelectedWorkspaceData.users){
            await axios.get(`/users/${store.getState().allSelectedWorkspaceData.users[i]}`)
            .then(res => {
                usersList.push({
                    name: res.data.data.name,
                    _id: res.data.data._id,
                    email: res.data.data.email
                })
            })
        }
        setUsers(usersList)
    }

    /* TASK FUNCTIONS */
    function addTask(){
        let assigned_users = []

        //Find the assigned user ids 
        if(personName.length > 0){
            for(var i in personName){
                let a = personName[i].split('(')[1].replace(')','')
                for(var j in users){
                    if(a === users[j].email){
                        assigned_users.push(users[j]._id)
                    }
                }
            }
        }

        let title = document.getElementById('new_task_title').value
        let description = document.getElementById('new_task_description').value

        console.log(document.getElementById('due-date-picker-dialog').value)
        if(title !== undefined && title !== ""){
            axios.post('/todo/', {
                title: title,
                description: description,
                assigned_users: assigned_users,
                progress_status: document.getElementById('slider').childNodes[2].value,
                creation_date: document.getElementById('creation-date-picker-dialog').value,
                collectionid: collection._id,
                due_date: document.getElementById('due-date-picker-dialog').value //NEED TO SORT
            })
            .then(res => {
                setAddTaskOpen(false) //Close Add Task modal
                updateTaskPanel(store.getState().selectedWorkspace)
                setReloadTodo(true)
            })
        }  
    }

    useEffect( () => {
        setUsers([])
        setPersonName([])

        if(addTaskOpen){
            if(store.getState().allSelectedWorkspaceData.users !== undefined || store.getState().allSelectedWorkspaceData.users !== []) {
                loadWorkspaceUsers()
            }
        }
    }, [addTaskOpen] );
    
    const handleAddTaskOpen = (e, title) => {

        setNewTask({
            name: "",
            description: "",
            progress_status: 0,
            creation_date: new Date(Date.now()),
            due_date : null,
            collectionID: e.id
        }) //Reset the new task when opening task modal
        
        setAddTaskOpen(true); //Open Add Task Modal
      };
    
    const handleAddTaskClose = () => {
        setAddTaskOpen(false);
    };

    const dueDatePickedBeforeCreationDate = (e) => {
        setSelectedCreationDate(e); 
        setSelectedDueDate(e);
    }

    const creationDatePickedAfterDueDate = (e) => {
        setSelectedCreationDate(e); 
        setSelectedDueDate(e);
    }

    return(
        <div>
        <IconButton aria-label="settings" variant="contained" id={collection._id} onClick={e => handleAddTaskOpen(e.currentTarget, collection.title)}>
            <PlaylistAdd style={{color: "#f1b92e"}} />
        </IconButton>
    
        <Modal 
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={addTaskOpen}
            onClose={handleAddTaskClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{timeout: 500}}
            >
            <Fade in={addTaskOpen}>
                <Grid container xs={4} className={classes.paper}>
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center">Add Task to {collection.title}</Typography>
                    </Grid>
    
                    {/*title text field*/}
                    <Grid item  xs={12} style={{marginTop:20}}>
                        <TextField style={{width:"100%"}}  id="new_task_title" size="small" label="Task Name" variant="outlined" color="secondary" onChange={e => newTask["title"] = e.currentTarget.value}  /> {/*style={{display:"inline-block"}}*/}
                    </Grid>
                    {/* description text field */}
                    
                    <Grid item xs={12} style={{marginTop:10}}>
                        <TextField style={{width:"100%"}} rowsMax={5} multiline id="new_task_description" size="small" label="Description" variant="outlined" color="secondary" onChange={e => newTask["description"] = e.currentTarget.value}/>
                    </Grid>
                    {/* users multiple select field */}

                    {/* progress status scale  */}
                    <Grid item xs={12} style={{marginTop:10}}>
                        <Typography variant="body2" align="center">Progress Status</Typography>
                        <PrettoSlider item id="slider" valueLabelDisplay="auto" aria-label="pretto slider" defaultValue={0}  />
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
                                value={personName}
                                onChange={handleChange}
                                input={<Input id="select-multiple-chip" />}
                                renderValue={(selected) => (
                                    <div className={classes.chips}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} className={classes.chip} />
                                    ))}
                                    </div>
                                )}
                                MenuProps={MenuProps}
                                >
                                    {users.map((user, index) => (
                                        <MenuItem key={user._id} value={user.name+ " (" + user.email + ")"}> {/*id: user._id, name: user.name*/}
                                            {user.name}
                                        </MenuItem>
                                        )
                                    )
                                }
                            </Select>
                        </FormControl>
                    </Grid>
    
                    <Grid item xs={12}>
                        <Button onClick={addTask}>Ok</Button> {/*addTask(document.getElementById("new_task_title"))  */}
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

export default connect(mapStateToProps, mapDispatchToProps)(AddTaskModal)
