const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server);

app.use(express.static("public"));

const users = [];

// user connects
io.on("connection", (socket) => {
  // when user connects first time
  const userId = Date.now();
  socket.userId = userId;
  users.push(userId);
  socket.emit("user_id", userId);
  console.log(`connects ${userId} | users: ${users.length}`);

  // receive message
  socket.on("message", (msg) => {
    // send to all including sender
    // io.emit("message", msg);

    // send to all except sender
    socket.broadcast.emit("message", msg);

    // send to specific room/socket
    // let recevierId = 1111;
    // socket.broadcast.to(recevierId).emit("message", msg);
  });

  // user disconnects
  socket.on("disconnect", () => {
    const index = users.indexOf(socket.userId);
    users.splice(index, 1);
    console.log(`disconnects: ${socket.userId} | users: ${users.length}`);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
