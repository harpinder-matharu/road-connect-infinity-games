import { _decorator, Component, Node, Enum, SpriteFrame, CCBoolean } from "cc";
const { ccclass, property, boolean } = _decorator;

export enum ITEM_TYPE {
  NONE = 0,
  ROAD1,
  ROAD2,
  ROAD3,
  ROAD4,
  ROAD5,
  ROAD6,
  ROAD7,
}
export enum ROTATION_TYPE {
  NONE,
  TWO_WAY,
  FOUR_WAY,
}
export interface itemDataType {
  obj: {
    x: number;
    y: number;
    z: number;
  };
  isFixed: boolean;
  itemType: ITEM_TYPE;
  angle: number;
}

@ccclass("levelItem")
export class levelItem extends Component {
  @property({ type: Enum(ITEM_TYPE) })
  itemType: ITEM_TYPE = ITEM_TYPE.NONE;
  @property({ type: Enum(ROTATION_TYPE) })
  rotationType: ROTATION_TYPE = ROTATION_TYPE.NONE;

  @property
  isFixed = false;

  resultantAngle: number;

  start() {}

  update(deltaTime: number) {}
}
