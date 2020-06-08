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

  
const DeleteChatModal = ( { } ) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [chatId, setChatId] = React.useState("");
    const [element, setElement] = React.useState(null);

    const handleOpen = () => {
        if(document.getElementById('group_chats').childNodes[0].childNodes[0].childNodes.length > 0){
            for(var i in document.getElementById('group_chats').childNodes[0].childNodes[0].childNodes){ //Loop through chats
                if(document.getElementById('group_chats').childNodes[0].childNodes[0].childNodes[i].nodeName === "DIV" && 
                document.getElementById('group_chats').childNodes[0].childNodes[0].childNodes[i].className === "MuiButtonBase-root MuiListItem-root makeStyles-nested-260 makeStyles-selectedButton-261 MuiListItem-gutters MuiListItem-button"){ //Check that the element is a div node and not a function
                    // console.log(document.getElementById('group_chats').childNodes[0].childNodes[0].childNodes[i].id)
                    setChatId(document.getElementById('group_chats').childNodes[0].childNodes[0].childNodes[i].childNodes[0].childNodes[0].id)
                    setElement(document.getElementById('group_chats').childNodes[0].childNodes[0].childNodes[i])
                    break;
                }
            }
        }

        if(document.getElementById('private_chats').childNodes[0].childNodes[0].childNodes.length > 0){ //Check there are chats
            for(var i in document.getElementById('private_chats').childNodes[0].childNodes[0].childNodes){ //Loop through chats
                if(document.getElementById('private_chats').childNodes[0].childNodes[0].childNodes[i].nodeName === "DIV"){ //Check that the element is a div node and not a function
                    console.log(document.getElementById('private_chats').childNodes[0].childNodes[0].childNodes[i])
                }
            }

        }
        
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const a = (list) => {
        let b = []
        for(var i in list){
            if(chatId !== list[i]._id){
                b.push(list[i])    
            }
        }
        return(b)
    }

    /* TASK FUNCTIONS */
    const deleteChat = async () =>{
        //Delete chat in database
        let workspaceData = store.getState().allSelectedWorkspaceData 
        let group_chats = []
        let private_chats = []

        workspaceData.group_chats = await a(workspaceData.group_chats)
        workspaceData.private_chats = await a(workspaceData.private_chats)

        await store.dispatch({ type: 'ALL_WORKSPACE_DATA', data: { workspaceData: workspaceData } });

        axios.delete(`/groupchat/`, {
            params:{
                group_id: chatId
            }
        })
        .then(async res => {

            console.log(element)
            // await element.remove()
            setElement(null)
    
            //Change selected panel to calendar
            store.dispatch({ type: 'SELECTED_PANEL', data: { selectedPanel: "Calendar" } });
            console.log("delete", store.getState().allSelectedWorkspaceData)
        })

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
  
  