import {ArrayHelper} from "../helpers/ArrayHelper";
import {PlayButton} from "../objects/PlayButton";

export class MainMenuScene extends Phaser.Scene {
    private titleBitmapText: Phaser.GameObjects.BitmapText;
    private title: Phaser.GameObjects.Text;
    private btnPlay: Phaser.GameObjects.Sprite;

    constructor() {
        super({
            key: "MainMenuScene"
        });
    }

    create(): void {
        this.titleBitmapText = this.add.bitmapText(
            0,
            200,
            "font",
            this.game.config.gameTitle.toUpperCase(),
            30
        );

        this.titleBitmapText.x = this.getCenterXPositionOfBitmapText(
            this.titleBitmapText.width
        );


        /*this.game.instance.sfx = {
            mainTheme: this.sound.add("sndMainTheme"),
            combatTheme: this.sound.add("sndGameplayTheme"),
            btnOver: this.sound.add("sndBtnOver"),
            btnDown: this.sound.add("sndBtnDown")
        };*/
        //start main theme sound
        // todo вынести аудиоменеджер в отдельный класс
        // // this.game.instance.sfx.mainTheme.play();
        // // this.game.instance.sfx.combatTheme.play();

        /*
         * Play Button Group
         */
        //todo вынести группу в класс
        let playButton = new PlayButton(this.scene);

        /*this.btnPlay = this.add.sprite(
            this.cameras.main.width * 0.5,
            this.cameras.main.height * 0.5,
            "btnPlay"
        );
        this.btnPlay.setInteractive();
        this.btnPlay.on("pointerover", function() {
            this.btnPlay.setTexture("btnPlayHover");
            // this.game.instance.sfx.btnOver.play(); sound
        }, this);
        this.btnPlay.on("pointerout", function() {
            this.setTexture("btnPlay");
        });
        this.btnPlay.on("pointerdown", function() {
            this.btnPlay.setTexture("btnPlayActive");
            // this.game.instance.sfx.btnDown.play(); sound
        }, this);
        this.btnPlay.on("pointerup", function() {
            this.btnPlay.setTexture("btnPlay");
            // console.log('start scene: CombatScene');
            // this.scene.start("CombatScene"); next scene
        }, this);*/

        let gameTitle = this.game.config.gameTitle + " | v" + this.game.config.gameVersion + " | " + this.game.config.gameURL;
        this.title = this.add.text(
            5,
            5,
            gameTitle.toUpperCase(),
            {
                fontFamily: 'monospace',
                fontSize: 10,
                fontStyle: 'bold',
                color: '#ffffff',
                align: 'left'
            });

    }

    update(): void {
        //
    }

    private getCenterXPositionOfBitmapText(width: number): number {
        return this.sys.canvas.width / 2 - width / 2;
    }
}
