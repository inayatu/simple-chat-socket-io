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
  const username = socket.handshake.query["name"];
  socket.username = username;
  users.push(socket);
  console.log(`connected: ${username}`);

  // receive message
  socket.on("message", (msg) => {
    msg = JSON.parse(msg);

    // send to all including sender
    // io.emit("message", msg);

    // send to all except sender
    // socket.broadcast.emit("message", msg);

    // send to specific socket
    const recevier = users.filter((user) => user.username === msg.receiverName);
    if (!recevier) return;

    let recevierId = recevier[0].id;
    socket.broadcast.to(recevierId).emit("message", msg.text);
  });

  // user disconnects
  socket.on("disconnect", () => {
    let index = null;
    for (let i = 0; i < users.length; i++) {
      if (users[i].username === socket.username) index = i;
    }

    users.splice(index, 1);
    console.log(`disconnected ${socket.username}`);
  });
});

server.listen(PORT, () => {
  console.log(`listening on :${PORT}`);
});
