import React, { useEffect } from 'react';
import clsx from 'clsx';
import axios from 'axios'
import store from './../../store';
import { connect } from 'react-redux';
import { useSelector, useDispatch } from 'react-redux';

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
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import InputBase from '@material-ui/core/InputBase';

import SettingsIcon from '@material-ui/icons/Settings';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';

import MobileDashboard from '../dashboard/mobileScreen/MobileDashboard.js';
import { CompanyDrawer, WorkspaceDrawer } from './components/drawers/Drawers.js';
import WorkspacePanelItems from './components/workspace/WorkspaceButtonList.js';
import EditUserModal from './components/modals/editUserModal.js';
import WorkspaceMenu from './components/menus/menu.js';
import { getCompanies } from './DataLoading.js';

const drawerWidth = 240;

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

function checkIfAdmin(){
  for(var currentCompany in store.getState().companies){
    if (store.getState().companies[currentCompany] === store.getState().selectedCompany){
      for(var currentUser in store.getState().companies[currentCompany]){
        if(store.getState().companies[currentCompany].admins[currentUser] === store.getState().user._id){
          return("Admin")
        }
      }
    } 
    else {
      return("User")
    }
  }
}

function Dashboard() {

  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  var user = store.getState().user
  useSelector(state=> state.selectedPanel)
  useSelector(state=> state.selectedWorkspace)

  useEffect(() => { 
    if( store.getState().user.name === ""){
      axios.get(`/users/status`).then(res =>{
        store.dispatch({ type: 'USER_LOGGED_IN', data: { user: res.data.data }})  
        user = store.getState().user
        getCompanies("")
      })
    }

  });
  
  const selected_workspace_name = useSelector(state=> state.selectedWorkspace);
  const selected_workspace_id = useSelector(state=> state.selectedWorkspace);
  var selectedWorkspace =  {}
  var selectedPanel = ""
  var role = user.owner && store.getState().selectedCompany === user.companies[0] ? "Owner" : checkIfAdmin()
  
  if(store.getState().workspaces[0] !== undefined){
    for (var i in store.getState().workspaces){
      if (store.getState().workspaces[i]._id === store.getState().selectedWorkspace){
        selectedWorkspace = store.getState().workspaces[i] // Sets the name of the selected Workspace
        selectedPanel = selectedWorkspace.name
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
    <div className={classes.root}>
      <CssBaseline />
      
      <Hidden smDown>
        <CompanyDrawer classes={classes} />

        <WorkspaceDrawer classes={classes} />

        <main className={classes.content} style={{overflow:"hidden" }}> 
 
        <Grid container direction="column" justify="space-between" alignItems="stretch" md={2} spacing={0} style={{float:"left"}}>

            <Grid item md={12} >
              <div style={{height:"10vh",backgroundColor:"#2f3136"}} className="valign-wrapper center-align">
                <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                  {selectedPanel}
                </Typography>  
                  <WorkspaceMenu classNames={selectedPanel} />
              </div>
            </Grid>

            <Grid item md={12} >
              <div style={{height:"80vh", backgroundColor:"#2f3136", overflow:"auto"}}>
                <List style={{backgroundColor:"#2f3136",  minWidth:"46px" }} >
                  <WorkspacePanelItems />
                </List>
              </div>
            </Grid>

            <Grid item md={12} >
              <div style={{height:"10vh", backgroundColor:"#202225"}} >
                <Card elevation={0} style={{backgroundColor:"#202225", shadow:"none"}}>
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

        <Grid container direction="column" justify="space-between" alignItems="stretch" md={10} spacing={0} style={{}}>

            <Grid item md={12} >
              <div style={{}} >
                <div style={{backgroundColor:"#2f3136", width:"100%", height:"10vh", paddingTop:"2vh", paddingBottom:"2vh"}}>
                  <IconButton style={{float:"right", marginRight:"10px"}} type="submit" aria-label="search">
                    <SearchIcon />
                  </IconButton>
                  <InputBase style={{width:"25%", float:"right"}}
                    className={classes.input}
                    placeholder="Search"
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </div>
              </div>
            </Grid>

            <Grid item md={12} >
              <div style={{height:"90vh"}} >
                {/* Calendar layout */}
                {/* Charts layout */}
                {/* Tasks layout */}
                {/* General layout */}
                {/* Announcements layout */}
                {/* Text chat layout */}
                {/*  */}

              <Container item maxWidth="lg" className={classes.container}>
                  <Grid container spacing={3} >
                    
                  {store.getState().selectedPanel === "Calendar" ? 
                    <Grid item xs={12} md={8} lg={9}>
                      <Paper className={fixedHeightPaper}>
                        {/* <Calendar /> */}
                        {"Calendar"}
                      </Paper>
                    </Grid>
                    : null}

                  {store.getState().selectedPanel === "Charts" ? 
                    <Grid item xs={12} md={8} lg={9}>
                      <Paper className={fixedHeightPaper}>
                        {/* <Chart /> */}
                        {"Charts"}
                      </Paper>
                    </Grid>
                    : null}
  
                  {store.getState().selectedPanel === "Tasks" ? 
                    <Grid item xs={12} md={8} lg={9}>
                      <Paper className={fixedHeightPaper}>
                        {/* <Tasks /> */}
                        {"Tasks"}
                      </Paper>
                    </Grid>
                    : null}

                    {/* Chart
                    <Grid item xs={12} md={8} lg={9}>
                      <Paper className={fixedHeightPaper}>
                        {/* <Chart /> */}
                        {/* {"1"} */}
                      {/* </Paper> */}
                    {/* </Grid> */}

                    {/* Recent Deposits */}
                    {/* <Grid item xs={12} md={4} lg={3}> */}
                      {/* <Paper className={fixedHeightPaper}> */}
                        {/* <Deposits /> */}
                        {/* {"2"} */}
                      {/* </Paper> */}
                    {/* </Grid> */}
                    
                    {/* Recent Orders */}
                    {/* <Grid item xs={12}> */}
                      {/* <Paper className={classes.paper}> */}
                        {/* <Orders /> */}
                        {/* {"3"} */}
                      {/* </Paper> */}
                    {/* </Grid> */} 

                  </Grid>
                </Container>
              </div>
            </Grid>

        </Grid>

        </main>
      </Hidden>

      <Hidden mdUp>
        <MobileDashboard />
      </Hidden>
    </div>
  );
}

const mapStateToProps = state => {
  return {selectedCompany: state.selectedCompany, companies: state.companies, workspaces: state.workspaces, selectedWorkspace: state.selectedWorkspace, user: state.user}
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)