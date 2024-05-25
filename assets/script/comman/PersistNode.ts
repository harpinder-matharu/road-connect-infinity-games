import {
  _decorator,
  AudioSource,
  Component,
  director,
  Node,
  ProgressBar,
} from "cc";

import { GameManager } from "../managers/GameManager";
import {
  CircularLoader,
  LoaderType,
} from "../../components/loader/CircularLoader";
import { SoundManager } from "../managers/SoundManager";
import { ResourcesManager } from "../managers/ResourcesManager";
import {
  ASSET_CACHE_MODE,
  CUSTON_EVENT,
  MAX_LEVELS,
  SOUNDS_NAME,
} from "../constants/Constant";
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

  @property({ type: ProgressBar })
  loadingProgress: ProgressBar = null!;

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
    let audioResources = [
      { FunkyChill2loop: "SoundMusic/FunkyChill2loop" },
      { DefaultClick: "SoundMusic/DefaultClick" },
      { RotateShape: "SoundMusic/RotateShape" },
      { ShapeAppear: "SoundMusic/ShapeAppear" },
      { LevelComplete: "SoundMusic/LevelComplete" },
    ];

    let levelReources = [];
    for (let index = 1; index <= MAX_LEVELS; index++) {
      levelReources.push({ index: `Levels/level${index}` });
    }
    let resouresToBeLoaded = [...levelReources, ...audioResources];
    await ResourcesManager.loadArrayOfResource(
      resouresToBeLoaded,
      ASSET_CACHE_MODE.Normal,
      this.loading
    );

    SoundManager.getInstance().setMusicVolume(0.5);
    SoundManager.getInstance().setEffectsVolume(1);

    this.playAudio(
      ResourcesManager.Instance.getResourceFromCache(
        SOUNDS_NAME.FUNKY_CHILL_2_LOOP
      ),
      true
    );
  }

  loading = (progress: number) => {
    this.loadingProgress.progress = progress;
    if (progress >= 1) {
      this.loadingProgress.node.active = false;
      director.emit(CUSTON_EVENT.LOADING_DONE);
    }
  };
}
