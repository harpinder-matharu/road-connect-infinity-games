import {
  _decorator,
  Color,
  Component,
  Label,
  Sprite,
  tween,
  UITransform,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("LevelNumber")
export class LevelNumber extends Component {
  @property({ type: Label })
  num: Label = null!;

  sprite: Sprite = null!;
  start() {
    this.sprite = this.node.getComponent(Sprite);
  }

  updateLevelNumber(levelNum: number) {
    let nodeSize = this.node.getComponent(UITransform).getBoundingBox();
    let parentSize = this.node.parent
      .getComponent(UITransform)
      .getBoundingBox();
    let initPosX = parentSize.width / 2 + nodeSize.width / 2;
    this.num.string = levelNum.toString();
    this.node.setPosition(initPosX, this.node.position.y);

    let tweenDuration: number = 0.4;
    tween(this.node.position)
      .to(tweenDuration, new Vec3(0, this.node.position.y, 0), {
        onUpdate: (target: Vec3, ratio: number) => {
          this.node.position = target;
          this.sprite.color = new Color(0, 0, 0, 255 * ratio);
        },
      })
      .start();
  }

  exit() {
    let nodeSize = this.node.getComponent(UITransform).getBoundingBox();

    let parentSize = this.node.parent
      .getComponent(UITransform)
      .getBoundingBox();
    let endPosX = -parentSize.width / 2 - nodeSize.width / 2;

    let tweenDuration: number = 0.4;
    tween(this.node.position)
      .to(tweenDuration, new Vec3(endPosX, this.node.position.y, 0), {
        onUpdate: (target: Vec3, ratio: number) => {
          this.node.position = target;
          this.sprite.color = new Color(0, 0, 0, 255 * (1 - ratio));
        },
      })
      .start();
  }
}
