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

const MATRIX_SIZE = 4;

const G_A_M_E = createGame(MATRIX_SIZE);


G_A_M_E.subscribe(MOVE_EVENT, (idx, [x, y], { dx, dy }) => {
  const tile = tiles[idx]

  const tileAnimation = tile.animate(
    [
      {
        transform: `translate(${-1 * dy * 105}%, ${-1 * dx * 105}%)`,
      },
    ],
    150
  )

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

    tileAnimation.removeEventListener("finish", handleFinishAnimation)
  }

  tileAnimation.addEventListener("finish", handleFinishAnimation);

  movesControl.textContent = String(G_A_M_E.moves);
});

G_A_M_E.subscribe(START_EVENT, () => {

  movesControl.textContent = String(G_A_M_E.moves);
  timeControl.textContent = secToStringTime(G_A_M_E.duration);

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
  G_A_M_E.isPlaying ? overlay.classList.add('hidden') : overlay.classList.remove('hidden')
});


G_A_M_E.subscribe(TIMECHANGE_EVENT, () => {
  timeControl.textContent = secToStringTime(G_A_M_E.duration);
});


G_A_M_E.subscribe(SOLVED_EVENT, () => {
  console.log(`You WON!, It takes you ${G_A_M_E.moves} moves and ${G_A_M_E.duration} seconds`);
  overlay.classList.remove("hidden")
});

// ==================================

const title = createElement("h1", {
  className: "app-title",
  text: "Fifteen puzzle",
});

const movesControl = createElement("span", { text: "0" });
const timeControl = createElement("span", { text: "00:00" });

const startButton = createElement("button", {
  className: "button",
  text: "start new game",
  events: {
    click: () => {
      G_A_M_E.start();
      board.focus();
    },
  },
})


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

const overlay = createElement('div', {
  className: 'board-overlay', children: [
    createElement("div", {
      className: "stack stack--row stack--gap-x-2",
      children: [
        startButton
      ],
    }),
  ]
})

const board = createElement("div", {
  className: `board board--size-${MATRIX_SIZE}`,
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
        case "Escape": {
          G_A_M_E.playpause();
        }
      }
    },
  },
});

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
  ],
});

const app = createElement("div", {
  className: "app",
  children: [title, controls, board],
});

document.body.append(app);
