import {ArrayHelper} from "../helpers/ArrayHelper";

export class PlayButton extends Phaser.GameObjects.Group {
    private static textTypes = ["Text", "BitmapText"];
    private playButton: Phaser.GameObjects.Group;

    constructor(params) {
        super(params);

        this.scene = params.scene;

        this.playButton = this.scene.add.group({
            active: true,
            name: "playButton",
            createCallback: function (object) {
                // отлавливает элементы типа текст и исправляем их позиционироваие
                object.setName(this.name + object.type);
                if (ArrayHelper.inArray(object.type, PlayButton.textTypes)) {
                    let element: Phaser.GameObjects.Text = <Phaser.GameObjects.Text>object;
                    element.x = element.x - element.width / 2;
                    element.y = element.y - element.height / 1.5;
                }
            }
        });

        this.initElements();
        this.handleHover();
    }

    private initElements(): void {
        this.playButton.addMultiple([
            this.scene.add.sprite(
                this.scene.cameras.main.width * 0.5,
                this.scene.cameras.main.height * 0.5,
                "btnPlay"
            ),
            this.scene.add.bitmapText(
                this.scene.cameras.main.width * 0.5,
                this.scene.cameras.main.height * 0.5,
                "font",
                "START",
                30,
                Phaser.GameObjects.BitmapText.ALIGN_CENTER
            )
        ]);
    }

    private handleHover(): void {
        let elementId = ArrayHelper.getElement("Sprite", this.playButton.getChildren());
        console.log(elementId);
    }
}