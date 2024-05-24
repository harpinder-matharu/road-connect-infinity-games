import {
  _decorator,
  Component,
  director,
  EventTouch,
  instantiate,
  Node,
  Prefab,
  UITransform,
  Vec3,
} from "cc";
import { ITEM_TYPE, levelItem } from "../GamePlay/levelItem";
import { GridItem } from "./GridItem";

const { ccclass, property } = _decorator;

@ccclass("LevelCreator")
export class LevelCreator extends Component {
  @property({ type: Prefab })
  draggable: Prefab = null;

  @property({ type: Prefab })
  gridItem: Prefab = null;

  @property({ type: Node })
  itemsParent: Node = null;

  @property({ type: Node })
  city: Node = null;

  @property({ type: Node })
  grid: Node = null;

  draggableRoad: Node = null;
  isDragging: any;
  start() {
    this.addGridItems();
    this.node.on(Node.EventType.TOUCH_START, this.touchStart, this);
    this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
  }

  onTouchEnd(event: EventTouch) {
    if (!this.isDragging) {
      return;
    }

    // this.draggable = null;
    let items = this.grid.children;
    const touchPosInWorld = event.getUILocation();
    let itemIndex = -1;
    for (let index = 0; index < items.length; index++) {
      if (
        items[index]
          .getComponent(UITransform)
          .getBoundingBoxToWorld()
          .contains(touchPosInWorld)
      ) {
        itemIndex = index;
        break;
      }
    }
    if (itemIndex == -1) {
      this.draggableRoad.removeFromParent();

      return;
    } else {
      items[itemIndex].getComponent(GridItem).addRoad(this.draggableRoad);
      this.draggableRoad.setPosition(Vec3.ZERO);
    }
    this.draggableRoad = null;
    this.isDragging = false;
  }

  touchStart(event: EventTouch) {
    let items = this.itemsParent.children;
    const touchPosInWorld = event.getUILocation();
    let itemIndex = -1;
    for (let index = 0; index < items.length; index++) {
      if (
        items[index]
          .getComponent(UITransform)
          .getBoundingBoxToWorld()
          .contains(touchPosInWorld)
      ) {
        itemIndex = index;
        break;
      }
    }
    if (itemIndex == -1) {
      this.isDragging = false;
      return;
    }
    this.isDragging = true;

    this.draggableRoad = instantiate(items[itemIndex]);
    this.city.addChild(this.draggableRoad);
    this.draggableRoad.setWorldPosition(
      new Vec3(touchPosInWorld.x, touchPosInWorld.y, 0)
    );
  }

  onTouchMove(event: EventTouch) {
    if (!this.isDragging) {
      return;
    }
    const touchPosInWorld = event.getUILocation();
    this.draggableRoad.setWorldPosition(
      new Vec3(touchPosInWorld.x, touchPosInWorld.y, 0)
    );
  }

  addGridItems() {
    for (let index = 0; index < 8 * 8; index++) {
      this.grid.addChild(instantiate(this.gridItem));
    }
  }

  editDone() {
    let completeLevel = [];
    let array = this.grid.children;
    let road: Node = null;
    array.forEach((element) => {
      road = element.getComponent(GridItem).getRoad();
      if (road && road.getComponent(levelItem).itemType != ITEM_TYPE.NONE) {
        let pos = element.getPosition();
        let obj = { x: pos.x, y: pos.y, z: pos.z };
        let itemType = road.getComponent(levelItem).itemType;
        let isfixed = road.getComponent(levelItem).isFixed;
        let rotationType = road.getComponent(levelItem).rotationType;
        let itemObj = {
          ...obj,
          isFixed: isfixed,
          itemType: itemType,
          rotationType: rotationType,
          angle: road.angle,
        };
        completeLevel.push(itemObj);
      }
    });
    console.log(completeLevel);
  }

  onClear() {
    let array = this.grid.children;
    let road: Node = null;
    array.forEach((element) => {
      road = element.getComponent(GridItem).getRoad();
      if (road) {
        road.removeFromParent();
      }
    });
  }
}
