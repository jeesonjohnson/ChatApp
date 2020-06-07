import React, { useEffect } from 'react';
import './ButtonLists.css'

import { connect } from 'react-redux';
import store from '../../../../store';
import { useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import { getCompanies ,getAllWorkspaceSpecificData, checkIfAdmin, getAcronym} from '../../DataLoading.js';

import ManageCompanyModal from './../modals/manageModals/manageCompany/manageCompanyModal.js'
import ManageWorkspaceModal from './../modals/manageModals/manageWorkspace/manageWorkspaceModal.js'
import AddWorkspaceModal from './../modals/manageModals/manageWorkspace/addWorkspaceModal.js'

function getButtonList(classes, list, changeSelected){
    let buttonList

    if (list.length > 0){
        buttonList = list.map((item, key) => {
            var class_name = "MuiButtonBase-root MuiListItem-root MuiTypography-root MuiListItemText-primary MuiTypography-body2 MuiTypography-displayBlock  MuiListItem-dense MuiListItem-gutters MuiListItem-button"
        
            if(key === 0){ 
                class_name = `${class_name} selected_company`
            }

            return(
                <ListItem button container dense={true} alignItemsFlexStart className={class_name} key={key} id={item._id} onClick={e => changeSelected ? changeSelectedCompany(e) : changeSelectedWorkspace(e) }>
                    <ListItemAvatar>
                        <Avatar className={classes.avatar}>{getAcronym(item.name)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={item.name} />
                </ListItem>
            )
        })
    }
    else {
        buttonList = []
    }

    return buttonList
}

const changeSelectedCompany = e => {
    getCompanies(e.currentTarget.id)

    // Set UI for Company buttons
    for(var i = 0; i < e.currentTarget.parentNode.childNodes.length; i++){
        e.currentTarget.parentNode.childNodes[i].className = "MuiButtonBase-root MuiListItem-root MuiTypography-root MuiListItemText-primary MuiTypography-body2 MuiTypography-displayBlock MuiListItem-dense MuiListItem-gutters MuiListItem-button" //Set all company button styles
    }
    e.currentTarget.className=`${e.currentTarget.className} selected_company` //Set active company button style

    //Set UI for Workspace buttons
    const workspacePanel = e.currentTarget.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[2]

    for(var index = 0; index < workspacePanel.childNodes.length-1; index++) {
        workspacePanel.childNodes[index].className = "MuiButtonBase-root MuiListItem-root MuiTypography-root MuiListItemText-primary MuiTypography-body2 MuiTypography-displayBlock MuiListItem-dense MuiListItem-gutters MuiListItem-button"
    } 
    const workspaceButton = workspacePanel.childNodes[0] //Sets first button in workspace list
    workspaceButton.className = "MuiButtonBase-root MuiListItem-root MuiTypography-root MuiListItemText-primary MuiTypography-body2 MuiTypography-displayBlock MuiListItem-dense MuiListItem-gutters MuiListItem-button selected_company"
}

const changeSelectedWorkspace = e => {
    getAllWorkspaceSpecificData(e.currentTarget.id);
    
    //Set all workspace button styles
    for(var i = 0; i < e.currentTarget.parentNode.childNodes.length-1; i++){
    e.currentTarget.parentNode.childNodes[i].className = "MuiButtonBase-root MuiListItem-root MuiTypography-root MuiListItemText-primary MuiTypography-body2 MuiTypography-displayBlock MuiListItem-dense MuiListItem-gutters MuiListItem-button"
    }

    //Set active workspace button style
    e.currentTarget.className=`${e.currentTarget.className} selected_company`   
    
    store.dispatch({ type: 'WORKSPACE_SELECTED', data: { selectedWorkspace: e.currentTarget.id }})     
    //When a user selects a workspace, all the data assocaited to a workspace is also saved
    
}


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
    avatar: {
        backgroundColor: "#52776c",
    },
  }));

const ButtonList = ( { type } ) => {
    const classes = useStyles();
    const [buttonList, setButtonList] = React.useState([]);
    var user = useSelector(state=> state.user)
    var role = user.owner && store.getState().selectedCompany === user.companies[0] ? "Owner" : checkIfAdmin
    const [companyData, setCompanyData] = React.useState({});
    const [selectedCompanySection, setSelectedCompanySection] = React.useState('Company'); 
    const [selectedWorkspaceSection, setSelectedWorkspaceSection] = React.useState('Workspace'); 
    var workspaceData = useSelector(state=> state.allSelectedWorkspaceData)

    useEffect(() => { 
        //Load the elements for the button lists of Companies and Workspaces
        if (store.getState().companies.length > 0){
            // setCompanyData(getCompanyData())
            if(type === "Company"){
                setButtonList(getButtonList(classes, store.getState().companies, true))

                if(store.getState().allSelectedWorkspaceData._id !== undefined){
                    setCompanyData({
                        name: store.getState().allSelectedWorkspaceData.name,
                        admins: store.getState().allSelectedWorkspaceData.admins,
                        users: store.getState().allSelectedWorkspaceData.users,
                        // workspaces: store.getState().allSelectedWorkspaceData.companies[companyIndex]
                    })
                }
            }
            else if (type === "Workspace"){
                setButtonList(getButtonList(classes, store.getState().workspaces, false))
            }

        }
    }, [store.getState().companies, store.getState().workspaces, store.getState().allSelectedWorkspaceData, store.getState().user]);

    return(
            <div>
                {buttonList}
                
                <Divider />

                {type === "Company" && role === "Owner" ?
                    <ManageCompanyModal {...{type, classes}} />
                    :
                    null
                }

                {type === "Workspace" && (role === "Admin" || role === "Owner") ?
                    <div>
                        <ManageWorkspaceModal {...{type, classes}} />
                        <AddWorkspaceModal {...{type, classes}} />
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ButtonList)