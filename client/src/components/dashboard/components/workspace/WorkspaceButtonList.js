import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StarBorder from "@material-ui/icons/StarBorder";

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
import { useSelector, useDispatch } from "react-redux";

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

  const [plannerOpen, setPlannerOpen] = React.useState(true);
  const [chatOpen, setChatOpen] = React.useState(false);
  const [voiceOpen, setVoiceOpen] = React.useState(false);
  const [videoOpen, setVideoOpen] = React.useState(false);
  const [selectedPanel, setSelectedPanel] = React.useState("Calendar");

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
  
  //Need to do this!
  const loadGroupChats = () => {
    if(!workspaceData.group_chats){

      console.log("Here")
      console.log(typeof(workspaceData.group_chats))
      console.log(JSON.stringify(workspaceData.group_chats[0]))
    }
    // console.log("JERERERERERERERE")
    // workspaceData.group_chats.map((group)=>{
    //   console.log(group.title)
    // })
    // return workspaceData.group_chats.map((group, i) =>{
    //   console.log(group)
    //   return (<li>{group.title}</li>)
    //   // loadButtonContent(group.title, <ListIcon />, true)
    // }
    // );
    // return workspaceData.group_chats.map((group) => {
    //   console.log("hereeeeeeeee")
    //   console.log(group)
    //   // <ListItem
    //   //   button
    //   //   className={true}
    //   //   onClick={handleSelected}
    //   //   id={group.title}
    //   // >
    //   //   <ListItemIcon>
    //   //     <ChatIcon />
    //   //   </ListItemIcon>
    //   //   <ListItemText primary={group.title} />
    //   // </ListItem>;
    //   // loadButtonContent(group.title,<ChatIcon />,true)
    // });
  };

  const handleSelected = (e) => {
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
        {
          //Here cointains the names of the chats
          loadGroupChats()
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
