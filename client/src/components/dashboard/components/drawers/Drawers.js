import React, { useEffect } from 'react';
import clsx from 'clsx';

import { connect } from 'react-redux';
import store from '../../../../store';
import { useSelector } from 'react-redux';
import axios from 'axios'

import { checkIfAdmin } from '../../DataLoading.js';

import Avatar from '@material-ui/core/Avatar';
import ButtonList from './ButtonList.js';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import MenuIcon from '@material-ui/icons/Menu';

import BusinessIcon from '@material-ui/icons/Business';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode';

const expandButton = (classes, open, setOpen) => { 
    const handleDrawerOpen = () => {
        setOpen(true);
        };
        
    const handleDrawerClose = () => {
        setOpen(false);
    };
    
    return(
        <div className={classes.toolbarIcon} style={{marginRight:5}}>
            <IconButton onClick={handleDrawerClose} className={clsx(classes.menuButton, !open && classes.menuButtonHidden)}>
                <ChevronLeftIcon />
            </IconButton>
            <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} className={clsx(classes.menuButton, open && classes.menuButtonHidden)}>
                <MenuIcon />
            </IconButton>
        </div>
    )
}

export function CompanyDrawer(props) {
    const classes = props.classes;
    const key = props.key;
    const [open, setOpen] = React.useState(false); //Controls whether the Company panel is expanded

    return(
        <Drawer id={key} variant="permanent" classes={{paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)}} open={open}>
            {/* <ListItem><Avatar alt="Logo" src="logo.png" /></ListItem> */}
            <ListItem button container dense={true} alignItemsFlexStart >
                <ListItemAvatar>
                    <Avatar>
                        <BusinessIcon color="primary" />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Companies" />
            </ListItem>
            <Divider />
            <ButtonList {...{type: "Company"}} />
            {expandButton(classes, open, setOpen)} 
        </Drawer>
    )
}; 

export function WorkspaceDrawer(props) {
    const classes = props.classes;
    const key = props.key;
    const [open, setOpen] = React.useState(false); //Controls whether the workspace panel is expanded

    return(
        <Drawer id={key} variant="permanent" classes={{paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),}} open={open}>
            {/* <ListItem style={{height:56}}> */}
            <ListItem button container dense={true} alignItemsFlexStart >
                <ListItemAvatar>
                    <Avatar>
                        <ChromeReaderModeIcon color="primary" />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Workspaces" />
            </ListItem>
            <Divider />
            <ButtonList {...{type: "Workspace"}} />
            {expandButton(classes, open, setOpen)}  
        </Drawer>
    )
}; 

