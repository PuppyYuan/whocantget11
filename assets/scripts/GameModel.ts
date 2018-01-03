import CellModel from "./CellModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameModel extends cc.Component {

    @property
    _cells = [];

    constructor() {
        super();

        this._cells = [];
        for (let i = 1; i <= 5; i++) {
            this._cells[i] = [];
            for (let j = 1; j <= 5; j++) {
                this._cells[i][j] = this.getRandomNum(MAX_NUM);
            }
        }
    }

    getRandomNum(maxNum) {
        return Math.floor(cc.random0To1() * maxNum + 1);
    }

    getCells() {
        return this._cells;
    }
}