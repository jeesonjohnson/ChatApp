import React from 'react';

import onlineIcon from '../icons/onlineIcon.png';

import './InfoBar.css';

const InfoBar = ({ room,user }) => (
  <div className="infoBar">
    <div className="leftInnerContainer">
      <img className="onlineIcon" src={onlineIcon} alt="online icon" />
      <h3>{room}</h3>
    </div>
    <div className="rightInnerContainer">
      <a>{user}</a>
    </div>
  </div>
);

export default InfoBar;