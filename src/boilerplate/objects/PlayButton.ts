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
        this.srtButton = <Phaser.GameObjects.Sprite>ArrayHelper.getElementByType("Sprite", this.playButton.getChildren());

        let _self = this;
        // this.setDefault();

        this.srtButton.setInteractive()
            .on("pointerover", (event) => {
                _self.eventHandler(PlayButtonStruct.POINTER_OVER)
                //todo sfx
                // this.game.instance.sfx.btnOver.play(); sound
            })
            .on("pointerout", () => {
                _self.eventHandler(PlayButtonStruct.POINTER_OUT)
                //todo sfx
                // this.game.instance.sfx.btnOver.play(); sound
            })
            .on("pointerdown", () => {
                _self.eventHandler(PlayButtonStruct.POINTER_DOWN)
                //todo sfx
                // this.game.instance.sfx.btnOver.play(); sound
            })
            .on("pointerup", () => {
                _self.eventHandler(PlayButtonStruct.POINTER_UP)
                this.scene.scene.start("GameScene");
                //todo sfx
                // this.game.instance.sfx.btnOver.play(); sound
            });
    }

    /*private setDefault(): void {
        let group = this.playButton.getChildren();
        if (typeof group == 'undefined') return;
        let length = group.length;
        for (let i = 0; i < length; i++) {
            if (ArrayHelper.inArray(group[i].type, ["Sprite", "BitmapText", "Text"])) {
                let item = <Phaser.GameObjects.Sprite>group[i];
                group[i].setData('positionY', item.y);
            }
        }
    }*/

    private eventHandler(type: PlayButtonStruct) {
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
            //todo нужно пересмотреть использование объекта
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
        let textElement = <Phaser.GameObjects.BitmapText>ArrayHelper.getElementByType("BitmapText", this.playButton.getChildren());
        textElement.setTint(type == PlayButtonStruct.POINTER_DOWN ? this.activeTextColor : this.defaultTextColor);
    }
}