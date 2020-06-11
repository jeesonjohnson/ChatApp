import React from "react";
import "./FileWidget.css";
import GetAppRoundedIcon from "@material-ui/icons/GetAppRounded";
import { Box, IconButton } from "@material-ui/core";

export default function FileWidget({ text }) {
  var fileStartLocation = text.substring(text.indexOf("!FILE!", 0) + 6);
  var fileLocation = fileStartLocation.substring(
    0,
    fileStartLocation.indexOf("!FILE!", 0)
  );
  var fileNameStart = text.substring(text.indexOf("!NAME!", 0) + 6);
  var fileName = fileNameStart.substring(0, fileNameStart.indexOf("!NAME!", 0));
  // const imageLocation = "./dow.png";
  return (
    <Box>
      <div>
        <a href={fileLocation} className="downloadTitle" download>
          <center>
            <h4 style={{ color: "black" }}><b>Download: {fileName}</b></h4>
            <IconButton className="svg_scale" size="large">
              <GetAppRoundedIcon
                className="svg_scale"
                style={{ fontSize: 60 }}
              />
            </IconButton>
          </center>
        </a>
      </div>
    </Box>
  );
}
