import {
  _decorator,
  Component,
  director,
  easing,
  instantiate,
  Node,
  Prefab,
  ScrollView,
  tween,
  UITransform,
  Vec3,
} from "cc";
import {
  DURATIONS,
  MAX_LEVELS,
  IS_TESTING_MODE,
  CUSTON_EVENT,
  SCENE,
} from "../constants/Constant";
import { DataManager } from "../managers/DataManager";
import { LevelButton } from "./LevelButton";
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
  @property({ type: Node })
  roadLabel: Node;
  @property({ type: Node })
  connectLabel: Node;
  @property({ type: Node })
  playBtn: Node;

  isLogoAniDone = false;
  isLodingDone = false;

  start() {
    this.playBtn.setScale(Vec3.ZERO);
    if (DataManager.Instance.hasVisitedHomePage) {
      this.playScreen.active = false;
    } else {
      this.playScreen.active = true;
      DataManager.Instance.hasVisitedHomePage = true;
      this.roadConnectAnimation();
    }

    director.on(
      CUSTON_EVENT.LOADING_DONE,
      () => {
        this.isLodingDone = true;
        this.activatePlayBtn();
      },
      this
    );
    DataManager.Instance.updateLastOpenedLevel();
    this.initLevels(this.totalLevels);

    director.preloadScene(SCENE.GAME);
  }

  initLevels(totalLevels: number) {
    let lvlBtn: Node = null;
    for (let index = 1; index <= totalLevels; index++) {
      lvlBtn = instantiate(this.lvlBtnPrefab);
      lvlBtn.getComponent(LevelButton).initButton(index);
      this.levelSV.content.addChild(lvlBtn);
      if (!IS_TESTING_MODE && index > DataManager.Instance.LastOpenedLevel) {
        lvlBtn.getComponent(LevelButton).IsOpen = false;
      }
    }
  }

  onPlay() {
    this.playScreen.active = false;
  }

  roadConnectAnimation() {
    this.setInitialPos(this.roadLabel, true);
    this.setInitialPos(this.connectLabel, false);

    let promiseChain = [];
    promiseChain.push(this.createTween(this.roadLabel));
    promiseChain.push(this.createTween(this.connectLabel));

    Promise.all(promiseChain).then(() => {
      this.isLogoAniDone = true;
      this.activatePlayBtn();
    });
  }

  activatePlayBtn() {
    if (this.isLodingDone && this.isLogoAniDone) {
      tween(this.playBtn)
        .to(DURATIONS.PLAY_IN, { scale: Vec3.ONE }, { easing: easing.circOut })
        .start();
    }
  }

  createTween(node: Node) {
    return new Promise<void>((resolve) => {
      tween(node)
        .to(
          DURATIONS.LOGO_IN,
          { position: new Vec3(0, node.position.y, 0) },
          { easing: easing.elasticOut }
        )
        .call(() => {
          resolve();
        })
        .start();
    });
  }

  private setInitialPos(node: Node, isAtRight: boolean) {
    const nodeSize = node.getComponent(UITransform).getBoundingBox();
    let parentSize = node.parent.getComponent(UITransform).getBoundingBox();
    let initPosX = 0;
    if (isAtRight) {
      initPosX = parentSize.width / 2 + nodeSize.width / 2;
    } else {
      initPosX = -parentSize.width / 2 - nodeSize.width / 2;
    }
    node.setPosition(initPosX, node.position.y);
  }
}
