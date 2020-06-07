import React, { useState } from "react";
import axios from "axios";

//UI methods
import { DropzoneDialog } from "material-ui-dropzone";
import IconButton from '@material-ui/core/IconButton';
import { Modal } from "@material-ui/core";
import ProgressBar from "./Progress";
import AttachFileIcon from '@material-ui/icons/AttachFile';

const FileUploadDialog = ({ message,setMessage,sendMessage,socket,room,name,currentUserID}) => {
  const [open, openSelector] = useState(false);
  const [files, setFile] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [uploadingState, setUploadingState] = useState("Uploading");
  const [event, setEvent] = useState({});

  const handleClose = e => {
    openSelector(false);
  };

  const handleSave = (file) => {
    setFile(file);
    openSelector(false);
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file[0]);
    console.log(file)

    axios
      .post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );
        //   setTimeout(() => setUploadPercentage(0), 10000);
        }
      })
      .then(result => {
        const { fileName, filePath } = result.data;
        console.log("A FILE WAS UPLOADED SUCESSFULLY");
        console.log(fileName,filePath);

        uploadMessageSend(fileName,filePath,socket,room,name,currentUserID);


        setUploading(false);

      })
      .catch(err => {
        console.log("A ERROR UPLADOING THE FI");
        console.log(err);
        if (err.response.status === 500) {
          setUploadingState("There was a problem with the server");
        } else {
          setUploadingState(err.response.data.msg);
        }
        setUploading(false);
      });
  };

  const handleOpen = e => {
    openSelector(true);
    setEvent(e);
  };
  return (
    <div>
      <IconButton onClick={handleOpen.bind(this)} disableRipple={true} disableFocusRipple={true} disableTouchRipple={true}>
        <AttachFileIcon/>
      </IconButton>
      <DropzoneDialog
        inputProps={{type:"file",id:"mainfiles",name:"mainfiles"}}
        showFileNamesInPreview={true}
        showFileNames={true}
        filesLimit={1}
        open={open}
        onSave={handleSave.bind(this)}
        showPreviews={true}
        maxFileSize={5000000}
        onClose={handleClose.bind(this)}
      />
      <Modal open={uploading}>
        <ProgressBar
          percentage={uploadPercentage}
          loadingState={uploadingState}
        />
      </Modal>
    </div>
  );
};


function uploadMessageSend(fileName,filePath,socket,room,name,currentUserID){
    console.log("inUploadMethod");
    console.log(room,name,currentUserID,fileName,filePath)
    var postMessage = `>>file !FILE!${filePath}!FILE! !NAME!${fileName}!NAME!`;
    var postStructure = {
        group_id: room,
        message: postMessage,
        author: name,
        author_id: currentUserID,
      };
      axios
        .post("/groupmessage/", postStructure)
        .then((res) => {
          socket.emit("sendMessage", postMessage, () => {console.log("Sucessfully submitted to socket")});
        })
        .catch((error) => {
          if (error.response) {
            console.log("ERROROROROROOROROROR HERE");
            console.log(error.response.data);
          }
        });




}

export default FileUploadDialog;
