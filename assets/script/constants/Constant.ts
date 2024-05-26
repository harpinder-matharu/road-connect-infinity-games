export const LOCAL_STORAGE = {
  LANGUAGE_ID: "languageId",
  LAST_OPENED: "lastOpenedLevel",
};
export const SESSION_STORAGE = {
  LANGUAGE_ID: "languageId",
  GAME_STARTED: "gameStarted",
};

export const SCENE = {
  GAME: "GamePlay",
  LOBBY: "Lobby",
};

export const DURATIONS = {
  LEVEL_BUILDING: 0.5,
  LEVEL_CLEARING: 0.3,
  LOGO_IN: 0.1,
  PLAY_IN: 0.5,
};

export const MAX_LEVELS = 10;
export const IS_TESTING_MODE = true;

export const CUSTON_EVENT = {
  LOADING_DONE: "loading_done",
};

export enum SOUNDS_NAME {
  FUNKY_CHILL_2_LOOP = "FunkyChill2loop",
  DEFAULT_CLICK = "DefaultClick",
  ROTATE_SHAPE = "RotateShape",
  SHAPE_APPEAR = "ShapeAppear",
  LEVEL_COMPLETE = "LevelComplete",
}

export enum ITEM_TYPE {
  NONE = 0,
  ROAD1,
  ROAD2,
  ROAD3,
  ROAD4,
  ROAD5,
  ROAD6,
  ROAD7,
}
export enum ROTATION_TYPE {
  NONE,
  TWO_WAY,
  FOUR_WAY,
  ZERO_WAY,
}

export enum ASSET_CACHE_MODE {
  /** 一Secondary (immediately destroy nodes, prefabricated body resources are released immediately） */
  Once = 1,
  /** Normal (destroy the node immediately, but cache prefabricated resources） */
  Normal,
  /** Frequent (only close the node, and cache prefabricated body resources) */
  Frequent,
}
