import { _decorator, Component, Node, tween } from "cc";
import { levelItem } from "../GamePlay/levelItem";
import { ROTATION_TYPE } from "../constants/Constant";

const { ccclass, property } = _decorator;

@ccclass("GridItem")
export class GridItem extends Component {
  start() {
    this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
  }

  onTouchEnd() {
    let childrens = this.node.children;

    if (!childrens.length) {
      return;
    }
    const rotationType: ROTATION_TYPE =
      childrens[0].getComponent(levelItem).rotationType;
    childrens[0].angle = (childrens[0].angle + 90) % 360;
  }

  addRoad(node: Node) {
    this.node.removeAllChildren();
    this.node.addChild(node);
  }

  getRoad(): Node {
    if (this.node.children[0]) {
      return this.node.children[0];
    }
    return null;
  }

  update(deltaTime: number) {}
}
