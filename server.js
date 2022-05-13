const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server);
const PORT = 3000;

app.use(express.static("public"));

const users = [];

// user connects
io.on("connection", (socket) => {
  // when user connects first time
  const userId = !users.length ? 1 : Date.now();
  socket.userId = userId;

  users.push(socket);
  socket.emit("user_id", userId);
  //   console.log(`connects ${userId} | users: ${users.length}`);

  // receive message
  socket.on("message", (msg) => {
    // send to all including sender
    // io.emit("message", msg);
    msg = JSON.parse(msg);

    // send to all except sender
    // socket.broadcast.emit("message", msg);

    // send to only user 1
    const recevier = users.filter((user) => (user.socketId = 1));
    let recevierId = recevier[0].id;
    socket.broadcast.to(recevierId).emit("message", msg.text);
  });

  // user disconnects
  socket.on("disconnect", () => {
    const index = users.indexOf(socket.userId);
    users.splice(index, 1);
    // console.log(`disconnects: ${socket.userId} | users: ${users.length}`);
  });
});

server.listen(PORT, () => {
  console.log(`listening on :${PORT}`);
});
