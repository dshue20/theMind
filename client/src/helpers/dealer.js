import Card from './card';

export default class Dealer {
    constructor(scene) {
        this.dealCards = (whichPlayer, cards) => {
            const level = cards[0].length;
            let toDraw = cards.splice(whichPlayer - 1, 1);
            for (let i=0; i < level; i++){
                let val = toDraw[i];
                let playerCard = new Card(scene, val);
                playerCard.render(700 + i*50, 650, val.toString());
            };

            if (cards.length > 0){
                for (let i=0; i < level; i++){
                    let opponentCard = new Card(scene);
                    scene.opponentCards.push(opponentCard.render(700 + i*50, 125, 'back').disableInteractive());
                };
            };

            if (cards.length > 0){
                for (let i=0; i < level; i++){
                    let leftCard = new Card(scene);
                    leftCard.angle += 90;
                    scene.opponentCards.push(leftCard.render(150, 390, 'back', 90).disableInteractive());
                };
            };

            if (cards.length > 0){
                for (let i=0; i < level; i++){
                    let rightCard = new Card(scene);
                    rightCard.angle += 270;
                    scene.opponentCards.push(rightCard.render(1200, 390, 'back', 270).disableInteractive());
                }
            };
        }
    }
}