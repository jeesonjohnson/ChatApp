import React from 'react';
import ReactEmoji from 'react-emoji';

import './Message.css';

//Methods regarding API call
import Weather from "./API/Weather/Weather"




const Message = ({ message: { text, user }, name }) => {
  let isSentByCurrentUser = false;

  const trimmedName = name.trim().toLowerCase();

  if(user === trimmedName) {
    isSentByCurrentUser = true;
  }


  //Methods for displaying API call
  const APICallStartIndex = text.indexOf("<APICALLTAG>");
  const APICallEndIndex = text.indexOf("</APICALLTAG>");
  const APIExists = false;
  const ActualAPIImage;
  if(APICallEndIndex>=0 && APICallEndIndex>=0){
    APICallExists = true;
    //Note the 12 for the lenght of <APICALLTAG>
    ActualAPIRender = whichAPI(text.substring(APICallStartIndex+12,APICallEndIndex));
  }
  

  return (
    isSentByCurrentUser
      ? (
        <div className="messageContainer justifyEnd">
          <p className="sentText pr-10">{trimmedName}</p>
          <div className="messageBox backgroundBlue">
            <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
            {APICallExists ? ActualAPIRender:null}
          </div>
        </div>
        )
        : (
          <div className="messageContainer justifyStart">
            <div className="messageBox backgroundLight">
              <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
              {APICallExists ? ActualAPIRender:null}
            </div>
            <p className="sentText pl-10 ">{user}</p>
          </div>
        )
  );
}

function whichAPI(message){

  var APITag = message.substring(message.indexOf("<",0),message.indexOf(">",0)+1);
  //Done this way to ensure no "<" inside of a message body messes with the data
  var APITagEnd = `</${APITag.substring(1)}` ;
  var actualData = JSON.parse(message.substring(message.indexOf(APITag)+APITag.length,message.indexOf(APITagEnd)));

  switch (APITag){
    case "WEATHER":
      return <Weather response={actualData}/>
    default:
      return null
  }

}

export default Message;