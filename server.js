const server = require('express')();
const http = require('http').createServer(server);
const io = require('socket.io')(http);
let players = [];
let names = [];
let gameStarted = false;

io.on('connection', function (socket) {
    console.log('A user connected: ' + socket.id);

    players.push(socket.id);

    if (players.length === 1) {
        io.emit('isPlayerA');
    };

    socket.on('dealCards', function (level, numPlayers) {
        let allCards = [];

        let nums = [];
        for (let i=1; i <= 100; i++){
            nums.push(i);
        };

        for (let i=1; i <= numPlayers; i++){
            let arr = [];
            for (let j=1; j <= level; j++){
                arr.push(nums.splice(Math.floor(Math.random() * nums.length), 1)[0]);
            };
            allCards.push(arr);
        };

        gameStarted = true;
        io.emit('dealCards', allCards);
    });

    socket.on('checkName', function(name){
        names.push({id: socket.id, player: players.length, name: name});
    });

    socket.on('drawNames', function () {
        console.log('names', names);
        io.emit('drawNames', names, gameStarted);
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
        if (names.length === 0) gameStarted = false;
        io.emit('redrawNames', names);
    });
});

http.listen(3000, function () {
    console.log('Server started!');
});