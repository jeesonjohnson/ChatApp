import React, { Component, useState, useEffect } from 'react';
import axios from 'axios';

import { connect } from 'react-redux';
import store from '../../../store';
import { useSelector, useDispatch } from 'react-redux';

import ToDo from './components/toDo.js'
import { getTaskCollections, getTaskCollectionsIDs } from '../DataLoading.js';
import useTodoState from '../toDoList/components/useTodoState.js';

import { makeStyles } from '@material-ui/core/styles';

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

// class ToDoPage extends Component {

//     async loadTaskCollections(){
//         await this.setState({viewedWorkspace: store.getState().selectedWorkspace })
//         await getTaskCollections()
//         this.forceUpdate()
//     }

//     deleteTaskCollection(collection){
//         // this.setState({ deleteModelOpen : true})
                
//         axios.delete(`/todocollection/`, { params: { collection_id: collection.id } }) //Deletes task collection in database

//         document.getElementById(collection.parentNode.parentNode.parentNode.id).remove() //Deletes task collection rendered elements
//     }
    

//     addTaskCollection(key){       
//         if(key === "Enter"){
//             this.setState({  newCollection: ""})
//             document.getElementById("addCollectionName").value = ""

//             axios.post(`/todocollection/`, {
//                 name: this.state.newCollection,
//                 workspaceid: store.getState().selectedWorkspace
//             })
//             .then(res => {
//                 this.loadTaskCollections()
//             })
//         }
//     }

//     unfocusCollection(e){
//         e.value = ""
//         this.setState({ newCollection: ""})
//     }

//     addTask(){
//         //Each collection should have ADD TASK button at top
//         /*
//         title:
//         description:
//         assigned_users: array of user ids
//         progress_status: 0 (out of 100 ? or 0, 1, 2)
//         creation_date: current date
//         collectionID: (get from collection add task button)
//         due_date: pick date
//         */
//     //    axios.post('/todo/', { params: { collectionid: } })
//     //    .then(res => {

//     //    })
//     }

//     loadToDoElement(todoID){
//         axios.get('/todo/', { params: { todo_id: todoID } })
//         .then(res => {
//             console.log(res.data.data.todoDetails)
//             this.setState({ currentTask: res.data.data.todoDetails})
//         })
//     }

//     render() {
//         let collections
        
//           const handleClose = () => {
//             this.setState({ deleteModelOpen: false })
//           };

//         return(
//             <Grid container>
//                 {/* {collections} */}

//                 {/* <ToDoList todos={store.getState().workspaceTaskCollections} /> */}
                
//                 {store.getState().workspaceTaskCollections.map((collection, index) =>(
//                     <div item style={{marginRight: 15}}>
//                         <Paper className="valign-wrapper" >
//                             <Typography variant="h6" style={{ width:"100%"}}>
//                                 {collection.title}
//                             </Typography>
//                                 <IconButton style={{right:0 }}>
//                                     <Delete />
//                                 </IconButton>
//                         </Paper>

//                         <Paper style={{marginTop: 10}}>
//                             <Typography>
//                                 Add Task
//                                 <IconButton>
//                                     <PlaylistAdd />
//                                 </IconButton>
//                             </Typography>

//                         </Paper>

//                         {collection.to_do_elements.length > 0 ? 
//                             collection.to_do_elements.map((todo, index)=> (
//                                 <Paper index={index}>
//                                     {
//                                         todo
//                                     // axios.get('/todo/', {params: { todo_id : todo } })
//                                     // .then(res => {
//                                     //     console.log(res.data.data.todoDetails)
//                                     //     return(<div>{res.data.data.todoDetails.title}</div>)
//                                     // })
//                                     }
//                                     <ToDo {...{todo}}></ToDo>
//                                 </Paper>
//                             ))
//                         :
//                             null
//                         }

//                     </div>
//                     )
//                 )}
                
//                 {this.state.newCollection === "" ? 
//                 <TextField id="addCollectionName" size="small" onBlur={e => this.unfocusCollection(e.currentTarget)} onChange={e => this.setState({ newCollection: e.target.value })} label="Collection Name" variant="outlined" color="secondary"/>
//                 :
//                 <TextField id="addCollectionName" size="small" onKeyPress={e => this.addTaskCollection(e.key)} onBlur={e => this.unfocusCollection(e.currentTarget)} onChange={e => this.setState({ newCollection: e.target.value })} label="Collection Name" variant="outlined" color="secondary"/>
//                 }
//             </Grid>
//         )
//     }
// }



// //     return (
// //     <Grid>
// //         <div>Tester</div>

