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

import { updateTaskPanel } from '../../DataLoading.js';

import DeleteCollectionModal from './deleteCollectionModal.js';

const EditCollectionModal = ( { classes, collection, selectedCollection, index, reloadCollections, setReloadCollections } ) => {
    const [editCollectionOpen, setEditCollection] = React.useState(false) //Edit Collection modal
    const [editCollection, setEditCollectionName] = useState("") //For the Edit collection text field

    const editTaskCollection = (id) => {
        axios.patch('/todocollection/', 
        {
            collectionid: collection._id,
            title: editCollection,
            todo_id: ""
        })
        handleEditCollectionClose()
        setReloadCollections(true)
        updateTaskPanel(store.getState().selectedWorkspace)
    };

    const handleEditCollectionOpen = (collection, index) => {
        collection["index"] = index
        // setSelectedCollection(collection)
        setEditCollection(true);
    };

    const handleEditCollectionClose = () => {
        setEditCollection(false);
    };

return(
    <div>
    <IconButton aria-label="delete" id={index} onClick={e => handleEditCollectionOpen(collection, e.currentTarget.id)} onMouseEnter={e => e.currentTarget.childNodes[0].childNodes[0].style.opacity = 1.0} onMouseLeave={e => e.currentTarget.childNodes[0].childNodes[0].style.opacity = 0.4}>
        <MoreVertIcon style={{color: "#f1b92e", opacity:0.4}} />
    </IconButton>

    <Modal 
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={editCollectionOpen}
        onClose={handleEditCollectionClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{timeout: 500}}
        >
        <Fade in={editCollectionOpen}>
            {/* Edit task collection Modal body */}
            <div className={classes.paper}>
                <Grid container>
                    <Typography item variant="h6" style={{marginBottom:20}}>Edit Collection {collection.title}</Typography>
                    <DeleteCollectionModal item {...{classes, index, collection, editCollectionOpen, setEditCollection}} />
                </Grid>

                <Grid container>
                    <TextField item id="editCollectionName" onLoadedData={e => e.value = collection.title} size="small" onChange={e => setEditCollectionName(e.target.value) } label="Collection Name" variant="outlined" color="secondary"/>
                    <Button item onClick={e => editTaskCollection(editCollection)}>Save</Button>
                </Grid>
                
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(EditCollectionModal)
  
  