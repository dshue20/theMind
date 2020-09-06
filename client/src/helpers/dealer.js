import Card from './card';

export default class Dealer {
    constructor(scene) {
        this.dealCards = (level, numPlayers) => {
            scene.gameStarted = true;
            let nums = [];
            for (let i=1; i <= 100; i++){
                nums.push(i);
            };

            let toDeal = [];
            for (let i=0; i < level * numPlayers; i++){
                toDeal.push(nums.splice(Math.floor(Math.random() * nums.length), 1)[0])
            };

            for (let i = 0; i < level; i++) {
                let playerCard = new Card(scene);
                playerCard.render(700, 650, toDeal.shift().toString());

                if (numPlayers > 1){
                    let opponentCard = new Card(scene);
                    scene.opponentCards.push(opponentCard.render(700, 125, 'back').disableInteractive());
                };

                if (numPlayers > 2){
                    let leftCard = new Card(scene);
                    scene.opponentCards.push(leftCard.render(150, 390, 'back', 90).disableInteractive());
                };

                if (numPlayers > 3){
                    let rightCard = new Card(scene);
                    rightCard.angle += 270;
                    scene.opponentCards.push(rightCard.render(1200, 390, 'back', 270).disableInteractive());
                };
            }
        }
    }
}