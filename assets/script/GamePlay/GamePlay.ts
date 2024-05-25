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
  Label,
  director,
  AudioClip,
} from "cc";
import { SOUNDS_NAME, SCENE, DURATIONS } from "../constants/Constant";
import { DataManager } from "../managers/DataManager";
import { GameManager } from "../managers/GameManager";
import { ResourcesManager } from "../managers/ResourcesManager";
import { BaseData } from "./BaseData";
import { levelItem, ITEM_TYPE, ROTATION_TYPE } from "./levelItem";
import { LevelNumber } from "./LevelNumber";

const { ccclass, property } = _decorator;
const anglePairs = {
  0: [0, 180],
  90: [90, 270],
  180: [0, 180],
  270: [90, 270],
};

@ccclass("GamePlay")
export class GamePlay extends Component {
  /**
   * Array of Road data with values prefab and item type.
   */
  @property({ type: [BaseData], visible: true }) roadsData: BaseData[] = [];
  @property({ type: Node }) mainNode: Node;
  @property({ type: Node }) levelLabel: Node;

  // Random initial rotation angles for four-way items at the start of the level
  fourWayArray = [0, 90, 180, 270];
  // Random initial rotation angles for two-way items at the start of the level
  twoWayArray = [0, 90];
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
      this.updateLevel(this._testLevel.json, false);
    }
  }

  // To print the data of the level which was created.
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
    this.initNewLevel();
  }

  initNewLevel() {
    let levelData: JsonAsset = <JsonAsset>(
      ResourcesManager.Instance.getResourceFromCache(
        `level${DataManager.Instance.LevelSelected}`
      )
    );
    if (levelData) {
      console.log("LOCAL LEVEL FOUND");
      this.mainNode.destroyAllChildren();
      this.updateLevel(levelData.json, true);
      this.levelInitiated();
    } else {
      console.log("LOCAL LEVEL NOT FOUND");

      const levelPath = `Levels/level${DataManager.Instance.LevelSelected}`;
      resources.load(levelPath, JsonAsset, (err, level) => {
        this.mainNode.destroyAllChildren();
        this.updateLevel(level.json, true);
        this.levelInitiated();
      });
    }
  }

  levelInitiated() {
    this.levelLabel
      .getComponent(LevelNumber)
      .updateLevelNumber(DataManager.Instance.LevelSelected);
    GameManager.Instance.PersistNodeRef.playEffect(
      ResourcesManager.Instance.getResourceFromCache(SOUNDS_NAME.SHAPE_APPEAR)
    );
  }

  updateLevel = (itemsInfo: any, changeAngles: boolean) => {
    /**
     * Iterating the json file and checking each asset's types and creating the instance according to the type
     */

    let path = itemsInfo.path;
    let delayInEachRoad: number =
      DURATIONS.LEVEL_BUILDING / itemsInfo.path.length;

    path.forEach((element, index) => {
      let item: Node = null;
      item = instantiate(this.roadTypeKeyPair[element.itemType]);
      item.setPosition(new Vec3(element.x, element.y, element.z));
      item.getComponent(levelItem).resultantAngle = element.angle;
      item.getComponent(levelItem).isFixed = element.isFixed;
      // item.getComponent(levelItem).rotationType = element.rotationType;
      this.mainNode.addChild(item);

      if (!element.isFixed && changeAngles) {
        switch (element.rotationType) {
          case ROTATION_TYPE.FOUR_WAY:
            item.angle = this.getRandomDirection(
              element.angle,
              this.fourWayArray
            );
            break;
          case ROTATION_TYPE.TWO_WAY:
            const randomIndex = Math.floor(
              Math.random() * this.twoWayArray.length
            );
            item.angle = this.twoWayArray[randomIndex];
            break;

          default:
            break;
        }

        // Touch event on items which are not fixed
        item.on(Input.EventType.TOUCH_START, this.checkPos);
        tween(item)
          .call(() => {
            item.setScale(Vec3.ZERO);
          })
          .delay(index * delayInEachRoad)
          .to(0.1, { scale: Vec3.ONE }, { easing: easing.expoOut })
          .start();
      } else {
        item.angle = element.angle;
      }
    });
    // this.randomize();
  };

  getRandomDirection(currentValue, directions) {
    // Filter out the current value
    const possibleDirections = directions.filter(
      (direction) => direction !== currentValue
    );

    // Choose a random index from the possible directions
    const randomIndex = Math.floor(Math.random() * possibleDirections.length);

    return possibleDirections[randomIndex];
  }

  checkPos = (event) => {
    const rotationType: ROTATION_TYPE =
      event.target.getComponent(levelItem).rotationType;
    let angle = (event.target.angle + 90) % 450;
    GameManager.Instance.PersistNodeRef.playEffect(
      ResourcesManager.Instance.getResourceFromCache(SOUNDS_NAME.ROTATE_SHAPE)
    );
    tween(event.target)
      .to(0.1, { angle: angle })
      .call(() => {
        if (angle == 360) {
          event.target.angle = 0;
        }
        this.checkIfLevelCompleted();
      })
      .start();
  };

  checkIfLevelCompleted() {
    if (this.gameCompleted()) {
      DataManager.Instance.levelFinished();

      this.mainNode.children.forEach((element, index) => {
        element.off(Input.EventType.TOUCH_START, this.checkPos);
      });
      DataManager.Instance.incrementSlectedLevel();

      GameManager.Instance.PersistNodeRef.playEffect(
        ResourcesManager.Instance.getResourceFromCache(
          SOUNDS_NAME.LEVEL_COMPLETE
        )
      );

      this.levelLabel.getComponent(LevelNumber).exit();
      this.playTweenOnChildren(this.mainNode, () => {
        setTimeout(() => {
          this.initNewLevel();
        }, 1000);
      });
    }
  }

  /**
   *
   * @returns a boolean variable indicating whether our game is over
   */
  gameCompleted = () => {
    let flag = true;
    this.mainNode.children.forEach((element) => {
      const rotationType = element.getComponent(levelItem).rotationType;
      const resultantAngle = element.getComponent(levelItem).resultantAngle;
      switch (rotationType) {
        case ROTATION_TYPE.TWO_WAY:
          if (!anglePairs[resultantAngle].includes(element.angle)) {
            flag = false;
          }
          break;
        case ROTATION_TYPE.FOUR_WAY:
          if (element.angle !== resultantAngle) {
            flag = false;
          }
          break;
        case ROTATION_TYPE.ZERO_WAY:
          break;
        default:
          break;
      }
    });
    return flag;
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
  playTweenOnChildren(node: Node, finalCallback: Function) {
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
