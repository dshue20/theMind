import Card from '../helpers/card';
import Zone from '../helpers/zone';
import io from 'socket.io-client';
import Dealer from '../helpers/dealer';

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        });
    }

    preload() {
        for (let i=1; i <= 100; i++){
            this.load.image(i.toString(), 'src/assets/cards/' + i.toString() + '.png');
        };
        this.load.image('back', 'src/assets/cards/back.png');
        this.load.image('cyanCardFront', 'src/assets/CyanCardFront.png');
        this.load.image('cyanCardBack', 'src/assets/CyanCardBack.png');
        this.load.image('magentaCardFront', 'src/assets/MagentaCardFront.png');
        this.load.image('magentaCardBack', 'src/assets/MagentaCardBack.png');
    }

    create() {
        let self = this;
        this.isPlayerA = false;
        this.opponentCards = [];
        this.level = 1;
        this.numPlayers = 0;
        this.gameStarted = false;
        this.dealer = new Dealer(this);

        this.socket = io('http://localhost:3000');

        this.dealText = this.add.text(350, 365, ['START GAME']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();

        this.socket.on('connect', function () {
            if (self.numPlayers < 4 && !self.gameStarted){
                console.log('Connected!', self.socket.id);
                const name = prompt('Please enter your name: ');
                self.add.text(100, 700, [name + '(You)']).setFontSize(24).setFontFamily('Trebuchet MS').setColor('white');
                self.socket.emit('checkName', name);
                self.socket.emit('drawNames', name);
            };
        });

        this.socket.on('isPlayerA', function () {
        	self.isPlayerA = true;
        });

        this.socket.on('dealCards', function () {
            self.dealer.dealCards(self.level, self.numPlayers);
            self.dealText.destroy();
        });

        this.socket.on('drawNames', function (names) {
            names = names.filter(hash => hash['id'] !== self.socket.id).map(hash => hash['name']);
            console.log('names', names);
            self.numPlayers = names.length + 1;
            if (names[0]) self.add.text(1200, 80, [names[0]]).setFontSize(24).setFontFamily('Trebuchet MS').setColor('white');
            if (names[1]){
                const leftPlayer = self.add.text(300, 80, [names[1]]).setFontSize(24).setFontFamily('Trebuchet MS').setColor('white');
                leftPlayer.angle += 90;
            };
            if (names[2]){
                const rightPlayer = self.add.text(1050, 600, [names[2]]).setFontSize(24).setFontFamily('Trebuchet MS').setColor('white');
                rightPlayer.angle += 270;
            };
        });

        this.socket.on('cardPlayed', function (gameObject, isPlayerA) {
            if (isPlayerA !== self.isPlayerA) {
                let sprite = gameObject.textureKey;
                self.opponentCards.shift().destroy();
                self.dropZone.data.values.cards++;
                let card = new Card(self);
                card.render(((self.dropZone.x - 350) + (self.dropZone.data.values.cards * 50)), (self.dropZone.y), sprite).disableInteractive();
            }
        });

        this.zone = new Zone(this);
        this.dropZone = this.zone.renderZone();
        this.outline = this.zone.renderOutline(this.dropZone);

		this.dealText.on('pointerdown', function () {
            self.socket.emit("dealCards");
        });

        this.dealText.on('pointerover', function () {
            self.dealText.setColor('#ff69b4');
        });

        this.dealText.on('pointerout', function () {
            self.dealText.setColor('#00ffff');
        });

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragstart', function (pointer, gameObject) {
            gameObject.setTint(0xff69b4);
            self.children.bringToTop(gameObject);
        });

        this.input.on('dragend', function (pointer, gameObject, dropped) {
            gameObject.setTint();
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        });

        this.input.on('drop', function (pointer, gameObject, dropZone) {
            dropZone.data.values.cards++;
            gameObject.x = (dropZone.x - 350) + (dropZone.data.values.cards * 50);
            gameObject.y = dropZone.y;
            gameObject.disableInteractive();
            self.socket.emit('cardPlayed', gameObject, self.isPlayerA);
        });
    }
    
    update() {
    
    }
}