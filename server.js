const mongoose = require("mongoose");
const dotenv = require("dotenv");
const express = require('express');

//Set environment variables
dotenv.config({ path: "./config.env" });
const PORT = 8082;
const app = require("./app");

//DB config
const db = process.env.MONGO_URI.replace(
  "<USER>",
  process.env.MONGO_USER
).replace("<PASSWORD>", process.env.MONGO_PASSWORD);

//Connect to MongoDB with appropriate parameters
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));


//If in production server the build folder
if(process.env.NODE_ENV==="production"){
  //Set static return folder
  app.use(express.static(path.join(__dirname, '/client/build')));

  app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"client","build","index.html"));
  });
}

app.listen(process.env.PORT || PORT, () =>
  console.log(`Server running on port ${process.env.PORT || PORT}`)
);


// //Live chat methods

// const http = require("http");
// const socketio = require("socket.io");
// const chat = require("./controllers/usersLiveChat.js");
// const cors = require('cors');
// const { addUser, removeUser, getUser, getUsersInRoom } = require('./controllers/usersLiveChat');


// const liveChatApp = express();
// const server = http.createServer(liveChatApp);
// const io = socketio(server);


// liveChatApp.use(cors());


// io.on('connect', (socket) => {
//   socket.on('join', ({ name, room, user_id }, callback) => {
//     const { error, user } = addUser({ id: socket.id, name, room,user_id});

//     if(error) return callback(error);

//     socket.join(user.room);

//     // socket.emit('message', { user:user.id,name: 'admin', text: `${user.name}, welcome to room ${user.room}.`,user_id:user_id});
//     // socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!`,user_id: user_id});

//     io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

//     callback();
//   });

//   socket.on('sendMessage', (message, callback) => {
//     const user = getUser(socket.id);
//     io.to(user.room).emit('message', { user:user.user_id,name: user.name, text: message });

//     callback();
//   });

//   socket.on('disconnect', () => {
//     const user = removeUser(socket.id);

//     if(user) {
//       io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
//       io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
//     }
//   })
// });

// server.listen(8083, () => console.log(`Server has started. PORT 8083, live chat`));

