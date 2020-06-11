import React, { useEffect } from 'react';
import axios from 'axios'
import store from '../../store';
import { connect } from 'react-redux';
import { useSelector } from 'react-redux';
import { Redirect } from "react-router-dom";

//UI
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import List from '@material-ui/core/List';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';

//UI ICONS
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';

import MobileDashboard from './mobileScreen/MobileDashboard.js';

import { CompanyDrawer, WorkspaceDrawer } from './components/drawers/Drawers.js';
import WorkspacePanelItems from './components/workspace/WorkspaceButtonList.js';

import EditUserModal from './components/modals/editUserModal.js';

import LeaveChatModal from './components/modals/chatModals/leaveChatModal.js';
import DeleteChatModal from './components/modals/chatModals/deleteChatModal.js';
import AddGroupChatModal from './components/modals/chatModals/addGroupChatModal.js';
import AddPrivateChatModal from './components/modals/chatModals/addPrivateChatModal.js';
import EditChatModal from './components/modals/chatModals/editChatModal.js';

import WorkspaceMenu from './components/menus/menu.js';
import { getCompanies, checkIfAdmin } from './DataLoading.js';

// import Calendar from './calendar/calendar.js';
import Calendar from './components/calendar/calendar.js';
import Chat from './groupchat/Chat.js';
import PrivateChat from './groupchat/PrivateChat.js';
import Chart from './chart/Charts.js';
import ToDoPage from './toDoList/toDoPage.js';
import Announcements from './announcements/announcements.js';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height:"100vh",
    backgroundColor: '#202225',
    width:"100%"
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  menuButton: {
    marginRight: 0,
  },
  menuButtonHidden: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: '#202225'
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  content: {
    flexGrow: 1,
    marginTop: '1vh',
    overflowX: "auto", 
    overflowY: "hidden", 
    width:"100%",
    backgroundColor: '#36393f',
  },
  mobile_content: {
    flexGrow: 1,
    overflow: 'auto',
    backgroundColor: '#36393f'
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    paddingBottom: 50,
  },
  title:{
    flexGrow: 1
  },
  text: {
    padding: theme.spacing(2, 2, 0),
  },
  list: {
    marginBottom: theme.spacing(2),
  },
  subheader: {
    backgroundColor: theme.palette.background.paper,
  },
  mobileBottomAppBar: {
    top: 'auto',
    backgroundColor: '#52776c',
    bottom: 0,
  },
  mobileTopAppBar: {
    top: 'auto',
    backgroundColor: '#52776c',
  },
  grow: {
    flexGrow: 1,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(0),
  },
}));

