const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const Filter = require("bad-words");
const {
  generateMesssage,
  generatelocationMesssage,
} = require("./utils/messages");
const {
  addUSer,
  removeUser,
  getAllUsersInRoom,
  getUser,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("New Websocket Connection");

  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUSer({ id: socket.id, username, room });
    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit("message", generateMesssage('Admin',"Welcome!"));
    socket.broadcast
      .to(user.room)
      .emit("message", generateMesssage('Admin',`${user.username} has joined!`));
      io.to(user.room).emit('roomData',{
        room:user.room,
        users: getAllUsersInRoom(user.room)
      })
   

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback("Profanity is Not allowed !");
    }
    io.to(user.room).emit("message", generateMesssage(user.username,message));
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
        io.to(user.room).emit(
            "message",
            generateMesssage('Admin', `${user.username} has left the chat.`)
        );
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getAllUsersInRoom(user.room)
        });
    }
});


  socket.on("sendLocation", (coords, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "sharelocation",
      generatelocationMesssage(user.username,
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    );
    callback();
  });
});

server.listen(port, () => {
  console.log("Server is up and Running on port " + port);
});
