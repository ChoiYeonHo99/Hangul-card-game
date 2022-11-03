const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
let players = [];
let playersIcon = {};
let lastTurn;

app.use(express.static(__dirname + '/client'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

server.listen(8081, function () {
    console.log(`Listening on ${server.address().port}`);
});

playerCount = 0;
turnCount = 0;
io.on('connection', function (socket) {
    console.log('A user connected: ' + socket.id);

    playerCount++;
    playersIcon[socket.id] = {
        x: 100,
        y: 200 + playerCount * 150,
        playerId: socket.id,
        playerImage: playerCount
    };

    players.push(socket.id);
    if (players.length === 1) {
        io.emit('firstTurn', players[0]);
        lastTurn = players[0];
    };

    socket.on('nextTurn', function () {
        turnCount++;
        socket.broadcast.emit('nextTurn', players[(turnCount % playerCount)]);
        console.log(turnCount + '번째 next: ' + players[(turnCount % playerCount)]);
    });

    // send the players object to the new player
    // socket.emit('currentPlayers', playersIcon);
    // update all other players of the new player
    // socket.broadcast.emit('newPlayer', playersIcon[socket.id]);

    socket.on('disconnect', function () {
        console.log('A user disconnected: ' + socket.id);
        playerCount--;
        players = players.filter(player => player !== socket.id);
        // emit a message to all players to remove this player
        // io.emit('disconnect', socket.id);
    });

    socket.on('cardDrop', function (cardData) {
        console.log("card Drop!");
        socket.broadcast.emit('cardDrop', cardData);
    });
    socket.on('red', function (id) {
        lastTurn = id;
        socket.broadcast.emit('red');
    });
    socket.on('green', function () {
        socket.broadcast.emit('green', lastTurn);
    });
    socket.on('firstDrop', function () {
        socket.broadcast.emit('firstDrop');
    });
});