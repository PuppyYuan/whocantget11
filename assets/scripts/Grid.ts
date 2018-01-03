import CellModel from "./CellModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Grid extends cc.Component {

    @property
    _controller = null;

    @property
    _cellViews = [];

    @property(cc.Prefab)
    cellPrefab: cc.Prefab = null;

    onLoad() {
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this._onMouseDown, this);
    }

    _onMouseDown(event: cc.Event.EventMouse) {
        let pos = event.getLocation();

        let cellPos = this.convertPos2Cell(pos);
        if(cellPos){
            let cellView = this._cellViews[cellPos.y][cellPos.x];
            let cellModel = cellView.getComponent(CellModel);
            cellModel.playAnimation();
        }
    }

    convertPos2Cell(pos: cc.Vec2) {

        pos = this.node.convertToNodeSpaceAR(pos);

        if (pos.x < 0 || pos.x > GRID_WIDTH || pos.y < 0 || pos.y > GRID_HEIGHT) {
            return false;
        }

        let x = Math.floor(pos.x / (CELL_WIDTH + 10)) + 1;
        let y = Math.floor(pos.y / (CELL_HEIGHT + 10)) + 1;

        return cc.p(x, y);
    }

    setController(controller) {
        this._controller = controller;
    }

    initWithCellModels(cellModels) {

        this._cellViews = [];
        for (let i = 1; i <= 5; i++) {
            this._cellViews[i] = [];
            for (let j = 1; j <= 5; j++) {

                let cell = cc.instantiate(this.cellPrefab);
                cell.x = CELL_WIDTH * (j - 0.5) + 10 * (j - 1);
                cell.y = CELL_HEIGHT * (i - 0.5) + 10 * (i - 1);

                let cellModel = cell.getComponent(CellModel);
                cellModel.num = cellModels[i][j];

                cell.parent = this.node;

                this._cellViews[i][j] = cell;
            }
        }
    }

}