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
  // tiles[idx].style.transform = `translate(${-1 * dy * 105}%, ${
  //   -1 * dx * 105
  // }%)`;

  tiles[idx]
    .animate(
      [
        {
          transform: `translate(${-1 * dy * 105}%, ${-1 * dx * 105}%)`,
        },
      ],
      150
    )
    .addEventListener("finish", () => {
      tiles[idx].style.gridArea = `${x + 1} / ${y + 1}`;

      // G_A_M_E.isSolved &&
    });

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
    '<svg data-name="Layer 2" id="Layer_2" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1{fill:none;stroke:#020202;stroke-linecap:round;stroke-miterlimit:12;stroke-width:32px;}</style></defs><path class="cls-1" d="M239.89,358.6H362a0,0,0,0,1,0,0V641.4a0,0,0,0,1,0,0H239.89a62.81,62.81,0,0,1-62.81-62.81V421.4A62.81,62.81,0,0,1,239.89,358.6Z"/><path class="cls-1" d="M588,408.64V818.16c0,3.19-4.65,5-7.83,3L434.2,699.55"/><path class="cls-1" d="M403.46,672l-42.08-35.52v-273L580.12,178.83c3.18-2,7.83-.18,7.83,3V339.6"/><path class="cls-1" d="M639.3,403.1a91.73,91.73,0,1,1,0,183.46"/><path class="cls-1" d="M639.3,311.21a183.62,183.62,0,0,1,0,367.24"/></svg>',
  events: {
    click: () => {
      G_A_M_E.mute((isMuted) => {
        soundButton.innerHTML = isMuted
          ? '<svg data-name="Layer 2" id="Layer_2" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1{fill:none;stroke:#020202;stroke-linecap:round;stroke-miterlimit:12;stroke-width:32px;}</style></defs><line class="cls-1" x1="644.38" x2="831.85" y1="393.76" y2="606.24"/><line class="cls-1" x1="831.85" x2="644.38" y1="393.76" y2="606.24"/><path class="cls-1" d="M231,358.6H353a0,0,0,0,1,0,0V641.4a0,0,0,0,1,0,0H231a62.81,62.81,0,0,1-62.81-62.81V421.4A62.81,62.81,0,0,1,231,358.6Z"/><path class="cls-1" d="M579,408.64V818.16c0,3.19-4.65,5-7.83,3L425.27,699.55"/><path class="cls-1" d="M394.53,672l-42.08-35.52v-273L571.19,178.83c3.18-2,7.83-.18,7.83,3V339.6"/></svg>'
          : '<svg data-name="Layer 2" id="Layer_2" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1{fill:none;stroke:#020202;stroke-linecap:round;stroke-miterlimit:10;stroke-width:22px;}</style></defs><path class="cls-1" d="M239.89,358.6H362a0,0,0,0,1,0,0V641.4a0,0,0,0,1,0,0H239.89a62.81,62.81,0,0,1-62.81-62.81V421.4A62.81,62.81,0,0,1,239.89,358.6Z"/><path class="cls-1" d="M588,408.64V818.16c0,3.19-4.65,5-7.83,3L434.2,699.55"/><path class="cls-1" d="M403.46,672l-42.08-35.52v-273L580.12,178.83c3.18-2,7.83-.18,7.83,3V339.6"/><path class="cls-1" d="M639.3,403.1a91.73,91.73,0,1,1,0,183.46"/><path class="cls-1" d="M639.3,311.21a183.62,183.62,0,0,1,0,367.24"/></svg>';
      });
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
    dragstart: (e) => {
      const el = tiles.find((el) => el.contains(e.target));

      if (el) {
        const [x, y] = [
          Number(el.style.gridRowStart) - 1,
          Number(el.style.gridColumnStart) - 1,
        ];

        e.dataTransfer.setData("x", x);
        e.dataTransfer.setData("y", y);
      }
    },
    dragover: (e) => e.preventDefault(),
    drop: (e) => {
      const x = e.dataTransfer.getData("x");
      const y = e.dataTransfer.getData("y");

      const direction = [UP, DOWN, RIGHT, LEFT].find(
        ({ dx, dy }) => dx === x - G_A_M_E.empty.x && dy === y - G_A_M_E.empty.y
      );

      direction && G_A_M_E.move(direction);
    },
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
