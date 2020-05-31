import React from "react";
import store from "../../../../store";

import "./Input.css";

import FileUpload from "../fileUpload/FileUpload";

const Input = ({ message,setMessage,sendMessage,socket,room,name,currentUserID}) => {
  return (
    <div>
      <form className="form">
        <input
          className="input"
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={({ target: { value } }) => setMessage(value)}
          onKeyPress={(event) =>
            event.key === "Enter" ? sendMessage(event) : null
          }
        />
        <div className="fileUploadButton">
          <FileUpload
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
            socket={socket}
            room={room}
            name={name}
            currentUserID={currentUserID}
          />
        </div>
        <button className="sendButton" onClick={(e) => sendMessage(e)}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Input;
