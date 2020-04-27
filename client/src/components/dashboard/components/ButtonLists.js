import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AddCircle from '@material-ui/icons/AddCircle';
import Avatar from '@material-ui/core/Avatar';
import axios from 'axios';
import Divider from '@material-ui/core/Divider';
import './ButtonLists.css'

import { connect } from 'react-redux';
import store from '../../../store';
import { isObject, isNullOrUndefined } from 'util';

//Takes a sentence and returns the first letter of each word as one word
function getAcronym(name) {
  var wordList = name.split(" ")
  var acronym = ""
  
  for(var wordIndex = 0; wordIndex < wordList.length; wordIndex++){
    wordList[wordIndex].charAt(0)
  
    acronym = acronym + wordList[wordIndex].charAt(0)
  }
  
  return acronym
}

class ButtonList extends Component {
    constructor(props) {
        super(props);
        this.state = { type: props.type }
    }

    changeSelectedCompany = e => {
      store.dispatch({ type: 'COMPANY_SELECTED', data: { selectedCompany: e.currentTarget.id } })

      //Set all company button styles
      for(var i = 1; i < e.currentTarget.parentNode.childNodes.length; i++){
        e.currentTarget.parentNode.childNodes[i].className = "MuiButtonBase-root MuiListItem-root MuiTypography-root MuiListItemText-primary MuiTypography-body2 MuiTypography-displayBlock MuiListItem-dense MuiListItem-gutters MuiListItem-button"
      }

      //Set active company button style
      e.currentTarget.className=`${e.currentTarget.className} selected_company`

      //LOAD WORKSPACES
      axios.get('/workspaces/')
      .then(res => {
        var selected_company = store.getState().selectedCompany
        var workspaces = res.data.data[selected_company]
        var workspaceNames = []

        for(var currentWorkspace in workspaces){
          workspaceNames.push(workspaces[currentWorkspace].name)
        }

        store.dispatch({ type: 'WORKSPACE_NAMES_LOADED', data: { workspaces: workspaceNames} })
        store.dispatch({ type: 'WORKSPACE_SELECTED', data: { selectedWorkspace: workspaces[0].name } })
        this.changeSelectedWorkspace()
      })
      .catch(err => {
          console.log('Error from loading user companies');
      })
      }

      changeSelectedWorkspace = e => {
        //Change state
        store.dispatch({ type: 'WORKSPACE_SELECTED', data: { selectedWorkspace: e.currentTarget.id } })   
           
        //Set all workspace button styles
        for(var i = 1; i < e.currentTarget.parentNode.childNodes.length; i++){
          e.currentTarget.parentNode.childNodes[i].className = "MuiButtonBase-root MuiListItem-root MuiTypography-root MuiListItemText-primary MuiTypography-body2 MuiTypography-displayBlock MuiListItem-dense MuiListItem-gutters MuiListItem-button"
        }
    
        //Set active workspace button style
        e.currentTarget.className=`${e.currentTarget.className} selected_company`   
      }


      loadData = () => {

      }

    render() {
      var list;
      let buttonList;
      let joinButton;

      if (this.state.type === "Company"){
        joinButton = 
          <ListItem button>
            <ListItemAvatar>
              <ListItemIcon><AddCircle /></ListItemIcon>
            </ListItemAvatar>
            <ListItemText primary="Join Company" />
          </ListItem>;
            
            list = store.getState().companyNames;

            if(list === []){
              buttonList = "No companies found";
            }
            else {
              buttonList = list.map((company, k) => {
                var class_name = "MuiButtonBase-root MuiListItem-root MuiTypography-root MuiListItemText-primary MuiTypography-body2 MuiTypography-displayBlock  MuiListItem-dense MuiListItem-gutters MuiListItem-button"
                    
                  if(k === 0){ 
                    class_name = `${class_name} selected_company`
                  }
                  
                  return( 
                    <ListItem button  container dense={true} alignItemsFlexStart className={class_name} onClick={this.changeSelectedCompany} id={company}>
                      <ListItemAvatar style={{}}>
                        <Avatar>{getAcronym(company)}</Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={company} />
                    </ListItem>
                  )
                });
            }
          }
        else if (this.state.type === "Workspace"){
          joinButton = 
            <ListItem button>
              <ListItemAvatar>
                <ListItemIcon><AddCircle /></ListItemIcon>
              </ListItemAvatar>
              <ListItemText primary="Join Workspace" />
            </ListItem>

          list = store.getState().workspaceNames;
          
          if(list === []){
            buttonList = "No workspaces found";
          }
          else {
            buttonList = list.map((workspace, k) => {
              var class_name = "MuiButtonBase-root MuiListItem-root MuiTypography-root MuiListItemText-primary MuiTypography-body2 MuiTypography-displayBlock  MuiListItem-dense MuiListItem-gutters MuiListItem-button"
                  
                if(k === 0){ 
                  class_name = `${class_name} selected_company`
                }
                
                return( 
                  <ListItem button  container dense={true} alignItemsFlexStart className={class_name} onClick={this.changeSelectedWorkspace} id={workspace}>
                    <ListItemAvatar style={{}}>
                      <Avatar>{getAcronym(workspace)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={workspace} />
                  </ListItem>
                )
              });
          }
        }
        
        return(
            <div>
              <ListItem>
                  <Avatar alt="Logo" src="logo.png" />
              </ListItem>
                {buttonList}
                {joinButton}
          </div>
        )
    }
  }

const mapStateToProps = state => {
  return {selectedCompany: state.selectedCompany, selectedWorkspace: state.selectedWorkspace, companies: state.companies, workspaces: state.workspaces}
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonList)