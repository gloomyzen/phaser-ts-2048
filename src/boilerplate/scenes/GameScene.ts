import {Game2048} from "../objects/Game2048";

export class GameScene extends Phaser.Scene {
    protected game2048: Game2048;
    protected score: 0;
    protected gameOptions;
    protected canMove: boolean;
    protected movingTiles;
    protected moveSound;
    protected growSound;
    protected scoreText;
    protected bestScore;
    protected bestScoreText;

    constructor() {
        super({
            key: "GameScene"
        });
    }

    create(){
        this.gameOptions = this.game.instance.config;
        this.game2048 = new Game2048({
            rows: this.gameOptions.boardSize.rows,
            columns: this.gameOptions.boardSize.cols,
            maxValue: 12
        });
        this.score = 0;
        let restartXY = this.getTilePosition(-0.8, this.gameOptions.boardSize.cols - 1);
        let restartButton = this.add.sprite(restartXY.x, restartXY.y, "restart");
        restartButton.setInteractive();
        restartButton.on("pointerdown", function(){
            this.scene.start("GameScene");
        }, this);
        let fullScreenButton = this.add.sprite(restartButton.x, restartButton.y - 120, "fullscreen");
        fullScreenButton.setInteractive();
        fullScreenButton.on("pointerup", function(){
            if(!this.scale.isFullscreen){
                this.scale.startFullscreen();
            }
            else{
                this.scale.stopFullscreen();
            }
        }, this);

        var scoreXY = this.getTilePosition(-0.8, 1);
        this.add.image(scoreXY.x, scoreXY.y, "scorepanel");
        this.add.image(scoreXY.x, scoreXY.y - 70, "scorelabels");
        var textXY = this.getTilePosition(-0.92, -0.4);
        this.scoreText = this.add.bitmapText(textXY.x, textXY.y, "font", "0");
        textXY = this.getTilePosition(-0.92, 1.1);
        this.bestScore = null;//localStorage.getItem(this.gameOptions.localStorageName);
        if(this.bestScore == null){
            this.bestScore = 0;
        }
        this.bestScoreText = this.add.bitmapText(textXY.x, textXY.y, "font", this.bestScore.toString());


        this.canMove = false;
        this.game2048.generateField();
        for(let i = 0; i < this.game2048.getRows(); i ++){
            for(let j = 0; j < this.game2048.getColumns(); j ++){
                let tilePosition = this.getTilePosition(i, j);
                this.add.image(tilePosition.x, tilePosition.y, "emptyTile");
                let tile = this.add.sprite(tilePosition.x, tilePosition.y, "tiles", 0);
                tile.visible = false;
                this.game2048.setCustomData(i, j, tile);
            }
        }
        this.addTile();
        this.addTile();
        this.input.keyboard.on("keydown", this.handleKey, this);
        this.input.on("pointerup", this.handleSwipe, this);
        // this.moveSound = this.sound.add("move");
        // this.growSound = this.sound.add("grow");
    }
    addTile(){
        let addedTile = this.game2048.addTile();
        let tileSprite = this.game2048.getCustomData(addedTile.row, addedTile.column);
        tileSprite.visible = true;
        tileSprite.setFrame(0);
        tileSprite.alpha = 0;
        this.tweens.add({
            targets: tileSprite,
            alpha: 1,
            duration: this.gameOptions.tweenSpeed,
            callbackScope: this,
            onComplete: function(){
                this.canMove = true;
            }
        });
    }
    getTilePosition(row, col){
        var posX = this.gameOptions.tileSpacing * (col + 1) + this.gameOptions.tileSize * (col + 0.5);
        var posY = this.gameOptions.tileSpacing * (row + 1) + this.gameOptions.tileSize * (row + 0.5);
        var boardHeight = this.game2048.getRows() * this.gameOptions.tileSize;
        boardHeight += (this.game2048.getRows() + 1) * this.gameOptions.tileSpacing;
        var offsetY = (this.cameras.main.height - boardHeight) / 2; //todo
        posY += offsetY;
        return new Phaser.Geom.Point(posX, posY);
    }
    handleKey(e){
        if(this.canMove){
            switch(e.code){
                case "KeyA":
                case "ArrowLeft":
                    this.makeMove(this.game2048.direction.LEFT);
                    break;
                case "KeyD":
                case "ArrowRight":
                    this.makeMove(this.game2048.direction.RIGHT);
                    break;
                case "KeyW":
                case "ArrowUp":
                    this.makeMove(this.game2048.direction.UP);
                    break;
                case "KeyS":
                case "ArrowDown":
                    this.makeMove(this.game2048.direction.DOWN);
                    break;
            }
        }
    }
    handleSwipe(e){
        if(this.canMove){
            let swipeTime = e.upTime - e.downTime;
            let fastEnough = swipeTime < this.gameOptions.swipeMaxTime;
            let swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
            let swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe);
            let longEnough = swipeMagnitude > this.gameOptions.swipeMinDistance;
            if(longEnough && fastEnough){
                Phaser.Geom.Point.SetMagnitude(swipe, 1);
                if(swipe.x > this.gameOptions.swipeMinNormal){
                    this.makeMove(this.game2048.direction.RIGHT);
                }
                if(swipe.x < -this.gameOptions.swipeMinNormal){
                    this.makeMove(this.game2048.direction.LEFT);
                }
                if(swipe.y > this.gameOptions.swipeMinNormal){
                    this.makeMove(this.game2048.direction.DOWN);
                }
                if(swipe.y < -this.gameOptions.swipeMinNormal){
                    this.makeMove(this.game2048.direction.UP);
                }
            }
        }
    }
    makeMove(d){
        let movements = this.game2048.moveBoard(d);
        if(movements.length > 0){
            this.canMove = false;
            this.movingTiles = 0;
            // this.moveSound.play();
            movements.forEach(function(movement){
                var newPos = this.getTilePosition(movement.to.row, movement.to.column);
                this.moveTile(this.game2048.getCustomData(movement.from.row, movement.from.column), newPos, movement.from.value != movement.to.value);
                if(movement.from.value != movement.to.value){
                    this.score += Math.pow(2, movement.to.value);
                }
            }.bind(this))
        }
    }
    moveTile(tile, point, upgrade){
        this.movingTiles ++;
        tile.depth = this.movingTiles;
        var distance = Math.abs(tile.x - point.x) + Math.abs(tile.y - point.y);
        this.tweens.add({
            targets: [tile],
            x: point.x,
            y: point.y,
            duration: this.gameOptions.tweenSpeed * distance / this.gameOptions.tileSize,
            callbackScope: this,
            onComplete: function(){
                if(upgrade){
                    this.upgradeTile(tile);
                }
                else{
                    this.endTween(tile);
                }
            }
        })
    }
    upgradeTile(tile){
        // this.growSound.play();
        tile.setFrame(tile.frame.name + 1);
        this.tweens.add({
            targets: [tile],
            scaleX: 1.1,
            scaleY: 1.1,
            duration: this.gameOptions.tweenSpeed,
            yoyo: true,
            repeat: 1,
            callbackScope: this,
            onComplete: function(){
                this.endTween(tile);
            }
        })
    }
    endTween(tile){
        this.movingTiles --;
        tile.depth = 0;
        if(this.movingTiles == 0){
            this.refreshBoard();
        }
    }
    refreshBoard(){
        this.scoreText.text = this.score.toString();
        if(this.score > this.bestScore){
            this.bestScore = this.score;
            // localStorage.setItem(this.gameOptions.localStorageName, this.bestScore);
            this.bestScoreText.text = this.bestScore.toString();
        }
        for(let i = 0; i < this.game2048.getRows(); i++){
            for(let j = 0; j < this.game2048.getColumns(); j++){
                let spritePosition = this.getTilePosition(i, j);
                this.game2048.getCustomData(i, j).x = spritePosition.x;
                this.game2048.getCustomData(i, j).y = spritePosition.y;
                let tileValue = this.game2048.getTileValue(i, j);
                if(tileValue > 0){
                    this.game2048.getCustomData(i, j).visible = true;
                    this.game2048.getCustomData(i, j).setFrame(tileValue - 1);
                }
                else{
                    this.game2048.getCustomData(i, j).visible = false;
                }
            }
        }
        this.addTile();
    }
}