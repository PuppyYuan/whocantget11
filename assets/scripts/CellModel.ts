const { ccclass, property } = cc._decorator;

@ccclass
export default class CellModel extends cc.Component {

    @property(cc.Label)
    numLabel: cc.Label = null;

    static _bgColors = [new cc.Color(255, 255, 255),
        new cc.Color(236, 101, 116),
        new cc.Color(245, 187, 79),
        new cc.Color(85, 173, 215),
        new cc.Color(176, 118, 239),
        new cc.Color(172, 196, 69),
        new cc.Color(81, 174, 164),
        new cc.Color(32, 81, 150)
    ]

    @property
    _num: number = 1;

    set num(value: number) {
        this._num = value;

        this.numLabel.string = value + '';
        this.node.color = CellModel._bgColors[value];
    }

    get num(): number {
        return this._num;
    }

    playAnimation(){
        // 放大缩小左右闪动
        let seq = cc.sequence(
            cc.scaleTo(0.1, 1.2, 1.2),
            cc.scaleTo(0.1, 1, 1),
            cc.moveBy(0.05, -10, 0),
            cc.moveBy(0.05, 10, 0),
            cc.moveBy(0.05, 10, 0),
            cc.moveBy(0.05, -10, 0)
        );

        this.node.runAction(seq);
    }

}