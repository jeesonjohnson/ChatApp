import React, { useEffect } from 'react';
import clsx from 'clsx';
import axios from 'axios';
import store from './../../../store';
import { connect } from 'react-redux';
import { useSelector } from 'react-redux';
import { Redirect } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Paper from '@material-ui/core/Paper';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert';


import MenuIcon from '@material-ui/icons/Menu';

import { getCompanies } from '../DataLoading.js';

const useStyles = makeStyles((theme) => ({
  root: {
      display: 'flex',
    height:"100vh",
    backgroundColor: '#202225'
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
  title: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    marginTop: '1vh',
    overflow: 'auto',
    backgroundColor: '#36393f',
    borderTopLeftRadius: 50,
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

function MobileDashboard() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [redirect, setRedirect] = React.useState(false);
  const [user, setUser] = React.useState({name:""});
  let workspace = useSelector(state=> state.selectedWorkspace)
  let workspaceData = useSelector(state => state.allSelectedWorkspaceData)

  useEffect(()=> {
    // console.log(store.getState())
    // if (store.getState().selectedCompany === ""){
    //   getCompanies("")
    // }
    // else{
    //   getCompanies(store.getState().selectedCompany)
    // }
    if(user.name === ""){
      axios.get(`/users/status`)
      .then(res =>{
        if(res.status === 200 && user.name === ""){
          store.dispatch({ type: 'USER_LOGGED_IN', data: { user: res.data.data }})  
          setUser(store.getState().user)
          getCompanies("")
        }
      })
      .catch(() => {
        setRedirect(true)
      })
    }

  }, [store.getState().companies, store.getState().workspaces, store.getState().allSelectedWorkspaceData ]);
  
  const [companyAnchorEl, setCompanyAnchorEl] = React.useState(null);
  const handleCompanyClick = (event) => {
    setCompanyAnchorEl(event.currentTarget);
  };
  const handleCompanyClose = () => {
    setCompanyAnchorEl(null);
  };

  const [workspaceanchorEl, setWorkspaceAnchorEl] = React.useState(null);
  const handleWorkspaceClick = (event) => {
    setWorkspaceAnchorEl(event.currentTarget);
  };
  const handleWorkspaceClose = () => {
    setWorkspaceAnchorEl(null);
  };

  const [panelanchorEl, setPanelAnchorEl] = React.useState(null);
  const handlePanelClick = (event) => {
    setPanelAnchorEl(event.currentTarget);
    // workspaceData
  };
  const handlePanelClose = () => {
    setPanelAnchorEl(null);
  };

  const getPrivateChat = async (private_chat) => {
    let a
    axios.get(`/users/${private_chat.user1}`)
    .then(res => {
      a =  {
        id: res.data.data._id,
        name: res.data.data.name
      }
    })

    return(<MenuItem id={a.id} onClick={handlePanelClose}>{a.name}</MenuItem>) 
  }
 
  return (
      <div className={classes.mobile_content}>
        {redirect ? <Redirect to="/login"/> : null}
        
        <AppBar color="primary" className={classes.mobileTopAppBar}>
          <Typography variant="h6" className="center-align">
            {workspace + " - " + "(Name of current page)"}
          </Typography>
        </AppBar>

        <main className={classes.mobile_content} style={{overflow:"auto", marginBottom:60}}> 
          <Container item maxWidth="lg" className={classes.container}>
            <div style={{paddingTop:20}}></div>
              <Grid container spacing={3} >
                {/* Calendar */}
                <Grid item xs={12} md={8} lg={9}>
                  <Paper className={fixedHeightPaper}>
                    {/* <Chart /> */}
                  </Paper>
                </Grid>
                {/* Charts */}
                <Grid item xs={12} md={4} lg={3}>
                  <Paper className={fixedHeightPaper}>
                    {/* <Deposits /> */}
                  </Paper>
                </Grid>
                {/* Tasks */}
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    {/* <Orders /> */}
                  </Paper>
                </Grid>
              </Grid>
            </Container>
        </main>

        <AppBar position="fixed" color="primary" className={classes.mobileBottomAppBar}>
          <Toolbar>

          <Grid container>

            <Grid item xs={4}>
              <ListItem button  container dense={true} alignItemsFlexStart onClick={handleCompanyClick}>
                <ListItemAvatar>
                  <Avatar style={{backgroundColor:"#725bda"}}>{"C"}</Avatar>
                </ListItemAvatar>
                <Hidden only='xs'>
                  <ListItemText primary={"Companies"} />
                </Hidden>
              </ListItem>

              <Menu id="company-menu" anchorEl={companyAnchorEl} keepMounted open={Boolean(companyAnchorEl)} onClose={handleCompanyClose}>
                {store.getState().companies !== [] && store.getState().companies.length > 0 ?
                  store.getState().companies.map(company => (
                    <MenuItem>{company.name}</MenuItem>
                  ))
                  :
                  null
                }
              </Menu>

            </Grid>

            <Grid item xs={4}>
              <ListItem button  container dense={true} alignItemsFlexStart aria-controls="workspace-menu" aria-haspopup="true" onClick={handleWorkspaceClick}>
                <ListItemAvatar style={{}}>
                  <Avatar style={{backgroundColor:"#725bda"}}>{"W"}</Avatar>
                </ListItemAvatar>
                <Hidden only='xs'>
                  <ListItemText primary={"Workspaces"} />
                </Hidden>
              </ListItem>

              <Menu id="workspace-menu" anchorEl={workspaceanchorEl} keepMounted open={Boolean(workspaceanchorEl)} onClose={handleWorkspaceClose}>
                {store.getState().workspaces !== [] && store.getState().workspaces.length > 0 ?
                  store.getState().workspaces.map(workspace => (
                    <MenuItem onClick={handleWorkspaceClose}>{workspace.name}</MenuItem>
                  ))
                  :
                  null
                }
                
                
              </Menu>

            </Grid>

            <Grid item xs={4}>
              <ListItem button  container dense={true} alignItemsFlexStart aria-controls="panel-menu" aria-haspopup="true" onClick={handlePanelClick}>
                <ListItemAvatar style={{}}>
                  <Avatar style={{backgroundColor:"#725bda"}}>{"P"}</Avatar>
                </ListItemAvatar>
                <Hidden only='xs'>
                  <ListItemText primary={"Planner"} />
                </Hidden>
              </ListItem>
            </Grid>

            <Menu id="panel-menu" anchorEl={panelanchorEl} keepMounted open={Boolean(panelanchorEl)} onClose={handlePanelClose}>
              <MenuItem onClick={e => console.log(store.getState())}>Calendar</MenuItem>
              <MenuItem onClick={handlePanelClose}>Charts</MenuItem>
              <MenuItem onClick={handlePanelClose}>Tasks</MenuItem>
              <MenuItem onClick={handlePanelClose}>General</MenuItem>
              <MenuItem onClick={handlePanelClose}>Announcements</MenuItem>
              <Divider />
              <MenuItem>Group Chats</MenuItem>
              {workspaceData.group_chats !== undefined && workspaceData.group_chats.length > 0 ?
                workspaceData.group_chats.map(group_chat =>(
                  <MenuItem id={group_chat._id} onClick={handlePanelClose}>{group_chat.title}</MenuItem>
                ))
                :
                null
              }
              <Divider />
              <MenuItem>Private Chats</MenuItem>
              {workspaceData.private_chats !== undefined && workspaceData.private_chats.length > 0 ?
                workspaceData.private_chats.map( async (private_chat) =>(
                  // console.log(private_chat)
                  getPrivateChat(private_chat)
                ))
                :
                null
              }
            </Menu>

          </Grid>
          
            <div className={classes.grow} />
            <IconButton edge="start" color="inherit" aria-label="open drawer">
              <MenuIcon />
            </IconButton>
            
            
            <IconButton color="inherit">
              <SearchIcon />
            </IconButton>
            
            <IconButton edge="end" color="inherit">
              <MoreIcon />
            </IconButton>
          
          </Toolbar>
        </AppBar>
      </div>
  )
}

const mapStateToProps = state => {
  return {selectedCompany: state.selectedCompany, companies: state.companies, workspaces: state.workspaces, selectedWorkspace: state.selectedWorkspace}
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileDashboard)