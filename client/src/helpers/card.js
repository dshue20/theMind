export default class Card {
    constructor(scene) {
        this.render = (x, y, sprite, angle=0) => {
            let card = scene.add.image(x, y, sprite).setScale(0.4, 0.4).setInteractive();
            if (angle) card.angle += angle;
            scene.input.setDraggable(card);
            return card;
        }
    }
}