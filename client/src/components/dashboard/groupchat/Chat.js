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
    <div className="overall">
      <div className="outerContainer">
        <div className="container">
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

// import React, { useState, useEffect } from "react";
// import { connect } from "react-redux";
// import queryString from "query-string";
// import store from "../../../store";

// //None react plugins
// import axios from "axios";
// import io from "socket.io-client";

// //Styling
// import CssBaseline from "@material-ui/core/CssBaseline";
// import Typography from "@material-ui/core/Typography";
// import Container from "@material-ui/core/Container";
// import "./chat.css";

// //Other components of chat
// import ChatHeader from "./chatHeader/chatHeader";
// import UserInput from "./userInput/userInput";
// import Messages from "./messages/messages";

// // <div className="overall">
// //     {console.log(props)}
// //     <div>Chat ID: {props._id}</div>
// //     <div>Chat Title: {props.title}</div>
// //     <div>Workspace ID: {props.workspaceID}</div>
// //     {props.users.length > 0 ?
// //     props.users.map((user) =>(
// //         <div>{user}</div>
// //     ))
// //     :
// //     null
// //     }
// // </div>

// let socket;

// function Chat(props) {
//   const [name, setName] = useState("");
//   const [room, setRoom] = useState("");
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);

//   //Setting up connection to chat server
//   useEffect(() => {
//     const userName = store.getState().user.name;
//     const chatID = props._id;
//     const chatTitle = props.title;

//     //Connect to backend
//     let SERVERADDRESS = "localhost:8082";
//     var connectionOptions =  {
//         "force new connection" : true,
//         "reconnectionAttempts": "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
//         "timeout" : 10000,                  //before connect_error and connect_timeout are emitted.
//         "transports" : ["websocket"]
//     };

//     socket = io(SERVERADDRESS, connectionOptions);
//     // socket = io(SERVERADDRESS);

//     //Initiate chat stream
//     socket.emit("chatjoin", { userName, chatID }, () => {});

//     //Disconnecting a socket connection
//     return () => {
//       socket.emit("disconnect");
//       socket.off();
//     };
//   }, [props]);

//   //What happens when a message is received by client
//   useEffect(() => {
//     socket.on("message", (message) => {
//       //Fancy ES6 for adding a message to the top of the messages array
//       setMessages([...messages, message]);
//     });
//   }, [messages]);

//   const sendMessage = (event) => {
//     event.preventDefault();
//     if (message) {
//       socket.emit("sendMessage", message, () => setMessage(""));
//     }
//   };
//   console.log(message, messages);
//   return (
//     <div className="overall">
//       <div className="outerContainer">
//         <div className="container">
//           <ChatHeader room={room} user={name} />
//           <Messages messages={messages} name={name} />
//           <UserInput
//             message={message}
//             setMessage={setMessage}
//             sendMessage={sendMessage}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// //Redundant code about state!
// const mapStateToProps = (state) => {
//   return {
//     selectedCompany: state.selectedCompany,
//     companies: state.companies,
//     workspaces: state.workspaces,
//     selectedWorkspace: state.selectedWorkspace,
//     taskCollectionIDs: state.taskCollectionIDs,
//     workspaceTaskCollections: state.workspaceTaskCollections,
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   return { dispatch };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(Chat);
