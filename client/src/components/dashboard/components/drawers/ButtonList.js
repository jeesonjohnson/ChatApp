import React, { Component } from 'react';
import './ButtonLists.css'
import axios from 'axios';

import { connect } from 'react-redux';
import store from '../../../../store';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import AddCircle from '@material-ui/icons/Add';
import { isUndefined, isNullOrUndefined } from 'util';

import { getCompanies, getTaskCollections } from '../../DataLoading.js';

//Takes a sentence and returns the first letter of each word as one word
function getAcronym(name) {
    if(name !== "" || name !== isUndefined){
      var wordList = name.split(" ")
      var acronym = ""
      
      for(var wordIndex = 0; wordIndex < wordList.length; wordIndex++){
        wordList[wordIndex].charAt(0)
        
        acronym = acronym + wordList[wordIndex].charAt(0)
      }
    
      return acronym
    }
  }

function JoinButton(text) {
    return(
        <ListItem button>
            <ListItemAvatar>
                <Avatar>
                    <AddCircle />

                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={text} />
        </ListItem>
    )
}; 

function getButtonList(list, changeSelected){
    let buttonList

    if (list.length > 0){
        buttonList = list.map((item, key) => {
            var class_name = "MuiButtonBase-root MuiListItem-root MuiTypography-root MuiListItemText-primary MuiTypography-body2 MuiTypography-displayBlock  MuiListItem-dense MuiListItem-gutters MuiListItem-button"
        
            if(key === 0){ 
                class_name = `${class_name} selected_company`
            }

            return(
                <ListItem button container dense={true} alignItemsFlexStart className={class_name} key={key} id={item._id} onClick={changeSelected.bind(this)}>
                    <ListItemAvatar>
                        <Avatar>{getAcronym(item.name)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={item.name} />
                </ListItem>
            )
        })
    }
    else {
        buttonList = ""
    }

    return buttonList
}

class ButtonList extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          type: props.type,
        }
        
        // if(this.state.type === "Company"){
        //     getCompanies("")
        // }
    }

    changeSelectedCompany = e => {
        getCompanies(e.currentTarget.id)
        // Set UI for Company buttons
        for(var i = 0; i < e.currentTarget.parentNode.childNodes.length; i++){
            e.currentTarget.parentNode.childNodes[i].className = "MuiButtonBase-root MuiListItem-root MuiTypography-root MuiListItemText-primary MuiTypography-body2 MuiTypography-displayBlock MuiListItem-dense MuiListItem-gutters MuiListItem-button" //Set all company button styles
        }
        e.currentTarget.className=`${e.currentTarget.className} selected_company` //Set active company button style

        //Set UI for Workspace buttons
        const workspacePanel = e.currentTarget.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[1]
        
        for(var i = 0; i < workspacePanel.childNodes.length; i++) {
            workspacePanel.childNodes[i].className = "MuiButtonBase-root MuiListItem-root MuiTypography-root MuiListItemText-primary MuiTypography-body2 MuiTypography-displayBlock MuiListItem-dense MuiListItem-gutters MuiListItem-button"
        } 
        const workspaceButton = workspacePanel.childNodes[0] //Sets first button in workspace list
        workspaceButton.className = "MuiButtonBase-root MuiListItem-root MuiTypography-root MuiListItemText-primary MuiTypography-body2 MuiTypography-displayBlock MuiListItem-dense MuiListItem-gutters MuiListItem-button selected_company"
    }

    changeSelectedWorkspace = e => {
       //Set all workspace button styles
      for(var i = 0; i < e.currentTarget.parentNode.childNodes.length; i++){
        e.currentTarget.parentNode.childNodes[i].className = "MuiButtonBase-root MuiListItem-root MuiTypography-root MuiListItemText-primary MuiTypography-body2 MuiTypography-displayBlock MuiListItem-dense MuiListItem-gutters MuiListItem-button"
      }

      //Set active workspace button style
      e.currentTarget.className=`${e.currentTarget.className} selected_company`   
      
      store.dispatch({ type: 'WORKSPACE_SELECTED', data: { selectedWorkspace: e.currentTarget.id }})     
    //   getTaskCollections() 
    }
    
    render() {
        //Load the elements for the button lists of Companies and Workspaces
        let buttonList

        if (store.getState().companies.length > 0){
            if(this.state.type === "Company"){
                buttonList = getButtonList(store.getState().companies, this.changeSelectedCompany)
            }
            else if (this.state.type === "Workspace"){
                buttonList = getButtonList(store.getState().workspaces, this.changeSelectedWorkspace)
            }
        }

        return(
            <div>
                {buttonList}
                {JoinButton("Join " + this.state.type)}
          </div>
        )
    }
  }

const mapStateToProps = state => {
  return {selectedCompany: state.selectedCompany, companies: state.companies, workspaces: state.workspaces, selectedWorkspace: state.selectedWorkspace, taskCollectionIDs: state.taskCollectionIDs, workspaceTaskCollections: state.workspaceTaskCollections}
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonList)