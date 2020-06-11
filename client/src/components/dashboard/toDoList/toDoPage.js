import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { useSelector } from 'react-redux';
import store from '../../../store';

import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';

import ToDo from './components/toDo.js'
import { getTaskCollections, updateTaskPanel } from '../DataLoading.js';
import AddTaskModal from './components/addTaskModal.js';
import EditCollectionModal from './components/editCollectionModal.js';

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
    const [selectedCollection, setSelectedCollection] = React.useState({})
    const [newCollection, setNewCollection] = useState("") //For the New collection text field 
    const taskCollections = useSelector(state=> state.allSelectedWorkspaceData.task_collections);
    const [loadedCollections, setLoadedCollections] = React.useState([])
    const [reloadTodo, setReloadTodo] = React.useState({})
    const [reloadCollections, setReloadCollections] = React.useState(false);

    useEffect( () => {
        if(loadedCollections !== [] || reloadCollections){
            loadTodoCollection()
        }  
    // }, [taskCollections]) 
    }, [store.getState().selectedPanel, taskCollections, reloadCollections ] )

    //Posts data for new collection, then resets the text field 
    async function addTaskCollection(key){       
        if(key === "Enter"){
            setNewCollection("")
            document.getElementById("addCollectionName").value = ""

            await axios.post(`/todocollection/`, {
                name: newCollection,
                workspaceid: store.getState().selectedWorkspace
            })
            .then(res =>(
                updateTaskPanel(store.getState().selectedWorkspace)
                // setReloadCollections(true)
            ))
        }
    }

    //Reset the new collection name text field when click detected outside textfield
    function unfocusCollection(e){
        e.value = ""
        setNewCollection("")
    }

    const loadTodoCollection =  async() => {
        var list = []
        for(var i in taskCollections){
            await axios.get('/todocollection/', {
                params : {
                    collection_id: taskCollections[i]
                }
            })
            .then(res => {
                list.push(res.data.data.collectionDetails)
            })
        }
        setLoadedCollections(list)
        
    };

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
            {loadedCollections !== undefined && loadedCollections !== [] && loadedCollections.length > 0 ?
                loadedCollections.map((collection, index) => (
                    collection !== null && collection !== undefined ?
                        // <Grid container xs={2} id={`collection${index}`} index={index} zeroMinWidth wrap='nowrap' direction='column' style={{marginRight: 20, display:"inline-block",  verticalAlign:"text-top", flexGrow: 1}} onMouseEnter={e => l(e)} onMouseLeave={e => k(e)}>
                        <div  item xs={2} id={`collection${index}`} index={index}  wrap='nowrap' direction='column' style={{marginRight: 20, display:"inline-block",  verticalAlign:"text-top", flexGrow: 1, marginTop: 0, paddingTop:0}} > {/*onMouseEnter={e => onMouseInTaskCollection(e)} onMouseLeave={e => onMouseOutTaskCollection(e)}> */}
                            <div item >
                                <Card style={{marginTop: 0, paddingTop:0, backgroundColor:"#52776c"}}>
                                    <CardHeader style={{paddingLeft:10, paddingRight:10, paddingTop:0, paddingBottom:0, }}
                                        action={
                                            <EditCollectionModal {...{classes, collection, selectedCollection, index, reloadCollections, setReloadCollections}} />
                                            } 
                                        title={<Typography variant="h6">{collection.title}</Typography>} />
                                </Card>        
                            </div>

                            <div item >
                                <Card style={{marginTop: 15, paddingTop:0}}>
                                    <CardHeader style={{paddingLeft:10, paddingRight:10, paddingTop:0, paddingBottom:0}}
                                        action={
                                            <AddTaskModal {...{classes, collection, reloadTodo, setReloadTodo}}/>
                                        } 
                                        title={<Hidden mdup><Typography >Add Task</Typography></Hidden>} />
                                </Card>        
                            </div>

                            <div item style={{minHeight:"100vh"}}>
                            { collection.to_do_elements !== undefined && collection.to_do_elements === [] ?
                                null
                                :
                                collection.to_do_elements.map((todo, key) => {
                                    return (<ToDo item key={key} {...{classes, collection, todo, reloadTodo, setReloadTodo, loadedCollections}} />)
                                    }
                                )
                                
                            }
                            </div>

                        </div>
                    :
                    null
                ))
            :
            null
            }

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
        workspaceTaskCollections: state.workspaceTaskCollections,
        allSelectedWorkspaceData: state.allSelectedWorkspaceData
    }
}
      
const mapDispatchToProps = dispatch => {
    return { dispatch }
}
      
export default connect(mapStateToProps, mapDispatchToProps)(ToDoPage)