export const LOCAL_STORAGE = {
  TOKEN: "token",
  GAMEID: "gameid",
  LAST_OPENED: "lastOpenedLevel",
};
export const SESSION_STORAGE = {
  TOKEN: "token",
  GAMEID: "gameid",
  GAME_STARTED: "gameStarted",
};

export const SCENE = {
  GAME: "GamePlay",
  LOBBY: "Lobby",
};

export const MAX_LEVELS = 10;

export enum SOUNDS_NAME {
  FUNKY_CHILL_2_LOOP = "FunkyChill2loop",
  DEFAULT_CLICK = "DefaultClick",
  ROTATE_SHAPE = "RotateShape",
  SHAPE_APPEAR = "ShapeAppear",
  LEVEL_COMPLETE = "LevelComplete",
}

export enum ASSET_CACHE_MODE {
  /** 一Secondary (immediately destroy nodes, prefabricated body resources are released immediately） */
  Once = 1,
  /** Normal (destroy the node immediately, but cache prefabricated resources） */
  Normal,
  /** Frequent (only close the node, and cache prefabricated body resources) */
  Frequent,
}
