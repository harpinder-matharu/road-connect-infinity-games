import { _decorator, Component, Enum, Vec3, tween, easing, Input } from "cc";
import { RoadType } from "../comman/Interfaces";
import { ITEM_TYPE, ROTATION_TYPE } from "../constants/Constant";
const { ccclass, property, boolean } = _decorator;

@ccclass("levelItem")
export class levelItem extends Component {
  @property({ type: Enum(ITEM_TYPE) })
  itemType: ITEM_TYPE = ITEM_TYPE.NONE;
  @property({ type: Enum(ROTATION_TYPE) })
  rotationType: ROTATION_TYPE = ROTATION_TYPE.NONE;
  @property isFixed = false;

  resultantAngle: number;
  // Random initial rotation angles for four-way items at the start of the level
  fourWayArray = [0, 90, 180, 270];
  // Random initial rotation angles for two-way items at the start of the level
  twoWayArray = [0, 90];
  // Data structure for opt

  start() {}

  updateData(
    element: RoadType,
    changeAngles: boolean,
    index: number,
    delayInRoadSpawn: number,
    callback: Function
  ) {
    this.node.setPosition(new Vec3(element.x, element.y, element.z));
    this.node.getComponent(levelItem).resultantAngle = element.angle;
    this.node.getComponent(levelItem).isFixed = element.isFixed;
    if (!element.isFixed && changeAngles) {
      switch (element.rotationType) {
        case ROTATION_TYPE.FOUR_WAY:
          this.node.angle = this.getRandomDirection(
            element.angle,
            this.fourWayArray
          );
          break;
        case ROTATION_TYPE.TWO_WAY:
          const randomIndex = Math.floor(
            Math.random() * this.twoWayArray.length
          );
          this.node.angle = this.twoWayArray[randomIndex];
          break;

        default:
          break;
      }
      this.node.on(Input.EventType.TOUCH_START, callback);
      tween(this.node)
        .call(() => {
          this.node.setScale(Vec3.ZERO);
        })
        .delay(index * delayInRoadSpawn)
        .to(0.1, { scale: Vec3.ONE }, { easing: easing.expoOut })
        .start();
    } else {
      this.node.angle = element.angle;
    }
  }
  getRandomDirection(currentValue, directions) {
    // Filter out the current value
    const possibleDirections = directions.filter(
      (direction) => direction !== currentValue
    );
    // Choose a random index from the possible directions
    const randomIndex = Math.floor(Math.random() * possibleDirections.length);
    return possibleDirections[randomIndex];
  }
}
