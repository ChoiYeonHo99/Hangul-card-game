const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
let players = [];
let playersIcon = {};

app.use(express.static(__dirname + '/client'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

server.listen(8081, function () {
    console.log(`Listening on ${server.address().port}`);
});

this.playerCount = 0;
io.on('connection', function (socket) {
    console.log('A user connected: ' + socket.id);

    this.playerCount++;
    playersIcon[socket.id] = {
        x: 100,
        y: 200 + this.playerCount * 150,
        playerId: socket.id,
        playerImage: this.playerCount
    };

    players.push(socket.id);
    // send the players object to the new player
    // socket.emit('currentPlayers', playersIcon);
    // update all other players of the new player
    // socket.broadcast.emit('newPlayer', playersIcon[socket.id]);

    socket.on('disconnect', function () {
        console.log('A user disconnected: ' + socket.id);
        this.playerCount--;
        players = players.filter(player => player !== socket.id);
        // emit a message to all players to remove this player
        // io.emit('disconnect', socket.id);
    });

    socket.on('cardDrop', function (cardData) {
        socket.broadcast.emit('cardDrop', cardData);
    });
    socket.on('red', function () {
        socket.broadcast.emit('red');
    });
    socket.on('green', function () {
        socket.broadcast.emit('green');
    });
});