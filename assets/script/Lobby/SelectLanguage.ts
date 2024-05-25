import { _decorator, Component, Node, Toggle, ToggleContainer } from "cc";
const { ccclass, property } = _decorator;

import * as i18n from "../../../extensions/i18n/assets/LanguageData";
import {
  LocAndSessStoreManager,
  STORAGE,
} from "../managers/LocAndSessStoreManager";
import { LOCAL_STORAGE } from "../constants/Constant";
@ccclass("SelectLanguage")
export class SelectLanguage extends Component {
  @property({ type: Toggle })
  toggleEn: Toggle = null!;
  @property({ type: Toggle })
  togglePt: Toggle = null!;
  @property({ type: Toggle })
  toggleFr: Toggle = null!;

  start() {
    let languageId = LocAndSessStoreManager.Instance.getData(
      LOCAL_STORAGE.LANGUAGE_ID,
      STORAGE.LOCAL
    );
    if (languageId.length != 0) {
      switch (languageId) {
        case "en":
          this.toggleEn.isChecked = true;
          break;
        case "fr":
          this.toggleFr.isChecked = true;
          break;
        case "pt":
          this.togglePt.isChecked = true;
          break;
        default:
          break;
      }
    }
  }

  toggleCallback(event: Event, customEventData: string) {
    let node: Node | any = event.target;
    if (node.getComponent(Toggle).isChecked) {
      this.changeLanguage(customEventData);
    }
  }

  changeLanguage(languageId: string) {
    switch (languageId) {
      case "en":
        i18n.init("en");
        i18n.updateSceneRenderers();
        break;
      case "fr":
        i18n.init("fr");
        i18n.updateSceneRenderers();
        break;
      case "pt":
        i18n.init("pt");
        i18n.updateSceneRenderers();
        break;
      default:
        break;
    }
    LocAndSessStoreManager.Instance.setData(
      LOCAL_STORAGE.LANGUAGE_ID,
      languageId,
      STORAGE.LOCAL
    );
  }
}
