const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const axios = require('axios');
const https = require('https');
const convert = require('xml-js');

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));
app.set('io', io);

function publicRooms(){ //return Room
    const {
        sockets: {
            adapter: {sids, rooms},
            },
        } = io;
    let publicRooms = [];
    rooms.forEach((_,key) => {
        if(sids.get(key) === undefined){
            publicRooms.push({
                roomname: key,
                roomnum: countRoom(key),
                roomuser: roomUser(key),
            });
        }
    });
    return publicRooms;
}

function countRoom(roomName) { // return the number of user in the room
    return io.sockets.adapter.rooms.get(roomName)?.size;
}

function nowRoom(socketid) { // return roomname with socketid(socket in one room)
    let roomName = "";
    io.sockets.adapter.sids.get(socketid)?.forEach((val) => {
        roomName = val;
    });
    return roomName;
}

function roomUser(roomName) { // return the usernickname in the room
    let roomUsers = [];
    io.sockets.adapter.rooms.get(roomName)?.forEach((val) => {
        roomUsers.push({
            socketId: val,
            nickname: io.sockets.sockets.get(val).nickname,
        });
    })
    return roomUsers;
}

let controlGame = [];

io.on("connection", (socket) => {
    socket["nickname"] = "Anonymous";
    io.sockets.emit("room_change", publicRooms());

    socket.on("enter_room", (nickname, roomName, done) => {
        socket["nickname"] = nickname
        socket.join(roomName);
        done();
        io.to(roomName).emit("welcome", socket.nickname);
        io.sockets.emit("room_change", publicRooms());
        
    });

    socket.on("disconnect", () => {
        console.log("disconnect: " + socket.id);
        let roomlist = publicRooms();
        let roomnamelist = [];
        roomlist.forEach((room) => {
            roomnamelist.push(room.roomname);
        })
        io.sockets.emit("room_change", roomlist);
        for (let i=0;i<controlGame.length; i++) {
            if (roomnamelist.includes(String(controlGame[i].room))) {//방에 사람이 있을때
                let roomName = controlGame[i].room

                for (let j = 0; j < controlGame[i].players.length; j++) {
                    if (controlGame[i].players[j].socketId === socket.id) { //contorlGame안 플레이어 일때
                        controlGame[i].currentPlayerCount--;

                        for (let k = 0; k < controlGame[i].startPlayerCount; k++) {
                            if (controlGame[i].players[k].socketId === controlGame[i].currentTurn) {
                                controlGame[i].players[k].socketId = 0;
                            }
                        }

                        io.to(roomName).emit('disconnection', socket.id);
                        if(controlGame[i].currentTurn === socket.id) {
                            var type = "disconnection"
                            var word = ""
                            controlGame[i].criticalSection = true;
                            socket.broadcast.to(roomName).emit('turnEnd', type, word);

                            do {
                                controlGame[i].turnCount++;
                                controlGame[i].currentTurn = controlGame[i].players[(controlGame[i].turnCount % controlGame[i].startPlayerCount)].socketId;
                                if (controlGame[i].currentPlayerCount === 0)
                                    break;
                            } while(controlGame[i].currentTurn === 0)
                            
                            socket.broadcast.to(roomName).emit('nextTurn', controlGame[i].players[(controlGame[i].turnCount % controlGame[i].startPlayerCount)].socketId);
                            console.log(controlGame[i].turnCount + '번째 next: ' + controlGame[i].players[(controlGame[i].turnCount % controlGame[i].startPlayerCount)].socketId);
                            socket.broadcast.to(roomName).emit('turnPlayerDisconnection');
                        }
                    }
                }
            } else{//방에 사람 없을때
                controlGame.splice(i,1); //control게임 하나 삭제
                console.log("방 삭제");
            }
        }
    });

    socket.on("new_message", (msg, room, done) =>{
        io.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    });

    socket.on("gamestart", (roomName) => {
        console.log("gamestart");
        console.log(roomName);
        io.to(roomName).emit("gamestart");
        const roomuser = roomUser(roomName);
        let userlist = roomUser(roomName);
        userlist.forEach((val) => {
            val['played'] = false;
        })
        controlGame.push({
            room: roomName,
            turnCount: 0,
            lastWord: "",
            criticalSection: true,
            lastTurn: "",
            players: roomUser(roomName),
            currentPlayerCount: 0,
            currentTurn: 0,
            startPlayerCount: 0,
        });
        
        console.log("first turn: " + roomuser[0].socketId);
        controlGame.forEach((val) => {
            if(val.room === roomName){
                val.lastTurn = roomuser[0].socketId;
            }
        });
    });

    socket.on("ready", (roomName) => {
        let num_ready = 0;
        controlGame.forEach((val) => {
            if(val.room === roomName){
                val.players.forEach((player) => {
                    if(player.socketId === socket.id){
                        player.played = true;
                    }
                    if(player.played === true){
                        num_ready ++;
                    }
                });
                if(num_ready === val.players.length){
                    var centerCardValue = Math.floor(Math.random() * 48);
                    io.to(roomName).emit("firstTurn", val.players[0].socketId);
                    io.to(roomName).emit('centerCard', centerCardValue);
                    io.to(roomName).emit('currentPlayers', val.players, val.players.length);
                    val.currentPlayerCount = val.players.length;
                    val.lastTurn = val.players[0].socketId;
                    val.currentTurn = val.players[0].socketId;
                    val.startPlayerCount = val.players.length;
                }
            }
        });
    })

    socket.on('nextTurn', (roomName) => {
        controlGame.forEach((val) => {
            if(val.room === roomName){
                do {
                    val.turnCount++;
                    val.currentTurn = val.players[(val.turnCount % val.startPlayerCount)].socketId;
                    if (val.currentPlayerCount === 0)
                        break;
                } while(val.currentTurn === 0)
                io.to(roomName).emit('nextTurn', val.currentTurn);
                console.log(val.turnCount + '번째 next: ' + val.currentTurn);
            }
        });
    });

    socket.on('cardDrop', (roomName, cardData) => {
        socket.broadcast.to(roomName).emit('cardDrop', cardData);
    });

    socket.on('turnEnd', (roomName, id, word, type) => {
        controlGame.forEach((val) => {
            if(val.room === roomName){
                val.lastTurn = id;
                val.lastWord = word;
                val.criticalSection = true;
                socket.broadcast.to(roomName).emit('turnEnd', type, word);
            }
        });
    });

    socket.on('firstDrop', (roomName) => {
        socket.broadcast.to(roomName).emit('firstDrop');
    });

    socket.on('currentCardUpdate', (roomName, id, number) => {
        io.to(roomName).emit('currentCardUpdate', id, number);
    });

    socket.on('timeOut', (roomName) => {
        io.to(roomName).emit('timeOut', null);
    });

    socket.on('tick', (roomName, time) => {
        socket.broadcast.to(roomName).emit('tok', time);
    });

    socket.on('objection', (roomName, id) => {
        controlGame.forEach((val) => {
            if(val.room === roomName){ 
                if (val.criticalSection)
                    val.criticalSection = false;
                else
                    return 0;
                console.log(val.lastWord);
                const url = `https://krdict.korean.go.kr/api/search?certkey_no=4549&key=487E5EEAB2BE2EB3932C7B599847D5DC&type_search=search&part=word&q=${val.lastWord}&sort=dict&advanced=y&method=exact`;
                const options = {
                    method: "get",
                    httpsAgent: new https.Agent({
                        rejectUnauthorized: false, //허가되지 않은 인증을 reject하지 않겠다
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
                    // 존재하지 않는 단어일 때
                    if(def === null){
                        console.log("존재하지 않는 단어입니다.");
                        io.to(roomName).emit('verificationFalse', val.lastTurn);
                    }
                    // 존재하는 단어일 때
                    else {
                        console.log(word, pos, def);
                        io.to(roomName).emit('verificationTrue', id, {word, pos, def});
                    }
                });
            }
        });
    });
});



const handleListen = () => console.log(`Listening on http://localhost:3000`);
server.listen(3000, handleListen);