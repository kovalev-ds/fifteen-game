/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/minireset.css/minireset.css":
/*!**************************************************!*\
  !*** ./node_modules/minireset.css/minireset.css ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/styles/main.scss":
/*!******************************!*\
  !*** ./src/styles/main.scss ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/js/core.js":
/*!************************!*\
  !*** ./src/js/core.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DOWN": () => (/* binding */ DOWN),
/* harmony export */   "LEFT": () => (/* binding */ LEFT),
/* harmony export */   "MOVE_COUNTER_EVENT": () => (/* binding */ MOVE_COUNTER_EVENT),
/* harmony export */   "MOVE_EVENT": () => (/* binding */ MOVE_EVENT),
/* harmony export */   "PLAY_PAUSE_EVENT": () => (/* binding */ PLAY_PAUSE_EVENT),
/* harmony export */   "RIGHT": () => (/* binding */ RIGHT),
/* harmony export */   "SOLVED_EVENT": () => (/* binding */ SOLVED_EVENT),
/* harmony export */   "START_EVENT": () => (/* binding */ START_EVENT),
/* harmony export */   "TIMECHANGE_EVENT": () => (/* binding */ TIMECHANGE_EVENT),
/* harmony export */   "UP": () => (/* binding */ UP),
/* harmony export */   "createGame": () => (/* binding */ createGame)
/* harmony export */ });
const RIGHT = { dx: 0, dy: -1 };
const LEFT = { dx: 0, dy: 1 };
const UP = { dx: 1, dy: 0 };
const DOWN = { dx: -1, dy: 0 };

const MOVE_EVENT = "--move";
const MOVE_COUNTER_EVENT = "--count";
const START_EVENT = "--start";
const PLAY_PAUSE_EVENT = "--playpause";
const SOLVED_EVENT = "--solved";
const TIMECHANGE_EVENT = "--timechange";

const createGame = (size = 4) => {
  const subscribers = {};
  const dispatch = (type, ...payload) => {
    subscribers[type] && subscribers[type].forEach((fn) => fn(...payload));
  };

  const matrix = Array.from({ length: size }, (_, i) => {
    return Array.from({ length: size }, (_, j) => ({
      idx: i * size + j,
      name: i * size + j + 1,
    }));
  });

  const empty = matrix.at(-1).at(-1);

  let [emptyX, emptyY] = [size - 1, size - 1];

  let moves = 0;
  let duration = 0;
  let isPlaying = false;
  let intervalId;

  const canMove = (x, y) => {
    return x >= 0 && x < size && y >= 0 && y < size;
  };

  const swap = (matrix, [x1, y1], [x2, y2]) => {
    [matrix[x1][y1], matrix[x2][y2]] = [matrix[x2][y2], matrix[x1][y1]];
  };

  return {
    matrix,
    get moves() {
      return moves;
    },
    get duration() {
      return duration;
    },
    get isSolved() {
      return matrix.every((row, x) =>
        row.every(({ idx }, y) => x * size + y === idx)
      );
    },
    get empty() {
      return { ...empty, x: emptyX, y: emptyY };
    },
    get isPlaying() {
      return isPlaying;
    },
    move({ dx, dy }) {
      if (!isPlaying) return;

      let nx = emptyX + dx;
      let ny = emptyY + dy;

      if (canMove(nx, ny)) {
        moves++;

        swap(matrix, [nx, ny], [emptyX, emptyY]);

        [emptyX, emptyY, nx, ny] = [nx, ny, emptyX, emptyY];

        dispatch(MOVE_EVENT, matrix[nx][ny].idx, [nx, ny], {
          dx,
          dy,
        });
      }
    },
    playpause() {
      isPlaying = !isPlaying;
    },
    start() {
      clearInterval(intervalId);

      isPlaying = true;
      duration = 0;
      moves = 0;

      // make timer run on 2 actions (start, pause)

      intervalId = setInterval(() => {
        if (isPlaying) {
          duration++;
          dispatch(TIMECHANGE_EVENT, duration);
        }
      }, 1000);

      const neighbors = [UP, DOWN, RIGHT, LEFT];

      for (let i = 0; i < 200; i++) {
        const { dx, dy } = neighbors[
          Math.floor(Math.random() * neighbors.length)
        ];

        let nx = emptyX + dx;
        let ny = emptyY + dy;

        if (canMove(nx, ny)) {
          swap(matrix, [nx, ny], [emptyX, emptyY]);

          [emptyX, emptyY, nx, ny] = [nx, ny, emptyX, emptyY];
        }
      }

      dispatch(START_EVENT, matrix);
      dispatch(PLAY_PAUSE_EVENT, isPlaying);
    },
    subscribe(type, fn) {
      if (!subscribers[type]) {
        subscribers[type] = [];
      }
      subscribers[type].push(fn);
    },
  };
};


/***/ }),

/***/ "./src/js/lib.js":
/*!***********************!*\
  !*** ./src/js/lib.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createElement": () => (/* binding */ createElement)
/* harmony export */ });
const createElement = (tag, options) => {
  const { className, text, events = {}, children = [], ...attrs } = options;

  const el = document.createElement(tag);

  className && el.setAttribute("class", className);
  text && (el.textContent = text);

  Object.keys(events).forEach((key) => {
    events[key] && el.addEventListener(key, events[key]);
  });

  Object.keys(attrs).forEach((key) => {
    attrs[key] && el.setAttribute(key, attrs[key]);
  });

  el.append(...children);

  return el;
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var minireset_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! minireset.css */ "./node_modules/minireset.css/minireset.css");
/* harmony import */ var _styles_main_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles/main.scss */ "./src/styles/main.scss");
/* harmony import */ var _js_lib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./js/lib */ "./src/js/lib.js");
/* harmony import */ var _js_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./js/core */ "./src/js/core.js");



// import { createGame } from "./js/game";




const MATRIX_SIZE = 4;

const G_A_M_E = (0,_js_core__WEBPACK_IMPORTED_MODULE_3__.createGame)(MATRIX_SIZE);

G_A_M_E.subscribe(_js_core__WEBPACK_IMPORTED_MODULE_3__.MOVE_EVENT, (idx, [x, y], { dx, dy }) => {
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

G_A_M_E.subscribe(_js_core__WEBPACK_IMPORTED_MODULE_3__.START_EVENT, (matrix) => {
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

G_A_M_E.subscribe(_js_core__WEBPACK_IMPORTED_MODULE_3__.PLAY_PAUSE_EVENT, (isPlaying) => {
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

G_A_M_E.subscribe(_js_core__WEBPACK_IMPORTED_MODULE_3__.SOLVED_EVENT, () => {
  alert("You WON");
});

G_A_M_E.subscribe(_js_core__WEBPACK_IMPORTED_MODULE_3__.TIMECHANGE_EVENT, (duration) => {
  timeControl.textContent = `${String((duration / 60) | 0).padStart(
    2,
    "0"
  )}:${String(duration % 60).padStart(2, "0")}`;
});

// ==================================

const tiles = G_A_M_E.matrix
  .map((row, x) =>
    row.map(({ idx, name }, y) => {
      const el = (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
        className: `tile ${G_A_M_E.empty.idx === idx ? "tile--empty" : ""}`,
        text: name,
        "data-idx": String(idx),
      });

      el.style.gridArea = `${x + 1} / ${y + 1}`;

      return el;
    })
  )
  .flat();

const board = (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
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

        const direction = [_js_core__WEBPACK_IMPORTED_MODULE_3__.UP, _js_core__WEBPACK_IMPORTED_MODULE_3__.DOWN, _js_core__WEBPACK_IMPORTED_MODULE_3__.RIGHT, _js_core__WEBPACK_IMPORTED_MODULE_3__.LEFT].find(
          ({ dx, dy }) =>
            dx === x - G_A_M_E.empty.x && dy === y - G_A_M_E.empty.y
        );

        direction && G_A_M_E.move(direction);
      }
    },
    keydown: (e) => {
      switch (e.code) {
        case "ArrowUp":
          G_A_M_E.move(_js_core__WEBPACK_IMPORTED_MODULE_3__.UP);
          break;
        case "ArrowDown":
          G_A_M_E.move(_js_core__WEBPACK_IMPORTED_MODULE_3__.DOWN);
          break;
        case "ArrowRight":
          G_A_M_E.move(_js_core__WEBPACK_IMPORTED_MODULE_3__.RIGHT);
          break;
        case "ArrowLeft":
          G_A_M_E.move(_js_core__WEBPACK_IMPORTED_MODULE_3__.LEFT);
          break;
      }
    },
  },
});

const title = (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("h1", {
  className: "app-title",
  text: "Fifteen puzzle",
});

const movesControl = (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("span", { text: "0" });
const timeControl = (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("span", { text: "00:00" });

const controls = (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
  className: "stack stack--align-center stack--gap-y-2",
  children: [
    (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
      className: "stack stack--row stack--gap-x-2",
      children: [
        (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
          className: "info-box",
          children: [(0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("span", { text: "moves" }), movesControl],
        }),
        (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
          className: "info-box",
          children: [(0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("span", { text: "time" }), timeControl],
        }),
      ],
    }),
    (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
      className: "stack stack--row stack--gap-x-2",
      children: [
        (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("button", {
          className: "button",
          text: "start game",
          events: {
            click: () => {
              G_A_M_E.start();
              board.focus();
            },
          },
        }),
        (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("button", {
          className: "button",
          text: G_A_M_E.isPlaying ? "pause" : "resume",
          events: {
            click: () => {
              G_A_M_E.playpause();
            },
          },
        }),
        (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("button", { className: "button", text: "save game" }),
      ],
    }),
  ],
});

const app = (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
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

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLGVBQWU7QUFDbkQsb0NBQW9DLFdBQVc7QUFDL0M7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLGNBQWM7QUFDbEQsb0NBQW9DLGVBQWU7QUFDbkQ7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQStDLE9BQU8sSUFBSSxNQUFNO0FBQ2hFLGVBQWU7QUFDZixhQUFhO0FBQ2IsV0FBVztBQUNYLFNBQVM7QUFDVCxrQ0FBa0Msb0NBQW9DO0FBQ3RFLGtDQUFrQyx3Q0FBd0M7QUFDMUU7QUFDQSxLQUFLO0FBQ0w7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmlmdGVlbi1nYW1lLy4vbm9kZV9tb2R1bGVzL21pbmlyZXNldC5jc3MvbWluaXJlc2V0LmNzcyIsIndlYnBhY2s6Ly9maWZ0ZWVuLWdhbWUvLi9zcmMvc3R5bGVzL21haW4uc2NzcyIsIndlYnBhY2s6Ly9maWZ0ZWVuLWdhbWUvLi9zcmMvanMvY29yZS5qcyIsIndlYnBhY2s6Ly9maWZ0ZWVuLWdhbWUvLi9zcmMvanMvbGliLmpzIiwid2VicGFjazovL2ZpZnRlZW4tZ2FtZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9maWZ0ZWVuLWdhbWUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2ZpZnRlZW4tZ2FtZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2ZpZnRlZW4tZ2FtZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2ZpZnRlZW4tZ2FtZS8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJleHBvcnQgY29uc3QgUklHSFQgPSB7IGR4OiAwLCBkeTogLTEgfTtcclxuZXhwb3J0IGNvbnN0IExFRlQgPSB7IGR4OiAwLCBkeTogMSB9O1xyXG5leHBvcnQgY29uc3QgVVAgPSB7IGR4OiAxLCBkeTogMCB9O1xyXG5leHBvcnQgY29uc3QgRE9XTiA9IHsgZHg6IC0xLCBkeTogMCB9O1xyXG5cclxuZXhwb3J0IGNvbnN0IE1PVkVfRVZFTlQgPSBcIi0tbW92ZVwiO1xyXG5leHBvcnQgY29uc3QgTU9WRV9DT1VOVEVSX0VWRU5UID0gXCItLWNvdW50XCI7XHJcbmV4cG9ydCBjb25zdCBTVEFSVF9FVkVOVCA9IFwiLS1zdGFydFwiO1xyXG5leHBvcnQgY29uc3QgUExBWV9QQVVTRV9FVkVOVCA9IFwiLS1wbGF5cGF1c2VcIjtcclxuZXhwb3J0IGNvbnN0IFNPTFZFRF9FVkVOVCA9IFwiLS1zb2x2ZWRcIjtcclxuZXhwb3J0IGNvbnN0IFRJTUVDSEFOR0VfRVZFTlQgPSBcIi0tdGltZWNoYW5nZVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGNyZWF0ZUdhbWUgPSAoc2l6ZSA9IDQpID0+IHtcclxuICBjb25zdCBzdWJzY3JpYmVycyA9IHt9O1xyXG4gIGNvbnN0IGRpc3BhdGNoID0gKHR5cGUsIC4uLnBheWxvYWQpID0+IHtcclxuICAgIHN1YnNjcmliZXJzW3R5cGVdICYmIHN1YnNjcmliZXJzW3R5cGVdLmZvckVhY2goKGZuKSA9PiBmbiguLi5wYXlsb2FkKSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgbWF0cml4ID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogc2l6ZSB9LCAoXywgaSkgPT4ge1xyXG4gICAgcmV0dXJuIEFycmF5LmZyb20oeyBsZW5ndGg6IHNpemUgfSwgKF8sIGopID0+ICh7XHJcbiAgICAgIGlkeDogaSAqIHNpemUgKyBqLFxyXG4gICAgICBuYW1lOiBpICogc2l6ZSArIGogKyAxLFxyXG4gICAgfSkpO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBlbXB0eSA9IG1hdHJpeC5hdCgtMSkuYXQoLTEpO1xyXG5cclxuICBsZXQgW2VtcHR5WCwgZW1wdHlZXSA9IFtzaXplIC0gMSwgc2l6ZSAtIDFdO1xyXG5cclxuICBsZXQgbW92ZXMgPSAwO1xyXG4gIGxldCBkdXJhdGlvbiA9IDA7XHJcbiAgbGV0IGlzUGxheWluZyA9IGZhbHNlO1xyXG4gIGxldCBpbnRlcnZhbElkO1xyXG5cclxuICBjb25zdCBjYW5Nb3ZlID0gKHgsIHkpID0+IHtcclxuICAgIHJldHVybiB4ID49IDAgJiYgeCA8IHNpemUgJiYgeSA+PSAwICYmIHkgPCBzaXplO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHN3YXAgPSAobWF0cml4LCBbeDEsIHkxXSwgW3gyLCB5Ml0pID0+IHtcclxuICAgIFttYXRyaXhbeDFdW3kxXSwgbWF0cml4W3gyXVt5Ml1dID0gW21hdHJpeFt4Ml1beTJdLCBtYXRyaXhbeDFdW3kxXV07XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIG1hdHJpeCxcclxuICAgIGdldCBtb3ZlcygpIHtcclxuICAgICAgcmV0dXJuIG1vdmVzO1xyXG4gICAgfSxcclxuICAgIGdldCBkdXJhdGlvbigpIHtcclxuICAgICAgcmV0dXJuIGR1cmF0aW9uO1xyXG4gICAgfSxcclxuICAgIGdldCBpc1NvbHZlZCgpIHtcclxuICAgICAgcmV0dXJuIG1hdHJpeC5ldmVyeSgocm93LCB4KSA9PlxyXG4gICAgICAgIHJvdy5ldmVyeSgoeyBpZHggfSwgeSkgPT4geCAqIHNpemUgKyB5ID09PSBpZHgpXHJcbiAgICAgICk7XHJcbiAgICB9LFxyXG4gICAgZ2V0IGVtcHR5KCkge1xyXG4gICAgICByZXR1cm4geyAuLi5lbXB0eSwgeDogZW1wdHlYLCB5OiBlbXB0eVkgfTtcclxuICAgIH0sXHJcbiAgICBnZXQgaXNQbGF5aW5nKCkge1xyXG4gICAgICByZXR1cm4gaXNQbGF5aW5nO1xyXG4gICAgfSxcclxuICAgIG1vdmUoeyBkeCwgZHkgfSkge1xyXG4gICAgICBpZiAoIWlzUGxheWluZykgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IG54ID0gZW1wdHlYICsgZHg7XHJcbiAgICAgIGxldCBueSA9IGVtcHR5WSArIGR5O1xyXG5cclxuICAgICAgaWYgKGNhbk1vdmUobngsIG55KSkge1xyXG4gICAgICAgIG1vdmVzKys7XHJcblxyXG4gICAgICAgIHN3YXAobWF0cml4LCBbbngsIG55XSwgW2VtcHR5WCwgZW1wdHlZXSk7XHJcblxyXG4gICAgICAgIFtlbXB0eVgsIGVtcHR5WSwgbngsIG55XSA9IFtueCwgbnksIGVtcHR5WCwgZW1wdHlZXTtcclxuXHJcbiAgICAgICAgZGlzcGF0Y2goTU9WRV9FVkVOVCwgbWF0cml4W254XVtueV0uaWR4LCBbbngsIG55XSwge1xyXG4gICAgICAgICAgZHgsXHJcbiAgICAgICAgICBkeSxcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHBsYXlwYXVzZSgpIHtcclxuICAgICAgaXNQbGF5aW5nID0gIWlzUGxheWluZztcclxuICAgIH0sXHJcbiAgICBzdGFydCgpIHtcclxuICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbElkKTtcclxuXHJcbiAgICAgIGlzUGxheWluZyA9IHRydWU7XHJcbiAgICAgIGR1cmF0aW9uID0gMDtcclxuICAgICAgbW92ZXMgPSAwO1xyXG5cclxuICAgICAgLy8gbWFrZSB0aW1lciBydW4gb24gMiBhY3Rpb25zIChzdGFydCwgcGF1c2UpXHJcblxyXG4gICAgICBpbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgIGlmIChpc1BsYXlpbmcpIHtcclxuICAgICAgICAgIGR1cmF0aW9uKys7XHJcbiAgICAgICAgICBkaXNwYXRjaChUSU1FQ0hBTkdFX0VWRU5ULCBkdXJhdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCAxMDAwKTtcclxuXHJcbiAgICAgIGNvbnN0IG5laWdoYm9ycyA9IFtVUCwgRE9XTiwgUklHSFQsIExFRlRdO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyMDA7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IHsgZHgsIGR5IH0gPSBuZWlnaGJvcnNbXHJcbiAgICAgICAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuZWlnaGJvcnMubGVuZ3RoKVxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIGxldCBueCA9IGVtcHR5WCArIGR4O1xyXG4gICAgICAgIGxldCBueSA9IGVtcHR5WSArIGR5O1xyXG5cclxuICAgICAgICBpZiAoY2FuTW92ZShueCwgbnkpKSB7XHJcbiAgICAgICAgICBzd2FwKG1hdHJpeCwgW254LCBueV0sIFtlbXB0eVgsIGVtcHR5WV0pO1xyXG5cclxuICAgICAgICAgIFtlbXB0eVgsIGVtcHR5WSwgbngsIG55XSA9IFtueCwgbnksIGVtcHR5WCwgZW1wdHlZXTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRpc3BhdGNoKFNUQVJUX0VWRU5ULCBtYXRyaXgpO1xyXG4gICAgICBkaXNwYXRjaChQTEFZX1BBVVNFX0VWRU5ULCBpc1BsYXlpbmcpO1xyXG4gICAgfSxcclxuICAgIHN1YnNjcmliZSh0eXBlLCBmbikge1xyXG4gICAgICBpZiAoIXN1YnNjcmliZXJzW3R5cGVdKSB7XHJcbiAgICAgICAgc3Vic2NyaWJlcnNbdHlwZV0gPSBbXTtcclxuICAgICAgfVxyXG4gICAgICBzdWJzY3JpYmVyc1t0eXBlXS5wdXNoKGZuKTtcclxuICAgIH0sXHJcbiAgfTtcclxufTtcclxuIiwiZXhwb3J0IGNvbnN0IGNyZWF0ZUVsZW1lbnQgPSAodGFnLCBvcHRpb25zKSA9PiB7XHJcbiAgY29uc3QgeyBjbGFzc05hbWUsIHRleHQsIGV2ZW50cyA9IHt9LCBjaGlsZHJlbiA9IFtdLCAuLi5hdHRycyB9ID0gb3B0aW9ucztcclxuXHJcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XHJcblxyXG4gIGNsYXNzTmFtZSAmJiBlbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBjbGFzc05hbWUpO1xyXG4gIHRleHQgJiYgKGVsLnRleHRDb250ZW50ID0gdGV4dCk7XHJcblxyXG4gIE9iamVjdC5rZXlzKGV2ZW50cykuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICBldmVudHNba2V5XSAmJiBlbC5hZGRFdmVudExpc3RlbmVyKGtleSwgZXZlbnRzW2tleV0pO1xyXG4gIH0pO1xyXG5cclxuICBPYmplY3Qua2V5cyhhdHRycykuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICBhdHRyc1trZXldICYmIGVsLnNldEF0dHJpYnV0ZShrZXksIGF0dHJzW2tleV0pO1xyXG4gIH0pO1xyXG5cclxuICBlbC5hcHBlbmQoLi4uY2hpbGRyZW4pO1xyXG5cclxuICByZXR1cm4gZWw7XHJcbn07XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFwibWluaXJlc2V0LmNzc1wiO1xyXG5pbXBvcnQgXCIuL3N0eWxlcy9tYWluLnNjc3NcIjtcclxuXHJcbi8vIGltcG9ydCB7IGNyZWF0ZUdhbWUgfSBmcm9tIFwiLi9qcy9nYW1lXCI7XHJcbmltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi9qcy9saWJcIjtcclxuXHJcbmltcG9ydCB7XHJcbiAgY3JlYXRlR2FtZSxcclxuICBMRUZULFxyXG4gIFJJR0hULFxyXG4gIFVQLFxyXG4gIERPV04sXHJcbiAgTU9WRV9FVkVOVCxcclxuICBNT1ZFX0NPVU5URVJfRVZFTlQsXHJcbiAgU1RBUlRfRVZFTlQsXHJcbiAgUExBWV9QQVVTRV9FVkVOVCxcclxuICBTT0xWRURfRVZFTlQsXHJcbiAgVElNRUNIQU5HRV9FVkVOVCxcclxufSBmcm9tIFwiLi9qcy9jb3JlXCI7XHJcblxyXG5jb25zdCBNQVRSSVhfU0laRSA9IDQ7XHJcblxyXG5jb25zdCBHX0FfTV9FID0gY3JlYXRlR2FtZShNQVRSSVhfU0laRSk7XHJcblxyXG5HX0FfTV9FLnN1YnNjcmliZShNT1ZFX0VWRU5ULCAoaWR4LCBbeCwgeV0sIHsgZHgsIGR5IH0pID0+IHtcclxuICB0aWxlc1tpZHhdXHJcbiAgICAuYW5pbWF0ZShcclxuICAgICAgW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZSgkey0xICogZHkgKiAxMDB9JSwgJHstMSAqIGR4ICogMTAwfSUpYCxcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgICAxNTBcclxuICAgIClcclxuICAgIC5hZGRFdmVudExpc3RlbmVyKFwiZmluaXNoXCIsICgpID0+IHtcclxuICAgICAgdGlsZXNbaWR4XS5zdHlsZS5ncmlkQXJlYSA9IGAke3ggKyAxfSAvICR7eSArIDF9YDtcclxuICAgIH0pO1xyXG5cclxuICBHX0FfTV9FLmlzU29sdmVkICYmXHJcbiAgICB0aWxlcy5mb3JFYWNoKChlbCkgPT4ge1xyXG4gICAgICBlbC5hbmltYXRlKFxyXG4gICAgICAgIFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiBgcm90YXRlKDM2MGRlZylgLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICBdLFxyXG4gICAgICAgIDI1MFxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcblxyXG4gIG1vdmVzQ29udHJvbC50ZXh0Q29udGVudCA9IFN0cmluZyhHX0FfTV9FLm1vdmVzKTtcclxufSk7XHJcblxyXG5HX0FfTV9FLnN1YnNjcmliZShTVEFSVF9FVkVOVCwgKG1hdHJpeCkgPT4ge1xyXG4gIG1hdHJpeC5mb3JFYWNoKChyb3csIHgpID0+XHJcbiAgICByb3cuZm9yRWFjaCgoeyBpZHggfSwgeSkgPT4ge1xyXG4gICAgICB0aWxlc1tpZHhdLnN0eWxlLmdyaWRBcmVhID0gYCR7eCArIDF9IC8gJHt5ICsgMX1gO1xyXG5cclxuICAgICAgdGlsZXNbaWR4XS5hbmltYXRlKFxyXG4gICAgICAgIFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiBgcm90YXRlKDM2MGRlZylgLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICBdLFxyXG4gICAgICAgIDMwMFxyXG4gICAgICApO1xyXG4gICAgfSlcclxuICApO1xyXG59KTtcclxuXHJcbkdfQV9NX0Uuc3Vic2NyaWJlKFBMQVlfUEFVU0VfRVZFTlQsIChpc1BsYXlpbmcpID0+IHtcclxuICBsZXQgZHVyYXRpb24gPSAwO1xyXG5cclxuICBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICBpZiAoaXNQbGF5aW5nKSB7XHJcbiAgICAgIGR1cmF0aW9uKys7XHJcbiAgICAgIHRpbWVDb250cm9sLnRleHRDb250ZW50ID0gYCR7U3RyaW5nKChkdXJhdGlvbiAvIDYwKSB8IDApLnBhZFN0YXJ0KFxyXG4gICAgICAgIDIsXHJcbiAgICAgICAgXCIwXCJcclxuICAgICAgKX06JHtTdHJpbmcoZHVyYXRpb24gJSA2MCkucGFkU3RhcnQoMiwgXCIwXCIpfWA7XHJcbiAgICB9XHJcbiAgfSwgMTAwMCk7XHJcbn0pO1xyXG5cclxuR19BX01fRS5zdWJzY3JpYmUoU09MVkVEX0VWRU5ULCAoKSA9PiB7XHJcbiAgYWxlcnQoXCJZb3UgV09OXCIpO1xyXG59KTtcclxuXHJcbkdfQV9NX0Uuc3Vic2NyaWJlKFRJTUVDSEFOR0VfRVZFTlQsIChkdXJhdGlvbikgPT4ge1xyXG4gIHRpbWVDb250cm9sLnRleHRDb250ZW50ID0gYCR7U3RyaW5nKChkdXJhdGlvbiAvIDYwKSB8IDApLnBhZFN0YXJ0KFxyXG4gICAgMixcclxuICAgIFwiMFwiXHJcbiAgKX06JHtTdHJpbmcoZHVyYXRpb24gJSA2MCkucGFkU3RhcnQoMiwgXCIwXCIpfWA7XHJcbn0pO1xyXG5cclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuY29uc3QgdGlsZXMgPSBHX0FfTV9FLm1hdHJpeFxyXG4gIC5tYXAoKHJvdywgeCkgPT5cclxuICAgIHJvdy5tYXAoKHsgaWR4LCBuYW1lIH0sIHkpID0+IHtcclxuICAgICAgY29uc3QgZWwgPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcclxuICAgICAgICBjbGFzc05hbWU6IGB0aWxlICR7R19BX01fRS5lbXB0eS5pZHggPT09IGlkeCA/IFwidGlsZS0tZW1wdHlcIiA6IFwiXCJ9YCxcclxuICAgICAgICB0ZXh0OiBuYW1lLFxyXG4gICAgICAgIFwiZGF0YS1pZHhcIjogU3RyaW5nKGlkeCksXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZWwuc3R5bGUuZ3JpZEFyZWEgPSBgJHt4ICsgMX0gLyAke3kgKyAxfWA7XHJcblxyXG4gICAgICByZXR1cm4gZWw7XHJcbiAgICB9KVxyXG4gIClcclxuICAuZmxhdCgpO1xyXG5cclxuY29uc3QgYm9hcmQgPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcclxuICBjbGFzc05hbWU6IGBib2FyZCBib2FyZC0tc2l6ZS0ke01BVFJJWF9TSVpFfWAsXHJcbiAgY2hpbGRyZW46IHRpbGVzLFxyXG4gIHRhYmluZGV4OiBcIjBcIixcclxuICBldmVudHM6IHtcclxuICAgIGNsaWNrOiAoZSkgPT4ge1xyXG4gICAgICBjb25zdCBlbCA9IHRpbGVzLmZpbmQoKGVsKSA9PiBlbC5jb250YWlucyhlLnRhcmdldCkpO1xyXG5cclxuICAgICAgaWYgKGVsKSB7XHJcbiAgICAgICAgY29uc3QgW3gsIHldID0gW1xyXG4gICAgICAgICAgTnVtYmVyKGVsLnN0eWxlLmdyaWRSb3dTdGFydCkgLSAxLFxyXG4gICAgICAgICAgTnVtYmVyKGVsLnN0eWxlLmdyaWRDb2x1bW5TdGFydCkgLSAxLFxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IFtVUCwgRE9XTiwgUklHSFQsIExFRlRdLmZpbmQoXHJcbiAgICAgICAgICAoeyBkeCwgZHkgfSkgPT5cclxuICAgICAgICAgICAgZHggPT09IHggLSBHX0FfTV9FLmVtcHR5LnggJiYgZHkgPT09IHkgLSBHX0FfTV9FLmVtcHR5LnlcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBkaXJlY3Rpb24gJiYgR19BX01fRS5tb3ZlKGRpcmVjdGlvbik7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBrZXlkb3duOiAoZSkgPT4ge1xyXG4gICAgICBzd2l0Y2ggKGUuY29kZSkge1xyXG4gICAgICAgIGNhc2UgXCJBcnJvd1VwXCI6XHJcbiAgICAgICAgICBHX0FfTV9FLm1vdmUoVVApO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIkFycm93RG93blwiOlxyXG4gICAgICAgICAgR19BX01fRS5tb3ZlKERPV04pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIkFycm93UmlnaHRcIjpcclxuICAgICAgICAgIEdfQV9NX0UubW92ZShSSUdIVCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiQXJyb3dMZWZ0XCI6XHJcbiAgICAgICAgICBHX0FfTV9FLm1vdmUoTEVGVCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbmNvbnN0IHRpdGxlID0gY3JlYXRlRWxlbWVudChcImgxXCIsIHtcclxuICBjbGFzc05hbWU6IFwiYXBwLXRpdGxlXCIsXHJcbiAgdGV4dDogXCJGaWZ0ZWVuIHB1enpsZVwiLFxyXG59KTtcclxuXHJcbmNvbnN0IG1vdmVzQ29udHJvbCA9IGNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHsgdGV4dDogXCIwXCIgfSk7XHJcbmNvbnN0IHRpbWVDb250cm9sID0gY3JlYXRlRWxlbWVudChcInNwYW5cIiwgeyB0ZXh0OiBcIjAwOjAwXCIgfSk7XHJcblxyXG5jb25zdCBjb250cm9scyA9IGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1xyXG4gIGNsYXNzTmFtZTogXCJzdGFjayBzdGFjay0tYWxpZ24tY2VudGVyIHN0YWNrLS1nYXAteS0yXCIsXHJcbiAgY2hpbGRyZW46IFtcclxuICAgIGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1xyXG4gICAgICBjbGFzc05hbWU6IFwic3RhY2sgc3RhY2stLXJvdyBzdGFjay0tZ2FwLXgtMlwiLFxyXG4gICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgIGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1xyXG4gICAgICAgICAgY2xhc3NOYW1lOiBcImluZm8tYm94XCIsXHJcbiAgICAgICAgICBjaGlsZHJlbjogW2NyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHsgdGV4dDogXCJtb3Zlc1wiIH0pLCBtb3Zlc0NvbnRyb2xdLFxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1xyXG4gICAgICAgICAgY2xhc3NOYW1lOiBcImluZm8tYm94XCIsXHJcbiAgICAgICAgICBjaGlsZHJlbjogW2NyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHsgdGV4dDogXCJ0aW1lXCIgfSksIHRpbWVDb250cm9sXSxcclxuICAgICAgICB9KSxcclxuICAgICAgXSxcclxuICAgIH0pLFxyXG4gICAgY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XHJcbiAgICAgIGNsYXNzTmFtZTogXCJzdGFjayBzdGFjay0tcm93IHN0YWNrLS1nYXAteC0yXCIsXHJcbiAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgY3JlYXRlRWxlbWVudChcImJ1dHRvblwiLCB7XHJcbiAgICAgICAgICBjbGFzc05hbWU6IFwiYnV0dG9uXCIsXHJcbiAgICAgICAgICB0ZXh0OiBcInN0YXJ0IGdhbWVcIixcclxuICAgICAgICAgIGV2ZW50czoge1xyXG4gICAgICAgICAgICBjbGljazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgIEdfQV9NX0Uuc3RhcnQoKTtcclxuICAgICAgICAgICAgICBib2FyZC5mb2N1cygpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9KSxcclxuICAgICAgICBjcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIsIHtcclxuICAgICAgICAgIGNsYXNzTmFtZTogXCJidXR0b25cIixcclxuICAgICAgICAgIHRleHQ6IEdfQV9NX0UuaXNQbGF5aW5nID8gXCJwYXVzZVwiIDogXCJyZXN1bWVcIixcclxuICAgICAgICAgIGV2ZW50czoge1xyXG4gICAgICAgICAgICBjbGljazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgIEdfQV9NX0UucGxheXBhdXNlKCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIiwgeyBjbGFzc05hbWU6IFwiYnV0dG9uXCIsIHRleHQ6IFwic2F2ZSBnYW1lXCIgfSksXHJcbiAgICAgIF0sXHJcbiAgICB9KSxcclxuICBdLFxyXG59KTtcclxuXHJcbmNvbnN0IGFwcCA9IGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1xyXG4gIGNsYXNzTmFtZTogXCJhcHBcIixcclxuICBjaGlsZHJlbjogW3RpdGxlLCBjb250cm9scywgYm9hcmRdLFxyXG59KTtcclxuXHJcbmRvY3VtZW50LmJvZHkuYXBwZW5kKGFwcCk7XHJcblxyXG4vKiBcclxuXHJcbmNvbnN0IE1BVFJJWF9TSVpFID0gNDtcclxuXHJcbmNvbnN0IEdfQV9NX0UgPSBjcmVhdGVHYW1lKE1BVFJJWF9TSVpFLCAoc3RhdGUpID0+IHtcclxuICBjb25zb2xlLmxvZyhzdGF0ZSk7XHJcbn0pO1xyXG5cclxuY29uc3QgdGlsZXMgPSBHX0FfTV9FLm1hdHJpeFxyXG4gIC5tYXAoKHJvdywgeCkgPT5cclxuICAgIHJvdy5tYXAoKHsgaWR4LCBuYW1lIH0sIHkpID0+IHtcclxuICAgICAgY29uc3QgZWwgPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcclxuICAgICAgICBjbGFzc05hbWU6IGB0aWxlICR7R19BX01fRS5lbXB0eS5pZHggPT09IGlkeCA/IFwidGlsZS0tZW1wdHlcIiA6IFwiXCJ9YCxcclxuICAgICAgICB0ZXh0OiBuYW1lLFxyXG4gICAgICAgIFwiZGF0YS1pZHhcIjogU3RyaW5nKGlkeCksXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZWwuc3R5bGUuZ3JpZEFyZWEgPSBgJHt4ICsgMX0gLyAke3kgKyAxfWA7XHJcblxyXG4gICAgICByZXR1cm4gZWw7XHJcbiAgICB9KVxyXG4gIClcclxuICAuZmxhdCgpO1xyXG5cclxuY29uc3QgYm9hcmQgPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcclxuICBjbGFzc05hbWU6IGBib2FyZCBib2FyZC0tc2l6ZS0ke0dfQV9NX0UubWF0cml4Lmxlbmd0aH1gLFxyXG4gIGNoaWxkcmVuOiB0aWxlcyxcclxuICBldmVudHM6IHtcclxuICAgIGNsaWNrOiAoZSkgPT4ge1xyXG4gICAgICBjb25zdCBlbCA9IHRpbGVzLmZpbmQoKGVsKSA9PiBlbC5jb250YWlucyhlLnRhcmdldCkpO1xyXG5cclxuICAgICAgaWYgKGVsKSB7XHJcbiAgICAgICAgY29uc3QgaWR4ID0gTnVtYmVyKGVsLmRhdGFzZXQuaWR4KTtcclxuICAgICAgICBHX0FfTV9FLm1vdmUoaWR4LCAoW3gsIHldLCB7IGR4LCBkeSB9KSA9PiB7XHJcbiAgICAgICAgICB0aWxlc1tpZHhdXHJcbiAgICAgICAgICAgIC5hbmltYXRlKFxyXG4gICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlKCR7ZHkgKiAxMDB9JSwgJHtkeCAqIDEwMH0lKWAsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgMTUwXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoXCJmaW5pc2hcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIHRpbGVzW2lkeF0uc3R5bGUuZ3JpZEFyZWEgPSBgJHt4ICsgMX0gLyAke3kgKyAxfWA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG5cclxuY29uc3QgdGl0bGUgPSBjcmVhdGVFbGVtZW50KFwiaDFcIiwge1xyXG4gIGNsYXNzTmFtZTogXCJhcHAtdGl0bGVcIixcclxuICB0ZXh0OiBcIkZpZnRlZW4gcHV6emxlXCIsXHJcbn0pO1xyXG5cclxuY29uc3QgY29udHJvbHMgPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcclxuICBjbGFzc05hbWU6IFwic3RhY2sgc3RhY2stLWFsaWduLWNlbnRlciBzdGFjay0tZ2FwLXktMlwiLFxyXG4gIGNoaWxkcmVuOiBbXHJcbiAgICBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcclxuICAgICAgY2xhc3NOYW1lOiBcInN0YWNrIHN0YWNrLS1yb3cgc3RhY2stLWdhcC14LTJcIixcclxuICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcclxuICAgICAgICAgIGNsYXNzTmFtZTogXCJpbmZvLWJveFwiLFxyXG4gICAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgY3JlYXRlRWxlbWVudChcInNwYW5cIiwgeyB0ZXh0OiBcIm1vdmVzXCIgfSksXHJcbiAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHsgdGV4dDogXCIwXCIgfSksXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1xyXG4gICAgICAgICAgY2xhc3NOYW1lOiBcImluZm8tYm94XCIsXHJcbiAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICBjcmVhdGVFbGVtZW50KFwic3BhblwiLCB7IHRleHQ6IFwidGltZVwiIH0pLFxyXG4gICAgICAgICAgICBjcmVhdGVFbGVtZW50KFwic3BhblwiLCB7IHRleHQ6IFwiMDA6MDBcIiB9KSxcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgfSksXHJcbiAgICAgIF0sXHJcbiAgICB9KSxcclxuICAgIGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1xyXG4gICAgICBjbGFzc05hbWU6IFwic3RhY2sgc3RhY2stLXJvdyBzdGFjay0tZ2FwLXgtMlwiLFxyXG4gICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgIGNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIiwge1xyXG4gICAgICAgICAgY2xhc3NOYW1lOiBcImJ1dHRvblwiLFxyXG4gICAgICAgICAgdGV4dDogXCJzdGFydCBnYW1lXCIsXHJcbiAgICAgICAgICBldmVudHM6IHtcclxuICAgICAgICAgICAgY2xpY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICBHX0FfTV9FLnN0YXJ0KChpZHgsIFt4LCB5XSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGlsZXNbaWR4XS5zdHlsZS5ncmlkQXJlYSA9IGAke3ggKyAxfSAvICR7eSArIDF9YDtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgY3JlYXRlRWxlbWVudChcImJ1dHRvblwiLCB7IGNsYXNzTmFtZTogXCJidXR0b25cIiwgdGV4dDogXCJwYXVzZVwiIH0pLFxyXG4gICAgICAgIGNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIiwgeyBjbGFzc05hbWU6IFwiYnV0dG9uXCIsIHRleHQ6IFwic2F2ZSBnYW1lXCIgfSksXHJcbiAgICAgIF0sXHJcbiAgICB9KSxcclxuICBdLFxyXG59KTtcclxuXHJcbmNvbnN0IGFwcCA9IGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1xyXG4gIGNsYXNzTmFtZTogXCJhcHBcIixcclxuICBjaGlsZHJlbjogW3RpdGxlLCBjb250cm9scywgYm9hcmRdLFxyXG59KTtcclxuXHJcbmRvY3VtZW50LmJvZHkuYXBwZW5kKGFwcCk7XHJcbiovXHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==