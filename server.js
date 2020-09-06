const server = require('express')();
const http = require('http').createServer(server);
const io = require('socket.io')(http);
let players = [];
let names = [];

io.on('connection', function (socket) {
    console.log('A user connected: ' + socket.id);

    players.push(socket.id);

    if (players.length === 1) {
        io.emit('isPlayerA');
    };

    socket.on('dealCards', function () {
        io.emit('dealCards');
    });

    socket.on('checkName', function(name){
        names.push({id: socket.id, player: players.length, name: name});
    });

    socket.on('drawNames', function (name) {
        console.log('names', names);
        io.emit('drawNames', names);
    });

    socket.on('cardPlayed', function (gameObject, isPlayerA) {
        io.emit('cardPlayed', gameObject, isPlayerA);
    });

    socket.on('disconnect', function () {
        console.log('A user disconnected: ' + socket.id);
        players = players.filter(player => player !== socket.id);
        names = names.filter(hash => hash['id'] !== socket.id);
        names.map(hash => hash['player'] -= 1);
        console.log('names', names);
    });
});

http.listen(3000, function () {
    console.log('Server started!');
});