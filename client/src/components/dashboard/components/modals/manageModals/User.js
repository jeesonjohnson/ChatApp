import React, { Component, useEffect, useState } from 'react';

import { connect } from 'react-redux';
import store from '../../../../../store';
import { useSelector } from 'react-redux';
import axios from 'axios'

import AddCircle from '@material-ui/icons/Add';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Fade from '@material-ui/core/Fade';
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Modal from '@material-ui/core/Modal';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Paper from '@material-ui/core/Paper';
import { red } from '@material-ui/core/colors';
import Typography from '@material-ui/core/Typography';

import DeleteIcon from '@material-ui/icons/Delete';

import { getAcronym, getAllWorkspaceSpecificData } from '../../../DataLoading.js';

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: 345,
      marginTop: 10,
      backgroundColor: "#2f3136"
    },
    media: {
      height: 0,
    },
    highlighted: {
        backgroundColor: "#af0000"
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        borderRadius: 10,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    avatar: {
        backgroundColor: "#52776c"
    }
  }));

const User = ( { user_id, buttonListClasses } ) => {
    const classes = useStyles();
    const [data, setData] = React.useState({});
    const [openDeleteUser, setOpenDeleteUser] = React.useState(false);
    
    useEffect(() => { 
        axios.get(`/users/${user_id}`)
        .then(res => {
            setData(res.data.data)
        })
    }, []);

    const deleteSelectedUser = (userIDToDeleteButton) => {
        setOpenDeleteUser(false) //Close modal for choosing to delete user

        //Delete user in Database
        axios.delete('workspaces/user', {params: {
            workspace_id: store.getState().selectedWorkspace,
            user_id: userIDToDeleteButton.id,
        }})
        .then(res =>{
            getAllWorkspaceSpecificData(store.getState().selectedWorkspace)
        })

        //Delete user card
        document.getElementById('user_card_'+userIDToDeleteButton.id).remove()
    }

    const isAdmin = () =>{
        let userIsAdmin = false

        for(var i in store.getState().allSelectedWorkspaceData.admins){
            if(store.getState().allSelectedWorkspaceData.admins[i] === user_id){
                userIsAdmin = true    
            }
        }

        return(userIsAdmin)
    }

    return(
        <div>
            {data.companies !== undefined ?
                data.companies[0] === store.getState().selectedCompany && data.owner || isAdmin() ? //Checks if first company(should be selected company if they are owner) matches selected company and whether they are owner
                    null
                    :
                    <Card className={classes.root} id={'user_card_'+user_id} onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2f3136"} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f1b92e"}>
                        <CardHeader
                            avatar={
                            <Avatar className={classes.avatar}>
                                {data.name !== undefined ?
                                getAcronym(data.name)
                                :
                                null
                                }
                            </Avatar>
                            }
                            action={
                                <div>
                                    <IconButton aria-label="delete" id={user_id} onClick={e => setOpenDeleteUser(true)}>
                                        <DeleteIcon />
                                    </IconButton>

                                    <Modal  
                                        aria-labelledby="transition-modal-title"
                                        aria-describedby="transition-modal-description"
                                        className={classes.modal}
                                        open={openDeleteUser}
                                        onClose={e => setOpenDeleteUser(false)}
                                        closeAfterTransition
                                        BackdropComponent={Backdrop}
                                        BackdropProps={{timeout: 500}}
                                    >
                                        <Fade in={openDeleteUser}>
                                            <div className={classes.paper}>
                                                <Typography variant="h6">Are you sure you wish to delete the user: {data.name}</Typography>
                                                
                                                <div className="center-align">
                                                    <Button id={user_id} onClick={e => deleteSelectedUser(e.currentTarget)}>Delete</Button>
                                                    <Button onClick={e => setOpenDeleteUser(false)}>Cancel</Button>
                                                </div>
                                            </div>
                                        </Fade>
                                    </Modal>
                                </div>
                            }
                            title={data.name}
                            subheader={data.email}
                        />
                    </Card>
                :
                null
            }
        </div>
            
            // <Avatar>
            //     A
            // </Avatar>

            // {data.name}
            // {data.email}
            // {/* _id, avatar, companies, owner */}
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
    return {dispatch}
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(User)