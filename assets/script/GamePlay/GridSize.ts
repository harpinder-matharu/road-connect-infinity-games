import { _decorator, Component, Node, Size, UITransform } from "cc";
const { ccclass, property } = _decorator;

@ccclass("GridSize")
export class GridSize extends Component {
  @property
  _gridX = 10;
  @property
  _gridY = 10;

  @property
  blockSize = 128;

  @property
  get gridX(): number {
    return this._gridX;
  }
  set gridX(value: number) {
    this._gridX = value;
    let oldSize = this.node.getComponent(UITransform).contentSize;
    this.node
      .getComponent(UITransform)
      .setContentSize(new Size(this.blockSize * value, oldSize.y));
  }

  @property
  get gridY(): number {
    return this._gridY;
  }
  set gridY(value: number) {
    this._gridY = value;
    let oldSize = this.node.getComponent(UITransform).contentSize;
    this.node
      .getComponent(UITransform)
      .setContentSize(new Size(oldSize.x, this.blockSize * value));
  }

  start() {}

  update(deltaTime: number) {}
}
