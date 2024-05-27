const win = window as any;

export const languages = {
  label_text: {
    clear: "EFFACER",
    done: "SAUVEGARDER",
    road: "ROUTE",
    connect: "CONNECTER",
    play: "JOUER",
    level: "NIVEAU",
    selectlevel: "CHOISIR LE NIVEAU",
  },
};

if (!win.languages) {
  win.languages = {};
}

win.languages.fr = languages;
