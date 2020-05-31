import React from "react";
import "./FileWidget.css";
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded';
import {Box,Button,IconButton, Container} from "@material-ui/core";


export default function FileWidget({ text }) {
  var fileStartLocation = text.substring(text.indexOf("!FILE!", 0) + 6);
  var fileLocation = fileStartLocation.substring(
    0,
    fileStartLocation.indexOf("!FILE!", 0)
  );
  var fileNameStart = text.substring(text.indexOf("!NAME!", 0) + 6);
  var fileName = fileNameStart.substring(0, fileNameStart.indexOf("!NAME!", 0));
  return (
    <Box>
      <div>
        <a href={fileLocation} className="downloadTitle" download>
          <center>
            <h3>Download: {fileName}</h3>
          </center>
          <IconButton className="svg_scale">
            <GetAppRoundedIcon className="svg_scale" />
          </IconButton>
        </a>
      </div>
    </Box>
  );
}
