export class Game2048{
    protected rows: number;
    protected columns: number;
    protected maxValue: number;
    protected gameArray = [];
    public direction = {
        LEFT: {},
        RIGHT: {},
        UP: {},
        DOWN: {},
    };

    constructor(obj){
        if(obj == undefined){
            obj = {}
        }
        this.rows = (obj.rows != undefined) ? obj.rows : 4;
        this.columns = (obj.columns != undefined) ? obj.columns : 4;
        this.maxValue = (obj.maxValue != undefined) ? obj.maxValue : 11;
        this.direction.LEFT = {
            deltaRow: 0,
            deltaColumn: -1,
            firstRow: 0,
            lastRow: this.rows,
            firstColumn: 1,
            lastColumn: this.columns
        };
        this.direction.RIGHT = {
            deltaRow: 0,
            deltaColumn: 1,
            firstRow: 0,
            lastRow: this.rows,
            firstColumn: 0,
            lastColumn: this.columns - 1
        }
        this.direction.UP = {
            deltaRow: -1,
            deltaColumn: 0,
            firstRow: 1,
            lastRow: this.rows,
            firstColumn: 0,
            lastColumn: this.columns
        }
        this.direction.DOWN = {
            deltaRow: 1,
            deltaColumn: 0,
            firstRow: 0,
            lastRow: this.rows - 1,
            firstColumn: 0,
            lastColumn: this.columns
        }
    }
    getRows(){
        return this.rows;
    }
    getColumns(){
        return this.columns;
    }
    getMaxValue(){
        return this.maxValue;
    }
    generateField(){
        this.gameArray = [];
        for(let i = 0; i < this.getRows(); i++){
            this.gameArray[i] = [];
            for(let j = 0; j < this.getColumns(); j++){
                this.gameArray[i][j] = {
                    tileValue: 0,
                    customData: null,
                    upgraded: false
                }
            }
        }
    }
    getTileValue(row, column){
        return this.gameArray[row][column].tileValue
    }
    setTileValue(row, column, value){
        this.gameArray[row][column].tileValue = value;
    }
    getCustomData(row, column){
        return this.gameArray[row][column].customData;
    }
    setCustomData(row, column, customData){
        this.gameArray[row][column].customData = customData;
    }
    setUpgradedTile(row, column, upgraded){
        this.gameArray[row][column].upgraded = upgraded
    }
    isEmptyTile(row, column){
        return this.getTileValue(row, column) == 0;
    }
    isUpgradedTile(row, column){
        return this.gameArray[row][column].upgraded;
    }
    isCappedTile(row, column){
        return this.getTileValue(row, column) == this.getMaxValue();
    }
    resetUpgradedTiles(){
        for(let i = 0; i < this.getRows(); i++){
            for(let j = 0; j < this.getColumns(); j++){
                this.setUpgradedTile(i, j, false);
            }
        }
    }
    upgradeTile(row, column){
        this.setTileValue(row, column, this.getTileValue(row, column) + 1);
        this.setUpgradedTile(row, column, true);
    }
    isInsideBoard(row, column){
        return row >= 0 && column >= 0 && row < this.getRows() && column < this.getColumns();
    }
    isLegalMove(row, column, value){
        return this.isInsideBoard(row, column) && !this.isCappedTile(row, column) && (this.isEmptyTile(row, column) || (this.getTileValue(row, column) == value) && !this.isUpgradedTile(row, column))
    }
    addTile(){
        let emptyTiles = [];
        for(let i = 0; i < this.getRows(); i++){
            for(let j = 0; j < this.getColumns(); j++){
                if(this.isEmptyTile(i, j)){
                    emptyTiles.push({
                        row: i,
                        column: j
                    })
                }
            }
        }
        if(emptyTiles.length > 0){
            let chosenTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            this.setTileValue(chosenTile.row, chosenTile.column, 1);
            return chosenTile;
        }
    }
    moveBoard(direction){
        let movements = [];
        for(let i = direction.firstRow; i < direction.lastRow; i ++){
            for(let j = direction.firstColumn; j < direction.lastColumn; j ++){
                let currentRow = direction.deltaRow == 1 ? (direction.lastRow - 1) - i : i;
                let currentColumn = direction.deltaColumn == 1 ? (direction.lastColumn - 1) - j : j;
                if(!this.isEmptyTile(currentRow, currentColumn)){
                    let tileValue = this.getTileValue(currentRow, currentColumn);
                    let newRow = currentRow;
                    var newColumn = currentColumn;
                    while(this.isLegalMove(newRow + direction.deltaRow, newColumn + direction.deltaColumn, tileValue)){
                        newRow += direction.deltaRow;
                        newColumn += direction.deltaColumn;
                    }
                    if(newRow != currentRow || newColumn != currentColumn){
                        this.setTileValue(currentRow, currentColumn, 0);
                        if(this.getTileValue(newRow, newColumn) == tileValue){
                            this.upgradeTile(newRow, newColumn);
                        }
                        else{
                            this.setTileValue(newRow, newColumn, tileValue)
                        }
                        movements.push({
                            from: {
                                row: currentRow,
                                column: currentColumn,
                                value: tileValue
                            },
                            to: {
                                row: newRow,
                                column: newColumn,
                                value: this.getTileValue(newRow, newColumn)
                            }
                        })
                    }
                }
            }
        }
        this.resetUpgradedTiles();
        return movements;
    }
}