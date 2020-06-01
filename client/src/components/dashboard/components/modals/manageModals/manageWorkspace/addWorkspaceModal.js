import React from 'react';

import { connect } from 'react-redux';
import store from '../../../../../../store';
import { useSelector } from 'react-redux';
import axios from 'axios'

import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import AddCircle from '@material-ui/icons/Add';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Fade from '@material-ui/core/Fade';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { getCompanies } from '../../../../DataLoading.js';

const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paperManageWorkspace: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },   
  }));

const AddWorkspaceModal = ( { type, buttonListClasses } ) => {    
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const addWorkspace = (e) => {
        //Add workspace to database
        axios.post('/workspaces/',  {
            company: store.getState().selectedCompany,
            name: document.getElementById('name_text_field').value,
            admin: ""
        })
        .then(res => {
            getCompanies("")
            setOpen(false)
        })
    }

    return(
            <div>
                <ListItem button onClick={e => setOpen(true)} >
                    <ListItemAvatar>
                        <Avatar>
                            <AddCircle />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={"Add " + type} />
                </ListItem>

                <Modal 
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={open}
                    onClose={e => setOpen(false)}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{timeout: 500}}
                    >
                    <Fade in={open}>
                        <div id="modal_paper" className={classes.paper, classes.paperManageWorkspace}>
                            <Typography variant="h6" align="center">Add Workspace</Typography>

                            <Divider />

                            <TextField id="name_text_field" label="Workspace Name" style={{ margin: 8, marginTop:20, marginBottom:20 }} placeholder="Enter New Workspace Name" fullWidth margin="normal" InputLabelProps={{ shrink: true, }} />

                            <div className="center-align">
                                <Button onClick={e => addWorkspace(e)}>Add</Button>
                                <Button>Cancel</Button>
                            </div>
                        </div>
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
      taskCollectionIDs: state.taskCollectionIDs, 
      workspaceTaskCollections: state.workspaceTaskCollections,
      user: state.user,
      allSelectedWorkspaceData: state.allSelectedWorkspaceData
    }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddWorkspaceModal)