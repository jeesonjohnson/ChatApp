import React, { useEffect } from "react";

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

import ChatIcon from "@material-ui/icons/Chat";
import MicIcon from "@material-ui/icons/Mic";
import VideoChatIcon from "@material-ui/icons/VoiceChat";
import GroupIcon from "@material-ui/icons/Group";

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

  const workspaceID = useSelector((state) => state.selectedWorkspace);
  
  //Below just stores all workspace data as per Backend response
  const workspaceData = useSelector((state) => state.allSelectedWorkspaceData);

  const [selectedPanel, setSelectedPanel] = React.useState("Calendar");
  const [plannerOpen, setPlannerOpen] = React.useState(true);
  const [chatOpen, setChatOpen] = React.useState(false);
  const [voiceOpen, setVoiceOpen] = React.useState(false);
  const [videoOpen, setVideoOpen] = React.useState(false);
  
  const [group_chats_names, setGroupChatsNames] = React.useState([]);

  useEffect( () => {
    loadGroupChats()
  }, [store.getState().selectedWorkspace, workspaceData])

  const handleClick = (e) => {
    if (e.currentTarget.innerText === "Planner") {
      setPlannerOpen(!plannerOpen);
    } else if (e.currentTarget.innerText === "Group Chats") {
      setChatOpen(!chatOpen);
    } else if (e.currentTarget.innerText === "Voice Chats") {
      setVoiceOpen(!voiceOpen);
    } else if (e.currentTarget.innerText === "Video Chats") {
      setVideoOpen(!videoOpen);
    }
  };
  
  //Loads the data for groupchats
  const loadGroupChats = async () => {
    if(workspaceData.group_chats !== undefined){ //Checks if the groupchats were loaded in
      if(workspaceData.group_chats.length > 0){ //Checks if there are any groupchats for the workspace
        var a = []
        workspaceData.group_chats.map((group_chat) => (
          a.push({title: group_chat.title, _id: group_chat._id}) //Adds each groupchat with title and id to be used for the group button (NOTE: _id is stored the groupchat icon)
        ))
        setGroupChatsNames(a)
      }
      else {setGroupChatsNames([])}
    }
  };

  const handleSelected = async (e) => {
    setSelectedPanel(e.currentTarget.id);
    store.dispatch({
      type: "SELECTED_PANEL",
      data: { selectedPanel: e.currentTarget.id },
    });
  };

  const loadButtonContent = (name, icon, selectedClass) => {
    return (
      <ListItem
        button
        className={selectedClass}
        onClick={handleSelected}
        id={name}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={name} />
      </ListItem>
    );
  };

  const loadButton = (name, icon, isNested) => {
    var button;
    var buttonClasses = [];

    if (isNested) {
      buttonClasses.push(classes.nested);
    }

    if (selectedPanel === name) {
      buttonClasses.push(classes.selectedButton);
      button = loadButtonContent(name, icon, buttonClasses);
    } else {
      button = loadButtonContent(name, icon, buttonClasses);
    }

    return button;
  };

  return (
    <div>
      <ListItem button onClick={handleClick}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Planner" />
        {plannerOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={plannerOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {loadButton("Calendar", <CalendarTodayOutlinedIcon />, true)}

          {loadButton("Charts", <DonutLargeIcon />, true)}

          {loadButton("Tasks", <ListIcon />, true)}
        </List>
      </Collapse>

      {loadButton("General", <AssignmentIcon />, false)}

      {loadButton("Announcements", <AnnouncementIcon />, false)}

      <ListItem button onClick={handleClick}>
        <ListItemIcon>
          <ChatIcon />
        </ListItemIcon>
        <ListItemText primary="Group Chats" />
        {chatOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={chatOpen} timeout="auto" unmountOnExit>
        {group_chats_names === [] || group_chats_names === undefined ? //Check if there are any groupchats to load
          null
          :
            group_chats_names.map((group_chat, index) => (
                loadButton(group_chat.title, <GroupIcon id={group_chat._id}/>, true)) //LoadButton needs three bits of data (1. Button text, 2. Button Icon, 3. Boolean for whether the button is nested inside the list)
            )
        }
      </Collapse>

      <ListItem button onClick={handleClick}>
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
        {loadButton(workspaceID, <GroupIcon />, true)}
      </Collapse>
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
