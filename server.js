// app = require('http').createServer();
// const io = require('socket.io')(app);
// io.set('origins', '*:*');
// // const server = io.listen(process.env.PORT || 3000)
// // const io = new Server();


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.PORT || 3000;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

http.listen(port, function () {
    console.log('listening on *:' + port);
});

const users = {}

io.sockets.on('connection', socket => {
    socket.on('new-user', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name);
    })
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
    })
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })

    socket.on('changetheme', (color) => {
        socket.broadcast.emit('themecolor', color)
        // document.documentElement.style.cssText = color;
    });
})