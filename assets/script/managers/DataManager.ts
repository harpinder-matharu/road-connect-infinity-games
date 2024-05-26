/**
 * This class is to Manage overall game data
 * @author : @harpinder
 * Add functions and variable according
 */

import { LOCAL_STORAGE, MAX_LEVELS } from "../constants/Constant";
import { LocAndSessStoreManager, STORAGE } from "./LocAndSessStoreManager";

export class DataManager {
  private static _instance: DataManager = null!;
  public static get Instance() {
    if (!DataManager._instance) {
      DataManager._instance = new DataManager();
    }
    return DataManager._instance;
  }

  private _lastOpenedLevel: number = 0;
  public get LastOpenedLevel(): number {
    return this._lastOpenedLevel;
  }
  public set LastOpenedLevel(levelNum: number) {
    this._lastOpenedLevel = levelNum;
  }

  updateLastOpenedLevel() {
    let lastOpenedLevel = LocAndSessStoreManager.Instance.getData(
      LOCAL_STORAGE.LAST_OPENED,
      STORAGE.LOCAL
    );
    if (lastOpenedLevel.length == 0) {
      LocAndSessStoreManager.Instance.setData(
        LOCAL_STORAGE.LAST_OPENED,
        "1",
        STORAGE.LOCAL
      );
      this.LastOpenedLevel = 1;
    } else {
      this.LastOpenedLevel = parseInt(lastOpenedLevel);
    }
  }

  levelFinished() {
    let level = this.LevelSelected;
    if ((this.LastOpenedLevel = level)) {
      LocAndSessStoreManager.Instance.setData(
        LOCAL_STORAGE.LAST_OPENED,
        (level + 1).toString(),
        STORAGE.LOCAL
      );
    }
  }

  private _levelSelected: number = 0;

  public get LevelSelected(): number {
    return this._levelSelected;
  }
  public set LevelSelected(levelNum: number) {
    this._levelSelected = levelNum;
  }

  incrementSlectedLevel() {
    if (this._levelSelected == MAX_LEVELS) {
      this._levelSelected = 1;
    } else {
      this._levelSelected = this._levelSelected + 1;
    }
  }

  private _levelPlayed: number = 0;

  public get LevelPlayed(): number {
    return this._levelPlayed;
  }
  public set LevelPlayed(levelNum: number) {
    this._levelPlayed = levelNum;
  }

  private _hasVisitedHomePage: boolean = false;

  public get hasVisitedHomePage(): boolean {
    return this._hasVisitedHomePage;
  }
  public set hasVisitedHomePage(levelNum: boolean) {
    this._hasVisitedHomePage = levelNum;
  }
}
