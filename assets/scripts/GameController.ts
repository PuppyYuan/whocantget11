import Grid from "./Grid";
import GameModel from "./GameModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameController extends cc.Component {

    @property(Grid)
    grid: Grid = null;

    @property
    _gameModel = null;

    onLoad() {
        // this._gameModel = new GameModel();

        // this.grid.setController(this);
        // this.grid.initWithCellModels(this._gameModel.getCells());

    }

    selectCell(cellPos: cc.Vec2): any {
        return this._gameModel.selectCell(cellPos);
    }

    // update (dt) {},
}
