import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

import * as i18n from "../../../extensions/i18n/assets/LanguageData";
@ccclass("SelectLanguage")
export class SelectLanguage extends Component {
  start() {}

  toggleCallback(event: Event, customEventData: string) {
    switch (customEventData) {
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
  }
}
