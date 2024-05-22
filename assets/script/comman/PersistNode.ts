import { _decorator, AudioSource, Component, director, Node } from "cc";

import { GameManager } from "../managers/GameManager";
import {
  CircularLoader,
  LoaderType,
} from "../../components/loader/CircularLoader";
import { SoundManager } from "../managers/SoundManager";
import { ResourcesManager } from "../managers/ResourcesManager";
import { SOUNDS_NAME } from "../constants/Constant";
const { ccclass, property } = _decorator;

@ccclass("PersistNode")
export class PersistNode extends Component {
  @property({ type: Node })
  snakBar: Node = null!;
  @property({ type: Node }) loader: Node = null!;

  @property({ type: Node })
  musicAudioSource: Node = null;
  @property({ type: Node })
  soundAudioSource: Node = null;

  start() {
    director.addPersistRootNode(this.node);
    GameManager.Instance.PersistNodeRef = this;
    this.initAudioSource();
    this.loadAudios();
  }

  showLoader() {
    this.loader!.getComponent(CircularLoader)!.showLoader(
      LoaderType.FULL_SCREEN
    );
  }

  initAudioSource() {
    SoundManager.getInstance().init(
      this.musicAudioSource.getComponent(AudioSource)!
    );
    SoundManager.getInstance().initSoundEffectAS(
      this.soundAudioSource.getComponent(AudioSource)!
    );
  }

  playAudio(clip, isloopOn: boolean) {
    SoundManager.getInstance().playMusicClip(clip, isloopOn);
  }
  playEffect(clip) {
    SoundManager.getInstance().playSoundEffect(clip, false);
  }
  stopAudio() {
    SoundManager.getInstance().stopMusic();
  }
  resumeAudio() {
    SoundManager.getInstance().playMusic(true);
  }

  hideLoader() {
    this.loader!.getComponent(CircularLoader)!.stopLoader();
  }

  async loadAudios() {
    await ResourcesManager.loadArrayOfResource([
      { settingsPopup: "SoundMusic/FunkyChill2loop" },
      { settingsPopup2: "SoundMusic/DefaultClick" },
      { settingsPopup3: "SoundMusic/RotateShape" },
      { settingsPopup4: "SoundMusic/ShapeAppear" },
      { settingsPopup5: "SoundMusic/LevelComplete" },
    ]);
    console.log(
      "HEY",
      ResourcesManager.Instance.getResourceFromCache("FunkyChill2loop")
    );

    SoundManager.getInstance().setMusicVolume(0.3);
    this.playAudio(
      ResourcesManager.Instance.getResourceFromCache(
        SOUNDS_NAME.FUNKY_CHILL_2_LOOP
      ),
      true
    );
  }
}
