import {
  _decorator,
  Component,
  Node,
  Input,
  JsonAsset,
  instantiate,
  Vec3,
  CCBoolean,
  resources,
  tween,
  easing,
  director,
} from "cc";
import {
  SOUNDS_NAME,
  SCENE,
  DURATIONS,
  ITEM_TYPE,
  ROTATION_TYPE,
} from "../constants/Constant";
import { DataManager } from "../managers/DataManager";
import { GameManager } from "../managers/GameManager";
import { ResourcesManager } from "../managers/ResourcesManager";
import { BaseData } from "./BaseData";
import { LevelNumber } from "./LevelNumber";
import { EDITOR } from "cc/env";
import { RoadType } from "../comman/Interfaces";
import { levelItem } from "./levelItem";

const { ccclass, property } = _decorator;
const anglePairs = {
  0: [0, 180],
  90: [90, 270],
  180: [0, 180],
  270: [90, 270],
};

/**
 * @description this class is responsible for gameplay logic and preview of template created using level creator.
 */
@ccclass("GamePlay")
export class GamePlay extends Component {
  // Array of Road data with values prefab and item type.
  @property({ type: BaseData, visible: true }) roadsData = [];
  @property({ type: Node }) mainNode: Node;
  @property({ type: Node }) levelLabel: Node;

  // Data structure for optimization.
  roadTypeKeyPair: {} = {};

  // Property to check level in editor
  _testLevel: JsonAsset = null;
  @property({ type: JsonAsset })
  get TestLevel() {
    return this._testLevel;
  }
  set TestLevel(value) {
    this._testLevel = value;
    this.mainNode.destroyAllChildren();
    if (value) {
      this.roadsData.forEach((value) => {
        this.roadTypeKeyPair[value.roadType] = value._roadPrefab;
      });
      this.updateLevel(this._testLevel.json, false, 0);
    }
  }

  // To print the data of the level which was updated.
  _printData: Boolean = false;
  @property({ type: CCBoolean })
  get printData() {
    return this._printData;
  }
  set printData(value) {
    this._printData = value;
    this.print();
  }

  print() {
    let completeLevel = [];
    let array = this.mainNode.children;
    array.forEach((element) => {
      if (element.getComponent(levelItem).itemType != ITEM_TYPE.NONE) {
        let pos = element.getPosition();
        let obj = { x: pos.x, y: pos.y, z: pos.z };
        let itemType = element.getComponent(levelItem).itemType;
        let isfixed = element.getComponent(levelItem).isFixed;
        let rotationType = element.getComponent(levelItem).rotationType;
        let itemObj = {
          ...obj,
          isFixed: isfixed,
          itemType: itemType,
          rotationType: rotationType,
          angle: element.angle,
        };
        completeLevel.push(itemObj);
      }
    });
    console.log(completeLevel);
  }

  onLoad() {
    this.roadsData.forEach((value) => {
      this.roadTypeKeyPair[value.roadType] = value._roadPrefab;
    });
    this.loadAndInitLevel();
  }

  /**
   * @description check if level is available in cache, if not load from resources and update.
   */
  loadAndInitLevel() {
    const levelNum = DataManager.Instance.LevelSelected;
    let levelData: JsonAsset = <JsonAsset>(
      ResourcesManager.Instance.getResourceFromCache(`level${levelNum}`)
    );
    if (levelData) {
      this.updateLevel(levelData.json, true, levelNum);
    } else {
      const levelPath = `Levels/level${DataManager.Instance.LevelSelected}`;
      resources.load(levelPath, JsonAsset, (err, level) => {
        this.updateLevel(level.json, true, levelNum);
      });
    }
  }

  /**
   * @description Iterating the json file and checking each asset's types and creating the instance according to the type
   * @param pathInfo information of complete path.
   * @param changeAngles false if want to view completed level in editor
   * @param levelNum level number
   */
  updateLevel(pathInfo: any, changeAngles: boolean, levelNum: number) {
    !EDITOR &&
      GameManager.Instance.PersistNodeRef.playEffect(
        ResourcesManager.Instance.getResourceFromCache(SOUNDS_NAME.SHAPE_APPEAR)
      );
    this.mainNode.destroyAllChildren();
    this.levelLabel.getComponent(LevelNumber).updateLevelNumber(levelNum);

    let path = pathInfo.path;
    let delayInRoadSpawn: number =
      DURATIONS.LEVEL_BUILDING / pathInfo.path.length;

    let item: Node = null;
    path.forEach((element: RoadType, index: number) => {
      item = instantiate(this.roadTypeKeyPair[element.itemType]);
      this.mainNode.addChild(item);
      item
        .getComponent(levelItem)
        .updateData(
          element,
          changeAngles,
          index,
          delayInRoadSpawn,
          this.rotateRoad
        );
    });
  }

