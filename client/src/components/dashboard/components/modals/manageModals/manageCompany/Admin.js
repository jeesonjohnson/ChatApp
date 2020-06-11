import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import store from '../../../../../../store';
import axios from 'axios'

import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';

import DeleteIcon from '@material-ui/icons/Delete';

import { getAcronym, getAllWorkspaceSpecificData } from '../../../../DataLoading.js';

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
    avatar: {
      backgroundColor: "#52776c"
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
  }));

const Admin = ( { admin_id, companyData, load, setLoad } ) => {
  const classes = useStyles();
  const [data, setData] = React.useState({});
  const [openDeleteAdmin, setOpenDeleteAdmin] = React.useState(false);

  useEffect(() => { 
      axios.get(`/users/${admin_id}`)
      .then(res => {
          setData(res.data.data)
      })
  }, []);

  const deleteSelectedUser = (userIDToDeleteButton) => {
    setOpenDeleteAdmin(false) //Close modal for choosing to delete user

    //Delete user in Database
    axios.delete('/companies/', {params: {
        company_id: store.getState().selectedCompany,
        user_id: userIDToDeleteButton.id,
    }})
    .then( res =>{      
        setLoad(false)
    })
    
    //Delete user card
    document.getElementById('admin_card_'+userIDToDeleteButton.id).remove()
  }

  return(
    <div>
      {data.companies !== undefined ?
        <Card className={classes.root} id={'admin_card_'+admin_id} onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2f3136"} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#725bda"}>
          <CardHeader
              avatar={
                <Avatar className={classes.avatar}>{data.name !== undefined ? getAcronym(data.name) : null}</Avatar>}
              action={
                <div>
                    {data !== {} ? 
                      data._id !== companyData.admins[0]  ? 
                        <IconButton aria-label="delete" id={admin_id} onClick={e => setOpenDeleteAdmin(true)} >
                          <DeleteIcon />
                        </IconButton>
                        :
                        null
                      :
                      null 
                    }
                    <Modal  
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        className={classes.modal}
                        open={openDeleteAdmin}
                        onClose={e => setOpenDeleteAdmin(false)}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{timeout: 500}}
                    >
                        <Fade in={openDeleteAdmin}>
                            <div className={classes.paper}>
                                <Typography variant="h6">Are you sure you wish to delete the admin: {data.name}</Typography>
                                
                                <div className="center-align">
                                    <Button id={admin_id} onClick={e => deleteSelectedUser(e.currentTarget)}>Delete</Button>
                                    <Button onClick={e => setOpenDeleteAdmin(false)}>Cancel</Button>
                                </div>
                            </div>
                        </Fade>
                    </Modal>
                </div>
              }
              title={<Typography>{data.name}</Typography>}
              subheader={data.email}
          />
      </Card>
      :
      null
      }
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
    return {dispatch}
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(Admin)