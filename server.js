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

let users = {};

//default theme
let theme = "--themecolor: rgb(31, 128, 255);	--conmesscolor: rgb(170, 184, 204);	--messageinputcolor: rgb(241, 247, 255);";

io.sockets.on('connection', socket => {
    socket.on('new-user', name => {
        users[socket.id] = name;
        io.emit('user-connected', { name: users[socket.id], users: users, theme: theme });

    });
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] });
    });
    socket.on('disconnect', () => {
        if (users[socket.id]) {
            socket.broadcast.emit('user-disconnected', { name: users[socket.id], users: users, id: socket.id });

            //deleteing the record from server
            delete users[socket.id];
        }

    });

    socket.on('changetheme', (color) => {
        theme = color;
        socket.broadcast.emit('themecolor', color);
    });
})