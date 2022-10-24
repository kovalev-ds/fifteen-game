import "minireset.css";
import "./styles/main.scss";

import { createElement, secToStringTime } from "./js/lib";

import {
  createGame,
  LEFT,
  RIGHT,
  UP,
  DOWN,
  MOVE_EVENT,
  START_EVENT,
  PLAY_PAUSE_EVENT,
  SOLVED_EVENT,
  TIMECHANGE_EVENT,
} from "./js/core";

const G_A_M_E = createGame();

G_A_M_E.subscribe(MOVE_EVENT, (idx, [x, y], { dx, dy }) => {
  const tile = tiles[idx];

  const tileAnimation = tile.animate(
    [
      {
        transform: `translate(${-1 * dy * 105}%, ${-1 * dx * 105}%)`,
      },
    ],
    150
  );

  const handleFinishAnimation = () => {
    tiles[idx].style.gridArea = `${x + 1} / ${y + 1}`;

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

    tileAnimation.removeEventListener("finish", handleFinishAnimation);
  };

  tileAnimation.addEventListener("finish", handleFinishAnimation);

  movesControl.textContent = String(G_A_M_E.moves);
});

G_A_M_E.subscribe(START_EVENT, () => {
  movesControl.textContent = String(G_A_M_E.moves);
  timeControl.textContent = secToStringTime(G_A_M_E.duration);
  overlayTitle.textContent = "";

  G_A_M_E.matrix.forEach((row, x) =>
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

G_A_M_E.subscribe(PLAY_PAUSE_EVENT, () => {
  G_A_M_E.isPlaying
    ? overlay.classList.add("hidden")
    : overlay.classList.remove("hidden");
});

G_A_M_E.subscribe(TIMECHANGE_EVENT, () => {
  timeControl.textContent = secToStringTime(G_A_M_E.duration);
});

G_A_M_E.subscribe(SOLVED_EVENT, () => {
  console.log(
    `You WON!, It takes you ${G_A_M_E.moves} moves and ${G_A_M_E.duration} seconds`
  );
  overlay.classList.remove("hidden");
  overlayTitle.innerHTML = `Hooray! You solved the puzzle in <b>${secToStringTime(
    G_A_M_E.duration
  )}</b> and <b>${G_A_M_E.moves}</b> moves!`;
});

// ==================================

const title = createElement("h1", {
  className: "app-title",
  text: "Fifteen puzzle",
});

const movesControl = createElement("span", { text: "0" });
const timeControl = createElement("span", { text: "00:00" });

const soundButton = createElement("button", {
  className: "button button--rounded",
  html:
    '<svg style="enable-background:new 0 0 32 32;" fill="#3f3844" version="1.1" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M14,2c-0.781,0-1.313,0.438-2,1.016L6,8H2c-1.1,0-2,0.9-2,2v12c0,1.1,0.9,2,2,2h4l6,4.984C12.688,29.563,13.219,30,14,30  c1.219,0,2-0.984,2-2V4C16,2.984,15.219,2,14,2z M12,23.784L7.445,20H4v-8h3.445L12,8.216V23.784z M20,6c-1.25,0-2,1.047-2,2  c0,1.422,2,2.781,2,8s-2,6.578-2,8c0,0.953,0.75,2,2,2c1.016,0,1.625-0.547,2.281-2C23.51,21.279,24,18.672,24,16  s-0.49-5.279-1.719-8C21.625,6.547,21.016,6,20,6z M29.146,4c-0.838-1.771-1.63-2-2.333-2c-1.188,0-2,1-2,2  C24.813,5.672,28,8.531,28,16s-3.188,10.328-3.188,12c0,1,0.813,2,2,2c0.703,0,1.495-0.229,2.333-2C30.063,26.063,32,22.156,32,16  S30.063,5.938,29.146,4z"/></svg>',
  events: {
    click: () => {
      G_A_M_E.start();
      board.focus();
    },
  },
});

const settingsButton = createElement("button", {
  className: "button button--rounded",
  html:
    '<svg enable-background="new 0 0 32 32" fill="#3f3844"  id="Glyph" version="1.1" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M27.526,18.036L27,17.732c-0.626-0.361-1-1.009-1-1.732s0.374-1.371,1-1.732l0.526-0.304  c1.436-0.83,1.927-2.662,1.098-4.098l-1-1.732c-0.827-1.433-2.666-1.925-4.098-1.098L23,7.339c-0.626,0.362-1.375,0.362-2,0  c-0.626-0.362-1-1.009-1-1.732V5c0-1.654-1.346-3-3-3h-2c-1.654,0-3,1.346-3,3v0.608c0,0.723-0.374,1.37-1,1.732  c-0.626,0.361-1.374,0.362-2,0L8.474,7.036C7.042,6.209,5.203,6.701,4.375,8.134l-1,1.732c-0.829,1.436-0.338,3.269,1.098,4.098  L5,14.268C5.626,14.629,6,15.277,6,16s-0.374,1.371-1,1.732l-0.526,0.304c-1.436,0.829-1.927,2.662-1.098,4.098l1,1.732  c0.828,1.433,2.667,1.925,4.098,1.098L9,24.661c0.626-0.363,1.374-0.361,2,0c0.626,0.362,1,1.009,1,1.732V27c0,1.654,1.346,3,3,3h2  c1.654,0,3-1.346,3-3v-0.608c0-0.723,0.374-1.37,1-1.732c0.625-0.361,1.374-0.362,2,0l0.526,0.304  c1.432,0.826,3.271,0.334,4.098-1.098l1-1.732C29.453,20.698,28.962,18.865,27.526,18.036z M16,21c-2.757,0-5-2.243-5-5s2.243-5,5-5  s5,2.243,5,5S18.757,21,16,21z" id="XMLID_273_"/></svg>',
  events: {
    click: () => {
      G_A_M_E.playpause();
      board.focus();
    },
  },
});

// const sizeControls = createElement("div", {
//   className:
//     "stack stack--row stack--wrap stack--justify-center stack--gap-2 hidden",
//   children: [3, 4, 5, 6, 7, 8].map((size) => {
//     return createElement("button", {
//       className: "button",
//       text: size + "x" + size,
//       "data-size": size,
//     });
//   }),
//   events: {
//     click: (e) => {
//       const { size } = e.target?.dataset;
//       if (size) {
//         G_A_M_E.start(Number(size));
//         board.focus();
//         sizeControls.classList.add("hidden");
//       }
//     },
//   },
// });

const startButton = createElement("button", {
  className: "button",
  text: "start new game",
  children: [],
  events: {
    click: () => {
      G_A_M_E.start();
      board.focus();
    },
  },
});

const tiles = G_A_M_E.matrix
  .map((row, x) =>
    row.map(({ idx, name }, y) => {
      const el = createElement("div", {
        className: `tile ${G_A_M_E.empty.idx === idx ? "tile--empty" : ""}`,
        text: name,
        draggable: true,
      });

      el.style.gridArea = `${x + 1} / ${y + 1}`;

      return el;
    })
  )
  .flat();

const overlayTitle = createElement("h2", {
  className: "board-overlay-title",
});

const overlay = createElement("div", {
  className: "board-overlay",
  children: [
    overlayTitle,
    createElement("div", {
      className: "stack stack--row stack--gap-x-2 py-4",
      children: [startButton],
    }),
  ],
});

const board = createElement("div", {
  className: `board board--size-${G_A_M_E.matrix.length}`,
  children: [...tiles, overlay],
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

const controls = createElement("div", {
  className: "stack stack--align-center stack--row stack--gap-x-2",
  children: [
    soundButton,
    createElement("div", {
      className: "info-box",
      children: [createElement("span", { text: "moves" }), movesControl],
    }),
    createElement("div", {
      className: "info-box",
      children: [createElement("span", { text: "time" }), timeControl],
    }),
    settingsButton,
  ],
});

const info = createElement("h2", {
  className: "info-text",
  html:
    "To move a tile you can <b>click</b> on it or use your <b>arrow keys</b>. Press <b>ESC</b> to pause game.",
});

const app = createElement("div", {
  className: "app",
  children: [title, controls, board, info],
});

document.addEventListener("keydown", (e) => {
  switch (e.code) {
    case "Escape": {
      G_A_M_E.playpause();
      board.focus();
    }
  }
});

document.body.append(app);
