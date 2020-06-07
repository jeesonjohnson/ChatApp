import React, { useEffect } from 'react';
import clsx from 'clsx';
import store from './../../../store';
import { connect } from 'react-redux';
import { useSelector } from 'react-redux';

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
  useEffect(()=> {
    if (store.getState().selectedCompanies === ""){
      getCompanies("")
    }

  }, []);
  

  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const user = useSelector(state=> state.user);
  const workspace = useSelector(state=> state.selectedWorkspace)




  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event, menuType) => {
    
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
      <div className={classes.mobile_content}>
      
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
              <ListItem button  container dense={true} alignItemsFlexStart>
                <ListItemAvatar>
                  <Avatar style={{backgroundColor:"#725bda"}}>{"C"}</Avatar>
                </ListItemAvatar>
                <Hidden only='xs'>
                  <ListItemText primary={"Companies"} />
                </Hidden>
              </ListItem>

              <Menu id="company-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={handleClose}>{store.getState().selectedCompany}</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
              </Menu>

            </Grid>

            <Grid item xs={4}>
              <ListItem button  container dense={true} alignItemsFlexStart aria-controls="workspace-menu" aria-haspopup="true" onClick={handleClick, "workspace-menu"}>
                <ListItemAvatar style={{}}>
                  <Avatar style={{backgroundColor:"#725bda"}}>{"W"}</Avatar>
                </ListItemAvatar>
                <Hidden only='xs'>
                  <ListItemText primary={"Workspaces"} />
                </Hidden>
              </ListItem>

              <Menu id="workspace-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={handleClose}>{store.getState().selectedCompany}</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
              </Menu>

            </Grid>

            <Grid item xs={4}>
              <ListItem button  container dense={true} alignItemsFlexStart aria-controls="panel-menu" aria-haspopup="true" onClick={handleClick, "panel-menu"}>
                <ListItemAvatar style={{}}>
                  <Avatar style={{backgroundColor:"#725bda"}}>{"P"}</Avatar>
                </ListItemAvatar>
                <Hidden only='xs'>
                  <ListItemText primary={"Planner"} />
                </Hidden>
              </ListItem>
            </Grid>

            <Menu id="panel-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={handleClose}>Calendar</MenuItem>
              <MenuItem onClick={handleClose}>Charts</MenuItem>
              <MenuItem onClick={handleClose}>Tasks</MenuItem>
              <MenuItem onClick={handleClose}>General</MenuItem>
              <MenuItem onClick={handleClose}>Announcements</MenuItem>
              <MenuItem onClick={handleClose}>CHATS</MenuItem>
              <MenuItem onClick={handleClose}>{store.getState().selectedCompany}</MenuItem>
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