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
  var APICallExists = false;
  var ActualAPIRender = null;
  var noAPIText = text;
  if(APICallEndIndex>=0 && APICallStartIndex>=0){
    APICallExists = true;
    //Note the 12 for the lenght of <APICALLTAG>
    ActualAPIRender = whichAPI(text.substring(APICallStartIndex+12,APICallEndIndex));
    noAPIText=text.substring(0,APICallStartIndex);
  }
  
//RIGHJT NOW THE TEXT IS PRESENT BUT ONLY THE NOAPITEXT HAS THE ACTUAL IMAGE... NOT ETHE CURRENT IMAGE DOESNT FIT ON HERE
  return (
    isSentByCurrentUser
      ? (
        <div className="messageContainer justifyEnd">
          <p className="sentText pr-10">{trimmedName}</p>
          <div className="messageBox backgroundBlue">
            <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
            <div>{APICallExists ? ActualAPIRender:"no api call"}</div>
          </div>
        </div>
        )
        : (
          <div className="messageContainer justifyStart">
            <div className="messageBox backgroundLight">
              <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
              {APICallExists ? ActualAPIRender:"no api call"}
            </div>
            <p className="sentText pl-10 ">{user}</p>
          </div>
        )
  );
}

function whichAPI(message){
  console.log("Un restrictde message");
  console.log(message);

  var APITag = message.substring(message.indexOf("<",0),message.indexOf(">",0)+1).toUpperCase();
  //Done this way to ensure no "<" inside of a message body messes with the data
  var APITagEnd = `</${APITag.substring(1)}` ;
  var actualData = JSON.parse(message.substring(message.indexOf(APITag)+APITag.length,message.indexOf(APITagEnd)));
  console.log("THE ACTUAL DATA BEING PASSED IN");
  console.log(actualData);

  console.log("Test vaklues");
  console.log(APITag);
  console.log(APITagEnd);

  switch (APITag){
    case "<WEATHER>":
      console.log("The weather was returenedRRRRRRRRRRRRRRRRRRRRRRRRR YAYYYYYYYYYYYYYYYYYYYYYYY")
      return <Weather response={actualData}/>
    default:
      console.log("THE DEFULAT WAS INTIITALISED")
      return null
  }

}

export default Message;