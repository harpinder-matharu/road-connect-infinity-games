import { _decorator, Button, Component, director, Label, Node } from "cc";
import { SCENE, SOUNDS_NAME } from "../constants/Constant";
import { DataManager } from "../managers/DataManager";
import { GameManager } from "../managers/GameManager";
import { ResourcesManager } from "../managers/ResourcesManager";

const { ccclass, property } = _decorator;

@ccclass("LevelButton")
export class LevelButton extends Component {
  @property({ type: Label })
  levelNum: Label = null;

  start() {}

  initButton(levelNum: number) {
    this.levelNum.string = levelNum.toString();
  }

  update(deltaTime: number) {}

  set IsOpen(_isOpen: boolean) {
    this.node.getComponent(Button).interactable = _isOpen;
  }

  onClick(event: Event, customEventData: string) {
    GameManager.Instance.PersistNodeRef.playEffect(
      ResourcesManager.Instance.getResourceFromCache(SOUNDS_NAME.DEFAULT_CLICK)
    );
    DataManager.Instance.LevelSelected = parseInt(this.levelNum.string);
    director.loadScene(SCENE.GAME);
  }
}
