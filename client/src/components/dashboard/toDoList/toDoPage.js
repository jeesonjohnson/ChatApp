import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { connect } from 'react-redux';
import { useSelector } from 'react-redux';
import store from '../../../store';

import { withStyles, makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { Delete, PlaylistAdd } from '@material-ui/icons';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Slider from '@material-ui/core/Slider';
import Hidden from '@material-ui/core/Hidden';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';

import ToDo from './components/toDo.js'
import { getTaskCollections } from '../DataLoading.js';
import AddTaskModal from '../toDoList/components/addTaskModal.js';
import EditCollectionModal from '../toDoList/components/editCollectionModal.js';

const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
      },
      chips: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      chip: {
        margin: 2,
      },
      noLabel: {
        marginTop: theme.spacing(3),
      },
  }));


const ToDoPage = () => {
    const classes = useStyles();
    const [editTaskOpen, setEditTaskOpen] = React.useState(false); //Edit Task modal
    const [selectedCollection, setSelectedCollection] = React.useState({})
    const [newCollection, setNewCollection] = useState("") //For the New collection text field 
    const [selectedDate, setSelectedDate] = React.useState(new Date(Date.now()));
    const taskCollections = useSelector(state=> state.workspaceTaskCollections);
    const [selectedUsers, setSelectedUsers] = React.useState([]);
    const [deleteTaskOpen, setDeleteTaskOpen] = React.useState(false); //Delete Task modal

    useEffect( () => {
        if(newCollection === ""){
            getTaskCollections()
        }

    }, [store.getState().selectedWorkspace, store.getState().selectedPanel, newCollection ] )

    //Posts data for new collection, then resets the text field 
    async function addTaskCollection(key){       
        if(key === "Enter"){
            setNewCollection("")
            document.getElementById("addCollectionName").value = ""

            await axios.post(`/todocollection/`, {
                name: newCollection,
                workspaceid: store.getState().selectedWorkspace
            })

            getTaskCollections()
        }
    }

    //Reset the new collection name text field when click detected outside textfield
    function unfocusCollection(e){
        e.value = ""
        setNewCollection("")
    }

    const loadTodoElement = async (collection_id) => {
        return await axios.get('/todo/', { params: {collection_id: collection_id} })
    }


    const onMouseInTaskCollection = (e) =>{
        e.currentTarget.style.overflowY = "scroll"
        e.currentTarget.style.backgroundColor = "#af0000"
    }

    const onMouseOutTaskCollection = (e) => {
        e.currentTarget.style.overflowY = "hidden"
        e.currentTarget.style.backgroundColor = "#0000af"
    }

    return(
        <div container style={{whiteSpace:"nowrap", minHeight:"50vh"}}>
            {taskCollections === [] ?
            null
            :
            taskCollections.map((collection, index) => (
                // <Grid container xs={2} id={`collection${index}`} index={index} zeroMinWidth wrap='nowrap' direction='column' style={{marginRight: 20, display:"inline-block",  verticalAlign:"text-top", flexGrow: 1}} onMouseEnter={e => l(e)} onMouseLeave={e => k(e)}>
                <div  item xs={2} id={`collection${index}`} index={index}  wrap='nowrap' direction='column' style={{marginRight: 20, display:"inline-block",  verticalAlign:"text-top", flexGrow: 1, marginTop: 0, paddingTop:0}} > {/*onMouseEnter={e => onMouseInTaskCollection(e)} onMouseLeave={e => onMouseOutTaskCollection(e)}> */}
                    <div item >
                        <Card style={{marginTop: 0, paddingTop:0, backgroundColor:"#52776c"}}>
                            <CardHeader style={{paddingLeft:10, paddingRight:10, paddingTop:0, paddingBottom:0, }}
                                action={
                                    <EditCollectionModal {...{classes, collection, selectedCollection, index}} />
                                    } 
                                title={<Typography variant="h6">{collection.title}</Typography>} />
                        </Card>        
                    </div>

                    <div item >
                        <Card style={{marginTop: 15, paddingTop:0}}>
                            <CardHeader style={{paddingLeft:10, paddingRight:10, paddingTop:0, paddingBottom:0}}
                                action={
                                    <AddTaskModal {...{classes, collection}}/>
                                } 
                                title={<Hidden mdup><Typography >Add Task</Typography></Hidden>} />
                        </Card>        
                    </div>

                    <div item style={{minHeight:"100vh"}}>
                    {collection.to_do_elements === [] ?
                        null
                        :
                        collection.to_do_elements.map((todo, key) => {
                            return (<ToDo item key={key} {...{classes, collection, todo}} />)
                            }
                        )
                        
                    }
                    </div>

                </div>
            ))}

                {newCollection === "" ?
                    <TextField id="addCollectionName" size="small" onBlur={e => unfocusCollection(e.currentTarget)} onChange={e => setNewCollection(e.target.value) } label="Collection Name" variant="outlined" color="secondary" style={{display:"inline-block"}}/>
                    :
                    <TextField id="addCollectionName" size="small" onKeyPress={e => addTaskCollection(e.key)} onBlur={e => unfocusCollection(e.currentTarget)} onChange={e => setNewCollection(e.target.value) } label="Collection Name" variant="outlined" color="secondary" style={{display:"inline-block"}}/>
                }
        </div>
    )
}

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
      
export default connect(mapStateToProps, mapDispatchToProps)(ToDoPage)