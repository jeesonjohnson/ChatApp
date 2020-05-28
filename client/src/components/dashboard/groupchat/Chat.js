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
  const ENDPOINT = "localhost:8083"; //'https://project-chat-application.herokuapp.com/';//'localhost:8083';

  const roomTitle = props.title;

  useEffect(() => {
    const room = props._id;
    const name = store.getState().user.name;

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
            user: resultsStore[i].author,
          };
          tempMessageStore.push(temp);
        }

        setMessages((messages) => [...messages, ...tempMessageStore]);
      });

    //Definition of what occurs when a person joins a chat
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
        console.log(
          "APIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII TOKEN"
        );
        console.log(apiToken);

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
          // axios
          //   .get(
          //     `https://cors-anywhere.herokuapp.com/https://samples.openweathermap.org/data/2.5/weather?q=${apiMessage.toLowerCase()}&appid=${WEATHER_API_KEY}`
          //   )
          //   .then((result) => {
          //     if (result.cod != "200") {
          //       postMessage =
          //         postMessage.message +
          //         `<APICALLTAG><ERROR>${JSON.stringify(
          //           result.data
          //         )}</ERROR></APICALLTAG>`;
          //     } else {
          //       postMessage =
          //         postMessage.message +
          //         `<APICALLTAG><WEATHER>${JSON.stringify(
          //           result.data
          //         )}</WEATHER></APICALLTAG>`;
          //     }

          //     var postStructure = {
          //       group_id: room,
          //       message: postMessage,
          //       author: name,
          //       author_id: currentUserID,
          //     };
          //     console.log(
          //       "THe message that was to be senttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt"
          //     );
          //     console.log(postStructure);
          //     console.log(typeof postStructure);
          //     axios
          //       .post("/groupmessage/", postStructure)
          //       .then((res) => {
          //         socket.emit("sendMessage", postMessage, () =>
          //           setMessage("")
          //         );
          //       })
          //       .catch((error) => {
          //         if (error.response) {
          //           console.log("ERROROROROROOROROROR HERE");
          //           console.log(error.response.data);
          //         }
          //       });
          //     // message.text = message.text+`<APICALLTAG><WEATHER>${JSON.stringify(result.data)}</WEATHER></APICALLTAG>`;
          //     var temp = JSON.parse(JSON.stringify(message));
          //     console.log("TEMP STRUCUTRE");
          //     console.log(temp);
          //     console.log(typeof temp);
          //     // temp.text = temp.text+`<APICALLTAG><WEATHER>${JSON.stringify(result.data)}</WEATHER></APICALLTAG>`;
          //     //Send message over sockets
          //     // socket.emit("sendMessage", temp, () => setMessage(""));
          //   });
          // // weatherAPICall(
          // //   socket,
          // //   apiToken,
          // //   apiMessage,
          // //   postMessage,
          // //   setMessage,
          // //   message
          // // );
          // break;
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
        console.log("NORMAL MESSAGE");
        console.log(typeof message);
        console.log(message);
        socket.emit("sendMessage", message, () => setMessage(""));
      }
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
      console.log(
        "THe message that was to be senttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt"
      );
      console.log(postStructure);
      console.log(typeof postStructure);
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
      // message.text = message.text+`<APICALLTAG><WEATHER>${JSON.stringify(result.data)}</WEATHER></APICALLTAG>`;
      var temp = JSON.parse(JSON.stringify(message));
      console.log("TEMP STRUCUTRE");
      console.log(temp);
      console.log(typeof temp);
      // temp.text = temp.text+`<APICALLTAG><WEATHER>${JSON.stringify(result.data)}</WEATHER></APICALLTAG>`;
      //Send message over sockets
      // socket.emit("sendMessage", temp, () => setMessage(""));
    });
  // weatherAPICall(
  //   socket,
  //   apiToken,
  //   apiMessage,
  //   postMessage,
  //   setMessage,
  //   message
  // );
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
