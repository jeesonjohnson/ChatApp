import React, { useEffect, useState } from 'react';
import axios from 'axios'
import store from '../../../../store';
import { connect } from 'react-redux';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Fade from '@material-ui/core/Fade';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Modal from '@material-ui/core/Modal';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';

import { Delete, PlaylistAdd } from '@material-ui/icons';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { getCompanies, checkIfAdmin } from '../../DataLoading.js';

const DeleteCollectionModal = ( { classes, index, collection } ) => {
    const [deleteCollectionOpen, setDeleteCollection] = React.useState(false) //Delete Collection modal

    const handleDeleteCollectionOpen = () => {
        setDeleteCollection(true);
    };

    const handleDeleteCollectionClose = () => {
        setDeleteCollection(false);
    };

    //Deletes Selected Task collection
    function deleteTaskCollection() {
        //open delete modal
        axios.delete('/todocollection/', { params: { collection_id: collection._id } }) //Deletes task collection in database

        document.getElementById(`collection${collection.index}`).remove() //Deletes task collection rendered elements

        handleDeleteCollectionClose()
        // handleEditCollectionClose()

        // setSelectedCollection("")   
    }

    return(
        <div>
            <IconButton onClick={handleDeleteCollectionOpen} >
                <Delete style={{color: "#af0000"}} />
            </IconButton>  

            <Modal 
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={deleteCollectionOpen}
                onClose={handleDeleteCollectionClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{timeout: 500}}
                >
                <Fade in={deleteCollectionOpen}>
                    {/* Delete task collection Modal body */}
                    <div className={classes.paper}>
                    <Typography variant="h5">Are you sure you wish to delete the collection {collection.title}</Typography>
                    
                        <Button id={index} onClick={deleteTaskCollection} style={{color:"#af0000"}}>Delete</Button>
                        <Button color="inherit" onClick={handleDeleteCollectionClose}>Cancel</Button>
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(DeleteCollectionModal)
  
  