// //         {/* { 
// //         store.getState().workspaceTaskCollections.map((collection, index) => (
// //             <Grid container id={`collection${index}`} index={index} style={{marginRight: 10}}>
// //                 <Paper item className="valign-wrapper" style={{height: 54}}>
// //                     <Typography  style={{float:"left"}} variant="h6" gutterBottom>
// //                         {collection.title}
// //                         {/* <IconButton id={collection._id} onClick={e => this.deleteTaskCollection(e.currentTarget)}> */}
// //                             {/* <Delete aria-label="delete" style={{color:"#af0000"}}/> */}
// //                         {/* </IconButton> */}
// //                         {/* <Modal style={{display: 'flex', alignItems: 'center', justifyContent: 'center',}} open={this.state.deleteModelOpen} onClose={ handleClose } aria-labelledby="transition-modal-title" aria-describedby="transition-modal-description" BackdropComponent={Backdrop} BackdropProps={{timeout: 500,}}> */}
// //                         {/* <Fade in={this.state.deleteModelOpen} style={{backgroundColor: "primary", borderRadius: 10, }}> */}
// //                             {/* <div> */}
// //                                 {/* <Typography component="h1" variant="h5" color="inherit" noWrap>Account Details</Typography> */}
// //                             {/* </div> */}
// //                         {/* </Fade> */}
// //                         {/* </Modal> */}
// //                     {/* </Typography>
// //                 </Paper>
                
// //                 <Paper style={{marginTop: 10}}>
// //                     <Typography>
// //                         Add Task
// //                         <IconButton color="secondary" onClick={e => console.log(e)}>
// //                             <PlaylistAdd/>
// //                         </IconButton>
// //                     </Typography>
// //                 </Paper>


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
  }));

const ToDoPage = () => {
    const classes = useStyles();
    const [addTaskOpen, setAddTaskOpen] = React.useState(false); //Add task module
  
    const [newCollection, setNewCollection] = useState("") //For the New collection text field 
  
    const [taskCollections, setTaskCollections] = useState([])

    const handleAddTaskOpen = () => {
        setAddTaskOpen(true);
      };
    
      const handleAddTaskClose = () => {
        setAddTaskOpen(false);
      };
    

    const loadTaskCollections = async () => {
        getTaskCollections()
        // await console.log(store.getState().workspaceTaskCollections)
        // await console.log(store.getState().taskCollectionIDs)
        // // setTaskCollections(a)
    }
    
    useEffect( () => {
        loadTaskCollections()

    }, [store.getState().selectedWorkspace])

    //Posts data for new collection, then resets the text field 
    function addTaskCollection(key){       
        if(key === "Enter"){
            setNewCollection("")
            document.getElementById("addCollectionName").value = ""

            axios.post(`/todocollection/`, {
                name: newCollection,
                workspaceid: store.getState().selectedWorkspace
            })
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

    return(
        <Grid container>
            {store.getState().workspaceTaskCollections === [] ?
            null
            :
            store.getState().workspaceTaskCollections.map((collection, index) => (
                <Grid item xs={2} id={`collection${index}`} index={index} style={{marginRight: 10}}>

                    <div>
                        <Card className="valign-wrapper"style={{paddingBottom:0, height: 54}}>
                            <CardHeader style={{paddingTop:0, paddingBottom:0}}  
                                action={
                                <IconButton aria-label="delete" id={collection._id} onClick={e => this.deleteTaskCollection(e.currentTarget)}>
                                    <Delete style={{color: "#af0000"}}/>
                                </IconButton>} 
                                title={<Typography variant="h6" >{collection.title}</Typography>} />
                        </Card>
                        </div>

                    <Paper style={{marginTop: 15, paddingTop:0}}>
                        <Card >
                            <CardHeader style={{paddingTop:0, paddingBottom:0}}  
                                action={
                                    <div>
                                        <IconButton aria-label="settings" variant="contained" onClick={handleAddTaskOpen}>
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
                                        <div className={classes.paper}>
                                            <h2 id="transition-modal-title">{collection.title}</h2>
                                            <p id="transition-modal-description">react-transition-group animates me.</p>
                                        </div>
                                        </Fade>
                                    </Modal>
                                </div>
                                } 
                                title={<Typography >Add Task</Typography>} />
                        </Card>
                    </Paper>

                    {collection.to_do_elements === [] ?
                        null
                        :
                        collection.to_do_elements.map((todo, key) => {
                            return (<ToDo key={key} {...{todo}} />)
                        })
                        
                    }

                </Grid>
            ))}

            <div>
                {newCollection === "" ?
                    <TextField id="addCollectionName" size="small" onBlur={e => unfocusCollection(e.currentTarget)} onChange={e => setNewCollection(e.target.value) } label="Collection Name" variant="outlined" color="secondary"/>
                    :
                    <TextField id="addCollectionName" size="small" onKeyPress={e => addTaskCollection(e.key)} onBlur={e => unfocusCollection(e.currentTarget)} onChange={e => setNewCollection(e.target.value) } label="Collection Name" variant="outlined" color="secondary"/>
                }
            </div>
        </Grid>
    )
}

const mapStateToProps = state => {
    return {selectedCompany: state.selectedCompany, companies: state.companies, workspaces: state.workspaces, selectedWorkspace: state.selectedWorkspace, taskCollectionIDs: state.taskCollectionIDs, workspaceTaskCollections: state.workspaceTaskCollections}
}
      
const mapDispatchToProps = dispatch => {
    return { dispatch }
}
      
export default connect(mapStateToProps, mapDispatchToProps)(ToDoPage)