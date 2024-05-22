import { _decorator, Component, instantiate, Node, Prefab } from "cc";
import { ITEM_TYPE, levelItem } from "./levelItem";
import { EDITOR } from "cc/env";
const { ccclass, property } = _decorator;

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
