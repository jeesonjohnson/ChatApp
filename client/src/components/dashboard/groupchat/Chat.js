//Things to ask....abs
//1)Ask about the cookie error logging out
//2)Define a function for when the below compondent unmounts

import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import { connect } from "react-redux";
import axios from "axios";

// import TextContainer from './TextContainer/TextContainer';
import Messages from "./Messages/Messages";
import InfoBar from "./InfoBar/InfoBar";
import Input from "./Input/Input";
import store from "../../../store";

import "./Chat.css";

let socket;
const WEATHER_API_KEY = "50ae9f311f4a7d041ad5c5155d2d8639";

const Chat = (props) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const ENDPOINT = "https://oogwai-chat-server.herokuapp.com/"; //"localhost:8083"; //'https://project-chat-application.herokuapp.com/';//'localhost:8083';

  const roomTitle = props.title;

  useEffect(() => {
    const room = props._id;
    const name = store.getState().user.name;
    const user_id = store.getState().user._id;

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name);

    //Loading OLD messages into chat.
    axios
      .get(`/groupmessage/all/?group_id=${room}&page=1&limit=50`)
      .then((result) => {
        var tempMessageStore = [];
        var resultsStore = result.data.data;

        for (var i = 0; i < resultsStore.length; i++) {
          var temp = {
            text: resultsStore[i].message,
            user: resultsStore[i].author_id,
            name: resultsStore[i].author,
          };
          tempMessageStore.push(temp);
        }

        setMessages((messages) => [...messages, ...tempMessageStore]);
      });

    //Definition of what occurs when a person joins a chat
    socket.emit("join", { name, room,user_id }, (error) => {
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

  //Send message to server
  const sendMessage = (event) => {
    event.preventDefault();
    const currentUserID = store.getState().user._id;

    if (message) {
      var postMessage = {
        group_id: room,
        message: message,
        author: name,
        author_id: currentUserID,
      };

      const apiStartLocation = message.indexOf(">>");
      //If a message contains an API call we, need to make the API call and save the associated data
      if (apiStartLocation >= 0) {
        //No api then returns -1
        var stringSplitToApi = message
          .substring(apiStartLocation + 2)
          .split(" ");
        var apiToken = stringSplitToApi[0].toUpperCase();
        var apiMessage = stringSplitToApi[1].toLowerCase();

        switch (apiToken) {
          case "WEATHER":
            weatherAPICall(
              apiMessage,
              postMessage,
              room,
              name,
              currentUserID,
              socket,
              setMessage,
              message
            );
            break;
          case "MAP":
            mapAPICALL(apiMessage,
              postMessage,
              room,
              name,
              currentUserID,
              socket,
              setMessage,
              message
            );
            break;
        }
      } else {
        //Save non API Message to server
        axios
          .post("/groupmessage/", postMessage)
          .then((res) => {})
          .catch((error) => {
            if (error.response) {
              console.log("ERROROROROROOROROROR HERE");
              console.log(error.response.data);
            }
          });
        //Send message over sockets
        socket.emit("sendMessage", message, () => setMessage(""));
      }
    }
  };
  const currentUserID = store.getState().user._id;
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
          socket={socket}
          room={room}
          name={name}
          currentUserID={currentUserID}
          />
        </div>
      </div>
    </div>
  );
};

function mapAPICALL(
  apiMessage,
  postMessage,
  room,
  name,
  currentUserID,
  socket,
  setMessage,
  message
) {
  console.log("Main request is to");
  console.log(`http://api.postcodes.io/postcodes/${apiMessage.toLowerCase()}`);
  axios
    .get(
      `https://cors-anywhere.herokuapp.com/http://api.postcodes.io/postcodes/${apiMessage.toLowerCase()}`
    )
    .then((result) => {
      console.log("MAIN RESULT");
      console.log(result);
      //POst code generator website api.postcodes.io/postcodes/<POSTCODE>
      if (result.data.status !== 200) {
        postMessage =
          postMessage.message +
          `<APICALLTAG><ERROR>${JSON.stringify(
            result.data
          )}</ERROR></APICALLTAG>`;
      } else {
        postMessage =
          postMessage.message +
          `<APICALLTAG><MAP>${JSON.stringify(
            result.data.result
          )}</MAP></APICALLTAG>`;
      }
      console.log("Data passed into map prop is");
      console.log(result.data.result);

      var postStructure = {
        group_id: room,
        message: postMessage,
        author: name,
        author_id: currentUserID,
      };
      axios
        .post("/groupmessage/", postStructure)
        .then((res) => {
          socket.emit("sendMessage", postMessage, () => setMessage(""));
        })
        .catch((error) => {
          if (error.response) {
            console.log("ERROROROROROOROROROR HERE");
            console.log(error.response.data);
          }
        });
    });
}

function weatherAPICall(
  apiMessage,
  postMessage,
  room,
  name,
  currentUserID,
  socket,
  setMessage,
  message
) {
  axios
    .get(
      `https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=${apiMessage.toLowerCase()}&appid=${WEATHER_API_KEY}`
    )
    .then((result) => {
      if (result.cod === 200) {
        postMessage =
          postMessage.message +
          `<APICALLTAG><ERROR>${JSON.stringify(
            result.data
          )}</ERROR></APICALLTAG>`;
      } else {
        postMessage =
          postMessage.message +
          `<APICALLTAG><WEATHER>${JSON.stringify(
            result.data
          )}</WEATHER></APICALLTAG>`;
      }

      var postStructure = {
        group_id: room,
        message: postMessage,
        author: name,
        author_id: currentUserID,
      };
      axios
        .post("/groupmessage/", postStructure)
        .then((res) => {
          socket.emit("sendMessage", postMessage, () => setMessage(""));
        })
        .catch((error) => {
          if (error.response) {
            console.log("ERROROROROROOROROROR HERE");
            console.log(error.response.data);
          }
        });
    });
}


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
    allSelectedWorkspaceData: state.allSelectedWorkspaceData
  };
};

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
