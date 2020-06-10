import React, { useEffect, useState } from 'react';
import axios from 'axios'
import store from '../../../../../store';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';

import DeleteIcon from '@material-ui/icons/Delete';

import { getWorkspaces, getAllWorkspaceSpecificData } from '../../../DataLoading.js';

  const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },   
    button: {
        backgroundColor: '#757575'
    }
  }));

  
const DeleteChatModal = ( {type} ) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [chatId, setChatId] = React.useState("");

    const handleOpen = () => {  
        setChatId(store.getState().selectedPanel.id)
        setOpen(true);
    };


    const handleClose = () => {
        setOpen(false);
    };

    const removeChatId = (list) => {
        let chats = []
        for(var i in list){
            if(chatId !== list[i]._id){
                chats.push(list[i])    
            }
        }
        return(chats)
    }

    /* TASK FUNCTIONS */
    const deleteChat = async () =>{
        //Delete chat in database
        let workspaceData = store.getState().allSelectedWorkspaceData 

        if(type === "Group"){
            workspaceData.group_chats = await removeChatId(workspaceData.group_chats)

            if(workspaceData.group_chats.length > 0){
                axios.delete(`/groupchat/`, {params:{ group_id: chatId}})
            }
        }
        else if (type === "Private"){
            workspaceData.private_chats = await removeChatId(workspaceData.private_chats)

            if(workspaceData.private_chats.length > 0){
                axios.delete(`/privatechat/`, {params:{ private_id: chatId }})            
            }
        }
        
        await store.dispatch({ type: 'ALL_WORKSPACE_DATA', data: { workspaceData: workspaceData } });
        store.dispatch({ type: 'SELECTED_PANEL', data: { selectedPanel: {id: "Calendar", name: "Calendar"} } });
        
        // document.getElementById(store.getState().selectedPanel.id).remove()   

        
        getAllWorkspaceSpecificData(store.getState().selectedWorkspace)
        // getWorkspaces(store.getState().selectedWorkspace)
    }

    return(
        <div>
            <Button
                variant="contained"
                className={classes.button}
                startIcon={<DeleteIcon style={{color: "#af0000"}} />}
                onClick={e => handleOpen()}
            >
                Delete Chat
            </Button>
            
            <Modal 
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{timeout: 500}}
            >
            <Fade in={open}>
                <Grid container xs={4} className={classes.paper}>
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center">Are you sure you want to delete chat</Typography>
                    </Grid>
    
                    <Grid item xs={12} align="center">
                        <Button onClick={deleteChat}>Ok</Button> {/*addTask(document.getElementById("new_task_title"))  */}
                        <Button onClick={handleClose}>Cancel</Button>
                    </Grid>
                </Grid>
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(DeleteChatModal)
  
  