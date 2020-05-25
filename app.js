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


app.use(cors());
// ######################### SOCKET IO(live chat) ##########################
// //Setting up chat, and socket io
// const server = http.createServer(app);
// //Before const io = socketio(server);
// const io = require("socket.io")(server, {
//   handlePreflightRequest: (req, res) => {
//     const headers = {
//       "Access-Control-Allow-Headers": "Content-Type, Authorization",
//       "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
//       "Access-Control-Allow-Credentials": true,
//     };
//     res.writeHead(200, headers);
//     res.end();
//   },
// });


// //starting sockets
// io.on(`connection`, (socket) => {
//   console.log("A user has JOINEEEEEEEEEEEEEEEEEEEEED");

//   socket.on("chatjoin", ({ name, room }, callback) => {
//     //Assing a user to chat values
//     const { error, user } = chat.addUser({ id: socket.id, name, room });
//     if (error) return callback(error);

//     socket.join(user.room);

//     callback();
//   });

//   socket.on("sendMessage", (message, callback) => {
//     const user = getUser(socket.id);
//     io.to(user.room).emit("message", { user: user.name, text: message });
//     callback();
//   });

//   socket.on("disconnect", () => {
//     const user = removeUser(socket.id);
//     if (user) {
//       io.to(user.room).emit("message", {
//         user: "UserBot",
//         text: `${user.name} has left.`,
//       });
//       io.to(user.room).emit("roomData", {
//         room: user.room,
//         users: getUsersInRoom(user.room),
//       });
//     }
//   });
// });


module.exports = app;