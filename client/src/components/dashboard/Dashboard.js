import React, { useEffect } from 'react';
import clsx from 'clsx';
import axios from 'axios'
import store from './../../store';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';

import ButtonList from './components/ButtonLists.js';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: '#202225',
    borderTopLeftRadius: 50
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
    height: '99vh',
    marginTop: '1vh',
    overflow: 'auto',
    backgroundColor: '#36393f',
    borderTopLeftRadius: 50,
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
}));

export default function Dashboard() {
  useEffect(()=> {
    axios.get('/workspaces/')
    .then(res => {
        var companiesList = []
        var workspaceNames = []
        var workspacesList = res.data.data
  
        //If recieved data is not empty, add each company name to array 
        if (res.data.data != {}) {
          for(var key in workspacesList){
            companiesList.push(key)
          }

          for(var key in workspacesList[companiesList[0]]){
            workspaceNames.push(workspacesList[companiesList[0]][key].name)
          }

          store.dispatch({ type: 'COMPANY_NAMES_LOADED', data: { companies: companiesList } })
          store.dispatch({ type: 'COMPANY_SELECTED', data: { selectedCompany: companiesList[0] } })
        
          store.dispatch({ type: 'WORKSPACE_NAMES_LOADED', data: { workspaces: workspaceNames} })
          store.dispatch({ type: 'WORKSPACE_SELECTED', data: { selectedWorkspace: workspacesList[companiesList[0]][0].name } })            
        }
      
    })
    .catch(err => {
        console.log('Error from loading user companies');
    })
  }, []);
  

  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <div className={classes.root}>
      <CssBaseline />

      <Drawer variant="permanent" classes={{paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),}} open={open}>
        <ButtonList type="Company" /> 
      </Drawer>

      <Drawer variant="permanent"  classes={{paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),}} open={open}>
        <ButtonList type="Workspace" /> 
        <Divider />
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose} className={clsx(classes.menuButton, !open && classes.menuButtonHidden)}>
            <ChevronLeftIcon />
          </IconButton>
          <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} className={clsx(classes.menuButton, open && classes.menuButtonHidden)}>
            <MenuIcon />
          </IconButton>
        </div>
      </Drawer>
      

      <main className={classes.content}>
        
        {
        //Left Panel
        //Right Panel
        }

      <div maxWidth="lg" style={{backgroundColor:"#2f3136", width:"30%", padding:20, borderTopLeftRadius: 50}}> 
        <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>Dashboard
          <IconButton>
            <NotificationsIcon/>
          </IconButton>
        </Typography>
      </div>

      <List style={{backgroundColor:"#2f3136", width:"30%"}} >

        <IconButton color="inherit">
          <Badge badgeContent={4} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </List>
    
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>

              </Paper>
            </Grid>
            {/* Recent Deposits */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>

              </Paper>
            </Grid>
            {/* Recent Orders */}
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                
              </Paper>
            </Grid>
          </Grid>
          <Box pt={4}>
            
          </Box>
        </Container>
      </main>

 

    </div>
  );
}