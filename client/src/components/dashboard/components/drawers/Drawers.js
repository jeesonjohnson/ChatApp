import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

import store from '../../../../store'

import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ButtonList from './ButtonList.js';

import { getCompanies } from '../../DataLoading.js';

const expandButton = (classes, open, setOpen) => { 
    const handleDrawerOpen = () => {
        setOpen(true);
        };
        
    const handleDrawerClose = () => {
        setOpen(false);
    };
    
    return(
        <div className={classes.toolbarIcon} style={{bottom:0}}>
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
    useEffect(() => { 
    });
    const classes = props.classes;
    const key = props.key;
    const [open, setOpen] = React.useState(false);

    return(
        <Drawer variant="permanent" classes={{paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)}} open={open}>
            <ListItem><Avatar alt="Logo" src="logo.png" /></ListItem>
            <ButtonList type="Company" />
            {expandButton(classes, open, setOpen)} 
        </Drawer>
    )
}; 

export function WorkspaceDrawer(props) {
    const classes = props.classes;
    const key = props.key;
    const [open, setOpen] = React.useState(false);

    return(
        <Drawer variant="permanent" classes={{paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),}} open={open}>
            <ListItem style={{height:56}} />
            <ButtonList type="Workspace" />
            {expandButton(classes, open, setOpen)} 
            
        </Drawer>
    )
}; 

