import React, { Component } from "react";
import '../../../auth/Auth.css';

import { connect } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
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
  }));
  
function EditUserModal() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
  
    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    return (
      <div>
        <IconButton onClick={handleOpen} aria-label="settings">
            <SettingsIcon />
        </IconButton>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className={classes.paper}>
              <Typography component="h1" variant="h5" color="inherit" noWrap>Account Details</Typography>
              <Divider />
              <TextField id="standard-basic" label="Name" />
              <TextField id="standard-basic" label="Email" />
              <TextField id="standard-basic" label="Current Password" />
              <TextField id="standard-basic" label="New Password" />
              <TextField id="standard-basic" label="Confirm Password" />

            </div>
          </Fade>
        </Modal>
      </div>
    );
  }

const mapStateToProps = state => {
    return {selectedCompany: state.selectedCompany, companies: state.companies, workspaces: state.workspaces, selectedWorkspace: state.selectedWorkspace, user: state.user}
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      dispatch
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(EditUserModal)