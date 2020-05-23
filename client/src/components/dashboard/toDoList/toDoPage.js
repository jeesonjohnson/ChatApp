import React, { Component } from 'react';
import axios from 'axios';

import { connect } from 'react-redux';
import store from '../../../store';
import { useSelector, useDispatch } from 'react-redux';

import { getCompanies } from '../DataLoading.js';

import ToDoList from './components/toDoList.js'
import ToDo from './components/toDo.js'

import { getTaskCollections } from '../DataLoading.js';

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

import useTodoState from '../toDoList/components/useTodoState.js';

class ToDoPage extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            newCollection: "",
            viewedWorkspace : "",
            deleteModelOpen: false,
            tasksLoaded: false
        }
    }
    
    loadTaskCollections(){
        this.setState({viewedWorkspace: store.getState().selectedWorkspace })
        getTaskCollections()
        this.forceUpdate()
    }

    deleteTaskCollection(collection){
        // this.setState({ deleteModelOpen : true})
                
        axios.delete(`/todocollection/`, { params: { collection_id: collection.id } }) //Deletes task collection in database

        document.getElementById(collection.parentNode.parentNode.parentNode.id).remove() //Deletes task collection rendered elements
    }

    componentDidUpdate(){
        if(store.getState().taskCollectionIDs != [] && this.state.viewedWorkspace != store.getState().selectedWorkspace && this.state.tasksLoaded === false){
            this.loadTaskCollections()
            this.setState({ tasksLoaded: true })
        }
    }
    

    addTaskCollection(key){       
        if(key === "Enter"){
            this.setState({  newCollection: ""})
            document.getElementById("addCollectionName").value = ""

            axios.post(`/todocollection/`, {
                name: this.state.newCollection,
                workspaceid: store.getState().selectedWorkspace
            })
            .then(res => {
                this.loadTaskCollections()
            })
        }
    }

    unfocusCollection(e){
        e.value = ""
        this.setState({ newCollection: ""})
    }

    addTask(){
        //Each collection should have ADD TASK button at top
        /*
        title:
        description:
        assigned_users: array of user ids
        progress_status: 0 (out of 100 ? or 0, 1, 2)
        creation_date: current date
        collectionID: (get from collection add task button)
        due_date: pick date
        */
    //    axios.post('/todo/', { params: { collectionid: } })
    //    .then(res => {

    //    })
    }

    loadToDoElement(todoID){
        axios.get('/todo/', { params: { todo_id: todoID } })
        .then(res => {
            console.log(res.data.data.todoDetails)
            this.setState({ currentTask: res.data.data.todoDetails})
        })
    }

    render() {
        let collections
        
          const handleClose = () => {
            this.setState({ deleteModelOpen: false })
          };

        //   console.log("1")
        // if (store.getState().taskCollectionIDs != [] && this.state.tasksLoaded === false){
        //     console.log("2")
        //     collections = store.getState().workspaceTaskCollections.map((collection, index) => (
        //         <div id={`collection${index}`} index={index} style={{marginRight: 10}}>
        //             <Paper className="valign-wrapper" style={{height: 54}}>
        //                 <Typography  style={{float:"left"}} variant="h6" gutterBottom>
        //                     {collection.title}
        //                     <IconButton id={collection._id} onClick={e => this.deleteTaskCollection(e.currentTarget)}>
        //                         <Delete aria-label="delete" style={{color:"#af0000"}}/>
        //                     </IconButton>
        //                     <Modal style={{display: 'flex', alignItems: 'center', justifyContent: 'center',}} open={this.state.deleteModelOpen} onClose={ handleClose } aria-labelledby="transition-modal-title" aria-describedby="transition-modal-description" BackdropComponent={Backdrop} BackdropProps={{timeout: 500,}}>
        //                     <Fade in={this.state.deleteModelOpen} style={{backgroundColor: "primary", borderRadius: 10, }}>
        //                         <div>
        //                             <Typography component="h1" variant="h5" color="inherit" noWrap>Account Details</Typography>
        //                         </div>
        //                     </Fade>
        //                     </Modal>
        //                 </Typography>
        //             </Paper>
                    
        //             <Paper style={{marginTop: 10}}>
        //                 <Typography>
        //                     Add Task
        //                     <IconButton color="secondary" onClick={e => console.log(e)}>
        //                         <PlaylistAdd/>
        //                     </IconButton>
        //                 </Typography>
        //             </Paper>

        //             {collection.to_do_elements.map((task_id, key) => (
        //                 <ToDo key={key} {...{task_id}} />
        //             ))}
                  
        //         </div>
        //     ))

        //     this.setState({ tasksLoaded: true })
        // }
        // else {
        //     console.log("3", this.state.tasksLoaded, store.getState())
        //     collections = "" 
        // }

        return(
            <Grid container>
                {/* {collections} */}

                {/* <ToDoList todos={store.getState().workspaceTaskCollections} /> */}
                
                {store.getState().workspaceTaskCollections.map((collection, index) =>(
                    <div item style={{marginRight: 15}}>
                        <Paper className="valign-wrapper" >
                            <Typography variant="h6" style={{ width:"100%"}}>
                                {collection.title}
                            </Typography>
                                <IconButton style={{right:0 }}>
                                    <Delete />
                                </IconButton>
                        </Paper>

                        <Paper style={{marginTop: 10}}>
                            <Typography>
                                Add Task
                                <IconButton>
                                    <PlaylistAdd />
                                </IconButton>
                            </Typography>

                        </Paper>
                    </div>
                    )
                )}
                
                {this.state.newCollection === "" ? 
                <TextField id="addCollectionName" size="small" onBlur={e => this.unfocusCollection(e.currentTarget)} onChange={e => this.setState({ newCollection: e.target.value })} label="Collection Name" variant="outlined" color="secondary"/>
                :
                <TextField id="addCollectionName" size="small" onKeyPress={e => this.addTaskCollection(e.key)} onBlur={e => this.unfocusCollection(e.currentTarget)} onChange={e => this.setState({ newCollection: e.target.value })} label="Collection Name" variant="outlined" color="secondary"/>
                }
            </Grid>
        )
    }
}





