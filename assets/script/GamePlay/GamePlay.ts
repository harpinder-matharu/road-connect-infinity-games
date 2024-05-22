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
import { SOUNDS_NAME, SCENE } from "../constants/Constant";
import { DataManager } from "../managers/DataManager";
import { GameManager } from "../managers/GameManager";
import { ResourcesManager } from "../managers/ResourcesManager";
import { BaseData } from "./BaseData";
import { levelItem, ITEM_TYPE, ROTATION_TYPE } from "./levelItem";

const { ccclass, property } = _decorator;

@ccclass("GamePlay")
export class GamePlay extends Component {
  @property({ type: [BaseData], visible: true }) roadsData: BaseData[] = [];
  @property({ type: Node }) mainNode: Node;
  @property({ type: Label }) levelLabel: Label;

  fourWayArray = [0, 90, 180, 270];
  twoWayArray = [0, 90];
  roadTypeKeyPair: {} = {};

  _levelData: JsonAsset = null;
  @property({ type: JsonAsset })
  get levelData2() {
    return this._levelData;
  }
  set levelData2(value) {
    this._levelData = value;
    this.mainNode.destroyAllChildren();
    if (value) {
      this.roadsData.forEach((value) => {
        this.roadTypeKeyPair[value.roadType] = value._roadPrefab;
      });
      this.updateLevel(this._levelData.json, false);
    }
  }

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
    const levelPath = `Levels/level${DataManager.Instance.LevelSelected}`;
    resources.load(levelPath, JsonAsset, (err, level) => {
      console.log(level.json);
      this.mainNode.destroyAllChildren();
      this.updateLevel(level.json, true);
      this.updateLevelLabel(DataManager.Instance.LevelSelected);
      GameManager.Instance.PersistNodeRef.playEffect(
        ResourcesManager.Instance.getResourceFromCache(SOUNDS_NAME.SHAPE_APPEAR)
      );
    });
  }

  updateLevelLabel(level: number) {
    this.levelLabel.string = `Level ${level}`;
  }
  updateStatusOnComplete() {}
  protected onBeforeHide(suspended: boolean): Promise<void> {
    return new Promise((res, rej) => {
      res();
    });
  }

  protected updateDisplay(options: any): void {
    // director.on(GameEvent.OnGameEnded, this.closeGame, this);
  }
  updateLevel = (itemsInfo: any, changeAngles: boolean) => {
    /**
     * Iterating the json file and checking each asset's types and creating the instance according to the type
     */

    let path = itemsInfo.path;
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
          .delay(index * 0.05)
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
      console.log("YEAH YOU ARE DOING GREAT!!");

      DataManager.Instance.levelFinished();
      this.updateStatusOnComplete();

      this.mainNode.children.forEach((element, index) => {
        element.off(Input.EventType.TOUCH_START, this.checkPos);
      });
      DataManager.Instance.incrementSlectedLevel();

      let clip: AudioClip = <AudioClip>(
        ResourcesManager.Instance.getResourceFromCache(
          SOUNDS_NAME.LEVEL_COMPLETE
        )
      );
      console.log("DURATION: ", clip.getDuration());
      GameManager.Instance.PersistNodeRef.playEffect(
        ResourcesManager.Instance.getResourceFromCache(
          SOUNDS_NAME.LEVEL_COMPLETE
        )
      );
      this.playTweenOnChildren(this.mainNode, () => {
        console.log("Final operation after all tweens");
        // Perform final operation here
        setTimeout(() => {
          this.initNewLevel();
        }, (clip.getDuration() / 2) * 1000);
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
          if (
            (resultantAngle === 90 &&
              element.angle !== 90 &&
              element.angle !== 270) ||
            (resultantAngle === 0 &&
              element.angle !== 0 &&
              element.angle !== 180)
          ) {
            flag = false;
          }
          break;
        case ROTATION_TYPE.FOUR_WAY:
          if (element.angle !== resultantAngle) {
            flag = false;
          }
          break;
        default:
          break;
      }
    });
    return flag;
  };

  // Function to play tween on a single child and return a promise
  playTweenOnChild(child) {
    return new Promise<void>((resolve) => {
      tween(child)
        .to(0.3, { scale: Vec3.ZERO }, { easing: easing.expoIn }) // Example tween operation
        .call(() => {
          console.log(`Tween completed for child: ${child.name}`);
          resolve();
        })
        .start();
    });
  }

  // Function to play tweens in sequence on all children
  playTweenOnChildren(node, finalCallback) {
    const children = node.children;
    let promiseChain = [];

    children.forEach((child) => {
      promiseChain.push(this.playTweenOnChild(child));
    });

    Promise.all(promiseChain).then(() => {
      console.log("All tweens completed");
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
