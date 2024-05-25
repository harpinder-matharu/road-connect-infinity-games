const win = window as any;

export const languages = {
  label_text: {
    clear: "CLARO",
    done: "FEITO",
    road: "ESTRADA",
    connect: "CONECTAR",
    play: "JOGAR",
    level: "NIVEL",
    selectlevel: "SELECIONE O NÍVEL",
  },
};

if (!win.languages) {
  win.languages = {};
}

win.languages.pt = languages;