  /**
   * @description By using modulo 450, the code allows the angle to include the
   * 360-degree mark, making the full rotation visible in the animation.
   * Resetting to 0 after reaching 360 ensures that angles remain within the typical
   * 0-359 range for game logic while allowing a complete visual rotation.
   * @param event
   */
  rotateRoad = (event) => {
    const rotationType: ROTATION_TYPE =
      event.target.getComponent(levelItem).rotationType;
    let angle = (event.target.angle + 90) % 450;
    GameManager.Instance.PersistNodeRef.playEffect(
      ResourcesManager.Instance.getResourceFromCache(SOUNDS_NAME.ROTATE_SHAPE)
    );
    tween(event.target)
      .to(0.1, { angle: angle })
      .call(() => {
        //ensures that the angle of 360 degrees is normalized to 0 degrees. This line will only affect the case where event.target.angle reaches 360 degrees.
        if (angle == 360) {
          event.target.angle = 0;
        }
        this.checkProgressAndEndGame();
      })
      .start();
  };

  checkProgressAndEndGame() {
    const isGameCompleted = this.gameCompleted();
    if (isGameCompleted) {
      DataManager.Instance.levelFinished();

      this.mainNode.children.forEach((element, index) => {
        element.off(Input.EventType.TOUCH_START, this.rotateRoad);
      });
      DataManager.Instance.incrementSlectedLevel();

      GameManager.Instance.PersistNodeRef.playEffect(
        ResourcesManager.Instance.getResourceFromCache(
          SOUNDS_NAME.LEVEL_COMPLETE
        )
      );

      this.levelLabel.getComponent(LevelNumber).exit();
      this.playLevelEndAnimation(this.mainNode, () => {
        setTimeout(() => {
          this.loadAndInitLevel();
        }, 1000);
      });
    }
  }

  /**
   *
   * @returns a boolean variable indicating whether our game is over
   */
  gameCompleted = () => {
    for (const element of this.mainNode.children) {
      const component = element.getComponent(levelItem);
      const rotationType = component.rotationType;
      const resultantAngle = component.resultantAngle;

      switch (rotationType) {
        case ROTATION_TYPE.TWO_WAY:
          if (!anglePairs[resultantAngle].includes(element.angle)) {
            return false;
          }
          break;
        case ROTATION_TYPE.FOUR_WAY:
          if (element.angle !== resultantAngle) {
            return false;
          }
          break;
        case ROTATION_TYPE.ZERO_WAY:
          // No checks needed for ZERO_WAY
          break;
        default:
          break;
      }
    }
    return true;
  };

  /**
   * @description Function to play tween on a single child and return a promise
   * @param child
   * @returns promise
   */
  playTweenOnChild(child: Node) {
    return new Promise<void>((resolve) => {
      tween(child)
        .to(
          DURATIONS.LEVEL_CLEARING,
          { scale: Vec3.ZERO },
          { easing: easing.expoIn }
        )
        .call(() => {
          resolve();
        })
        .start();
    });
  }

  /**
   * @description Function to play tweens in sequence on all children.
   * @param node Parent of nodes on which tween has to be played.
   * @param finalCallback Calback to be triggerd after complition of all the tweens.
   */
  playLevelEndAnimation(node: Node, finalCallback: Function) {
    const children = node.children;
    let promiseChain = [];

    children.forEach((child) => {
      promiseChain.push(this.playTweenOnChild(child));
    });

    Promise.all(promiseChain).then(() => {
      finalCallback();
    });
  }

  onMenu() {
    GameManager.Instance.PersistNodeRef.playEffect(
      ResourcesManager.Instance.getResourceFromCache(SOUNDS_NAME.DEFAULT_CLICK)
    );
    director.loadScene(SCENE.LOBBY);
  }
}
