import CellModel from "./CellModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Grid extends cc.Component {

    @property
    _cells = [];

    @property
    _max_num = 4;

    @property
    _count = 0;

    @property(cc.Prefab)
    cellPrefab: cc.Prefab = null;

    onLoad() {

        this.init();
        this.node.on(cc.Node.EventType.TOUCH_END, this._onMouseDown, this);
    }

    init() {
        this._cells = [];
        for (let i = 0; i < 5; i++) {
            this._cells[i] = [];
            for (let j = 0; j < 5; j++) {
                let num = this.getRandomNum(this._max_num);

                let cell = cc.instantiate(this.cellPrefab);
                cell.x = (CELL_WIDTH + 20) * (j + 0.5);
                cell.y = (CELL_HEIGHT + 20) * (i + 0.5);

                cell.parent = this.node;

                let cellModel = cell.getComponent(CellModel);
                cellModel.num = num;

                this._cells[i][j] = cell;
            }
        }
    }

    getRandomNum(maxNum) {
        return Math.floor(cc.random0To1() * (maxNum - 1) + 1);
    }

    _onMouseDown(event: cc.Event.EventTouch) {
        let pos = event.getLocation();

        let cellPos = this.convertPos2Cell(pos);
        if (cellPos) {
            this.selectCell(cellPos);
        }
    }

    resetQueue() {
        let queue = [];
        for (let i = 0; i < 5; i++) {
            queue[i] = [];
            for (let j = 0; j < 5; j++) {
                queue[i][j] = 0;
            }
        }
        return queue;
    }

    selectCell(cellPos): any {

        let cell = this._cells[cellPos.y][cellPos.x];
        let num = cell.getComponent(CellModel).num;

        let queue = this.resetQueue();

        this._count = 0;
        this.checkPoint(cellPos.x, cellPos.y, num, queue);

        if (this._count > 1) {
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 5; j++) {
                    if (queue[i][j] == 1) {
                        this._cells[i][j].getComponent(CellModel).moveAndScale(cellPos, 0.3);
                        this._cells[i][j] = null;
                    }
                }
            }

            this.createNewCell(cellPos, ++num);
            this.down();
        } else {
            let cellView = this._cells[cellPos.y][cellPos.x];
            let cellModel = cellView.getComponent(CellModel);
            cellModel.shake();
        }
    }

    createNewCell(pos: cc.Vec2, num: number) {
        this._max_num = num > this._max_num ? num : this._max_num;

        let cell = cc.instantiate(this.cellPrefab);

        cell.x = (CELL_WIDTH + 20) * (pos.x + 0.5);
        cell.y = (CELL_HEIGHT + 20) * (pos.y + 0.5);
        cell.scaleX = 0;
        cell.scaleY = 0;

        cell.parent = this.node;

        let cellModel = cell.getComponent(CellModel);
        cellModel.num = num;

        cellModel.scaleTo(0.3);

        this._cells[pos.y][pos.x] = cell;
    }

    down() {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (this._cells[i][j] == null) {
                    let curRow = i;
                    for (let k = curRow; k < 5; k++) {
                        if (this._cells[k][j]) {

                            this._cells[curRow][j] = this._cells[k][j];
                            this._cells[k][j] = null;
                            this._cells[curRow][j].getComponent(CellModel).moveTo(cc.p(j, curRow), 0.3);
                            curRow++;
                        }
                    }

                    let count = 1;
                    for (let k = curRow; k < 5; k++) {
                        let num = this.getRandomNum(this._max_num);

                        let cell = cc.instantiate(this.cellPrefab);
                        cell.x = (CELL_WIDTH + 20) * (j + 0.5);
                        cell.y = (CELL_HEIGHT + 20) * (i + 5.5);

                        cell.parent = this.node;

                        let cellModel = cell.getComponent(CellModel);
                        cellModel.num = num;
                        cellModel.moveTo(cc.p(j, k), 0.3);

                        this._cells[k][j] = cell;
                    }
                }
            }
        }
    }


    convertPos2Cell(pos: cc.Vec2) {

        pos = this.node.convertToNodeSpaceAR(pos);

        if (pos.x < 0 || pos.x > GRID_WIDTH || pos.y < 0 || pos.y > GRID_HEIGHT) {
            return false;
        }

        let x = Math.floor(pos.x / (CELL_WIDTH + 20));
        let y = Math.floor(pos.y / (CELL_HEIGHT + 20));

        return cc.p(x, y);
    }

    isBlock(x: number, y: number, queue: Array<number>): boolean {

        if (x >= 0 && x < 5 && y >= 0 && y < 5 && queue[y][x] == 0) {
            return false;
        }
        return true;
    }

    checkPoint(x: number, y: number, num: number, queue: Array<number>) {

        if (this.isBlock(x, y, queue) || this._cells[y][x].getComponent(CellModel).num != num) {
            return;
        }

        queue[y][x] = 1;
        this._count++;
        this.checkPoint(x, y + 1, num, queue);
        this.checkPoint(x, y - 1, num, queue);
        this.checkPoint(x + 1, y, num, queue);
        this.checkPoint(x - 1, y, num, queue);
    }

}