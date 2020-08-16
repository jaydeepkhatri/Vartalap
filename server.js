var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

http.listen(port, function () {
    console.log('listening on *:' + port);
});

let users = {}

io.sockets.on('connection', socket => {
    socket.on('new-user', name => {
        users[socket.id] = name;
        io.emit('user-connected', { name: users[socket.id], totalusers: Object.keys(users).length });
    });
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] });
    });
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', { name: users[socket.id], totalusers: Object.keys(users).length - 1 });
        delete users[socket.id];
    });

    socket.on('changetheme', (color) => {
        socket.broadcast.emit('themecolor', color);
    });
})