import React, { Component, useState } from "react";
import "./Map.css";
import L from "leaflet";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import pinDrop from "./icons/pinDrop.png";

import axios from "axios";

export default function MapComponent(props) {
  var latitude = props.response.latitude;
  var longitude = props.response.longitude;
  var locationDetailsText = props.response.nuts +" "+ props.response.region + " " +props.response.country;
  return <div>{actualMap(latitude, longitude,locationDetailsText)}</div>;
}

function actualMap(latitude, longitude,locationDetails) {
  var redIcon = L.icon({
    iconUrl: pinDrop,
    iconSize: [38, 80], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62], // the same for the shadow
    popupAnchor: [-3, -86]
  });
  const positionRedIcon = [latitude, longitude];
  const mapZoom = 13;

  return (
    <div className="mapOuterBox">
    <p>{locationDetails}</p>
      <Map className="mapStyling" center={positionRedIcon} zoom={mapZoom}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={positionRedIcon} icon={redIcon}>
          <Popup>{locationDetails}</Popup>
        </Marker>
      </Map>
      <br/>
    </div>
  );
}

