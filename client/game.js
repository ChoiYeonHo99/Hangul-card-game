let game;
let gameOptions = {
    startingCards: 6,
    cardWidth: 100,
    cardHeight: 100,
    handSizeRatio: 1,
    blankSizeRatio: 0.7,
    firstBlankX: 708,
    firstBlankY: 158,
    betweenBlank: 76
}
window.onload = function() {
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
}
class playGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }
    preload() {
        this.load.image("background", "image/background.png");
        this.load.image("blank", "image/blank.png");
        this.load.image("deck", "image/deck.png");
        this.load.image("finishButton", "image/finishButton.png");
        this.load.image("objectionButton", "image/objectionButton.png");
        this.load.image("logo", "image/logo.png");
        this.load.image("lastWordBar", "image/lastWordBar.png");
        this.load.image("board", "image/board.png");
        this.load.image("뒷면", "image/뒷면.png");
        this.load.image("player1", "image/player1.png");
        this.load.image("player2", "image/player2.png");
        this.load.image("player3", "image/player3.png");
        this.load.image("player4", "image/player4.png");
        this.load.image("가", "cards/가.png");
        this.load.image("거", "cards/거.png");
        this.load.image("고", "cards/고.png");
        this.load.image("구", "cards/구.png");
        this.load.image("그", "cards/그.png");
        this.load.image("금", "cards/금.png");
        this.load.image("기", "cards/기.png");
        this.load.image("나", "cards/나.png");
        this.load.image("다", "cards/다.png");
        this.load.image("대", "cards/대.png");
        this.load.image("도", "cards/도.png");
        this.load.image("동", "cards/동.png");
        this.load.image("드", "cards/드.png");
        this.load.image("라", "cards/라.png");
        this.load.image("로", "cards/로.png");
        this.load.image("리", "cards/리.png");
        this.load.image("마", "cards/마.png");
        this.load.image("보", "cards/보.png");
        this.load.image("부", "cards/부.png");
        this.load.image("비", "cards/비.png");
        this.load.image("사", "cards/사.png");
        this.load.image("상", "cards/상.png");
        this.load.image("생", "cards/생.png");
        this.load.image("소", "cards/소.png");
        this.load.image("수", "cards/수.png");
        this.load.image("스", "cards/스.png");
        this.load.image("시", "cards/시.png");
        this.load.image("식", "cards/식.png");
        this.load.image("아", "cards/아.png");
        this.load.image("안", "cards/안.png");
        this.load.image("어", "cards/어.png");
        this.load.image("오", "cards/오.png");
        this.load.image("요", "cards/요.png");
        this.load.image("우", "cards/우.png");
        this.load.image("음", "cards/음.png");
        this.load.image("이", "cards/이.png");
        this.load.image("인", "cards/인.png");
        this.load.image("일", "cards/일.png");
        this.load.image("자", "cards/자.png");
        this.load.image("장", "cards/장.png");
        this.load.image("전", "cards/전.png");
        this.load.image("정", "cards/정.png");
        this.load.image("제", "cards/제.png");
        this.load.image("주", "cards/주.png");
        this.load.image("지", "cards/지.png");
        this.load.image("진", "cards/진.png");
        this.load.image("하", "cards/하.png");
        this.load.image("한", "cards/한.png");
        this.load.image("해", "cards/해.png");
    }
    create() {
        this.socket = io();
        var self = this;
        this.myTurn = false; // true면 자신의 turn임을 나타낸다
        let whetherObjection = false; // objection의 가능 여부를 나타낸다
        this.word = ""; // 제출하는 단어
        this.direction = "row"; // 자신의 card drop이 row인지 column인지를 나타낸다
        this.dropped = false; // drop을 1번 이상 했는지를 나타낸다
        this.clicked = false; // board에서 1번 이상 click을 했는지를 나타낸다
        this.x; // 자신의 턴에서 처음으로 drop한 위치의 x좌표를 나타낸다
        this.y; // 자신의 턴에서 처음으로 drop한 위치의 y좌표를 나타낸다

        // 게임 시작 후 1번째 turn을 부여받는다
        this.socket.on("firstTurn", function (id) {
            if (id === self.socket.id) {
                self.myTurn = true;
                console.log("My Turn! " + self.myTurn);
                whetherObjection = true;
                // board 중앙에 생성할 카드값을 생성한 후 서버에 전송한다
                var randNumber = Phaser.Math.Between(0, 48);
                var centerCardValue = self.deckArray[randNumber]
                self.socket.emit("centerCardValue", centerCardValue);
            }
        });

        // 2번째 turn부터 자신의 turn인지 확인한다
        this.socket.on("nextTurn", function (id) {
            if (id === self.socket.id) {
                self.myTurn = true;
                self.dropped = false;
                self.clicked = false;
                console.log("My Turn! " + self.myTurn);
            }
        });

        // 2명 이상 접속하면 board 중앙에 카드를 생성한다
        let firstCenter = true; // 2번 이상 생성하지 않게 제한하는 변수
        this.socket.on("centerCard", function (value) {
            if(firstCenter) {
                console.log("center card set!");
                let card = self.add.sprite(gameOptions.firstBlankX + gameOptions.betweenBlank * 4, gameOptions.firstBlankY + gameOptions.betweenBlank * 4, value).setDepth(3).setInteractive().on("pointerdown",() => {
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
                card.value = value;
                card.i = 4;
                card.j = 4;
                self.boardGroup.add(card);
            }
            firstCenter = false;
            // board를 update한다
            self.board[4][4] = 2;
        });

        // turn이 부여된 후 1번째 card를 drop하면 objection을 비활성화하고 배열을 초기화한다
        this.socket.on("firstDrop", function () {
            whetherObjection = false;
            console.log("whetherObjection: " + whetherObjection);
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
        this.socket.on("cardDrop", function (cardData) {
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
        });

        // 다른 유저의 turn이 끝나면 objection을 활성화한다
        this.socket.on("turnEnd", function (type, lastWord) {
            if (type === "drop") {
                console.log("turnEnd!");
                whetherObjection = true;
                console.log("whetherObjection: " + whetherObjection);
                self.lastWord.setText(lastWord);
            }
            else if (type === "deck") {
                console.log("turnEnd!");
                whetherObjection = false;
                console.log("whetherObjection: " + whetherObjection);
            }
        });

        // 마지막 유저가 제출한 단어에 대해 objection을 신청한 결과로 존재하지 않는 단어일 때
        this.socket.on("verificationFalse", function (id) {
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
                if (id === self.socket.id) {
                    if(self.dropCard[0][i] != -1) {
                        self.createCard(self.dropCard[2][i]);
                    }
                    if (i === 9) {
                        var randNumber = Phaser.Math.Between(0, 48);
                        self.createCard(self.deckArray[randNumber]);
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
            whetherObjection = false;
            console.log("whetherObjection: " + whetherObjection);
        });

        // 마지막 유저가 제출한 단어에 대해 objection을 신청한 결과로 존재하는 단어일 때
        this.socket.on("verificationTrue", function (id) {
            // 자신이 이의신청한 유저라면 카드를 1장 생성한다
            if (id === self.socket.id) {
                console.log("존재하는 단어입니다.");
                whetherObjection = false;
                console.log("whetherObjection: " + whetherObjection);
                var randNumber = Phaser.Math.Between(0, 48);
                self.createCard(self.deckArray[randNumber]);
                self.arrangeCardsInHand();
            }
        });

        // 새로운 player가 접속하면 해당 player의 프로필을 표시한다
        this.socket.on("newPlayer", function (id, number) {
            if (number === 0) {
                self.player1Box = self.add.sprite(200, 340, "player1");
                self.player1Name = self.add.text(200, 340, id);
            }
            else if (number === 1) {
                self.player2Box = self.add.sprite(200, 340 + 210 * number, "player2");
                self.player2Name = self.add.text(200, 340 + 210 * number, id);
            }
            else if (number === 2) {
                self.player3Box = self.add.sprite(200, 340 + 210 * number, "player3");
                self.player3Name = self.add.text(200, 340 + 210 * number, id);
            }
            else if (number === 3) {
                self.player4Box = self.add.sprite(200, 340 + 210 * number, "player4");
                self.player4Name = self.add.text(200, 340 + 210 * number, id);
            }
        });

        // 새로 접속한 player에게 기존 player들의 프로필을 표시한다
        this.socket.on("currentPlayers", function (id, number) {
            for (var i = 0; i < number; i++) {
                if (i === 0) {
                    self.player1Box = self.add.sprite(200, 340, "player1");
                    self.player1Name = self.add.text(200, 340 + 210 * i, id[i]);
                }
                else if (i === 1) {
                    self.player2Box = self.add.sprite(200, 340 + 210 * i, "player2");
                    self.player2Name = self.add.text(200, 340 + 210 * i, id[i]);
                }
                else if (i === 2) {
                    self.player3Box = self.add.sprite(200, 340 + 210 * i, "player3");
                    self.player3Name = self.add.text(200, 340 + 210 * i, id[i]);
                }
                else if (i === 3) {
                    self.player4Box = self.add.sprite(200, 340 + 210 * i, "player4");
                    self.player4Name = self.add.text(200, 340 + 210 * i, id[i]);
                }
            }
        });

        // player가 게임을 나가면 해당 player의 프로필을 제거한다
        this.socket.on("disconnection", function (id) {
            if (self.player1Name.text === id) {
                self.player1Box.visible = false;
                self.player1Name.visible = false;
            }
            else if (self.player2Name.text === id) {
                self.player2Box.visible = false;
                self.player2Name.visible = false;
            }
            else if (self.player3Name.text === id) {
                self.player3Box.visible = false;
                self.player3Name.visible = false;
            }
            else if (self.player4Name.text === id) {
                self.player4Box.visible = false;
                self.player4Name.visible = false;
            }
        });

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
                this.socket.emit("turnEnd", this.socket.id, this.word, "drop");
                this.socket.emit("nextTurn", null);
                this.myTurn = false;
                console.log("Turn End! " + this.myTurn);
                whetherObjection = false;
                console.log("whetherObjection: " + whetherObjection);
                this.lastWord.setText(this.word);

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
            if(whetherObjection) {
                this.socket.emit("objection", this.socket.id);
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
        var fontStyle = { font: "60px Arial", fill: "black"};
        this.lastWord = this.add.text(1050, 60, "", fontStyle);
        this.lastWord.setOrigin(0.5, 0.5);

        // card를 drop하는 위치에 생기는 preview
        this.cardPreview = this.add.sprite(200, 200, "뒷면");
        this.cardPreview.visible = false;
        this.cardPreview.alpha = 0.75;
        this.cardPreview.displayWidth = gameOptions.cardWidth * gameOptions.blankSizeRatio;
        this.cardPreview.displayHeight = gameOptions.cardHeight * gameOptions.blankSizeRatio;
        this.cardPreview.setDepth(3);

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
                this.socket.emit("turnEnd", this.socket.id, this.word, "deck");
                this.socket.emit("nextTurn", null);
                this.myTurn = false;
                console.log("Turn End! " + this.myTurn);
                whetherObjection = false;
                console.log("whetherObjection: " + whetherObjection);
            }
        });
        deck.setDepth(1);

        this.input.on("dragenter", function(dropZone) {
            // show card preview
            this.cardPreview.visible = true;
            this.cardPreview.x = dropZone.x;
            this.cardPreview.y = dropZone.y;
        }, this);

        this.input.on("dragleave", function() {
            // hide card preview
            this.cardPreview.visible = false;
        }, this);

        // card를 drag하면 pointer를 따라다니도록 한다
        this.input.on("dragstart", function(pointer, card) {
            // card가 hand에 있는지 검사한다
            if(this.handGroup.contains(card)) {
                // hand에서 card를 제거한다
                this.handGroup.remove(card);
                // hand에 있는 card들을 재정렬한다
                this.arrangeCardsInHand();
                card.setDepth(4);
                // card가 pointer를 따라다니도록 한다
                this.tweens.add({
                    targets: card,
                    angle: 0,
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
                    whetherObjection = false;
                    this.socket.emit("firstDrop", null);
                    console.log("whetherObjection: " + whetherObjection);
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
                    angle: 0,
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
                       this.socket.emit("cardDrop", {value: card.value, x: blank.i, y: blank.j});
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
    }
 
    // card value값을 받아서 해당 값을 가지는 card를 생성한다
    createCard(n) {
        let coordinates = this.setHandCoordinates(this.handGroup.countActive(), gameOptions.startingCards);
        let card = this.add.sprite(coordinates.x, coordinates.y, n).on("pointerdown",(pointer) => {
            if(pointer.rightButtonDown()) {
                if(this.handGroup.contains(card)) {
                    /*if(card.value === "가" || "나") {
                        card.value = "도";
                        card.angle += 90;
                        console.log("right click");
                    }*/
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
        card.setOrigin(0.5, 1);
        card.rotation = coordinates.r;
        card.handPosition = this.handGroup.countActive();
        card.setInteractive({
            draggable: true
        });
        card.displayWidth = gameOptions.cardWidth;
        card.displayHeight = gameOptions.cardHeight;
        card.value = n;
        card.i = 0;
        card.j = 0;
        card.activate = false;
        this.handGroup.add(card);
    }
 
    setHandCoordinates(n, totalCards) {
        let rotation = Math.PI / 4 / totalCards * (totalCards - n - 1);
        let xPosition = game.config.width + 200 * Math.cos(rotation + Math.PI / 2);
        let yPosition = game.config.height + 200 - 200 * Math.sin(rotation + Math.PI / 2);
        return {
            x: xPosition,
            y: yPosition,
            r: -rotation
        }
    }
 
    // 보유중인 card를 알맞게 위치시킨다
    arrangeCardsInHand() {
        this.handGroup.children.iterate(function(card, i) {
            card.setDepth(i + 1);
            let coordinates = this.setHandCoordinates(i, this.handGroup.countActive());
            this.tweens.add({
                targets: card,
                rotation: coordinates.r,
                x: coordinates.x,
                y: coordinates.y,
                displayWidth: gameOptions.cardWidth,
                displayHeight: gameOptions.cardHeight,
                duration: 150
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
}