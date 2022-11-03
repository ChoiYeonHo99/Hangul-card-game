let game;
let gameOptions = {
    startingCards: 6,
    cardWidth: 100,
    cardHeight: 100,
    handSizeRatio: 1,
    blankSizeRatio: 0.5
}
window.onload = function() {
    let gameConfig = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "thegame",
            width: 1280,
            height: 740
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
        this.load.image("player1", "image/player1.jpg");
        this.load.image("player2", "image/player2.jpg");
        this.load.image("player3", "image/player3.jpg");
        this.load.image("player4", "image/player4.jpg");
        this.load.image("background", "image/background.png");
        this.load.image("blank", "image/blank.png");
        this.load.image("deck", "cards/뒷면.jpg");
        this.load.image("redbutton", "image/redbutton.png");
        this.load.image("greenbutton", "image/greenbutton.png");
        this.load.image("가", "cards/가.jpg");
        this.load.image("거", "cards/거.jpg");
        this.load.image("고", "cards/고.jpg");
        this.load.image("구", "cards/구.jpg");
        this.load.image("그", "cards/그.jpg");
        this.load.image("금", "cards/금.jpg");
        this.load.image("기", "cards/기.jpg");
        this.load.image("나", "cards/나.jpg");
        this.load.image("다", "cards/다.jpg");
        this.load.image("대", "cards/대.jpg");
        this.load.image("도", "cards/도.jpg");
        this.load.image("동", "cards/동.jpg");
        this.load.image("드", "cards/드.jpg");
        this.load.image("라", "cards/라.jpg");
        this.load.image("로", "cards/로.jpg");
        this.load.image("리", "cards/리.jpg");
        this.load.image("마", "cards/마.jpg");
        this.load.image("보", "cards/보.jpg");
        this.load.image("부", "cards/부.jpg");
        this.load.image("비", "cards/비.jpg");
        this.load.image("사", "cards/사.jpg");
        this.load.image("상", "cards/상.jpg");
        this.load.image("생", "cards/생.jpg");
        this.load.image("소", "cards/소.jpg");
        this.load.image("수", "cards/수.jpg");
        this.load.image("스", "cards/스.jpg");
        this.load.image("시", "cards/시.jpg");
        this.load.image("식", "cards/식.jpg");
        this.load.image("아", "cards/아.jpg");
        this.load.image("안", "cards/안.jpg");
        this.load.image("어", "cards/어.jpg");
        this.load.image("오", "cards/오.jpg");
        this.load.image("요", "cards/요.jpg");
        this.load.image("우", "cards/우.jpg");
        this.load.image("음", "cards/음.jpg");
        this.load.image("이", "cards/이.jpg");
        this.load.image("인", "cards/인.jpg");
        this.load.image("일", "cards/일.jpg");
        this.load.image("자", "cards/자.jpg");
        this.load.image("장", "cards/장.jpg");
        this.load.image("전", "cards/전.jpg");
        this.load.image("정", "cards/정.jpg");
        this.load.image("제", "cards/제.jpg");
        this.load.image("주", "cards/주.jpg");
        this.load.image("지", "cards/지.jpg");
        this.load.image("진", "cards/진.jpg");
        this.load.image("하", "cards/하.jpg");
        this.load.image("한", "cards/한.jpg");
        this.load.image("해", "cards/해.jpg");
    }
    create() {
        this.socket = io();
        var self = this;
        let myTurn = false;
        let whetherObjection = false;

        this.socket.on("firstTurn", function (id) {
            if (id === self.socket.id) {
                myTurn = true;
                console.log("My Turn! " + myTurn);
                whetherObjection = true;
            }
        });
        this.socket.on("nextTurn", function (id) {
            if (id === self.socket.id) {
                myTurn = true;
                console.log("My Turn! " + myTurn);
            }
        });
        this.socket.on("firstDrop", function () {
            whetherObjection = false;
            console.log("whetherObjection: " + whetherObjection);
            self.waitBlankGroup = self.add.group();
            self.waitCardGroup = self.add.group();
            self.set = [
                [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
            ];
            self.setcount = 0;
        });

        this.socket.on("cardDrop", function (cardData) {
            console.log("Other player: card Drop!");
            let card = self.add.sprite(300 + 60 * cardData.x, 75 + 60 * cardData.y, cardData.value).setDepth(2).setInteractive().on("pointerdown",() => {
                if(self.boardGroup.contains(card) & card.activate) {
                    console.log("카드 선택 취소");
                    card.alpha = 1;
                    card.activate = false;
                }
                else if(self.boardGroup.contains(card) & !card.activate) {
                    console.log("카드 선택");
                    card.alpha = 0.5;
                    card.activate = true;
                }
            });
            card.displayWidth = gameOptions.cardWidth * gameOptions.blankSizeRatio;
            card.displayHeight = gameOptions.cardHeight * gameOptions.blankSizeRatio;
            card.value = cardData.calue;
            card.i = cardData.x;
            card.j = cardData.y;

            self.set[0][self.setcount] = cardData.x;
            self.set[1][self.setcount] = cardData.y;
            self.set[2][self.setcount] = cardData.value;
            self.setcount++;
            self.boardGroup.add(card);
            self.waitCardGroup.add(card);
        });

        this.socket.on("red", function () {
            console.log("red!");
            
            whetherObjection = true;
            console.log("whetherObjection: " + whetherObjection);
        });

        this.socket.on("green", function (id) {
            console.log("green!");
            self.waitBlankGroup.clear(true);
            self.waitCardGroup.clear(true);
            for(var i = 0; i < 10; i++) {
                if(self.set[0][i] != -1) {
                    self.createBlank(self.set[0][i], self.set[1][i]);
                }
                if (id === self.socket.id) {
                    if(self.set[0][i] != -1) {
                        self.createCard(self.set[2][i]);
                    }
                }
            }
            self.arrangeCardsInHand();
            self.set = [
                [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
            ];
            self.setcount = 0;
            whetherObjection = false;
            console.log("whetherObjection: " + whetherObjection);
        });

        this.set = [
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
        ];
        this.setcount = 0;

        this.waitBlankGroup = this.add.group();
        this.waitCardGroup = this.physics.add.group();
        let redbutton = this.add.sprite(950, 100, "redbutton").setInteractive().on("pointerup",() => {
            if (myTurn) {
                this.socket.emit("red", this.socket.id);
                this.socket.emit("nextTurn", null);
                myTurn = false;
                console.log("Turn End! " + myTurn);
                whetherObjection = false;
                console.log("whetherObjection: " + whetherObjection);
            };
        });
        redbutton.setDepth(1);
        redbutton.displayWidth = 100;
        redbutton.displayHeight = 100;

        let greenbutton = this.add.sprite(1150, 100, "greenbutton").setInteractive().on("pointerup",() => {
            if(whetherObjection) {
                this.waitBlankGroup.clear(true);
                this.waitCardGroup.clear(true);
                for(var i = 0; i < 10; i++) {
                    if(this.set[0][i] != -1) {
                        this.createBlank(this.set[0][i], this.set[1][i]);
                    }
                }
                this.set = [
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
                ];
                this.setcount = 0;
                this.socket.emit("green", null);
                whetherObjection = false;
                console.log("whetherObjection: " + whetherObjection);
            }
        });
        greenbutton.setDepth(1);
        greenbutton.displayWidth = 100;
        greenbutton.displayHeight = 100;

        // group containing cards on board
        this.boardGroup = this.add.group();
 
        // group containing cards in hand
        this.handGroup = this.add.group();
 
        // game background
        this.background = this.add.sprite(game.config.width / 2, game.config.height / 2, "background");

        this.zoneGroup = this.physics.add.group();
        for(let i = 0; i < 10; i++) {
            for(let j = 0; j < 10; j++) {
                this.createBlank(i, j);
            }
        }
        this.zoneGroup.setDepth(1);

        this.physics.add.overlap(this.zoneGroup, this.waitCardGroup, this.setBlank, null, this);
 
        // create and place cards in hand
        this.deckarray = ["가", "거", "고", "구", "그", "금", "기", "나", "다", "대",
        "도", "동", "드", "라", "로", "리", "마", "보", "부", "비",
        "사", "상", "생", "소", "수", "스", "시", "식", "아", "안",
        "어", "오", "요", "우", "음", "이", "인", "일", "자", "장",
        "전", "정", "제", "주", "지", "진", "하", "한", "해"];
        for(let i = 0; i < gameOptions.startingCards; i ++) {
            var randNumber = Phaser.Math.Between(0, 48);
            this.createCard(this.deckarray[randNumber]);
        }

        // 덱 생성
        let deck = this.add.sprite(100, 100, "deck").setInteractive().on("pointerup",() => {
            var randNumber = Phaser.Math.Between(0, 48);
            this.createCard(this.deckarray[randNumber]),
            this.arrangeCardsInHand()
        });
        deck.setDepth(1);
        deck.displayWidth = 150;
        deck.displayHeight = 150;

        // listener fired when we start dragging
        this.input.on("dragstart", function(pointer, card) {
 
            // is the card in hand?
            if(this.handGroup.contains(card)) {
 
                // remove card from hand
                this.handGroup.remove(card);
 
                // re-arrange cards in hand
                this.arrangeCardsInHand();
 
                // bring the card in front
                card.setDepth(this.handGroup.countActive());
 
                // tween to animate the card
                this.tweens.add({
                    targets: card,
                    angle: 0,
                    x: pointer.x,
                    y: pointer.y,
                    duration: 150
                });
 
                // tween to fade the background
                this.tweens.add({
                    targets: this.background,
                    alpha: 0.3,
                    duration: 150
                });
            };
        }, this);
 
        // listener fired when we are dragging
        this.input.on("drag", function(pointer, card) {
 
            // if the card is not in hand and not on the board...
            if(!this.handGroup.contains(card) && !this.boardGroup.contains(card)) {
                // move the card to pointer position
                card.x = pointer.x;
                card.y = pointer.y;
            }
        }, this);
 
        // listener fired when we are dragging and the input leaves the drop zone
        this.input.on("drop", function(pointer, card, blank) {
            if (myTurn) {

                if(whetherObjection) {
                    whetherObjection = false;
                    this.socket.emit("firstDrop", null);
                    console.log("whetherObjection: " + whetherObjection);
                    this.waitBlankGroup = this.add.group();
                    this.waitCardGroup = this.add.group();
                    this.set = [
                        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
                    ];
                    this.setcount = 0;
                }

                card.setDepth(2);
                card.setOrigin(0.5, 0.5);
                blank.input.dropZone = false;
                card.input.draggable = false;
                card.i = blank.i;
                card.j = blank.j;
            
                this.set[0][this.setcount] = blank.i;
                this.set[1][this.setcount] = blank.j;
                this.set[2][this.setcount] = card.value;
                this.setcount++;

            

                // move the card on its final position
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
 
                        // add the card to board group
                      this.boardGroup.add(card);
                       this.waitBlankGroup.add(blank);
                       this.waitCardGroup.add(card);
                       this.socket.emit("cardDrop", {value: card.value, x: blank.i, y: blank.j});
                   }
            });}

            else {
                if(!this.handGroup.contains(card) && !this.boardGroup.contains(card)) {

                        // add dragged card to hand group
                        this.handGroup.add(card);
 
                        // arrange cards in hand
                        this.arrangeCardsInHand();

                    // tween to make the background visible again
                    this.tweens.add({
                        targets: this.background,
                        alpha: 1,
                        duration: 150
                    });
                }
            }
        }, this);
        
 
        // listener fired when we stop dragging
        this.input.on("dragend", function(pointer, card, dropped) {
 
                if(!this.handGroup.contains(card) && !this.boardGroup.contains(card)) {
 
                    // if the card hasn't been dropped in the drop zone...
 
                    if(!dropped) {
                        // add dragged card to hand group
                        this.handGroup.add(card);
 
                        // arrange cards in hand
                        this.arrangeCardsInHand();
                    }
 
                    // tween to make the background visible again
                    this.tweens.add({
                        targets: this.background,
                        alpha: 1,
                        duration: 150
                    });
                }
        }, this);
    }
 
    // THE FOLLOWING METHODS ARE ONLY USED TO SET CARDS POSITION, BOTH IN HAND AND ON THE TABLE
 
    // method to create a card
    // n = card number
    createCard(n) {
        let coordinates = this.setHandCoordinates(this.handGroup.countActive(), gameOptions.startingCards);
        let card = this.add.sprite(coordinates.x, coordinates.y, n).on("pointerdown",() => {
            if(this.boardGroup.contains(card) & card.activate) {
                console.log("카드 선택 취소");
                card.alpha = 1;
                card.activate = false;
            }
            else if(this.boardGroup.contains(card) & !card.activate) {
                console.log("카드 선택");
                card.alpha = 0.5;
                card.activate = true;
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
 
    // method to set card in hand coordinates
    // n = card card number
    // totalCards = amount of cards on the board
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
 
    // method to arrange cards in hand
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

    createBlank(i, j) {
        let blank = this.add.sprite(300 + 60 * i, 75 + 60 * j, "blank").setInteractive();
        blank.input.dropZone = true;
        blank.i = i;
        blank.j = j;
        blank.displayWidth = 50;
        blank.displayHeight = 50;
        this.zoneGroup.add(blank);
    }

    setBlank(blank, card) {
        blank.input.dropZone = false;
        this.waitBlankGroup.add(blank);
    }
}