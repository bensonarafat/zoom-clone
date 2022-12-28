const express = require('express');
const { v4: uuidv4 } = require("uuid");
const app = express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { env } = require('process');
const { ExpressPeerServer } = require('peer')

const peerServer = ExpressPeerServer(server, {
    debug: true
});

const io = new Server(server);
const port = 3000 || env.process.PORT;
app.set('view engine', 'ejs')
app.use(express.static('public'));

app.use("/peerjs", peerServer) 

app.get("/", (req, res) => {
    res.redirect(`/${uuidv4()}`)
});

app.get("/:room", (req, res) => {
    res.render("room", { roomId : req.params.room });
});


io.on('connection', (socket) => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        
        // socket.broadcast.emit('user-connected');
        // socket.to(roomId).emit("user-connected");
        io.to(roomId).emit("user-connected", userId);
        socket.on('message', message => {
            io.to(roomId).emit("createMessage", message);
        });
    })
  });

  
server.listen((port), () => {
    console.log(`Server is listening to port ${port}`);
})