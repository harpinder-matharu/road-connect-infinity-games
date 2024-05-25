const win = window as any;

export const languages = {
  label_text: {
    clear: "CLEAR",
    done: "DONE",
    road: "ROAD",
    connect: "CONNECT",
    play: "PLAY",
    level: "LEVEL",
    selectlevel: "SELECT LEVEL",
  },
};

if (!win.languages) {
  win.languages = {};
}

win.languages.zh = languages;