// const ToDoPage = ({ }) => {
//     const [newCollectionName, setCollectionName] = React.useState("");
    
//     function addTaskCollection(key){       
//         if(key === "Enter"){
//             axios.post(`/todocollection/`, {
//                 name: newCollectionName,
//                 workspaceid: store.getState().selectedWorkspace
//             })
//             .then(res => {
//                 console.log(res)
//                 // this.loadTaskCollections()
//             })
            
//             document.getElementById("addCollectionName").value = ""
//             setCollectionName("")
//         }
//     }
    
//     function unfocusCollection(e){
//         e.value = ""
//         setCollectionName("")
//     }

//     return (
//     <Grid>
//         <div>Tester</div>

//         {/* { 
//         store.getState().workspaceTaskCollections.map((collection, index) => (
//             <Grid container id={`collection${index}`} index={index} style={{marginRight: 10}}>
//                 <Paper item className="valign-wrapper" style={{height: 54}}>
//                     <Typography  style={{float:"left"}} variant="h6" gutterBottom>
//                         {collection.title}
//                         {/* <IconButton id={collection._id} onClick={e => this.deleteTaskCollection(e.currentTarget)}> */}
//                             {/* <Delete aria-label="delete" style={{color:"#af0000"}}/> */}
//                         {/* </IconButton> */}
//                         {/* <Modal style={{display: 'flex', alignItems: 'center', justifyContent: 'center',}} open={this.state.deleteModelOpen} onClose={ handleClose } aria-labelledby="transition-modal-title" aria-describedby="transition-modal-description" BackdropComponent={Backdrop} BackdropProps={{timeout: 500,}}> */}
//                         {/* <Fade in={this.state.deleteModelOpen} style={{backgroundColor: "primary", borderRadius: 10, }}> */}
//                             {/* <div> */}
//                                 {/* <Typography component="h1" variant="h5" color="inherit" noWrap>Account Details</Typography> */}
//                             {/* </div> */}
//                         {/* </Fade> */}
//                         {/* </Modal> */}
//                     {/* </Typography>
//                 </Paper>
                
//                 <Paper style={{marginTop: 10}}>
//                     <Typography>
//                         Add Task
//                         <IconButton color="secondary" onClick={e => console.log(e)}>
//                             <PlaylistAdd/>
//                         </IconButton>
//                     </Typography>
//                 </Paper>

//                 {/* {collection.to_do_elements.map((task_id, key) => ( */}
//                     {/* // <ToDo key={key} {...{task_id}} /> */}
//                 {/* // ))} */}
                
//             {/* </Grid> */}
            
//         {/* // )) */}
        
//         {/* // } */}

//         <div>
//             {newCollectionName === "" ?
//             <TextField id="addCollectionName" size="small" onBlur={e => this.unfocusCollection(e.currentTarget)} onChange={e => setCollectionName(e.target.value) } label="Collection Name" variant="outlined" color="secondary"/>
//             :
//             <TextField id="addCollectionName" size="small" onKeyPress={e => addTaskCollection(e.key)} onBlur={e => unfocusCollection(e.currentTarget)} onChange={e => setCollectionName(e.target.value) } label="Collection Name" variant="outlined" color="secondary"/>
//             }
//         </div>
//     </Grid>
// )}

const mapStateToProps = state => {
    return {selectedCompany: state.selectedCompany, companies: state.companies, workspaces: state.workspaces, selectedWorkspace: state.selectedWorkspace, taskCollectionIDs: state.taskCollectionIDs, workspaceTaskCollections: state.workspaceTaskCollections}
}
      
const mapDispatchToProps = dispatch => {
    return { dispatch }
}
      
export default connect(mapStateToProps, mapDispatchToProps)(ToDoPage)