const subdomain = require("express-subdomain");
const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
//Error handling utils
const AppError = require("./utils/appError");
const globalErrorhandler = require("./utils/errorController");
//Live chat communication
const http = require("http");
const socketio = require("socket.io");
const chat = require("./controllers/usersLiveChat.js");
const cors = require('cors');
//File uploading function
const fileUpload = require('express-fileupload');
//Custom routes
const userRouter = require("./routes/userRoutes");
const companyRouter = require("./routes/companyRoutes");
const workspaceRouter = require("./routes/workspaceRoutes");
const todoCollectionRouter = require("./routes/todoCollectionRoutes");
const todoElementRouter = require("./routes/todoElementRoutes");
const groupChatRouter = require("./routes/groupChatRoutes");
const groupMessageRouter = require("./routes/groupMessageRoutes");
const privateChatRouter = require("./routes/privateChatRoutes");
const privateMessageRouter = require("./routes/privateMessageRoutes");

const app = express();


//#########################   MAIN BACKEND  ###########################
//Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
//    Middleware
//Allow parsing of body elements as JSON Objects
app.use(bodyParser.json());
//Text compression for heroku
app.use(compression());
//For file upload
app.use(fileUpload());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString;
  next();
});

//Routes
app.use("/users", userRouter);
app.use("/companies", companyRouter);
app.use("/workspaces", workspaceRouter);
app.use("/todocollection", todoCollectionRouter);
app.use("/todo", todoElementRouter);
app.use("/groupchat", groupChatRouter);
app.use("/groupmessage", groupMessageRouter);
app.use("/privatechat", privateChatRouter);
app.use("/privatemessage", privateMessageRouter);

// Upload Endpoint
app.post('/upload', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const file = req.files.file;

  file.mv(`${__dirname}/client/public/uploads/${file.name}`, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});




app.get("*", (req, res, next) => {
  next(new AppError(`The route ${req.originalUrl} is not defined`, 404));
});

app.use(globalErrorhandler);


app.use(cors());


module.exports = app;