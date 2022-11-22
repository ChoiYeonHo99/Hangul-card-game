const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const axios = require('axios');
const https = require('https');
const convert = require('xml-js');
const request = require('request');
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
centerCardValue = "";
lastWord = "";
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
    }
    else {
        io.emit('centerCard', centerCardValue);
    }

    socket.on('nextTurn', function () {
        turnCount++;
        io.emit('nextTurn', players[(turnCount % playerCount)]);
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
    socket.on('turnEnd', function (id, word, type) {
        lastTurn = id;
        lastWord = word;
        socket.broadcast.emit('turnEnd', type);
    });
    socket.on('firstDrop', function () {
        socket.broadcast.emit('firstDrop');
    });
    socket.on('centerCardValue', function (value) {
        centerCardValue = value;
    });

    socket.on('objection', function (id) {
        console.log(lastWord);
        const url = `https://krdict.korean.go.kr/api/search?certkey_no=4549&key=487E5EEAB2BE2EB3932C7B599847D5DC&type_search=search&part=word&q=${lastWord}&sort=dict&advanced=y&method=exact`;
        const options = {
            method: "get",
            httpsAgent: new https.Agent({
                rejectUnauthorized: false, //허가되지 않은 인증을 reject하지 않겠다!
            }),
        };
        axios(url, options)
        .then((res) => {
            const result = res.data;
            const strJson = convert.xml2json(result, {compact:true,spaces:4});

            const objJson = JSON.parse(strJson);
            const total = objJson.channel.total._text;

            let word = null;
            let pos = null;
            let def = null;

            let objItem = null;

            if (total === '1') {
                objItem = objJson.channel.item;
            }
            else if (total !== '0'){
                objItem = objJson.channel.item[0];
            }
            if (total !== '0'){
                word = objItem.word._text;
                pos = objItem.pos._text;

                if(objItem.sense.length === undefined){
                    def = objItem.sense.definition._text;
                }
                else{
                    def = objItem.sense[0].definition._text;
                }
            }
            //뜻 없을때
            if(def === null){
                console.log("존재하지 않는 단어입니다.");
                io.emit('verificationFalse', lastTurn);
            }
            // 뜻 있을때 
            else {
                console.log(word, pos, def);
                io.emit('verificationTrue', id);
            }
        });
    });
});

