const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "index.html");
});

// app.use(express.static("public"));

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

var activeusers = [];
var messages = [];

io.on("connection", (socket) => {
  socket.on("new_user_joined", (username) => {
    if (username != null && username.length > 0) {
      activeusers = [...activeusers, { id: socket.id, username }];
      // socket.broadcast.emit("user-joined", username);
      messages = [
        ...messages,
        {
          id: socket.id,
          message: `${username} joined the party`,
          pos: "center",
        },
      ];

      socket.broadcast.emit("update-messages", messages);
    } else socket.emit("invalid-user", "enter valid name :");
  });

  socket.on("new-message", (message) => {
    messages = [...messages, { id: socket.id, message }];
    socket.broadcast.emit("update-messages", messages);
  });

  socket.on("disconnect", (ev) => {
    const user = activeusers.filter((user) => user.id == socket.id)[0];
    socket.broadcast.emit("user-left", user?.username);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
