import {
  _decorator,
  Component,
  instantiate,
  Node,
  Prefab,
  ScrollView,
} from "cc";
import { MAX_LEVELS, SESSION_STORAGE } from "../constants/Constant";
import { DataManager } from "../managers/DataManager";
import { LevelButton } from "./LevelButton";
import {
  LocAndSessStoreManager,
  STORAGE,
} from "../managers/LocAndSessStoreManager";
const { ccclass, property } = _decorator;

@ccclass("Lobby")
export class Lobby extends Component {
  @property({ type: Prefab })
  lvlBtnPrefab: Prefab = null;

  @property({ type: Node })
  playScreen: Node = null;

  @property({ type: ScrollView })
  levelSV: ScrollView = null;

  totalLevels = MAX_LEVELS;

  start() {
    if (
      LocAndSessStoreManager.Instance.getData(
        SESSION_STORAGE.GAME_STARTED,
        STORAGE.SESSION
      ).length != 0
    ) {
      this.playScreen.active = false;
    } else {
      this.playScreen.active = true;
      LocAndSessStoreManager.Instance.setData(
        SESSION_STORAGE.GAME_STARTED,
        "1",
        STORAGE.SESSION
      );
    }

    DataManager.Instance.updateLastOpenedLevel();
    this.initLevels(this.totalLevels);
  }

  initLevels(totalLevels: number) {
    let lvlBtn: Node = null;
    for (let index = 1; index <= totalLevels; index++) {
      lvlBtn = instantiate(this.lvlBtnPrefab);
      lvlBtn.getComponent(LevelButton).initButton(index);
      this.levelSV.content.addChild(lvlBtn);
      if (index > DataManager.Instance.LastOpenedLevel) {
        lvlBtn.getComponent(LevelButton).IsOpen = false;
      }
    }
  }

  onPlay() {
    this.playScreen.active = false;
  }
}
