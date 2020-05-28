import React from "react";
import ReactEmoji from "react-emoji";

import "./Message.css";

//Methods regarding Weather API call
import Weather from "./API/Weather/Weather";
import Error from "./API/Error/Error";

//Regarding youtube API call
import YouTube from "react-youtube";


const Message = ({ message: { text, user }, name }) => {
  let isSentByCurrentUser = false;

  const trimmedName = name.trim().toLowerCase();

  if (user === trimmedName) {
    isSentByCurrentUser = true;
  }

  //Methods for displaying API call
  const APICallStartIndex = text.indexOf("<APICALLTAG>");
  const APICallEndIndex = text.indexOf("</APICALLTAG>");
  var APICallExists = false;
  var ActualAPIRender = null;
  var noAPIText = text;
  if (APICallEndIndex >= 0 && APICallStartIndex >= 0) {
    APICallExists = true;
    //Note the 12 for the lenght of <APICALLTAG>
    ActualAPIRender = whichAPI(
      text.substring(APICallStartIndex + 12, APICallEndIndex)
    );
    noAPIText = text.substring(0, APICallStartIndex);
  }
  var youtubeVideo = false;
  if (
    text.toLowerCase().indexOf("http") >= 0 &&
    text.toLowerCase().indexOf("youtu") >= 0
  ) {
    youtubeVideo = true;
  }

  //RIGHJT NOW THE TEXT IS PRESENT BUT ONLY THE NOAPITEXT HAS THE ACTUAL IMAGE... NOT ETHE CURRENT IMAGE DOESNT FIT ON HERE
  return isSentByCurrentUser ? (
    <div className="messageContainer justifyEnd">
      <p className="sentText pr-10">{trimmedName}</p>
      <div className="messageBox backgroundBlue">
        <p className="messageText colorWhite">
          {ReactEmoji.emojify(noAPIText)}
        </p>
        <div>{APICallExists ? ActualAPIRender : null}</div>
        <div>{youtubeVideo ? playYoutube(text) : null}</div>
      </div>
    </div>
  ) : (
    <div className="messageContainer justifyStart">
      <div className="messageBox backgroundLight">
        <p className="messageText colorDark">{ReactEmoji.emojify(noAPIText)}</p>
        <div>{APICallExists ? ActualAPIRender : null}</div>
        <div>{youtubeVideo ? playYoutube(text) : null}</div>
      </div>
      <p className="sentText pl-10 ">{user}</p>
    </div>
  );
};

function whichAPI(message) {
  console.log("Un restrictde message");
  console.log(message);

  var APITag = message
    .substring(message.indexOf("<", 0), message.indexOf(">", 0) + 1)
    .toUpperCase();
  //Done this way to ensure no "<" inside of a message body messes with the data
  var APITagEnd = `</${APITag.substring(1)}`;
  var actualData = JSON.parse(
    message.substring(
      message.indexOf(APITag) + APITag.length,
      message.indexOf(APITagEnd)
    )
  );
  console.log("THE ACTUAL DATA BEING PASSED IN");
  console.log(actualData);

  console.log("Test vaklues");
  console.log(APITag);
  console.log(APITagEnd);

  switch (APITag) {
    case "<WEATHER>":
      console.log(
        "The weather was returenedRRRRRRRRRRRRRRRRRRRRRRRRR YAYYYYYYYYYYYYYYYYYYYYYYY"
      );
      return <Weather response={actualData} />;
    default:
      console.log("THE DEFULAT WAS INTIITALISED");
      return <Error />;
  }
}

function playYoutube(text) {
  var youtubeNameIndex = text.toLowerCase().indexOf("youtube");
  console.log(text.substring(youtubeNameIndex));
  var videoID="FXPKJUE86d0";
  var idEnd;
  if(youtubeNameIndex>=0){
    videoID = text.substring(youtubeNameIndex);
    videoID = videoID.substring(videoID.indexOf("?v=")+3);
    idEnd = videoID.indexOf(" ")>=0?videoID.indexOf(" "):videoID.length;
    videoID = videoID.substring(0,idEnd);
    console.log(videoID);
  }else{
    videoID = text.substring(text.indexOf("youtu.be/"));
    idEnd = videoID.indexOf(" ")>=0?videoID.indexOf(" "):videoID.length;
    videoID = videoID.substring(9,idEnd);
    console.log(idEnd,videoID);
  }

  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 0,
    },
  };
  return <div><YouTube videoId={videoID} opts={opts} /></div>
}

export default Message;
