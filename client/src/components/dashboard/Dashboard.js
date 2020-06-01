import React, { useEffect } from 'react';
import clsx from 'clsx';
import axios from 'axios'
import store from '../../store';
import { connect } from 'react-redux';
import { useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import InputBase from '@material-ui/core/InputBase';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';


import SettingsIcon from '@material-ui/icons/Settings';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';

import MobileDashboard from './mobileScreen/MobileDashboard.js';
import { CompanyDrawer, WorkspaceDrawer } from './components/drawers/Drawers.js';
import WorkspacePanelItems from './components/workspace/WorkspaceButtonList.js';
import EditUserModal from './components/modals/editUserModal.js';
import WorkspaceMenu from './components/menus/menu.js';
import { getCompanies, checkIfAdmin } from './DataLoading.js';

import Calendar from './calendar/calendar.js';
// import Calendar from './components/calendar/calendar.js';
import Chat from './groupchat/Chat.js';
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
  },
  title:{
    flexGrow: 1
  },
  fixedHeight: {
    height: 240,
  },
  text: {
    padding: theme.spacing(2, 2, 0),
  },
  paper: {
    paddingBottom: 50,
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
}));

function Dashboard() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  
  var selected_workspace_name = "";
  var selectedWorkspace =  {}
  var selectedPanel = useSelector(state => state.selectedPanel)
  var user = useSelector(state=> state.user)
  var role = user.owner && store.getState().selectedCompany === user.companies[0] ? "Owner" : checkIfAdmin()

  useEffect(() => { 
    //Load user if no name found
    if( store.getState().user.name === ""){
      axios.get(`/users/status`)
      .then(res =>{
        store.dispatch({ type: 'USER_LOGGED_IN', data: { user: res.data.data }})  
        user = store.getState().user
        getCompanies("")
      })
    }
  }, [store.getState().selectedCompany, store.getState().selectedWorkspace, store.getState().selectedPanel]);
  
  
  if(store.getState().workspaces[0] !== undefined){
    for (var i in store.getState().workspaces){
      if (store.getState().workspaces[i]._id === store.getState().selectedWorkspace){
        selectedWorkspace = store.getState().workspaces[i] // Sets the name of the selected Workspace
        selected_workspace_name = selectedWorkspace.name
      }
    }    
  }
  
  //Menu Item 
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root} style={{overflow:"hidden"}}>
      <CssBaseline />
      
      <Hidden smDown>
        <CompanyDrawer classes={classes} />

        <WorkspaceDrawer classes={classes} />
 
        {/* Workspace Panel buttons */}
        <Grid container md={2} spacing={0} style={{minWidth:200}}>
            {/* Workspace name area */}
            <Grid item md={12} >
              <div >

              <Card style={{height:"10vh", backgroundColor:"#2f3136", borderTopLeftRadius:50, marginTop:"1vh", width:'100%'}} className="valign-wrapper center-align" >
                <CardHeader
                  avatar={<Avatar alt="Logo" src="logo.png"  />} //{/*className={classes.avatar}>*/}
                  action={
                    <IconButton aria-label="settings" style={{}}>
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title={selected_workspace_name !== undefined ? <Typography style={{width:"100%"}}>{selected_workspace_name}</Typography> : null}
                  // subheader={user.name !== undefined && role !== undefined ? user.name + " : " + role : null}
                />
                
              </Card>

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
                      avatar={<Avatar aria-label="avatar" className={classes.avatar}>{user.name[0]}</Avatar>}
                      // action={<IconButton aria-label="settings"><SettingsIcon /></IconButton>}
                      action={<EditUserModal/>}
                      title={user.name}
                      subheader={role}
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
              <Typography variant="h6" />
                <InputBase style={{width:"25%", float:"right"}} placeholder="Search" inputProps={{ 'aria-label': 'search' }} />
                <IconButton  edge="start" color="inherit" aria-label="menu">
                  <SearchIcon />
                </IconButton>
            </Toolbar>
          </AppBar>
          

          {/* Main body of content */}
          {/* <Grid container direction="column" spacing={0} style={{width:"100%",overflow:"scroll"}} > */}
          <div style={{width:"100%", overflow:"auto"}} >   
              {/* <Grid item md={12} > */}
                  {/* General layout */}
                  {/* Text chat layout */}

                <div item className={classes.container} style={{height:"90vh", paddingLeft: 25 }}>

                  {/* Tasks layout */}
                    {selectedPanel === "Tasks" ? 
                      <ToDoPage />
                    : 
                    null
                    }

                  {/* Announcements layout */}
                  {selectedPanel === "Announcements" ? 
                    <Grid item xs={12} md={8} lg={9}>
                      {/* <Paper className={fixedHeightPaper}> */}
                        <Announcements />
                      {/* </Paper> */}
                    </Grid>
                  : 
                  null
                  }

                  {/* Calendar layout */}
                  {selectedPanel === "Calendar" ? 
                    <Grid item xs={12} md={12} lg={12}>
                        <br />
                        <Calendar />
                    </Grid>
                  : 
                  null
                  }

                  {/* Charts layout */}
                  {selectedPanel === "Charts" ? 
                    <div>
                      <Chart />
                    </div>  
                  : 
                  null
                  }

                  {/* Chat layout */}
                  {selectedPanel !== "Calendar" && selectedPanel !== "Charts" && selectedPanel !== "Tasks" && selectedPanel !== "Announcements" && store.getState().allSelectedWorkspaceData.group_chats !== undefined ? //Checks if non-standard-defined name and there is data for the workspace
                    store.getState().allSelectedWorkspaceData.group_chats.length > 0 ? //Checks there are group chats available
                      store.getState().allSelectedWorkspaceData.group_chats.map((group_chat) => { //Loop through each group chat
                        if(group_chat.title === selectedPanel){ //Render the page if the selected panel name is the same as the current group chat being checked
                          return(<Chat {...group_chat} />)
                        }
                      })
                    :
                    null
                  :
                  null
                  }

                  </div>
                {/* </div> */}
              {/* </Grid> */}
          </div>
        </Grid>

      </Hidden>

      <Hidden mdUp>
        <MobileDashboard />
      </Hidden>
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