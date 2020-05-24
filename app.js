const subdomain = require("express-subdomain");
const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const http =  require("http");
const socketio = require("socket.io")
//Error handling utils
const AppError = require("./utils/appError");
const globalErrorhandler = require("./utils/errorController");
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

// ######################### SOCKET IO(live chat) ##########################
//Setting up chat, and socket io
const server = http.createServer(app);
const io = socketio(server);

//starting sockets
io.on(`connection`,(socket)=>{
  console.log("A user has JOINEEEEEEEEEEEEEEEEEEEEED");

  socket.on('chatjoin',({name,room},callback)=>{
    const error = tru
 
  });


  socket.on('disconnect',()=>{
    console.log("A user has leffffffffffffffffffffffffffft");
  })
});






//#########################   MAIN BACKEND  ###########################
//Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
//    Middleware
//Allow parsing of body elements as JSON Objects
app.use(bodyParser.json());
//Text compression for heroku
app.use(compression());

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

app.get("*", (req, res, next) => {
  next(new AppError(`The route ${req.originalUrl} is not defined`, 404));
});

app.use(globalErrorhandler);

module.exports = app;
