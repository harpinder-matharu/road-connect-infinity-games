import { _decorator, Component, instantiate, Node, Prefab } from "cc";
import { levelItem } from "./levelItem";
import { EDITOR } from "cc/env";
import { ITEM_TYPE } from "../constants/Constant";
const { ccclass, property } = _decorator;

/**
 * @description // Basic data type for a road segment, used as a property in the gameplay mechanics.
 */
@ccclass("BaseData")
export class BaseData {
  @property({ type: Prefab })
  _roadPrefab: Prefab = null;
  @property({ type: Prefab })
  get roadPrefab() {
    return this._roadPrefab;
  }
  set roadPrefab(value) {
    this._roadPrefab = value;

    if (value && EDITOR)
      this.roadType = instantiate(this.roadPrefab).getComponent(
        levelItem
      ).itemType;
  }
  @property
  roadType: ITEM_TYPE = 0;
}
