import { sys } from "cc";
import { AudioClip, AudioSource, Vec3 } from "cc";

export class SoundManager {
  private static _instance: SoundManager = null!;
  private _audioSource: AudioSource = null!;
  private _SoundEffectAudioSource: AudioSource = null!;
  private canPlayMusic: Boolean = true;
  private canPlaySound: Boolean = true;

  public static getInstance() {
    if (!SoundManager._instance) {
      SoundManager._instance = new SoundManager();
    }
    return SoundManager._instance;
  }

  init(audioSource: AudioSource) {
    this._audioSource = audioSource;
    this._audioSource.volume = sys.localStorage.getItem("MusicVolume")
      ? JSON.parse(sys.localStorage.getItem("MusicVolume"))
      : 0.5;
  }

  initSoundEffectAS(audioSource: AudioSource) {
    this._SoundEffectAudioSource = audioSource;
    this._SoundEffectAudioSource.volume = sys.localStorage.getItem(
      "EffectVolume"
    )
      ? JSON.parse(sys.localStorage.getItem("EffectVolume"))
      : 0.5;
  }

  playOneShotSoundEffect(clip: AudioClip) {
    if (!this.canPlayMusic) {
      return;
    }
    if (clip) {
      this._audioSource.playOneShot(clip, 1);
    } else {
    }
  }

  playSoundEffect(clip: AudioClip, loop: boolean = false) {
    if (!this.canPlaySound) {
      return;
    }
    if (clip) {
      this.stopSoundEffect();
      this._SoundEffectAudioSource.clip = clip;
      this._SoundEffectAudioSource.loop = loop;
      this._SoundEffectAudioSource.play();
    } else {
    }
  }

  stopSoundEffect() {
    this._SoundEffectAudioSource && this._SoundEffectAudioSource.stop();
  }

  playMusic(loop: boolean) {
    if (!this.canPlayMusic) {
      return;
    }
    this._audioSource.loop = loop;
    if (!this._audioSource.playing) {
      this._audioSource.play();
    }
  }

  playMusicClip(clip: AudioClip, loop: boolean) {
    if (!this.canPlayMusic) {
      return;
    }
    if (clip) {
      this.stopMusic();
      this._audioSource.clip = clip;
      this._audioSource.loop = loop;
      this._audioSource.play();
    } else {
    }
  }

  stopMusic() {
    this._audioSource.stop();
  }

  setMusicVolume(flag: number) {
    flag = Math.round(flag * 10) / 10;
    this._audioSource.volume = flag;
    sys.localStorage.setItem("MusicVolume", flag.toString());
  }

  setEffectsVolume(flag: number) {
    flag = Math.round(flag * 10) / 10;
    this._SoundEffectAudioSource.volume = flag;
    sys.localStorage.setItem("EffectVolume", flag.toString());
  }

  get MusicVolume() {
    return this._audioSource.volume;
  }

  get EffectsVolume() {
    return this._SoundEffectAudioSource.volume;
  }
  get CanPlayMusic(): Boolean {
    return this.canPlayMusic;
  }

  set CanPlayMusic(value: Boolean) {
    if (value) {
      this._audioSource.play();
    } else {
      this._audioSource.pause();
    }
    sys.localStorage.setItem("CanPlayMusic", value.toString());
    this.canPlayMusic = value;
  }

  set CanPlaySound(value: Boolean) {
    if (value) {
      this._SoundEffectAudioSource.play();
    } else {
      this._SoundEffectAudioSource.stop();
    }
    sys.localStorage.setItem("CanPlayEffects", value.toString());
    this.canPlaySound = value;
  }
  get CanPlayWinSound(): Boolean {
    return this.canPlaySound;
  }
  get CanPlaySound(): Boolean {
    return this.canPlaySound;
  }

  setVolumePrefFromLocal() {
    let MusicVolume: string = localStorage.getItem("MusicVolume");
    let EffectVolume: string = localStorage.getItem("EffectVolume");
    let CanPlayMusic: string = localStorage.getItem("CanPlayMusic");
    let CanPlayEffects: string = localStorage.getItem("CanPlayEffects");

    if (MusicVolume) {
      this.setMusicVolume(parseFloat(MusicVolume));
    }
    if (EffectVolume) {
      this.setEffectsVolume(parseFloat(EffectVolume));
    }
    if (CanPlayMusic) {
      this.CanPlayMusic = CanPlayMusic === "true";
    }
    if (CanPlayEffects) {
      this.CanPlaySound = CanPlayEffects === "true";
    }
  }
}
