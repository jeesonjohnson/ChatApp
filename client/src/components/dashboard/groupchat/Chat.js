//Things to ask....abs
//1)Ask about the cookie error logging out
//2)Define a function for when the below compondent unmounts

import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import { connect } from "react-redux";

// import TextContainer from './TextContainer/TextContainer';
import Messages from "./Messages/Messages";
import InfoBar from "./InfoBar/InfoBar";
import Input from "./Input/Input";
import store from "../../../store";

import "./Chat.css";

let socket;

const Chat = (props) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const ENDPOINT = "localhost:8083"; //'https://project-chat-application.herokuapp.com/';//'localhost:8083';
  
  const roomTitle = props.title;

  useEffect(() => {
    const room = props._id;
    const name = store.getState().user.name;

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name);

    socket.emit("join", { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [props]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };


  

  return (
    <div className="overallChatContainer">
      <div className="outerChatContainer">
        <div className="chatInnerContainer">
          <InfoBar room={roomTitle} user={name} />
          <Messages messages={messages} name={name} />
          <Input
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
          />
        </div>
      </div>
    </div>
  );
};

//<TextContainer users={users}/> was removed from hwere the div space is!!!!!!!!!!!!!
//Redundant code about state!
const mapStateToProps = (state) => {
  return {
    selectedCompany: state.selectedCompany,
    companies: state.companies,
    workspaces: state.workspaces,
    selectedWorkspace: state.selectedWorkspace,
    taskCollectionIDs: state.taskCollectionIDs,
    workspaceTaskCollections: state.workspaceTaskCollections,
  };
};

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
