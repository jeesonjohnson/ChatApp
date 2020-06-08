import React, { useEffect, useState } from 'react';
import axios from 'axios'
import store from '../../../../../store';
import { connect } from 'react-redux';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import Fade from '@material-ui/core/Fade';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Modal from '@material-ui/core/Modal';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

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
  }));
  
  const AddGroupChatModal = ( { openAddGroupChat, setOpenGroupChat } ) => {
    const classes = useStyles();
    const [name, setName] = React.useState("");
    const [users, setUsers] = React.useState([]);
    const [selectedUsers, setSelectedUsers] = React.useState([]);

    useEffect(() => {       
        if(store.getState().allSelectedWorkspaceData !== undefined && store.getState().allSelectedWorkspaceData !== {} && openAddGroupChat){
            setUsers([])
            setSelectedUsers([])

            if(store.getState().allSelectedWorkspaceData.users !== undefined && store.getState().allSelectedWorkspaceData.users.length > 0){
                loadUsers()     
            }
        }
    }, [openAddGroupChat] );
    
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
    
    const handleClose = () => {
        setOpenGroupChat(false)
    };

    /* TASK FUNCTIONS */
    function addGroupChat(){
        if(name !== ""){                
            let user_ids= []
            for(var i in selectedUsers){
                user_ids.push(selectedUsers[i].id)
            }
            
            //Add chat in database
            axios.post(`/groupchat/`, {
                workspaceid : store.getState().selectedWorkspace,
                users: user_ids,
                name: name
            })
            .then(res => {
                //Add element
                console.log(res.data.data)
                console.log(res.data.workspace)
                store.dispatch({ type: 'ALL_WORKSPACE_DATA', data: { workspaceData: res.data.workspace } });
                console.log(store.getState().allSelectedWorkspaceData)
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
            open={openAddGroupChat}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{timeout: 500}}
            >
            <Fade in={openAddGroupChat}>
                <Grid container xs={4} className={classes.paper}>
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center">New Group</Typography>
                        <Divider/>
                    </Grid>

                    {/* Name */}
                    <Grid item xs={12} style={{marginTop:10}}>
                        <TextField style={{width:"100%"}} id="add_group_chat_name" size="small" label="Group Name" variant="outlined" color="secondary" onChange={e => setName(e.currentTarget.value)} />
                    </Grid>

                    {/* Users */}
                    <Grid item xs={12} style={{marginTop:10}}>
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
                                        <MenuItem value={user} key={index}>{user.name + '(' + user.email + ')'}</MenuItem>
                                        // <MenuItem key={user._id} value={user.name+ " (" + user.email + ")"}> {/*id: user._id, name: user.name*/}
                                            //{/* {user.name} */}
                                        //{/* </MenuItem> */}
                                        )
                                    )
                                }
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} align="center">
                        <Divider/>
                        <Button onClick={addGroupChat}>Ok</Button> {/*addTask(document.getElementById("new_task_title"))  */}
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(AddGroupChatModal)
  
  