function Dashboard() {
  const classes = useStyles();
  let selectedPanel = useSelector(state => state.selectedPanel)
  const [user, setUser] = React.useState({name: ""})
  const [redirect, setRedirect] = React.useState(false);
  let category = useSelector(state => state.chartCategory)

  const [openAddGroupChat, setOpenGroupChat] = React.useState(false);
  const [openAddPrivateChat, setOpenPrivateChat] = React.useState(false);

  const [newUserOpen, setNewUserOpen] = React.useState(false);


  useEffect(() => { 
    document.getElementById('html').style.overflow = "hidden"
    axios.get(`/users/status`)
    .then(res =>{
      if(res.status === 200 && user.name === ""){
        store.dispatch({ type: 'USER_LOGGED_IN', data: { user: res.data.data }})  
        setUser(store.getState().user)

        if(res.data.data.companies.length > 0){ //New user won't have any companies
          getCompanies("")
        }
        else{
          setNewUserOpen(true)
        }
      }
    })
    .catch(() => {
      setRedirect(true)
    })

  }, [store.getState().selectedCompany]);
  

  //Menu Item 
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddGroupChat = () => {
    setOpenGroupChat(true)
    handleClose()
  };

  const handleAddPrivateChat = () => {
    setOpenPrivateChat(true)
    handleClose()
  };

  const logout = () => {
    axios.get('/users/logout')
    .then(() => {
      store.dispatch({ type: 'USER_LOGGED_OUT', data: { user: { name: "" } }})
      setRedirect(true)
    })
  };


  //Charts select
  const handleChange = (event) => {
    store.dispatch({ type: 'CHART_CATEGOREY_CHANGED', data: { chartCategory: event.target.value }})
  };

  const getRole = () => {
    return(user.owner && store.getState().selectedCompany === user.companies[0] ? "Owner" : checkIfAdmin())
  }

  const adminChatButtons = () =>{
    let type = "Group"
    for(var i in store.getState().allSelectedWorkspaceData.group_chats){
      if(store.getState().selectedPanel.id !== undefined && store.getState().allSelectedWorkspaceData.group_chats[i]._id === store.getState().selectedPanel.id){
        return(
          <Grid container style={{float:"right", marginLeft:"auto"}} justify="flex-end">
            {store.getState().allSelectedWorkspaceData.group_chats.map(group_chat => {
                if(group_chat.users.length > 1){
                  return(<LeaveChatModal item />)
                }
              }
            )}
            
            
            {getRole() === "Owner" || getRole() === "Admin" ?
              <EditChatModal item /> : null}
              
              {/* Render the delete chat button on appbar if owner/admin */}
              {getRole() === "Owner" || getRole() === "Admin" ?
              <DeleteChatModal item {...{type}} /> : null}
          </Grid>
        )
      }
    }

    type = "Private"
    for(var i in store.getState().allSelectedWorkspaceData.private_chats){
      if(store.getState().selectedPanel.id !== undefined && store.getState().allSelectedWorkspaceData.private_chats[i]._id === store.getState().selectedPanel.id){
        return(
          <Grid container style={{float:"right", marginLeft:"auto"}} justify="flex-end">
            <DeleteChatModal item {...{type}} /> 
        </Grid>
        )
      }
    }
    
  }

  return (
    <div>
    {redirect ? <Redirect to="/login"/> : null}

    <Modal 
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={newUserOpen}
      // onClose={e => setManageWorkspaceOpen(false)}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{timeout: 500}}
      >
      <Fade in={newUserOpen}>
          <div id="modal_paper" style={{marginTop:"25vh"}}>
            <Typography variant="h6" align="center">Welcome to Oogwai</Typography>
            <Typography variant="body1" align="center">At the current point, you are not assigned to any companies. Please get in to contact with your company administrator to add you to the company.</Typography>
            <Typography variant="body1" align="center" style={{marginTop:35}}>Please log out and try again later.</Typography>
            <Typography align="center" style={{marginTop:10}}>
              <Button align="center" onClick={logout}>Logout</Button>
            </Typography>
          </div>
      </Fade>
    </Modal>

    {user.name !== "" ?
      <div className={classes.root} style={{overflow:"hidden"}}>
        <CssBaseline />
        
        {/* <Hidden smDown> */}
          <CompanyDrawer classes={classes} />

          <WorkspaceDrawer classes={classes} />
  
          {/* Workspace Panel buttons */}
          <Grid container md={2} spacing={0} style={{minWidth:200}}>
              {/* Workspace name area */}
              <Grid item md={12} >
                <div >
                  <Paper className="valign-wrapper" style={{paddingLeft:25, paddingRight:20, width:"100%", height:"10vh", backgroundColor:"#2f3136", borderTopLeftRadius:50, marginTop:"1vh",}}>
                    <Avatar alt="Logo" src="logo.png"  style={{float:"left"}}/>

                    <Typography  style={{float:"left", marginLeft:15, marginRight:"auto"}}>
                      {store.getState().allSelectedWorkspaceData.name}
                    </Typography> 

                    <IconButton aria-label="settings" onClick={handleClick} style={{float:"right"}}>
                      <MoreVertIcon />
                    </IconButton>

                      <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                      >
                        {getRole() === "Owner" || getRole() === "Admin" ?
                          
                          <MenuItem onClick={handleAddGroupChat}>Add Group Chat
                          </MenuItem>
                          :
                          null
                        }
                        {getRole() === "Owner" || getRole() === "Admin" ?
                        <AddGroupChatModal {...{openAddGroupChat, setOpenGroupChat}} />
                        :null}


                        <MenuItem onClick={handleAddPrivateChat}>Add Private Chat</MenuItem>
                        <AddPrivateChatModal {...{openAddPrivateChat, setOpenPrivateChat}} />

                        <MenuItem onClick={logout}>Logout</MenuItem>

                      </Menu>
                  </Paper>
                </div>
              </Grid>

              {/* List of Page buttons */}
              <Grid item md={12} >
                <div style={{height:"79vh", backgroundColor:"#2f3136", overflow:"auto" }}>
                  <List style={{backgroundColor:"#2f3136",  minWidth:"46px" }} >
                    <WorkspacePanelItems />
                  </List>
                </div>
              </Grid>

              {/* User Card */}
              <Grid item md={12} >
                <div style={{ height:"10vh", backgroundColor:"#202225", verticalAlign:"text-top"}} >
                  <Card elevation={0} style={{backgroundColor:"#202225", shadow:"none", paddingTop:0}}>
                      <CardHeader
                        avatar={<Avatar aria-label="avatar" className={classes.avatar}>{user.name !== "" ? user.name[0] : null}</Avatar>}
                        action={<EditUserModal/>}
                        title={user.name !== "" ? user.name : null}
                        subheader={getRole()}
                      />
                  </Card>
                  
                </div>
              </Grid>

          </Grid>

          {/* Content panel */}
          <Grid container id="main" className={classes.content} > 
          
            {/* Top bar with search */}
            <AppBar container id="appbar" position="static" style={{backgroundColor:"#2f3136"}} width={document.getElementById('main') !== null ? document.getElementById('main').scrollWidth : null}>
              <Toolbar>
                <Typography variant="h6" style={{float:"left", width:"50%"}}>{selectedPanel.name}</Typography>

                  {selectedPanel.id === "Charts" ?
                        <FormControl className={classes.formControl} style={{marginLeft:50}}>
                          <FormHelperText>Select Category To View</FormHelperText>
                        {/* <Typography>Select Category To View</Typography> */}
                            <Select
                              value={category}
                              onChange={handleChange}
                              displayEmpty
                              className={classes.selectEmpty}
                              inputProps={{ 'aria-label': 'Without label' }}
                            >
                                <MenuItem value="Collections" >Collections</MenuItem>
                                <MenuItem value="Deadlines" >Deadlines</MenuItem>
                            </Select>
                        </FormControl>
                  : null}
                  
                  {selectedPanel.id === "" ?
                    <div>
                      <InputBase style={{width:"25%", float:"right"}} placeholder="Search" inputProps={{ 'aria-label': 'search' }} />
                      <IconButton  edge="start" color="inherit" aria-label="menu">
                        <SearchIcon />
                      </IconButton>
                    </div>
                  : null}
                  
                  {store.getState().allSelectedWorkspaceData.group_chats !== undefined && selectedPanel.id !== "Calendar" && selectedPanel.id !== "Charts" && selectedPanel.id !== "Tasks" && selectedPanel.id !== "Announcements" ?
                    adminChatButtons()
                    :
                    null
                  }

              </Toolbar>
            </AppBar>
            
            {/* Main body of content */}
              {/* General layout */}
              {/* Text chat layout */}

              {/* Tasks layout */}
                {selectedPanel.id === "Tasks" ? 
                  <div item className={classes.container} style={{width:"100%", overflow:"auto", height:"90vh", paddingLeft: 25 }}>
                    <ToDoPage />
                  </div>
                : 
                null
                }

              {/* Announcements layout */}
              {selectedPanel.id === "Announcements" ? 
                  <div item className={classes.container} style={{width:"100%", overflow:"auto", height:"90vh", paddingLeft: 25 }}>
                    <Grid item xs={12} md={8} lg={9}>
                        <Announcements />
                    </Grid>
                  </div>
              : 
              null
              }

              {/* Calendar layout */}
              {selectedPanel.id === "Calendar" ? 
                <div item className={classes.container} style={{width:"100%", overflow:"auto", height:"90vh", paddingLeft: 25 }}>
                  <Grid item xs={12} md={12} lg={12}>
                      <br />
                      <Calendar />
                  </Grid>
                </div>
              : 
              null
              }

              {/* Charts layout */}
              {selectedPanel.id === "Charts" ? 
                <div item className={classes.container} style={{width:"100%", overflow:"auto",height:"90vh", paddingLeft: 25 }}>
                  <Chart {...{category}}/>
                </div>  
              : 
              null
              }

              {/* Chat layout */}
              {selectedPanel.id !== "Calendar" && selectedPanel.id !== "Charts" && selectedPanel.id !== "Tasks" && selectedPanel.id !== "Announcements" && store.getState().allSelectedWorkspaceData.group_chats !== undefined ? //Checks if non-standard-defined name and there is data for the workspace
                store.getState().allSelectedWorkspaceData.group_chats.length > 0 ? //Checks there are group chats available
                  store.getState().allSelectedWorkspaceData.group_chats.map((group_chat) => { //Loop through each group chat
                    if(group_chat.title === selectedPanel.name){ //Render the page if the selected panel name is the same as the current group chat being checked
                      return(
                        <div item className={classes.container} style={{width:"100%", overflow:"hidden", height:"90vh", paddingTop:0 }}>
                          <Chat {...group_chat} />
                        </div>
                      )
                    }
                  })
                :
                null
              :
              null
              }

              {/* Chat layout */}
              {selectedPanel.id !== "Calendar" && selectedPanel.id !== "Charts" && selectedPanel.id !== "Tasks" && selectedPanel.id !== "Announcements" && store.getState().allSelectedWorkspaceData.private_chats !== undefined ? //Checks if non-standard-defined name and there is data for the workspace
                store.getState().allSelectedWorkspaceData.private_chats.length > 0 ? //Checks there are group chats available
                  store.getState().allSelectedWorkspaceData.private_chats.map((private_chat) => { //Loop through each group chat
                    if(private_chat._id === selectedPanel.id){ //Render the page if the selected panel name is the same as the current group chat being checked
                      return(
                        <div item className={classes.container} style={{width:"100%", overflow:"hidden", height:"90vh", paddingTop:0 }}>
                          <PrivateChat {...private_chat} />
                        </div>
                      )
                    }
                  })
                :
                null
              :
              null
              }
                          

          </Grid>

        {/* </Hidden> */}

        {/* <Hidden mdUp>
          <MobileDashboard />
        </Hidden> */}
      </div>
      :
      null
    }
    </div>
  );
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

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)