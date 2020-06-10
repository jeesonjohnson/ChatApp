import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import store from '../../../../../../store';
import { useSelector } from 'react-redux';
import axios from 'axios'

import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Divider from '@material-ui/core/Divider';
import Fade from '@material-ui/core/Fade';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Modal from '@material-ui/core/Modal';
import SettingsIcon from '@material-ui/icons/Settings';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { getCompanies, checkIfAdmin} from '../../../../DataLoading.js';

import Admin from '../Admin.js';
import User from '../User.js';

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
  }));

const ManageCompanyModal = ( { type, buttonListClasses } ) => {
    const classes = useStyles();
    const [manageCompanyOpen, setManageCompanyOpen] = React.useState(false);
    var user = useSelector(state=> state.user)
    var role = user.owner && store.getState().selectedCompany === user.companies[0] ? "Owner" : checkIfAdmin
    const [selectedCompanySection, setSelectedCompanySection] = React.useState('Company');  
    const [deleteCompanyName, setDeleteCompanyName] = React.useState("")
    const [companyData, setCompanyData] = React.useState({admins:[], name:"", users:[]});

    useEffect(() => { 
        //Load the elements for the button lists of Companies and Workspaces
        if (store.getState().companies.length > 0 && manageCompanyOpen === true){
            if(store.getState().allSelectedWorkspaceData._id !== undefined){
                axios.get(`/companies/${store.getState().selectedCompany}`)
                .then(res => {
                    setCompanyData({
                        name: res.data.data.companyData.name,
                        admins: res.data.data.companyData.admins,
                        users: res.data.data.companyData.users,
                        workspaces: res.data.data.companyData.workspaces,
                        owner: res.data.data.companyData.ownerID
                    })
                }) 
            }
        }
    }, [store.getState().selectedCompany, manageCompanyOpen]);

    const deleteCompany = (e) => {
        axios.delete(`/companies/${store.getState().selectedCompany}`)
        getCompanies("")
        setManageCompanyOpen(false)
    }

    const saveNewCompanyName = async () => {
        await axios.patch(`/companies/name/${store.getState().selectedCompany}`, {
            params: {
                newName: document.getElementById('new_name_text_field').value
            }
        })
        getCompanies('')
        setManageCompanyOpen(false)
    };

    return(
        <div>
            <ListItem button onClick={e => setManageCompanyOpen(true)} >
                <ListItemAvatar>
                    <Avatar>
                        <SettingsIcon color="primary" />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={"Manage " + type} />
            </ListItem>
            
            { companyData.name !== undefined || companyData.name !== "" ?
                <Modal  
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={manageCompanyOpen}
                    onClose={e => setManageCompanyOpen(false)}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{timeout: 500}}
                    >
                    <Fade in={manageCompanyOpen}>
                        <div className={classes.paper}>
                            <Typography variant="h6" align="center">Manage {companyData.name}</Typography>

                            <ButtonGroup variant="text" color="inherit" aria-label="text primary button group" >
                                <Button selected onClick={e => setSelectedCompanySection(e.target.textContent)}>Company</Button>
                                <Button onClick={e => setSelectedCompanySection(e.target.textContent)}>Admins</Button>
                                <Button onClick={e => setSelectedCompanySection(e.target.textContent)}>Users</Button>
                                <Button onClick={e => setSelectedCompanySection(e.target.textContent)}>Add Users</Button>
                            </ButtonGroup>

                            <Divider />
                            
                            {selectedCompanySection === "Company" ?
                                <div>
                                    <Typography>Number of Admins: {companyData.admins !== undefined? companyData.admins.length : null}</Typography>
                                    <Typography>Number of Users: {companyData.users !== undefined? companyData.users.length - companyData.admins.length : null}</Typography>
                                
                                    <Divider style={{marginTop:10, marginBottom:10 }} />

                                    <Typography>Change Company Name</Typography>
                                    <TextField id="new_name_text_field" label="New Company Name" defaultValue={companyData.name !== undefined && companyData.name !== "" ? companyData.name : null} fullWidth margin="normal" InputLabelProps={{ shrink: true, }} />
                                    <Button onClick={saveNewCompanyName}>Save New Name</Button>

                                    <Divider style={{marginTop:10, marginBottom:10 }} />

                                    <Typography>Delete the Company {companyData.name}</Typography>
                                    <TextField id="name_text_field" onChange={e => setDeleteCompanyName(e.currentTarget.value)} helperText={'Type in: '+ companyData.name} style={{ margin: 8 }} placeholder="Enter Company Name to Delete" fullWidth margin="normal" InputLabelProps={{ shrink: true, }} />

                                    <div>
                                        {deleteCompanyName === companyData.name ?
                                            <Button style={{color:"#af0000"}} onClick={e => deleteCompany(e)} >Delete</Button>
                                            :
                                            <Button disabled>Delete</Button>
                                        }
                                    </div>  
                                </div>
                            : null}

                            {selectedCompanySection === "Admins" ?
                                <div>
                                    {companyData.admins.map((admin_id, index) =>(
                                        <Admin {...{admin_id, buttonListClasses}} />
                                    ))
                                    }
                                </div>
                            : null}

                            {selectedCompanySection === "Users" ?
                                <div>
                                    {companyData.users.length > 0 ?
                                        companyData.users.map((user_id, index) =>(
                                            
                                            <User {...{user_id, buttonListClasses}} />
                                        ))
                                        :
                                        <div>No users found</div>
                                    }
                                </div>
                            : null}

                        </div>
                    </Fade>
                </Modal>
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
  return {
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageCompanyModal)