import "minireset.css";
import "./styles/main.scss";

// import { createGame } from "./js/game";
import { createElement } from "./js/lib";

import {
  createGame,
  LEFT,
  RIGHT,
  UP,
  DOWN,
  MOVE_EVENT,
  MOVE_COUNTER_EVENT,
  START_EVENT,
  PLAY_PAUSE_EVENT,
  SOLVED_EVENT,
  TIMECHANGE_EVENT,
} from "./js/core";

const MATRIX_SIZE = 4;

const G_A_M_E = createGame(MATRIX_SIZE);

G_A_M_E.subscribe(MOVE_EVENT, (idx, [x, y], { dx, dy }) => {
  tiles[idx]
    .animate(
      [
        {
          transform: `translate(${-1 * dy * 100}%, ${-1 * dx * 100}%)`,
        },
      ],
      150
    )
    .addEventListener("finish", () => {
      tiles[idx].style.gridArea = `${x + 1} / ${y + 1}`;
    });

  G_A_M_E.isSolved &&
    tiles.forEach((el) => {
      el.animate(
        [
          {
            transform: `rotate(360deg)`,
          },
        ],
        250
      );
    });

  movesControl.textContent = String(G_A_M_E.moves);
});

G_A_M_E.subscribe(START_EVENT, (matrix) => {
  matrix.forEach((row, x) =>
    row.forEach(({ idx }, y) => {
      tiles[idx].style.gridArea = `${x + 1} / ${y + 1}`;

      tiles[idx].animate(
        [
          {
            transform: `rotate(360deg)`,
          },
        ],
        300
      );
    })
  );
});

G_A_M_E.subscribe(PLAY_PAUSE_EVENT, (isPlaying) => {
  let duration = 0;

  setInterval(() => {
    if (isPlaying) {
      duration++;
      timeControl.textContent = `${String((duration / 60) | 0).padStart(
        2,
        "0"
      )}:${String(duration % 60).padStart(2, "0")}`;
    }
  }, 1000);
});

G_A_M_E.subscribe(SOLVED_EVENT, () => {
  alert("You WON");
});

G_A_M_E.subscribe(TIMECHANGE_EVENT, (duration) => {
  timeControl.textContent = `${String((duration / 60) | 0).padStart(
    2,
    "0"
  )}:${String(duration % 60).padStart(2, "0")}`;
});

// ==================================

const tiles = G_A_M_E.matrix
  .map((row, x) =>
    row.map(({ idx, name }, y) => {
      const el = createElement("div", {
        className: `tile ${G_A_M_E.empty.idx === idx ? "tile--empty" : ""}`,
        text: name,
        "data-idx": String(idx),
      });

      el.style.gridArea = `${x + 1} / ${y + 1}`;

      return el;
    })
  )
  .flat();

const board = createElement("div", {
  className: `board board--size-${MATRIX_SIZE}`,
  children: tiles,
  tabindex: "0",
  events: {
    click: (e) => {
      const el = tiles.find((el) => el.contains(e.target));

      if (el) {
        const [x, y] = [
          Number(el.style.gridRowStart) - 1,
          Number(el.style.gridColumnStart) - 1,
        ];

        const direction = [UP, DOWN, RIGHT, LEFT].find(
          ({ dx, dy }) =>
            dx === x - G_A_M_E.empty.x && dy === y - G_A_M_E.empty.y
        );

        direction && G_A_M_E.move(direction);
      }
    },
    keydown: (e) => {
      switch (e.code) {
        case "ArrowUp":
          G_A_M_E.move(UP);
          break;
        case "ArrowDown":
          G_A_M_E.move(DOWN);
          break;
        case "ArrowRight":
          G_A_M_E.move(RIGHT);
          break;
        case "ArrowLeft":
          G_A_M_E.move(LEFT);
          break;
      }
    },
  },
});

const title = createElement("h1", {
  className: "app-title",
  text: "Fifteen puzzle",
});

const movesControl = createElement("span", { text: "0" });
const timeControl = createElement("span", { text: "00:00" });

const controls = createElement("div", {
  className: "stack stack--align-center stack--gap-y-2",
  children: [
    createElement("div", {
      className: "stack stack--row stack--gap-x-2",
      children: [
        createElement("div", {
          className: "info-box",
          children: [createElement("span", { text: "moves" }), movesControl],
        }),
        createElement("div", {
          className: "info-box",
          children: [createElement("span", { text: "time" }), timeControl],
        }),
      ],
    }),
    createElement("div", {
      className: "stack stack--row stack--gap-x-2",
      children: [
        createElement("button", {
          className: "button",
          text: "start game",
          events: {
            click: () => {
              G_A_M_E.start();
              board.focus();
            },
          },
        }),
        createElement("button", {
          className: "button",
          text: G_A_M_E.isPlaying ? "pause" : "resume",
          events: {
            click: () => {
              G_A_M_E.playpause();
            },
          },
        }),
        createElement("button", { className: "button", text: "save game" }),
      ],
    }),
  ],
});

const app = createElement("div", {
  className: "app",
  children: [title, controls, board],
});

document.body.append(app);

/* 

const MATRIX_SIZE = 4;

const G_A_M_E = createGame(MATRIX_SIZE, (state) => {
  console.log(state);
});

const tiles = G_A_M_E.matrix
  .map((row, x) =>
    row.map(({ idx, name }, y) => {
      const el = createElement("div", {
        className: `tile ${G_A_M_E.empty.idx === idx ? "tile--empty" : ""}`,
        text: name,
        "data-idx": String(idx),
      });

      el.style.gridArea = `${x + 1} / ${y + 1}`;

      return el;
    })
  )
  .flat();

const board = createElement("div", {
  className: `board board--size-${G_A_M_E.matrix.length}`,
  children: tiles,
  events: {
    click: (e) => {
      const el = tiles.find((el) => el.contains(e.target));

      if (el) {
        const idx = Number(el.dataset.idx);
        G_A_M_E.move(idx, ([x, y], { dx, dy }) => {
          tiles[idx]
            .animate(
              [
                {
                  transform: `translate(${dy * 100}%, ${dx * 100}%)`,
                },
              ],
              150
            )
            .addEventListener("finish", () => {
              tiles[idx].style.gridArea = `${x + 1} / ${y + 1}`;
            });
        });
      }
    },
  },
});

const title = createElement("h1", {
  className: "app-title",
  text: "Fifteen puzzle",
});

const controls = createElement("div", {
  className: "stack stack--align-center stack--gap-y-2",
  children: [
    createElement("div", {
      className: "stack stack--row stack--gap-x-2",
      children: [
        createElement("div", {
          className: "info-box",
          children: [
            createElement("span", { text: "moves" }),
            createElement("span", { text: "0" }),
          ],
        }),
        createElement("div", {
          className: "info-box",
          children: [
            createElement("span", { text: "time" }),
            createElement("span", { text: "00:00" }),
          ],
        }),
      ],
    }),
    createElement("div", {
      className: "stack stack--row stack--gap-x-2",
      children: [
        createElement("button", {
          className: "button",
          text: "start game",
          events: {
            click: () => {
              G_A_M_E.start((idx, [x, y]) => {
                tiles[idx].style.gridArea = `${x + 1} / ${y + 1}`;
              });
            },
          },
        }),
        createElement("button", { className: "button", text: "pause" }),
        createElement("button", { className: "button", text: "save game" }),
      ],
    }),
  ],
});

const app = createElement("div", {
  className: "app",
  children: [title, controls, board],
});

document.body.append(app);
*/
