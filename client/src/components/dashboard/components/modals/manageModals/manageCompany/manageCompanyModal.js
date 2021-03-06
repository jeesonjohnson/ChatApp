import React, {useEffect} from 'react';
import axios from 'axios';
import store from '../../../../../../store';
import { connect, useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Divider from '@material-ui/core/Divider';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Modal from '@material-ui/core/Modal';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import SettingsIcon from '@material-ui/icons/Settings';

import { getCompanies, getAllWorkspaceSpecificData, getAcronym} from '../../../../DataLoading.js';

import Admin from './Admin.js';
import User from './User.js';

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
        height:"80vh",
        maxHeight:"80vh"
    },   
    paperAddUser: {
        backgroundColor: theme.palette.background.paper,
        borderRadius: 10,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
      },
    avatar: {
        backgroundColor: "#52776c"
    }
  }));

const ManageCompanyModal = ( { type, buttonListClasses } ) => {    
    const classes = useStyles();
    const [manageCompanyOpen, setManageCompanyOpen] = React.useState(false);
    const [selectedCompanySection, setSelectedCompanySection] = React.useState('Company'); 
    const [companyData, setCompanyData] = React.useState({});
    const [usersInSearch, setUsersInSearch] = React.useState([]);
    const [openAddUser, setOpenAddUser] = React.useState(false);
    const [selectedUserToAdd, setAddUser] = React.useState({});
    const [deleteWorkspaceName, setDeleteWorkspaceName] = React.useState("")
    const [load , setLoad] = React.useState(false);

    useEffect(() => {
        if(manageCompanyOpen){
            getCompanyData()
        }
    }, [manageCompanyOpen, usersInSearch, companyData, load]);

    const getCompanyData = () => {
        if(!load){
            axios.get(`/companies/${store.getState().selectedCompany}`)
            .then(res =>{
                setCompanyData(res.data.data.companyData)
                setLoad(true)
            });
        }
    };

    let usersFoundInSearch = (keypressed, searchName) => {
        if(keypressed === "Enter"){
            axios.get('/users/names', {params:{
                name: searchName, 
                users: companyData.users
                }} 
            )
            .then(res => {
                setUsersInSearch(res.data.data)
            }) 
        }
    }
  
    const addSelectedUser = (e) => {
        let userCardToDelete = 'user_card_'+selectedUserToAdd._id
        document.getElementById(userCardToDelete).remove() //Deletes the added user from the list 
        
        console.log(selectedUserToAdd)
        axios.patch(`/companies/${selectedUserToAdd._id}`, { 
            company_id: store.getState().selectedCompany,
            admin: selectedUserToAdd.admin
        })
        .then(res => {
            // getCompanies('')
            setLoad(false)
            getCompanyData()
        })
        
        setOpenAddUser(false)
    }

    /* MENU FOR ADDING USER AS ADMIN/USER */
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event, user) => {
      setAnchorEl(event.currentTarget);
      setAddUser(user);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const addUser = (e) => {
        handleClose()
        selectedUserToAdd["admin"] = false
        setOpenAddUser(true);
    }

    const addAdmin = (e) => {
        handleClose()
        selectedUserToAdd["admin"] = true
        setOpenAddUser(true);
    }

    const deleteWorkspace = (e) => {
        axios.delete(`/workspaces/${store.getState().allSelectedWorkspaceData._id}`, {
            params:{ 
                company_id : store.getState().selectedCompany 
            } 
        });

        setDeleteWorkspaceName("")    // Reset the name to enable the delete button
        getCompanies("");               // Reload workspaces list
        setManageCompanyOpen(false);  // Close modal 
    };

    const sectionChanged = (e) => {
        if(e !== "Add Users"){
            setUsersInSearch("");
        }
        
        setSelectedCompanySection(e);
    };

    const saveNewCompanyName = async () => {
        await axios.patch(`/companies/${store.getState().selectedCompany}`, {
            params: {
                newName: document.getElementById('new_name_text_field').value
            }
        });
        
        getCompanies('');               // Reload workspaces list
        setManageCompanyOpen(false)   // Close modal
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
                    <div id="modal_paper" className={classes.paper, classes.paperManageWorkspace}>
                        <Typography variant="h6" align="center">Manage Company</Typography>

                        <ButtonGroup variant="text" color="inherit" aria-label="text primary button group" >
                            <Button selected onClick={e => sectionChanged(e.target.textContent)}>Company</Button>
                            <Button onClick={e => sectionChanged(e.target.textContent)}>Admins</Button>
                            <Button onClick={e => sectionChanged(e.target.textContent)}>Users</Button>
                            <Button onClick={e => sectionChanged(e.target.textContent)}>Add Users</Button>
                        </ButtonGroup>

                        <Divider />

                        {selectedCompanySection === "Company" ?
                            <div style={{marginTop:20, overflowX:"hidden", overflowY:"auto", maxHeight:"60vh"}}>
                                <Typography>Number of Admins: {companyData.admins !== undefined? companyData.admins.length : null}</Typography>
                                <Typography>Number of Users: {companyData.users !== undefined? companyData.users.length - companyData.admins.length : null}</Typography>
                                
                                <Divider style={{marginTop:10, marginBottom:10 }} />

                                <Typography>Change Company Name</Typography>
                                <TextField id="new_name_text_field" label="New Company Name" defaultValue={companyData.name} fullWidth margin="normal" InputLabelProps={{ shrink: true, }} />
                                <Button onClick={saveNewCompanyName}>Save New Name</Button>

                                <Divider style={{marginTop:10, marginBottom:10 }} />

                                <Typography>Delete the Company: {companyData.name}</Typography>
                                <TextField id="name_text_field" onChange={e => setDeleteWorkspaceName(e.currentTarget.value)} label="Company Name" helperText={'Type in: '+ companyData.name} style={{ margin: 8 }} placeholder="Enter Company Name to Delete" fullWidth margin="normal" InputLabelProps={{ shrink: true, }} />

                                <div>
                                    {deleteWorkspaceName === store.getState().allSelectedWorkspaceData.name ?
                                        <Button style={{color:"#af0000"}} onClick={e => deleteWorkspace(e)} >Delete</Button>
                                        :
                                        <Button disabled>Delete</Button>
                                    }
                                </div>  
                            </div>
                            : null
                        }

                        {selectedCompanySection === "Admins" ?
                            <Grid container direction="column" wrap="nowrap" style={{overflow:"auto", maxHeight:"60vh"}}>
                            {companyData.admins.map((admin_id, index) =>( 
                                <Admin item {...{admin_id, companyData, load, setLoad}} /> 
                            ) )}
                            </Grid>
                            : null
                        }

                        {selectedCompanySection === "Users" ?
                            <Grid container direction="column" wrap="nowrap" style={{overflow:"auto", maxHeight:"60vh"}}>
                                {companyData.users.map((user_id, index) =>( 
                                    <User item {...{user_id, companyData, setCompanyData, load , setLoad}} /> 
                                ) )}
                            </Grid>
                            : null
                        }

                        {selectedCompanySection === "Add Users" ?
                        <div >
                            {/* Text field to search for users */}
                            <TextField  id="search_textfield" label="Search" margin="small" style={{width:"100%"}} onKeyPress={e => usersFoundInSearch(e.key, e.target.value)} />

                            {/* List of search results */}
                            <div style={{overflow:"auto", maxHeight: "50vh", }} >
                                {usersInSearch !== [] && usersInSearch.length > 0 ?
                                    usersInSearch.map((user, index) => (
                                        <Card id={'user_card_'+user._id} onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2f3136"} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f1b92e"} style={{backgroundColor: "#2f3136"}}>
                                        <CardHeader
                                            avatar={
                                            <Avatar className={classes.avatar}>
                                                {user.name !== undefined ?
                                                getAcronym(user.name)
                                                :
                                                null
                                                }
                                            </Avatar>
                                            }
                                            action={
                                                <div>
                                                    <IconButton id={user._id} aria-controls="simple-menu" aria-haspopup="true" onClick={e=> handleClick(e, user)} > {/*onClick={e => handleOpen(user)}>*/}
                                                        <MoreVertIcon />
                                                    </IconButton>
                
                                                    <Menu
                                                        id="simple-menu"
                                                        anchorEl={anchorEl}
                                                        keepMounted
                                                        open={Boolean(anchorEl)}
                                                        onClose={handleClose}
                                                    >
                                                        <MenuItem onClick={e => addUser(e)}>Add as User</MenuItem>
                                                        <MenuItem style={{color:"#f1b92e"}} onClick={e => addAdmin(e)}>Add as Admin</MenuItem>
                                                    </Menu>
                                                    
                                                    <Modal  
                                                        aria-labelledby="transition-modal-title"
                                                        aria-describedby="transition-modal-description"
                                                        className={classes.modal}
                                                        open={openAddUser}
                                                        onClose={e => setOpenAddUser(false)}
                                                        closeAfterTransition
                                                        BackdropComponent={Backdrop}
                                                        BackdropProps={{timeout: 500}}
                                                    >
                                                        <Fade in={openAddUser}>
                                                            <div className={classes.paper, classes.paperAddUser}>
                                                                <Typography variant="h6" noWrap={true} >Are you sure you wish to add the user <span style={{color:"#f1b92e"}}>{selectedUserToAdd.name}</span> to the company <span style={{color:"#f1b92e"}}>{companyData.name}</span> as {selectedUserToAdd.admin ? "an Admin" : "a User"}</Typography>
                                                                
                                                                <div className="center-align">
                                                                    <Button id={selectedUserToAdd._id} onClick={e => addSelectedUser()}>Add User</Button>
                                                                    <Button onClick={e => setOpenAddUser(false)}>Cancel</Button>
                                                                </div>
                                                            </div>
                                                        </Fade>
                                                    </Modal>
                                                </div>
                                            }
                                            title={user.name}
                                            subheader={user.email}
                                        />
                                        <CardMedia
                                        />
                                    </Card>
                                    ))
                                    :
                                    null
                                }
                            </div>
                        </div>
                        :null
                        }
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageCompanyModal)