import "minireset.css";
import "./styles/main.scss";

import { createGame } from "./js/game";
import { createElement } from "./js/lib";

const MATRIX_SIZE = 3;

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
