import {ArrayHelper} from "../helpers/ArrayHelper";
import {PlayButtonStruct} from "./PlayButtonStruct";

export class PlayButton extends Phaser.GameObjects.Group {
    private playButton: Phaser.GameObjects.Group;
    private srtButton: Phaser.GameObjects.Sprite;
    private moveOffset: number = 2;
    private defaultTextColor: number = 0xffffff;
    private activeTextColor: number = 0xffef94;

    constructor(params) {
        super(params);

        this.scene = params.scene;

        let textTypes = ["Text", "BitmapText"];

        this.playButton = this.scene.add.group({
            active: true,
            name: "playButton",
            createCallback: function (object) {
                // отлавливает элементы типа текст и исправляем их позиционироваие
                object.setName(this.name + object.type);
                if (ArrayHelper.inArray(object.type, textTypes)) {
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
        //Get first sprite of group
        let elementId: number|boolean = ArrayHelper.getElement("Sprite", this.playButton.getChildren());
        if (elementId === false) {
            return;
        }
        this.srtButton = <Phaser.GameObjects.Sprite>this.playButton.getChildren()[<number>elementId];

        //handle events
        this.srtButton.setInteractive();

        let _self = this;
        this.srtButton.on("pointerover", () => {
            _self.moveButton(PlayButtonStruct.POINTER_OVER)
            //todo sfx
            // this.game.instance.sfx.btnOver.play(); sound
        }, this);
        this.srtButton.on("pointerout", function() {
            _self.moveButton(PlayButtonStruct.POINTER_OUT)
            //todo sfx
            // this.game.instance.sfx.btnOver.play(); sound
        }, this);
        this.srtButton.on("pointerdown", function() {
            _self.moveButton(PlayButtonStruct.POINTER_DOWN)
            //todo sfx
            // this.game.instance.sfx.btnOver.play(); sound
        }, this);
        this.srtButton.on("pointerup", function() {
            _self.moveButton(PlayButtonStruct.POINTER_UP)
            //todo sfx
            // this.game.instance.sfx.btnOver.play(); sound
        }, this);
    }

    private moveButton(type: PlayButtonStruct) {
        let direction: number = 0;
        switch (type) {
            case PlayButtonStruct.POINTER_OVER: {
                direction = direction + this.moveOffset;
                break;
            }
            case PlayButtonStruct.POINTER_OUT: {
                direction = direction - this.moveOffset;
                break;
            }
            default: {
                break;
            }
        }
        if (direction) {
            let elements: Phaser.GameObjects.GameObject[] = this.playButton.getChildren();
            if (typeof elements == 'undefined' || typeof elements.length == 'undefined') return;
            let length: number = elements.length;

            let element: Phaser.GameObjects.Sprite;
            for (let i: number = 0; i < length; i++) {
                element = <Phaser.GameObjects.Sprite>elements[i];
                element.y = element.y + direction;
            }
        }

        //Get text type element in group
        let elementId: number|boolean = ArrayHelper.getElement("BitmapText", this.playButton.getChildren());
        if (elementId !== false) {
            let textElement = <Phaser.GameObjects.BitmapText>this.playButton.getChildren()[<number>elementId];
            textElement.setTint(type == PlayButtonStruct.POINTER_DOWN ? this.activeTextColor : this.defaultTextColor);
        }
    }
}