const http = require("http");
const express = require("express");
const cors = require("cors"); // cors : used for inter communication b/w URL
const socketIO = require("socket.io");

const app = express();
const port = 4500 || process.emv.PORT; // means if localhost not run on 4500 then take another PORT

const usersArray = [{}]; // array of objects

app.use(cors());

app.get("/", (req, res) => {
  res.send("hello server is working, Afshan");
});

const server = http.createServer(app);

// io -> 1 entire CIRCUIT && socket --> different USERS on it
// made circiut of io [SERVER SIDE is being EXECUTED]
const io = socketIO(server);

io.on("connection", (socket) => {
  // when io circuit ON then, it will connect and "new connection" will display on server console
  console.log("New Connection"); // New Connection will display on server console when it connects to SOCKET SERVER

  // here socket.on means -> DATA is RECEIVED from CLIENT SIDE that is sent using EMIT
  socket.on("joined", ({ user }) => {
    // when USER join the ichat
    usersArray[socket.id] = user; // will save the USER at array id point  --> every socket/user has 1 unique id automatically
    console.log(`${user} has joined`); // will show on SERVER console

    // broadcast --> if afshan JOINED iChat, then server send JOINED msg to everyone except Afshan
    socket.broadcast.emit("userJoined", {
      user: "Admin",
      message: `${usersArray[socket.id]} has joined`,
    }); // [but it is showing on server side like Afshan has joined]

    // data send [this will show on CLIENT SIDE CONSOLE --> Admin welcome to iChat AFSHAN KHAN]
    socket.emit("welcome", {
      user: "Admin",
      message: `welcome to iChat ${usersArray[socket.id]}`,
    }); // event = welcome
  });

  // event = mesaage [when we exchange msgs b/w diff users/sockets]
  socket.on("message", ({ message, id }) => {
    // first of all, SERVER will receive the user msg and then SERVER will SEND the Afshan[USER] msg to ENTIRE CIRCUIT
    // send msg to entire CIRCUIT
    console.log("Received message:", message); // msg will be shown on SERVER side console , ---> message = "Hi guys"
    io.emit("sendMessage", { user: usersArray[id], message, id });
  });

  // 1) if User DIS-CONNECTs then socket.emit in client side send msg to server socket.on
  socket.on("disconnected", () => {
    // 2) and then, SERVER send broadcast msg to everyone that --> ex: [John has left]
    socket.broadcast.emit("leave", {
      user: "Admin",
      message: `${usersArray[socket.id]}user has left`,
    });
    console.log("user left"); // shown on server console
  });
});

server.listen(port, () => {
  console.log(`server is working on http://localhost:${port}`);
});
