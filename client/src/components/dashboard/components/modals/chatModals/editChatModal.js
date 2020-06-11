import React, {useEffect} from 'react';
import axios from 'axios';
import store from '../../../../../store';
import { connect, useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Divider from '@material-ui/core/Divider';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Modal from '@material-ui/core/Modal';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import SettingsIcon from '@material-ui/icons/Settings';

import { getCompanies, getAllWorkspaceSpecificData, getAcronym} from '../../../DataLoading.js';

import User from './User.js';

const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paperManageWorkspace: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        height:"80vh",
        maxHeight:"80vh"
    },   
    paperAddUser: {
        backgroundColor: theme.palette.background.paper,
        borderRadius: 10,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
      },
    avatar: {
        backgroundColor: "#52776c"
    },
    button: {
        backgroundColor: "#757575"
    }
  }));

const EditChatModal = () => {    
    const classes = useStyles();
    const [manageChatOpen, setManageChatOpen] = React.useState(false);
    const [selectedCompanySection, setSelectedCompanySection] = React.useState('Group Chat'); 
    const [chatData, setChatData] = React.useState({});
    const [usersInSearch, setUsersInSearch] = React.useState([]);
    const [openAddUser, setOpenAddUser] = React.useState(false);
    const [selectedUserToAdd, setAddUser] = React.useState({});
    const [workspaceUsers, setWorkspaceUsers] = React.useState([]);
    const [deleteWorkspaceName, setDeleteWorkspaceName] = React.useState("")
    const [load , setLoad] = React.useState(false);

    useEffect(() => {
        if(manageChatOpen && !load){
            getChatData()
        }
    }, [manageChatOpen, usersInSearch, chatData, load]);

    const getChatData = () => {
        if(!load){
            axios.get(`/groupChat/`, {params: { group_id: store.getState().selectedPanel.id} } )
            .then(res =>{
                console.log(res.data.data)
                setChatData(res.data.data)
                setLoad(true)
            });
        }
    };

    let usersFoundInSearch = (keypressed, searchName) => {
        if(keypressed === "Enter"){
            axios.get('/users/names', {params:{
                name: searchName, 
                users: chatData.users
                }} 
            )
            .then(res => {
                setUsersInSearch(res.data.data)
            }) 
        }
    }
  
    const addSelectedUser = (e) => {
        let userCardToDelete = 'user_card_'+selectedUserToAdd._id
        document.getElementById(userCardToDelete).remove() //Deletes the added user from the list 
        
        axios.patch('/groupchat/', {
            userid: selectedUserToAdd._id,
            groupid: chatData._id
        })
        .then(res => {
            setLoad(false)
            getChatData()
        })
        
        setOpenAddUser(false)
    }

    const handleAddUser = (event, user) => {
      setAddUser(user);
      setOpenAddUser(true)
    };

    const sectionChanged = (e) => {
        if(e.toString() === "Add Users from Workspace"){
            let user_list = []

            store.getState().allSelectedWorkspaceData.users.map(async workspace_user => {
                let addUser = true

                for(var i in chatData.users){
                    if(chatData.users[i] === workspace_user._id){
                        addUser = false
                        break;
                    }
                }
                
                if(addUser){
                    await axios.get(`/users/${workspace_user}`)
                    .then(res =>{
                        user_list.push(res.data.data)
                        setLoad(false)
                    })
                }
            })

            setWorkspaceUsers(user_list)
        }
            
        if(e !== "Add Users"){
            setUsersInSearch("");
        }

        setSelectedCompanySection(e);
    };

    const saveNewChatName = async () => {
        await axios.patch('/groupchat/name/', {
            params: {
                group_id: chatData._id,
                newName: document.getElementById('new_name_text_field').value
            }
        });
        
        getCompanies('');               // Reload workspaces list
        setManageChatOpen(false)   // Close modal
    };

    return(
        <div>
            <Button
                variant="contained"
                className={classes.button}
                startIcon={<SettingsIcon />}
                onClick={e => setManageChatOpen(true)}
            >
                Edit Chat
            </Button>
        
            <Modal 
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={manageChatOpen}
                onClose={e => setManageChatOpen(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{timeout: 500}}
                >
                <Fade in={manageChatOpen}>
                    <div id="modal_paper" className={classes.paper, classes.paperManageWorkspace}>
                        <Typography variant="h6" align="center">Manage Group Chat {chatData.name}</Typography>

                        <ButtonGroup variant="text" color="inherit" aria-label="text primary button group" >
                            <Button selected onClick={e => sectionChanged(e.target.textContent)}>Group Chat</Button>
                            <Button onClick={e => sectionChanged(e.target.textContent)}>Users</Button>
                            <Button onClick={e => sectionChanged(e.target.textContent)}>Add Users from Workspace</Button>
                            <Button onClick={e => sectionChanged(e.target.textContent)}>Add Users</Button>
                        </ButtonGroup>

                        <Divider />

                        {selectedCompanySection === "Group Chat" && chatData !== undefined && chatData !== {}  ?
                            <div style={{marginTop:20, overflowX:"hidden", overflowY:"auto", maxHeight:"60vh"}}>
                                <Typography>Number of Users: {chatData.users !== undefined? chatData.users.length : null}</Typography>
                                
                                <Divider style={{marginTop:10, marginBottom:10 }} />

                                <Typography>Change Company Name</Typography>
                                <TextField id="new_name_text_field" label="New Company Name" defaultValue={chatData.name} fullWidth margin="normal" InputLabelProps={{ shrink: true, }} />
                                <Button onClick={saveNewChatName}>Save New Name</Button>
                            </div>
                            : null
                        }

                        {selectedCompanySection === "Users" && chatData !== undefined && chatData !== {} ?
                            <Grid container direction="column" wrap="nowrap" style={{overflow:"auto", maxHeight:"60vh"}}>
                                {chatData.users.map((user_id, index) =>( 
                                    <User item {...{user_id, chatData, setChatData, load , setLoad}} /> 
                                ) )}
                            </Grid>
                            : null
                        }

                        {selectedCompanySection === "Add Users from Workspace" && chatData !== undefined && chatData !== {}?
                        <div >
                            {/* List of search results */}
                            <div style={{overflow:"auto", maxHeight: "50vh", }} >
                                {workspaceUsers !== [] && workspaceUsers.length > 0 ?
                                    workspaceUsers.map((user, index) => (
                                        <Card id={'user_card_'+user._id} onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2f3136"} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f1b92e"} style={{backgroundColor: "#2f3136"}}>
                                        <CardHeader
                                            avatar={
                                            <Avatar className={classes.avatar}>
                                                {user.name !== undefined ?
                                                getAcronym(user.name)
                                                :
                                                null
                                                }
                                            </Avatar>
                                            }
                                            action={
                                                <div>
                                                    <IconButton id={user._id} aria-controls="simple-menu" aria-haspopup="true" onClick={e=> handleAddUser(e, user)} > {/*onClick={e => handleOpen(user)}>*/}
                                                        <AddCircleIcon />
                                                    </IconButton>
                                                    
                                                    <Modal  
                                                        aria-labelledby="transition-modal-title"
                                                        aria-describedby="transition-modal-description"
                                                        className={classes.modal}
                                                        open={openAddUser}
                                                        onClose={e => setOpenAddUser(false)}
                                                        closeAfterTransition
                                                        BackdropComponent={Backdrop}
                                                        BackdropProps={{timeout: 500}}
                                                    >
                                                        <Fade in={openAddUser}>
                                                            <div className={classes.paper, classes.paperAddUser}>
                                                                <Typography variant="h6" noWrap={true} >Are you sure you wish to add the user <span style={{color:"#f1b92e"}}>{selectedUserToAdd.name}</span> to the company <span style={{color:"#f1b92e"}}>{chatData.name}</span> as {selectedUserToAdd.admin ? "an Admin" : "a User"}</Typography>
                                                                
                                                                <div className="center-align">
                                                                    <Button id={selectedUserToAdd._id} onClick={e => addSelectedUser()}>Add User</Button>
                                                                    <Button onClick={e => setOpenAddUser(false)}>Cancel</Button>
                                                                </div>
                                                            </div>
                                                        </Fade>
                                                    </Modal>
                                                </div>
                                            }
                                            title={user.name}
                                            subheader={user.email}
                                        />
                                        <CardMedia
                                        />
                                    </Card>
                                    ))
                                    :
                                    null
                                }
                            </div>
                        </div>
                        :null
                        }

                        {selectedCompanySection === "Add Users" && chatData !== undefined && chatData !== {} ?
                        <div >
                            {/* Text field to search for users */}
                            <TextField  id="search_textfield" label="Search" margin="small" style={{width:"100%"}} onKeyPress={e => usersFoundInSearch(e.key, e.target.value)} />

                            {/* List of search results */}
                            <div style={{overflow:"auto", maxHeight: "50vh", }} >
                                {usersInSearch !== [] && usersInSearch.length > 0 ?
                                    usersInSearch.map((user, index) => (
                                        <Card id={'user_card_'+user._id} onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2f3136"} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f1b92e"} style={{backgroundColor: "#2f3136"}}>
                                        <CardHeader
                                            avatar={
                                            <Avatar className={classes.avatar}>
                                                {user.name !== undefined ?
                                                getAcronym(user.name)
                                                :
                                                null
                                                }
                                            </Avatar>
                                            }
                                            action={
                                                <div>
                                                    <IconButton id={user._id} aria-controls="simple-menu" aria-haspopup="true" onClick={e=> handleAddUser(e, user)} > {/*onClick={e => handleOpen(user)}>*/}
                                                        <AddCircleIcon />
                                                    </IconButton>
                                                    
                                                    <Modal  
                                                        aria-labelledby="transition-modal-title"
                                                        aria-describedby="transition-modal-description"
                                                        className={classes.modal}
                                                        open={openAddUser}
                                                        onClose={e => setOpenAddUser(false)}
                                                        closeAfterTransition
                                                        BackdropComponent={Backdrop}
                                                        BackdropProps={{timeout: 500}}
                                                    >
                                                        <Fade in={openAddUser}>
                                                            <div className={classes.paper, classes.paperAddUser}>
                                                                <Typography variant="h6" noWrap={true} >Are you sure you wish to add the user <span style={{color:"#f1b92e"}}>{selectedUserToAdd.name}</span> to the company <span style={{color:"#f1b92e"}}>{chatData.name}</span> as {selectedUserToAdd.admin ? "an Admin" : "a User"}</Typography>
                                                                
                                                                <div className="center-align">
                                                                    <Button id={selectedUserToAdd._id} onClick={e => addSelectedUser()}>Add User</Button>
                                                                    <Button onClick={e => setOpenAddUser(false)}>Cancel</Button>
                                                                </div>
                                                            </div>
                                                        </Fade>
                                                    </Modal>
                                                </div>
                                            }
                                            title={user.name}
                                            subheader={user.email}
                                        />
                                        <CardMedia
                                        />
                                    </Card>
                                    ))
                                    :
                                    null
                                }
                            </div>
                        </div>
                        :null
                        }
                    </div>
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
      taskCollectionIDs: state.taskCollectionIDs, 
      workspaceTaskCollections: state.workspaceTaskCollections,
      user: state.user,
      allSelectedWorkspaceData: state.allSelectedWorkspaceData
    }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditChatModal)