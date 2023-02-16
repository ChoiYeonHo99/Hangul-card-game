const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
const startbutton = document.getElementById("startbutton");

room.hidden = true;
startbutton.hidden = true;

let roomName;

function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li")
    li.innerHTML = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", value, roomName, () =>{
        addMessage(`You: ${value}`);
    });
    input.value="";
}

function showRoom() {
    var image = new Image();
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerHTML = `Room ${roomName}`;
    const msgForm = room.querySelector("#msg");
    msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    welcome.hidden = true;
    const Nicknameinput = form.querySelector("#Nickname").value;
    const roominput = form.querySelector("#roomname").value;
    console.log(Nicknameinput);
    console.log(roominput);
    socket.emit("enter_room", Nicknameinput, roominput, showRoom);
    roomName = roominput;
}

form.addEventListener("submit", handleRoomSubmit); // welcome 처음에 이름과 방번호 입력했을때
startbutton.addEventListener("click", startgame); //게임시작버튼에 이벤트 추가



socket.on("welcome", (nickname) => {
    const h3 = room.querySelector("h3");
    h3.innerHTML = `Room ${roomName}`;
    addMessage(`${nickname} joined!`);
});

socket.on("bye", (nickname) => {
    const h3 = room.querySelector("h3");
    h3.innerHTML = `Room ${roomName}`;
    addMessage(`${nickname} left`);
});

socket.on("new_message", (msg) => {
    addMessage(msg);
});

socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    const h2 = room.querySelector("h2");
    roomList.innerHTML = "";
    h2.innerHTML = "";
    if(rooms.length === 0){
        return;
    };
    rooms.forEach((room) => {
        const li = document.createElement("li");
        li.innerHTML = `${room.roomname}(${room.roomnum}명)`;
        roomList.append(li);
        h2.innerHTML = "user list: ";
        room.roomuser.forEach((val) => {
            h2.append(` ${val.nickname} `);
        })
        if(room.roomnum >= 2){
            startbutton.hidden = false;
        }
    });
});

let game;
let gameOptions = {
    startingCards: 6,
    cardWidth: 100,
    cardHeight: 100,
    handSizeRatio: 1,
    blankSizeRatio: 0.7,
    firstBlankX: 708,
    firstBlankY: 158,
    betweenBlank: 76,
    firstCardX: 600,
    firstCardY: 980,
    betweenCrad: 130,
    handCardMax: 9
}

class playGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }
    preload() {
        this.load.image("background", "public/image/background.png");
        this.load.image("blank", "public/image/blank.png");
        this.load.image("deck", "public/image/deck.png");
        this.load.image("finishButton", "public/image/finishButton.png");
        this.load.image("objectionButton", "public/image/objectionButton.png");
        this.load.image("logo", "public/image/logo.png");
        this.load.image("lastWordBar", "public/image/lastWordBar.png");
        this.load.image("board", "public/image/board.png");
        this.load.image("뒷면", "public/image/뒷면.png");
        this.load.image("player1", "public/image/player1.png");
        this.load.image("player2", "public/image/player2.png");
        this.load.image("player3", "public/image/player3.png");
        this.load.image("player4", "public/image/player4.png");
        this.load.image("okButton", "public/image/okButton.png");
        this.load.image("verificationTrueBox", "public/image/verificationTrueBox.png");
        this.load.image("verificationFalseBox", "public/image/verificationFalseBox.png");
        this.load.image("rightArrange", "public/image/rightArrange.png");
        this.load.image("leftArrange", "public/image/leftArrange.png");
        this.load.image("가", "public/cards/가.png");
        this.load.image("거", "public/cards/거.png");
        this.load.image("고", "public/cards/고.png");
        this.load.image("구", "public/cards/구.png");
        this.load.image("그", "public/cards/그.png");
        this.load.image("금", "public/cards/금.png");
        this.load.image("기", "public/cards/기.png");
        this.load.image("나", "public/cards/나.png");
        this.load.image("다", "public/cards/다.png");
        this.load.image("대", "public/cards/대.png");
        this.load.image("도", "public/cards/도.png");
        this.load.image("동", "public/cards/동.png");
        this.load.image("드", "public/cards/드.png");
        this.load.image("라", "public/cards/라.png");
        this.load.image("로", "public/cards/로.png");
        this.load.image("리", "public/cards/리.png");
        this.load.image("마", "public/cards/마.png");
        this.load.image("보", "public/cards/보.png");
        this.load.image("부", "public/cards/부.png");
        this.load.image("비", "public/cards/비.png");
        this.load.image("사", "public/cards/사.png");
        this.load.image("상", "public/cards/상.png");
        this.load.image("생", "public/cards/생.png");
        this.load.image("소", "public/cards/소.png");
        this.load.image("수", "public/cards/수.png");
        this.load.image("스", "public/cards/스.png");
        this.load.image("시", "public/cards/시.png");
        this.load.image("식", "public/cards/식.png");
        this.load.image("아", "public/cards/아.png");
        this.load.image("안", "public/cards/안.png");
        this.load.image("어", "public/cards/어.png");
        this.load.image("오", "public/cards/오.png");
        this.load.image("요", "public/cards/요.png");
        this.load.image("우", "public/cards/우.png");
        this.load.image("음", "public/cards/음.png");
        this.load.image("이", "public/cards/이.png");
        this.load.image("인", "public/cards/인.png");
        this.load.image("일", "public/cards/일.png");
        this.load.image("자", "public/cards/자.png");
        this.load.image("장", "public/cards/장.png");
        this.load.image("전", "public/cards/전.png");
        this.load.image("정", "public/cards/정.png");
        this.load.image("제", "public/cards/제.png");
        this.load.image("주", "public/cards/주.png");
        this.load.image("지", "public/cards/지.png");
        this.load.image("진", "public/cards/진.png");
        this.load.image("하", "public/cards/하.png");
        this.load.image("한", "public/cards/한.png");
        this.load.image("해", "public/cards/해.png");
        this.load.image("믄", "public/cards/믄.png");
        this.load.image("무", "public/cards/무.png");
        this.load.image("여", "public/cards/여.png");
        this.load.image("믕", "public/cards/믕.png");
        this.load.image("으", "public/cards/으.png");
    }
    create() {
        this.myTurn = false; // true면 자신의 turn임을 나타낸다
        this.whetherObjection = false; // objection의 가능 여부를 나타낸다
        this.word = ""; // 제출하는 단어
        this.direction = "row"; // 자신의 card drop이 row인지 column인지를 나타낸다
        this.dropped = false; // drop을 1번 이상 했는지를 나타낸다
        this.clicked = false; // board에서 1번 이상 click을 했는지를 나타낸다
        this.x; // 자신의 턴에서 처음으로 drop한 위치의 x좌표를 나타낸다
        this.y; // 자신의 턴에서 처음으로 drop한 위치의 y좌표를 나타낸다
        this.firstCenter = true; // 2번 이상 생성하지 않게 제한하는 변수
        this.lastCardData = null;
        this.recentlyVerification = true;
        this.recentlyTimeOut = true;
        this.recentlyTurnPlayerDisconnection = true;
        this.firstCurrentPlayers = true;

        // 자신 및 다른 유저가 drop한 card들을 저장하는 배열과 그 수를 세는 변수
        this.dropCard = [
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
        ];
        this.dropCount = 0;

        // 자신이 drop한 card와 click한 card들을 저장하는 배열
        this.alphaCard = [];
        this.alphaCount = 0;

        // 현재 board의 상황을 2차원 배열로 표현
        this.board = [
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        ];

        // drop된 card와 해당 위치의 blank를 whetherObjection이 바뀔 때까지 저장하는 group
        this.waitBlankGroup = this.add.group();
        this.waitCardGroup = this.physics.add.group();

        // 자신의 turn을 끝내는 button
        let finishButton = this.add.sprite(1815, 750, "finishButton").setInteractive().on("pointerup",() => {
            if (this.myTurn & this.dropped & this.clicked & this.sortWord()) {
                socket.emit("turnEnd", roomName, socket.id, this.word, "drop");
                socket.emit("nextTurn", roomName, null);
                this.myTurn = false;
                console.log("Turn End! " + this.myTurn);
                this.whetherObjection = false;
                console.log("whetherObjection: " + this.whetherObjection);
                this.lastWord.setStyle(lastWordStyle);
                this.lastWord.setText(this.word);
                this.timer.paused = true;

                for (var i = 0; i < this.alphaCount; i++) {
                    this.alphaCard[i].alpha = 1;
                    this.alphaCard[i].activate = false;
                }
                this.alphaCard = [];
                this.alphaCount = 0;

                // board에서 내가 select한 card를 update한다
                for (var i = 0; i < 10; i++) {
                    for (var j = 0; j < 10; j++) {
                        if (this.board[i][j] === 1) {
                            this.board[i][j] = 2;
                        }
                    }
                }
            };
        });
        finishButton.setDepth(1);

        // objection을 신청하는 button
        let objectionButton = this.add.sprite(1815, 860, "objectionButton").setInteractive().on("pointerup",() => {
            if(this.whetherObjection) {
                socket.emit("objection", roomName, socket.id);
            }
        });
        objectionButton.setDepth(1);

        // board에 drop된 card들을 저장하는 group
        this.boardGroup = this.add.group();
 
        // hand에 있는 card들을 저장하는 group
        this.handGroup = this.add.group();
 
        // 게임 배경, 로고, 보드, 마지막 단어 바, 마지막 단어
        this.background = this.add.sprite(game.config.width / 2, game.config.height / 2, "background");
        this.logo = this.add.sprite(200, 120, "logo");
        this.boardImage = this.add.sprite(1050, 500, "board");
        this.lastWordBar = this.add.sprite(1050, 60, "lastWordBar");
        this.lastWord = this.add.text(1050, 60, "", lastWordStyle);
        this.lastWord.setOrigin(0.5, 0.5);
        var lastWordStyle = {font: "60px Arial", fill: "black"};

        // card를 drop하는 위치에 생기는 preview
        this.cardPreview = this.add.sprite(200, 200, "뒷면");
        this.cardPreview.visible = false;
        this.cardPreview.alpha = 0.75;
        this.cardPreview.displayWidth = gameOptions.cardWidth * gameOptions.blankSizeRatio;
        this.cardPreview.displayHeight = gameOptions.cardHeight * gameOptions.blankSizeRatio;
        this.cardPreview.setDepth(3);

        // 이의신청 결과에 따른 안내 메시지 박스와 확인 버튼
        this.verificationTrueBox = this.add.sprite(1050, 500, "verificationTrueBox");
        this.verificationTrueBox.setDepth(5);
        this.verificationTrueBox.visible = false;
        this.verificationFalseBox = this.add.sprite(1050, 500, "verificationFalseBox");
        this.verificationFalseBox.setDepth(5);
        this.verificationFalseBox.visible = false;
        this.okButton = this.add.sprite(1050, 500 + 220, "okButton").setInteractive().on("pointerup",() => {
            this.verificationTrueBox.visible = false;
            this.verificationFalseBox.visible = false;
            this.okButton.visible = false;
        });
        this.okButton.visible = false;
        this.okButton.setDepth(6);

        this.countArrange = 0;
        // handGroup에 있는 카드 목록을 왼쪽, 오른쪽으로 이동시키는 버튼
        this.rightArrange = this.add.sprite(1800, 980, "rightArrange").setInteractive().on("pointerup",() => {
            if (this.handGroup.countActive() - gameOptions.handCardMax > this.countArrange) {
                this.handGroup.children.iterate(function(card) {
                    card.x -= gameOptions.betweenCrad;
                    if (card.x >= gameOptions.firstCardX + gameOptions.betweenCrad * 9 || card.x < gameOptions.firstCardX) {
                        card.visible = false;
                    }
                    else {
                        card.visible = true;
                    }
                });
                this.countArrange++;
            }
        });
        this.leftArrange = this.add.sprite(450, 980, "leftArrange").setInteractive().on("pointerup",() => {
            if (this.countArrange > 0) {
                this.handGroup.children.iterate(function(card) {
                    card.x += gameOptions.betweenCrad;
                    if (card.x >= gameOptions.firstCardX + gameOptions.betweenCrad * 9 || card.x < gameOptions.firstCardX) {
                        card.visible = false;
                    }
                    else {
                        card.visible = true;
                    }
                });
                this.countArrange--;
            }
        });

        // total time until trigger
        this.timeInSeconds = 30;
        // timer font
        var timeStyle = {font: "50px Arial", fill: "black"};
        //make a text field
        this.timeText = this.add.text(1810, 100, "30", timeStyle);
        // center the text
        this.timeText.setOrigin(0.5, 0.5);
        // set up a loop timer
        this.timer = this.time.addEvent({ delay: 1000, callback: this.tick, callbackScope: this, loop: true });
        this.timer.paused = true;

        // 게임 시작 시 board에 blank를 생성한다
        this.zoneGroup = this.physics.add.group();
        for(let i = 0; i < 10; i++) {
            for(let j = 0; j < 10; j++) {
                this.createBlank(i, j);
            }
        }
        this.zoneGroup.setDepth(2);

        // drop된 카드가 위치한 자리의 blank는 비활성화한다
        this.physics.add.overlap(this.zoneGroup, this.waitCardGroup, this.setBlank, null, this);
 
        // 게임에서 사용하는 deck
        this.deckArray = ["가", "거", "고", "구", "그", "금", "기", "나", "다", "대",
        "도", "동", "드", "라", "로", "리", "마", "보", "부", "비",
        "사", "상", "생", "소", "수", "스", "시", "식", "아", "안",
        "어", "오", "요", "우", "음", "이", "인", "일", "자", "장",
        "전", "정", "제", "주", "지", "진", "하", "한", "해"];

        // 게임 시작 시 card를 생성한다
        for(let i = 0; i < gameOptions.startingCards; i ++) {
            var randNumber = Phaser.Math.Between(0, 48);
            this.createCard(this.deckArray[randNumber]);
            this.arrangeCardsInHand()
        }

        // 게임 시작 시 deck을 생성한다
        let deck = this.add.sprite(1810, 490, "deck").setInteractive().on("pointerup",() => {
            // 자신의 turn이며 아직 card를 drop하지 않았을 때 작동한다
            if(this.myTurn & !(this.dropped)) {
                // deck을 click하면 card를 1장 생성한다
                var randNumber = Phaser.Math.Between(0, 48);
                this.createCard(this.deckArray[randNumber]),
                this.arrangeCardsInHand()
                // turn을 종료한다
                socket.emit("turnEnd", roomName, socket.id, this.word, "deck");
                socket.emit("nextTurn", roomName, null);
                this.myTurn = false;
                console.log("Turn End! " + this.myTurn);
                this.whetherObjection = false;
                console.log("whetherObjection: " + this.whetherObjection);
                // 현재 카드 수를 플레이어에게 알린다
                socket.emit("currentCardUpdate", roomName, socket.id, this.handGroup.countActive());
                this.timer.paused = true;
            }
        });
        deck.setDepth(1);

        this.input.on("dragenter", function(dropZone) {
            // show card preview
            let previewPosition = this.setPreviewCoordinates(dropZone);
            this.cardPreview.visible = true;
            this.cardPreview.x = previewPosition.x;
            this.cardPreview.y = previewPosition.y;
        }, this);

        this.input.on("dragleave", function() {
            // hide card preview
            this.cardPreview.visible = false;
        }, this);

        // card를 drag하면 pointer를 따라다니도록 한다
        this.input.on("dragstart", function(pointer, card) {
            // card가 hand에 있는지 검사한다
            if(this.handGroup.contains(card)) {
                // card의 기준점을 angle을 반영하여 pointer에 위치하게 변경한다
                this.setCardOrigin(card);
                // hand에서 card를 제거한다
                this.handGroup.remove(card);
                // hand에 있는 card들을 재정렬한다
                this.arrangeCardsInHand();
                // card가 pointer를 따라다니도록 한다
                this.tweens.add({
                    targets: card,
                    x: pointer.x,
                    y: pointer.y,
                    duration: 150
                });
            };
        }, this);
 
        // card를 drag하면 pointer를 따라다니도록 한다
        this.input.on("drag", function(pointer, card) {
            // card가 hand에 있거나 board에 있는지를 검사한다
            if(!this.handGroup.contains(card) && !this.boardGroup.contains(card)) {
                // card가 pointer를 따라다니도록 한다
                card.x = pointer.x;
                card.y = pointer.y;
            }
        }, this);
 
        // card를 board에 있는 blank에 drop한다
        this.input.on("drop", function(pointer, card, blank) {
            card.i = blank.i;
            card.j = blank.j;
            if (this.myTurn & this.validLocation(card.i, card.j, "drop")) {
                // 만약 첫번째 card drop이라면 objection 가능 여부를 false로 바꾸고 다른 유저들에게 알린 후 배열을 초기화한다
                if(!this.dropped) {
                    this.dropped = true;
                    this.whetherObjection = false;
                    socket.emit("firstDrop", roomName, null);
                    console.log("whetherObjection: " + this.whetherObjection);
                    this.waitBlankGroup = this.add.group();
                    this.waitCardGroup = this.add.group();
                    this.dropCard = [
                        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
                    ];
                    this.dropCount = 0;
                    this.x = card.i;
                    this.y = card.j;
                }
                // card가 drop된 위치의 black의 input과 card의 darg 여부를 비활성화한다
                card.setDepth(3);
                card.setOrigin(0.5, 0.5);
                blank.input.dropZone = false;
                card.input.draggable = false;

                // drop된 card는 기본적으로 선택된 상태다
                card.alpha = 0.5;
                card.activate = true;
                this.alphaCard.push(card);
                this.alphaCount++;

                // drop한 card의 정보를 배열에 저장한다
                this.dropCard[0][this.dropCount] = blank.i;
                this.dropCard[1][this.dropCount] = blank.j;
                this.dropCard[2][this.dropCount] = card.value;
                this.dropCount++;

                // board를 update한다
                this.board[blank.i][blank.j] = 1;

                // card를 알맞은 위치에 알맞은 크기로 drop한다
                this.tweens.add({
                    targets: card,
                    x: blank.x,
                    y: blank.y,
                    displayWidth: gameOptions.cardWidth * gameOptions.blankSizeRatio,
                    displayHeight: gameOptions.cardHeight * gameOptions.blankSizeRatio,
                    duration: 150,
                    callbackScope: this,
                    onComplete: function(){

                        // card와 blank를 각 group에 추가하고 card 정보를 서버에 전달한다
                        this.boardGroup.add(card);
                        this.waitBlankGroup.add(blank);
                        this.waitCardGroup.add(card);
                        socket.emit("cardDrop", roomName, {value: card.value, x: blank.i, y: blank.j});
                        // 현재 카드 수를 플레이어에게 알린다
                        socket.emit("currentCardUpdate", roomName, socket.id, this.handGroup.countActive());
                    }
                })
            }
            // 자신의 turn이 아니라면 card를 다시 hand로 가져온다
            else {
                if(!this.handGroup.contains(card) && !this.boardGroup.contains(card)) {

                        // card를 다시 hand에 추가한다
                        this.handGroup.add(card);
 
                        // hand에 있는 card들을 재정렬한다
                        this.arrangeCardsInHand();

                    // background를 불투명하게 만든다
                    this.tweens.add({
                        targets: this.background,
                        alpha: 1,
                        duration: 150
                    });
                }
            }
        }, this);
        
 
        // drop하지 않고 drag가 끝나면 card를 다시 hand에 추가한다
        this.input.on("dragend", function(pointer, card, dropped) {
            // card의 기준점을 다시 중심으로 변경한다
            card.setOrigin(0.5, 0.5);
            // hide card preview
            this.cardPreview.visible = false;
            // card가 hand에 있거나 board에 있는지를 검사한다
            if(!this.handGroup.contains(card) && !this.boardGroup.contains(card)) {
                if(!dropped) {
                    // card를 다시 hand에 추가한다
                    this.handGroup.add(card);
                    // hand에 있는 card들을 재정렬한다
                    this.arrangeCardsInHand();
                }
            }
        }, this);

        socket.emit("ready", roomName);

        var self = this;
        // 게임 시작 후 1번째 turn을 부여받는다
        socket.on("firstTurn", function (id) {
            console.log("firstTurn");
            if (id === socket.id) {
                self.myTurn = true;
                console.log("My Turn! " + self.myTurn);
                self.whetherObjection = true;
                // timer를 재설정한다
                self.timeInSeconds = 30;
                self.timer.paused = false;
            }
        });

        // 2번째 turn부터 자신의 turn인지 확인한다
        socket.on("nextTurn", function (id) {
            if (id === socket.id) {
                self.myTurn = true;
                self.dropped = false;
                self.clicked = false;
                console.log("My Turn! " + self.myTurn);
                // timer를 재설정한다
                self.timeInSeconds = 30;
                self.timer.paused = false;
            }
        });

        // 2명 이상 접속하면 board 중앙에 카드를 생성한다
        socket.on("centerCard", function (value) {
            if(self.firstCenter) {
                console.log("center card set!");
                let card = self.add.sprite(gameOptions.firstBlankX + gameOptions.betweenBlank * 4, gameOptions.firstBlankY + gameOptions.betweenBlank * 4, self.deckArray[value]).setDepth(3).setInteractive().on("pointerdown",() => {
                    if(self.boardGroup.contains(card) & !card.activate & self.myTurn & self.dropped & self.validLocation(card.i, card.j, "click")) {
                        console.log("카드 선택");
                        card.alpha = 0.5;
                        card.activate = true;
                        self.alphaCard.push(card);
                        self.alphaCount++;
                        self.clicked = true;
                        self.board[card.i][card.j] = 1;
                    }
                });
                card.displayWidth = gameOptions.cardWidth * gameOptions.blankSizeRatio;
                card.displayHeight = gameOptions.cardHeight * gameOptions.blankSizeRatio;
                card.value = self.deckArray[value];
                card.i = 4;
                card.j = 4;
                self.boardGroup.add(card);
            }
            self.firstCenter = false;
            // board를 update한다
            self.board[4][4] = 2;
        });

        // turn이 부여된 후 1번째 card를 drop하면 objection을 비활성화하고 배열을 초기화한다
        socket.on("firstDrop", function () {
            self.whetherObjection = false;
            console.log("whetherObjection: " + self.whetherObjection);
            self.waitBlankGroup = self.add.group();
            self.waitCardGroup = self.add.group();
            self.dropCard = [
                [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
            ];
            self.dropCount = 0;
        });

        // 다른 유저가 card를 drop하면 자신의 board에 반영한다
        socket.on("cardDrop", function (cardData) {
            if (self.lastCardData != cardData) {
                self.lastCardData = cardData
                console.log("Other player: card Drop!");
                let card = self.add.sprite(gameOptions.firstBlankX + gameOptions.betweenBlank * cardData.x, gameOptions.firstBlankY + gameOptions.betweenBlank * cardData.y, cardData.value).setDepth(3).setInteractive().on("pointerdown",() => {
                    if(self.boardGroup.contains(card) & !card.activate & self.myTurn & self.dropped & self.validLocation(card.i, card.j, "click")) {
                        console.log("카드 선택");
                        card.alpha = 0.5;
                        card.activate = true;
                        self.alphaCard.push(card);
                        self.alphaCount++;
                        self.clicked = true;
                        self.board[card.i][card.j] = 1;
                    }
                });
                card.displayWidth = gameOptions.cardWidth * gameOptions.blankSizeRatio;
                card.displayHeight = gameOptions.cardHeight * gameOptions.blankSizeRatio;
                card.value = cardData.value;
                card.i = cardData.x;
                card.j = cardData.y;

                // 다른 유저가 drop한 card들을 배열에 저장한다
                self.dropCard[0][self.dropCount] = cardData.x;
                self.dropCard[1][self.dropCount] = cardData.y;
                self.dropCard[2][self.dropCount] = cardData.value;
                self.dropCount++;
                self.boardGroup.add(card);
                self.waitCardGroup.add(card);
                // board를 update한다
                self.board[cardData.x][cardData.y] = 2;
            }
        });

        // 다른 유저의 turn이 끝나면 objection을 활성화한다
        socket.on("turnEnd", function (type, lastWord) {
            self.recentlyVerification = true;
            self.recentlyTimeOut = true;
            self.recentlyTurnPlayerDisconnection = true;
            if (type === "drop") {
                console.log("turnEnd!");
                self.whetherObjection = true;
                console.log("whetherObjection: " + self.whetherObjection);
                var lastWordStyle = {font: "60px Arial", fill: "black"};
                self.lastWord.setStyle(lastWordStyle);
                self.lastWord.setText(lastWord);
            }
            else if (type === "deck") {
                console.log("turnEnd!");
                self.whetherObjection = false;
                console.log("whetherObjection: " + self.whetherObjection);
            }
            else if (type === "time") {
                console.log("turnEnd!");
            }
            else if (type === "disconnection") {
                console.log("turnEnd!");
            }
        });

        // 마지막 유저가 제출한 단어에 대해 objection을 신청한 결과로 존재하지 않는 단어일 때
        socket.on("verificationFalse", function (id) {
            if (self.recentlyVerification) {
                self.recentlyVerification = false;
                console.log("objection!");
                // 마지막 유저가 drop한 card를 모두 제거한다
                self.waitBlankGroup.clear(true);
                self.waitCardGroup.clear(true);
                for(var i = 0; i < 10; i++) {
                    if(self.dropCard[0][i] != -1) {
                        self.createBlank(self.dropCard[0][i], self.dropCard[1][i]);
                        // board를 update한다
                        self.board[self.dropCard[0][i]][self.dropCard[1][i]] = -1;
                    }
                    // 만약 자신이 마지막 유저라면 제거한 card를 모두 hand로 가져온 후 추가로 card를 1장 생성한다
                    if (id === socket.id) {
                        if(self.dropCard[0][i] != -1) {
                            self.createCard(self.dropCard[2][i]);
                        }
                        if (i === 9) {
                            var randNumber = Phaser.Math.Between(0, 48);
                            self.createCard(self.deckArray[randNumber]);
                        }
                        // 현재 카드 수를 플레이어에게 알린다
                        socket.emit("currentCardUpdate", roomName, socket.id, self.handGroup.countActive());
                    }
                }
                self.arrangeCardsInHand();
                // 배열을 초기화한다
                self.dropCard = [
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
                ];
                self.dropCount = 0;
                self.whetherObjection = false;
                console.log("whetherObjection: " + self.whetherObjection);
                // 존재하지 않는 단어라는 메시지 박스를 띄운다
                self.verificationFalseBox.visible = true;
                self.okButton.visible = true;
            }
        });

        // 마지막 유저가 제출한 단어에 대해 objection을 신청한 결과로 존재하는 단어일 때
        socket.on("verificationTrue", function (id, meaning) {
            if (self.recentlyVerification) {
                self.recentlyVerification = false;
                var meaningStyle = {font: "30px Arial", fill: "black"};
                // 자신이 이의신청한 유저라면 카드를 1장 생성한다
                if (id === socket.id) {
                    console.log("존재하는 단어입니다.");
                    self.whetherObjection = false;
                    console.log("whetherObjection: " + self.whetherObjection);
                    var randNumber = Phaser.Math.Between(0, 48);
                    self.createCard(self.deckArray[randNumber]);
                    self.arrangeCardsInHand();
                    // 현재 카드 수를 플레이어에게 알린다
                    socket.emit("currentCardUpdate", roomName, socket.id, self.handGroup.countActive());
                }
                // 단어를 설명한다
                self.lastWord.setStyle(meaningStyle);
                self.lastWord.setText(meaning.word + " " + meaning.pos + " " + meaning.def);
                // 존재하는 단어라는 메시지 박스를 띄운다
                self.verificationTrueBox.visible = true;
                self.okButton.visible = true;
            }
        });

        // 플레이어가 제한시간동안 단어를 완성하지 못한 경우
        socket.on("timeOut", function () {
            if (self.recentlyTimeOut) {
                self.recentlyTimeOut = false;
                console.log("time out!");

                // 만약 자신의 turn이라면 선택한 카드들을 모두 선택 해제한다
                if (self.myTurn) {
                    for (var i = 0; i < self.alphaCount; i++) {
                        self.alphaCard[i].alpha = 1;
                        self.alphaCard[i].activate = false;
                    }
                    self.alphaCard = [];
                    self.alphaCount = 0;
                }    

                // drop한 card를 모두 제거한다
                self.waitBlankGroup.clear(true);
                self.waitCardGroup.clear(true);
                for(var i = 0; i < 10; i++) {
                    if(self.dropCard[0][i] != -1) {
                        self.createBlank(self.dropCard[0][i], self.dropCard[1][i]);
                        // board를 update한다
                        self.board[self.dropCard[0][i]][self.dropCard[1][i]] = -1;
                    }
                    // 만약 자신의 turn이라면 제거한 card를 모두 hand로 가져온다
                    if (self.myTurn) {
                        if(self.dropCard[0][i] != -1) {
                            self.createCard(self.dropCard[2][i]);
                        }
                    }
                }
                self.arrangeCardsInHand();
                // 배열을 초기화한다
                self.dropCard = [
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
                ];
                self.dropCount = 0;
                self.whetherObjection = false;
                console.log("whetherObjection: " + self.whetherObjection);

                if(self.myTurn) {
                    // card를 1장 생성한다
                    var randNumber = Phaser.Math.Between(0, 48);
                    self.createCard(self.deckArray[randNumber]),
                    self.arrangeCardsInHand()
                    // turn을 종료한다
                    socket.emit("turnEnd", roomName, socket.id, self.word, "time");
                    socket.emit("nextTurn", roomName, null);
                    self.myTurn = false;
                    console.log("Turn End! " + self.myTurn);
                    // 현재 카드 수를 플레이어에게 알린다
                    socket.emit("currentCardUpdate", roomName, socket.id, self.handGroup.countActive());
                }
            }
        })

        socket.on("turnPlayerDisconnection", function () {
            if (self.recentlyTurnPlayerDisconnection) {
                self.recentlyTurnPlayerDisconnection = false;
                // drop한 card를 모두 제거한다
                self.waitBlankGroup.clear(true);
                self.waitCardGroup.clear(true);
                for(var i = 0; i < 10; i++) {
                    if(self.dropCard[0][i] != -1) {
                        self.createBlank(self.dropCard[0][i], self.dropCard[1][i]);
                        // board를 update한다
                        self.board[self.dropCard[0][i]][self.dropCard[1][i]] = -1;
                    }
                }
                self.arrangeCardsInHand();
                // 배열을 초기화한다
                self.dropCard = [
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
                ];
                self.dropCount = 0;
                self.whetherObjection = false;
                console.log("whetherObjection: " + self.whetherObjection);
            }
        });

        // 새로 접속한 player에게 기존 player들의 프로필을 표시한다
        socket.on("currentPlayers", function (id, number) {
            if (self.firstCurrentPlayers) {
                self.firstCurrentPlayers = false;
                var currentCardStyle = {font: "40px Arial", fill: "black"};
                for (var i = 0; i < number; i++) {
                    if (i === 0) {
                        self.player1Box = self.add.sprite(200, 340, "player1");
                        self.player1Name = self.add.text(200, 340, id[i].socketId);
                        self.player1currentCard = self.add.text(200, 360, gameOptions.startingCards, currentCardStyle);
                    }
                    else if (i === 1) {
                        self.player2Box = self.add.sprite(200, 340 + 210 * i, "player2");
                        self.player2Name = self.add.text(200, 340 + 210 * i, id[i].socketId);
                        self.player2currentCard = self.add.text(200, 360 + 210 * i, gameOptions.startingCards, currentCardStyle);
                    }
                    else if (i === 2) {
                        self.player3Box = self.add.sprite(200, 340 + 210 * i, "player3");
                        self.player3Name = self.add.text(200, 340 + 210 * i, id[i].socketId);
                        self.player3currentCard = self.add.text(200, 360 + 210 * i, gameOptions.startingCards, currentCardStyle);
                    }
                    else if (i === 3) {
                        self.player4Box = self.add.sprite(200, 340 + 210 * i, "player4");
                        self.player4Name = self.add.text(200, 340 + 210 * i, id[i].socketId);
                        self.player4currentCard = self.add.text(200, 360 + 210 * i, gameOptions.startingCards, currentCardStyle);
                    }
                }
            }
        });

        // player가 게임을 나가면 해당 player의 프로필을 제거한다
        socket.on("disconnection", function (id) {
            if (self.player1Name.text === id) {
                self.player1Box.visible = false;
                self.player1Name.visible = false;
                self.player1currentCard.visible = false;
            }
            else if (self.player2Name.text === id) {
                self.player2Box.visible = false;
                self.player2Name.visible = false;
                self.player2currentCard.visible = false;
            }
            else if (self.player3Name.text === id) {
                self.player3Box.visible = false;
                self.player3Name.visible = false;
                self.player3currentCard.visible = false;
            }
            else if (self.player4Name.text === id) {
                self.player4Box.visible = false;
                self.player4Name.visible = false;
                self.player4currentCard.visible = false;
            }
        });

        socket.on("currentCardUpdate", function (id, number) {
            if (self.player1Name.text === id) {
                self.player1currentCard.setText(number);
            }
            else if (self.player2Name.text === id) {
                self.player2currentCard.setText(number);
            }
            else if (self.player3Name.text === id) {
                self.player3currentCard.setText(number);
            }
            else if (self.player4Name.text === id) {
                self.player4currentCard.setText(number);
            }
        });

        socket.on("tok", function (time) {
            var seconds = time;
            //make a string showing the time
            var timeString = self.addZeros(seconds);
            //display the string in the text field
            self.timeText.text = timeString;
        });
    }
    update() {
        
    }
 
    // card value값을 받아서 해당 값을 가지는 card를 생성한다
    createCard(n) {
        let coordinates = this.setHandCoordinates(this.handGroup.countActive());
        let card = this.add.sprite(coordinates.x, coordinates.y, n).on("pointerdown",(pointer) => {
            if(pointer.rightButtonDown()) {
                if(this.handGroup.contains(card)) {
                    this.cardRotation(card);
                }
            }
            else {
                if(this.boardGroup.contains(card) & !card.activate & this.myTurn & this.dropped & this.validLocation(card.i, card.j, "click")) {
                    console.log("카드 선택");
                    card.alpha = 0.5;
                    card.activate = true;
                    this.alphaCard.push(card);
                    this.alphaCount++;
                    this.clicked = true;
                    this.board[card.i][card.j] = 1;
                }
            }
        });
        card.setOrigin(0.5, 0.5);
        card.handPosition = this.handGroup.countActive();
        card.setInteractive({
            draggable: true
        });
        card.displayWidth = gameOptions.cardWidth;
        card.displayHeight = gameOptions.cardHeight;
        card.value = n;
        card.i = 0;
        card.j = 0;
        card.setDepth(4);
        card.activate = false;
        this.handGroup.add(card);
        card.visible = false;
    }
 
    setHandCoordinates(n) {
        let xPosition = gameOptions.firstCardX + gameOptions.betweenCrad * n;
        let yPosition = gameOptions.firstCardY;
        return {
            x: xPosition,
            y: yPosition
        }
    }
 
    // 보유중인 card를 알맞게 위치시킨다
    arrangeCardsInHand() {
        this.countArrange = 0;
        this.handGroup.children.iterate(function(card, i) {
            let coordinates = this.setHandCoordinates(i);
            this.tweens.add({
                targets: card,
                x: coordinates.x,
                y: coordinates.y,
                displayWidth: gameOptions.cardWidth,
                displayHeight: gameOptions.cardHeight,
                duration: 150,
                onComplete: function(){
                    if (card.x >= gameOptions.firstCardX + gameOptions.betweenCrad * 9 || card.x < gameOptions.firstCardX) {
                        card.visible = false;
                    }
                    else {
                        card.visible = true;
                    }
                }
            });
        }, this);
    }

    // card를 drop할 수 있는 공간인 blank를 생성한다
    createBlank(i, j) {
        let blank = this.add.sprite(gameOptions.firstBlankX + gameOptions.betweenBlank * i, gameOptions.firstBlankY + gameOptions.betweenBlank * j, "blank").setInteractive();
        if(!(i == 4 && j == 4)) {
            blank.input.dropZone = true;
        }
        blank.i = i;
        blank.j = j;
        blank.displayWidth = gameOptions.cardWidth * gameOptions.blankSizeRatio;
        blank.displayHeight = gameOptions.cardHeight * gameOptions.blankSizeRatio;
        blank.alpha = 0.001;
        this.zoneGroup.add(blank);
    }

    // board에 있는 card의 위치에 존재하는 blank의 input을 비활성화한다
    setBlank(blank, card) {
        blank.input.dropZone = false;
        this.waitBlankGroup.add(blank);
    }

    // 제출할 단어를 만들기 위해 배열을 정렬한다
    sortWord() {
        this.word = "";
        var array = [[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]];

        if (this.direction === "row") {
            for (var i = 0; i < this.alphaCount; i++) {
                array[0][i] = this.alphaCard[i].i;
                array[1][i] = this.alphaCard[i].value;
            }
            for (var i = 0; i < this.alphaCount - 1; i++) {
                for (var j = 0; j < this.alphaCount - 1; j++) {
                    if (array[0][j] > array[0][j + 1]) {
                        var temp = array[0][j];
                        array[0][j] = array[0][j + 1];
                        array[0][j + 1] = temp;
    
                        var temp2 = array[1][j];
                        array[1][j] = array[1][j + 1];
                        array[1][j + 1] = temp2;
                    }
                }
            }
            for (var i = 0; i < this.alphaCount; i++) {
                if (array[1][i] != -1) {
                    this.word += array[1][i];
                }
            }
        }
        else if (this.direction === "column") {
            for (var i = 0; i < this.alphaCount; i++) {
                array[0][i] = this.alphaCard[i].j;
                array[1][i] = this.alphaCard[i].value;
            }
            for (var i = 0; i < this.alphaCount - 1; i++) {
                for (var j = 0; j < this.alphaCount - 1; j++) {
                    if (array[0][j] > array[0][j + 1]) {
                        var temp = array[0][j];
                        array[0][j] = array[0][j + 1];
                        array[0][j + 1] = temp;
    
                        var temp2 = array[1][j];
                        array[1][j] = array[1][j + 1];
                        array[1][j + 1] = temp2;
                    }
                }
            }
            for (var i = 0; i < this.alphaCount; i++) {
                if (array[1][i] != -1) {
                    this.word += array[1][i];
                }
            }
        }

        for (var i = 0; i < this.alphaCount - 1; i++) {
            if (array[0][i + 1] - array[0][i] != 1) {
                return false;
            }
        }
        return true;
    }

    validLocation(x, y, type) {
        var proper = false;
        if (type === "drop") {
            if (x < 9)
                if (this.board[x + 1][y] != -1)
                    proper = true;
            if (y < 9)
                if (this.board[x][y + 1] != -1)
                    proper = true;
            if (x > 0)
                if (this.board[x - 1][y] != -1)
                    proper = true;
            if (y > 0)
                if (this.board[x][y - 1] != -1)
                    proper = true;
        }
        else if (type === "click") {
            if (x < 9)
                if (this.board[x + 1][y] === 1)
                    proper = true;
            if (y < 9)
                if (this.board[x][y + 1] === 1)
                    proper = true;
            if (x > 0)
                if (this.board[x - 1][y] === 1)
                    proper = true;
            if (y > 0)
                if (this.board[x][y - 1] === 1)
                    proper = true;
        } 

        if (!proper)
            return false;
        
        if (this.alphaCount === 1) {
            if (this.x === x)
                this.direction = "column";
            else if (this.y === y)
                this.direction = "row";
            else
                return false;
        }

        
        if (this.alphaCount > 1) {
            if (this.direction === "row") {
                if (this.y === y)
                    return true;
                else
                    return false;
            }
            else if (this.direction === "column") {
                if (this.x === x)
                    return true;
                else
                    return false;
            }
        }

        return true;
    }

    cardRotation(card) {
        if(card.value === "금") {
            card.value = "믄";
            card.angle += 180;
        }
        else if(card.value === "믄") {
            card.value = "금";
            card.angle += 180;
        }
        else if(card.value === "마") {
            card.value = "무";
            card.angle += 90;
        }
        else if(card.value === "무") {
            card.value = "마";
            card.angle += 270;
        }
        else if(card.value === "아") {
            card.value = "우";
            card.angle += 90;
        }
        else if(card.value === "우") {
            card.value = "아";
            card.angle += 270;
        }
        else if(card.value === "어") {
            card.value = "오";
            card.angle += 90;
        }
        else if(card.value === "오") {
            card.value = "어";
            card.angle += 270;
        }
        else if(card.value === "요") {
            card.value = "여";
            card.angle += 270;
        }
        else if(card.value === "여") {
            card.value = "요";
            card.angle += 90;
        }
        else if(card.value === "음") {
            card.value = "믕";
            card.angle += 180;
        }
        else if(card.value === "믕") {
            card.value = "음";
            card.angle += 180;
        }
        else if(card.value === "이") {
            card.value = "으";
            card.angle += 90;
        }
        else if(card.value === "으") {
            card.value = "이";
            card.angle += 270;
        }
        console.log(card.angle);
    }

    setCardOrigin(card) {
        if (card.angle == 0) {
            card.setOrigin(0.5, 1);
        }
        else if (card.angle == 90) {
            card.setOrigin(1, 0.5);
        }
        else if (card.angle == 180) {
            card.setOrigin(0.5, 0);
        }
        else if (card.angle == 270) {
            card.setOrigin(0, 0.5);
        }
        else if (card.angle == -270) {
            card.setOrigin(1, 0.5);
        }
        else if (card.angle == -180) {
            card.setOrigin(0.5, 0);
        }
        else if (card.angle == -90) {
            card.setOrigin(0, 0.5);
        }
    }

    setPreviewCoordinates(dropZone) {
        let xPosition = dropZone.x - gameOptions.firstBlankX - gameOptions.cardWidth * gameOptions.blankSizeRatio / 2;
        let yPosition = dropZone.y - gameOptions.firstBlankY - gameOptions.cardHeight * gameOptions.blankSizeRatio / 2;

        let count = 0;
        while (xPosition >= 0) {
            xPosition -= gameOptions.betweenBlank;
            count++;
        }
        xPosition = gameOptions.firstBlankX + count * gameOptions.betweenBlank;

        count = 0;
        while (yPosition >= 0) {
            yPosition -= gameOptions.betweenBlank;
            count++;
        }
        yPosition = gameOptions.firstBlankY + count * gameOptions.betweenBlank;

        return {
            x: xPosition,
            y: yPosition
        }
    }

    tick() {
        //subtract a second
        this.timeInSeconds--;
        var seconds = this.timeInSeconds;
        //make a string showing the time
        var timeString = this.addZeros(seconds);
        //display the string in the text field
        this.timeText.text = timeString;
        socket.emit("tick", roomName, seconds);
        //check if the time is up
        if (this.timeInSeconds === 0 && this.myTurn) {
            this.timer.paused = true;
            socket.emit("timeOut", roomName, null);
        }
    }

    addZeros(number) {
        if (number < 10) {
            number = "0" + number;
        }
        return number;
    }
}

function startgame(event){
    event.preventDefault();
    socket.emit("gamestart", (roomName));
}

socket.on("gamestart", () => {
    console.log("game");
    room.hidden = true;
    let gameConfig = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "thegame",
            width: 1920,
            height: 1080
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        scene: playGame
    }
    game = new Phaser.Game (gameConfig);
    window.focus();
})