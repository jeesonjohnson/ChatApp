import React, { useEffect } from "react";
import axios from 'axios';

import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

import DashboardIcon from "@material-ui/icons/Dashboard";
import ListIcon from "@material-ui/icons/ListAltRounded";
import CalendarTodayOutlinedIcon from "@material-ui/icons/CalendarTodayOutlined";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import AssignmentIcon from "@material-ui/icons/Assignment";

import ChatIcon from "@material-ui/icons/SpeakerNotes";
import GroupIcon from "@material-ui/icons/Group";
import PrivateChatIcon from "@material-ui/icons/Sms";
import PersonIcon from '@material-ui/icons/Person';
import MicIcon from "@material-ui/icons/Mic";
import VideoChatIcon from "@material-ui/icons/VoiceChat";

import { connect } from "react-redux";
import store from "../../../../store";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  selectedButton: {
    borderRightStyle: "solid",
    borderRightWidth: "5px",
    borderRightColor: "#725bda",
    backgroundColor: "#36393f",
  },
}));

function WorkspaceButtonList() {
  const classes = useStyles();
  //Below just stores all workspace data as per Backend response
  const workspaceData = useSelector((state) => state.allSelectedWorkspaceData);

  const selectedPanel = useSelector((state) => state.selectedPanel);
  const [plannerOpen, setPlannerOpen] = React.useState(true);
  const [chatOpen, setChatOpen] = React.useState(false);
  const [privateChatOpen, setPrivateChatOpen] = React.useState(false);
  const [voiceOpen, setVoiceOpen] = React.useState(false);
  const [videoOpen, setVideoOpen] = React.useState(false);
  const [group_chats_names, setGroupChatsNames] = React.useState([]);
  const [private_chats_names, setPrivateChatsNames] = React.useState([]);

  useEffect( () => {
    loadGroupChats() 
    loadPrivateChats()
    setChatOpen(false)
    setPrivateChatOpen(false)
  }, [store.getState().selectedWorkspace, store.getState().selectedCompany, store.getState().allSelectedWorkspaceData])

  const handleClick = (e) => {
    console.log(e.currentTarget)
    if (e.currentTarget.id === "Planner") {
      setPlannerOpen(!plannerOpen);
    } else if (e.currentTarget.id === "Group Chats") {
      setChatOpen(!chatOpen);
    } else if (e.currentTarget.id === "Private Chats") {
      setPrivateChatOpen(!privateChatOpen);
    } else if (e.currentTarget.id === "Voice Chats") {
      setVoiceOpen(!voiceOpen);
    } else if (e.currentTarget.id === "Video Chats") {
      setVideoOpen(!videoOpen);
    }
  };
  
  //Loads the data for group chats
  const loadGroupChats = async () => {
    await setGroupChatsNames([])
    
    if(workspaceData.group_chats !== undefined){ //Checks if the groupchats were loaded in
      if(workspaceData.group_chats.length > 0){ //Checks if there are any groupchats for the workspace
        var group_list = []
        workspaceData.group_chats.map((group_chat) => (
          group_list.push({title: group_chat.title, _id: group_chat._id}) //Adds each groupchat with title and id to be used for the group button (NOTE: _id is stored the groupchat icon)
        ))
        setGroupChatsNames(group_list)
      }
    }
  };

  //Loads the data for private chats
  const loadPrivateChats = async () => {
    await setPrivateChatsNames([])

    if(workspaceData.private_chats !== undefined){ //Checks if the private chatswere loaded in
      if(workspaceData.private_chats.length > 0){ //Checks if there are any private chats for the workspace
        let private_list = []
        
        await workspaceData.private_chats.map(async(private_chat) => {
          let name = await getPrivateUserName(private_chat.user1)
          
          private_list.push({
            title: name, 
            _id: private_chat._id
          }) //Adds each private chat with title and id to be used for the group button (NOTE: _id is stored the groupchat icon)
        })
        setPrivateChatsNames(private_list)
      }
    }
  };

  const getPrivateUserName = async (userId) =>{
    let name

    await axios.get(`/users/${userId}`)
    .then(res=>{ 
      name = res.data.data.name
    })

    return(name) 
  };

  const handleSelected = async (e) => {
    store.dispatch({
      type: "SELECTED_PANEL",
      data: { 
        selectedPanel:{
          id: e.currentTarget.id,
          name: e.currentTarget.textContent
        } 
      },
    });

    if(e.currentTarget.id !== "Charts"){
      store.dispatch({ type: 'CHART_CATEGOREY_CHANGED', data: { chartCategory: "" }})
    }
  };

  const loadButtonContent = (name, id, icon, selectedClass) => {
    return (
      <ListItem
        button
        className={selectedClass}
        onClick={handleSelected}
        id={id}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={name} />
      </ListItem>
    );
  };

  const loadButton = (name, id, icon, isNested) => {
    var button;
    var buttonClasses = [];

    if (isNested) {
      buttonClasses.push(classes.nested);
    }

    if (selectedPanel.id === id) {
      buttonClasses.push(classes.selectedButton);
      button = loadButtonContent(name, id, icon, buttonClasses);
    } else {
      button = loadButtonContent(name, id, icon, buttonClasses);
    }

    return button;
  };

  return (
    <div>
      <ListItem id="Planner" button onClick={handleClick}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Planner" />
        {plannerOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={plannerOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {loadButton("Calendar", "Calendar", <CalendarTodayOutlinedIcon />, true)}

          {loadButton("Charts", "Charts", <DonutLargeIcon />, true)}

          {loadButton("Tasks", "Tasks", <ListIcon />, true)}
        </List>
      </Collapse>

      {/* {loadButton("General", <AssignmentIcon />, false)} */}

      {loadButton("Announcements", "Announcements", <AnnouncementIcon />, false)}

      <ListItem id="Group Chats" button onClick={handleClick}>
        <ListItemIcon>
          <ChatIcon />
        </ListItemIcon>
        <ListItemText primary={ 
          workspaceData !== undefined ? 
            workspaceData.group_chats !== undefined ? 
              "Group Chats (" + workspaceData.group_chats.length + ")" 
              : 
              null
            :
            null
          } 
        />
        {chatOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse id="group_chats" in={chatOpen} timeout="auto" unmountOnExit>
        {workspaceData !== undefined && (group_chats_names !== undefined || group_chats_names !== []) ? //Check if there are any groupchats to load
          group_chats_names.map((group_chat, index) => (
            loadButton(group_chat.title, group_chat._id, <GroupIcon id={group_chat._id}/>, true)) //LoadButton needs three bits of data (1. Button text, 2. Button Icon, 3. Boolean for whether the button is nested inside the list)
          )
          :
          null
        }
      </Collapse>

      <ListItem id="Private Chats" button onClick={handleClick}>
        <ListItemIcon>
          <PrivateChatIcon />
        </ListItemIcon>
        <ListItemText primary={
          workspaceData !== undefined ? 
            workspaceData.private_chats !== undefined ?
              "Private Chats (" + workspaceData.private_chats.length + ")"
              :
              null
            :
            null
        } 
        />
        {privateChatOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse id="private_chats" in={privateChatOpen} timeout="auto" unmountOnExit>
        {workspaceData !== undefined && (private_chats_names !== undefined || private_chats_names !== []) ? //Check if there are any groupchats to load
          private_chats_names.map((private_chat, index) => (
              loadButton(private_chat.title, private_chat._id, <PersonIcon id={private_chat._id}/>, true)) //LoadButton needs three bits of data (1. Button text, 2. Button Icon, 3. Boolean for whether the button is nested inside the list)
            )
            :
            null
        }
      </Collapse>

      {/* <ListItem button onClick={handleClick}>
        <ListItemIcon>
          <MicIcon />
        </ListItemIcon>
        <ListItemText primary="Voice Chats" />
        {voiceOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={voiceOpen} timeout="auto" unmountOnExit>
        {loadButton(workspaceID, <GroupIcon />, true)}
      </Collapse>

      <ListItem button onClick={handleClick}>
        <ListItemIcon>
          <VideoChatIcon />
        </ListItemIcon>
        <ListItemText primary="Video Chats" />
        {videoOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={videoOpen} timeout="auto" unmountOnExit>
        {loadButton(workspaceID, <GroupIcon />, true)} */}
      {/* </Collapse> */}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedCompany: state.selectedCompany,
    companies: state.companies,
    workspaces: state.workspaces,
    selectedWorkspace: state.selectedWorkspace,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceButtonList);
