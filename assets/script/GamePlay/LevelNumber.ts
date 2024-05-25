import { _decorator, Component, Label, tween, UITransform, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("LevelNumber")
export class LevelNumber extends Component {
  @property({ type: Label })
  num: Label = null!;

  start() {
    // this.updateLevelNumber(0);
  }

  updateLevelNumber(levelNum: number) {
    console.log("UPDATE LEVEL NUM: ", levelNum);
    let nodeSize = this.node.getComponent(UITransform).getBoundingBox();
    let parentSize = this.node.parent
      .getComponent(UITransform)
      .getBoundingBox();
    let initPosX = parentSize.width / 2 + nodeSize.width / 2;
    this.num.string = levelNum.toString();
    this.node.setPosition(initPosX, this.node.position.y);
    tween(this.node)
      .to(0.2, {
        position: new Vec3(0, this.node.position.y, 0),
      })
      .start();
  }

  exit() {
    let nodeSize = this.node.getComponent(UITransform).getBoundingBox();

    let parentSize = this.node.parent
      .getComponent(UITransform)
      .getBoundingBox();
    let endPosX = -parentSize.width / 2 - nodeSize.width / 2;

    tween(this.node)
      .to(0.2, {
        position: new Vec3(endPosX, this.node.position.y, 0),
      })
      .start();
  }
}
