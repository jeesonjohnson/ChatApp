import React, { useEffect, useState } from 'react';
import axios from 'axios'
import store from '../../../../../store';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Fade from '@material-ui/core/Fade';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Modal from '@material-ui/core/Modal';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

import { getAllWorkspaceSpecificData } from '../../../DataLoading.js';

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
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
  }));
  
  const AddPrivateChatModal = ( { openAddPrivateChat, setOpenPrivateChat } ) => {
    const classes = useStyles();
    const [users, setUsers] = React.useState([]);
    const [selectedUser, setSelectedUser] = React.useState({});

    useEffect(() => {       
        if(store.getState().allSelectedWorkspaceData !== undefined && store.getState().allSelectedWorkspaceData !== {} && openAddPrivateChat){
            setUsers([])
            setSelectedUser({})

            if(store.getState().allSelectedWorkspaceData.users !== undefined && store.getState().allSelectedWorkspaceData.users.length > 0){
                loadUsers()     
            }
        }
    }, [openAddPrivateChat] );
    
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
    }

    const handleChange = (event) => {
        setSelectedUser(event.target.value);
    };

    
    const handleClose = () => {
        setOpenPrivateChat(false)
    };

    /* TASK FUNCTIONS */
    function addPrivateChat(){
        if(selectedUser !== {}){                
            //Add chat in database
            axios.post(`/privatechat/`, {
                workspaceid : store.getState().selectedWorkspace,
                oppositeid: selectedUser.id,
            })
            .then(res => {
                getAllWorkspaceSpecificData(store.getState().selectedWorkspace)
            })
            
            //Close modal
            handleClose()
        }
    }

    return(
        <div>
            <Modal 
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={openAddPrivateChat}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{timeout: 500}}
            >
            <Fade in={openAddPrivateChat}>
                <Grid container xs={4} className={classes.paper}>
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center">New Private Chat</Typography>
                        <Divider/>
                    </Grid>

                    {/* Users */}
                    <Grid item xs={12} style={{marginTop:10}}>
                        <FormControl className={classes.formControl} item style={{marginTop:10,  width:"100%"}}>
                            <InputLabel id="demo-simple-select-label">User To Add</InputLabel>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedUser}
                            onChange={handleChange}
                            >
                                {users.map((user, index) => (
                                    <MenuItem value={user} key={index}>{user.name + '(' + user.email + ')'}</MenuItem>
                                    )
                                )}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} align="center">
                        <Divider/>
                        <Button onClick={addPrivateChat}>Ok</Button> {/*addTask(document.getElementById("new_task_title"))  */}
                        <Button onClick={handleClose}>Cancel</Button>
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(AddPrivateChatModal)
  
  