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
  let isGameStarted = false;
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

      if (this.isSolved) {
        isPlaying = false;
        isGameStarted = false;
        dispatch(SOLVED_EVENT);
      }
    },
    playpause() {
      if (isGameStarted) {
        isPlaying = !isPlaying;
        dispatch(PLAY_PAUSE_EVENT);
      }
    },
    start() {
      clearInterval(intervalId);

      isGameStarted = true;
      isPlaying = true;
      duration = 0;
      moves = 0;

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
/* harmony export */   "createElement": () => (/* binding */ createElement),
/* harmony export */   "secToStringTime": () => (/* binding */ secToStringTime)
/* harmony export */ });
const createElement = (tag, options) => {
  const {
    className,
    text,
    html,
    events = {},
    children = [],
    ...attrs
  } = options;

  const el = document.createElement(tag);

  className && el.setAttribute("class", className);
  text && (el.textContent = text);
  html && (el.innerHTML = html);

  Object.keys(events).forEach((key) => {
    events[key] && el.addEventListener(key, events[key]);
  });

  Object.keys(attrs).forEach((key) => {
    attrs[key] && el.setAttribute(key, attrs[key]);
  });

  el.append(...children);

  return el;
};

const secToStringTime = (duration) =>
  `${String((duration / 60) | 0).padStart(2, "0")}:${String(
    duration % 60
  ).padStart(2, "0")}`;


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







const G_A_M_E = (0,_js_core__WEBPACK_IMPORTED_MODULE_3__.createGame)();

G_A_M_E.subscribe(_js_core__WEBPACK_IMPORTED_MODULE_3__.MOVE_EVENT, (idx, [x, y], { dx, dy }) => {
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

G_A_M_E.subscribe(_js_core__WEBPACK_IMPORTED_MODULE_3__.START_EVENT, () => {
  movesControl.textContent = String(G_A_M_E.moves);
  timeControl.textContent = (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.secToStringTime)(G_A_M_E.duration);
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

G_A_M_E.subscribe(_js_core__WEBPACK_IMPORTED_MODULE_3__.PLAY_PAUSE_EVENT, () => {
  G_A_M_E.isPlaying
    ? overlay.classList.add("hidden")
    : overlay.classList.remove("hidden");
});

G_A_M_E.subscribe(_js_core__WEBPACK_IMPORTED_MODULE_3__.TIMECHANGE_EVENT, () => {
  timeControl.textContent = (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.secToStringTime)(G_A_M_E.duration);
});

G_A_M_E.subscribe(_js_core__WEBPACK_IMPORTED_MODULE_3__.SOLVED_EVENT, () => {
  console.log(
    `You WON!, It takes you ${G_A_M_E.moves} moves and ${G_A_M_E.duration} seconds`
  );
  overlay.classList.remove("hidden");
  overlayTitle.innerHTML = `Hooray! You solved the puzzle in <b>${(0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.secToStringTime)(
    G_A_M_E.duration
  )}</b> and <b>${G_A_M_E.moves}</b> moves!`;
});

// ==================================

const title = (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("h1", {
  className: "app-title",
  text: "Fifteen puzzle",
});

const movesControl = (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("span", { text: "0" });
const timeControl = (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("span", { text: "00:00" });

const soundButton = (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("button", {
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

const settingsButton = (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("button", {
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

const startButton = (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("button", {
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
      const el = (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
        className: `tile ${G_A_M_E.empty.idx === idx ? "tile--empty" : ""}`,
        text: name,
        draggable: true,
      });

      el.style.gridArea = `${x + 1} / ${y + 1}`;

      return el;
    })
  )
  .flat();

const overlayTitle = (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("h2", {
  className: "board-overlay-title",
});

const overlay = (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
  className: "board-overlay",
  children: [
    overlayTitle,
    (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
      className: "stack stack--row stack--gap-x-2 py-4",
      children: [startButton],
    }),
  ],
});

const board = (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
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

const controls = (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
  className: "stack stack--align-center stack--row stack--gap-x-2",
  children: [
    soundButton,
    (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
      className: "info-box",
      children: [(0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("span", { text: "moves" }), movesControl],
    }),
    (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
      className: "info-box",
      children: [(0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("span", { text: "time" }), timeControl],
    }),
    settingsButton,
  ],
});

const info = (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("h2", {
  className: "info-text",
  html:
    "To move a tile you can <b>click</b> on it or use your <b>arrow keys</b>. Press <b>ESC</b> to pause game.",
});

const app = (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
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

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0EsWUFBWSxzREFBYTtBQUN6QjtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2ZpZnRlZW4tZ2FtZS8uL25vZGVfbW9kdWxlcy9taW5pcmVzZXQuY3NzL21pbmlyZXNldC5jc3MiLCJ3ZWJwYWNrOi8vZmlmdGVlbi1nYW1lLy4vc3JjL3N0eWxlcy9tYWluLnNjc3MiLCJ3ZWJwYWNrOi8vZmlmdGVlbi1nYW1lLy4vc3JjL2pzL2NvcmUuanMiLCJ3ZWJwYWNrOi8vZmlmdGVlbi1nYW1lLy4vc3JjL2pzL2xpYi5qcyIsIndlYnBhY2s6Ly9maWZ0ZWVuLWdhbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZmlmdGVlbi1nYW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9maWZ0ZWVuLWdhbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9maWZ0ZWVuLWdhbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9maWZ0ZWVuLWdhbWUvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiZXhwb3J0IGNvbnN0IFJJR0hUID0geyBkeDogMCwgZHk6IC0xIH07XHJcbmV4cG9ydCBjb25zdCBMRUZUID0geyBkeDogMCwgZHk6IDEgfTtcclxuZXhwb3J0IGNvbnN0IFVQID0geyBkeDogMSwgZHk6IDAgfTtcclxuZXhwb3J0IGNvbnN0IERPV04gPSB7IGR4OiAtMSwgZHk6IDAgfTtcclxuXHJcbmV4cG9ydCBjb25zdCBNT1ZFX0VWRU5UID0gXCItLW1vdmVcIjtcclxuZXhwb3J0IGNvbnN0IE1PVkVfQ09VTlRFUl9FVkVOVCA9IFwiLS1jb3VudFwiO1xyXG5leHBvcnQgY29uc3QgU1RBUlRfRVZFTlQgPSBcIi0tc3RhcnRcIjtcclxuZXhwb3J0IGNvbnN0IFBMQVlfUEFVU0VfRVZFTlQgPSBcIi0tcGxheXBhdXNlXCI7XHJcbmV4cG9ydCBjb25zdCBTT0xWRURfRVZFTlQgPSBcIi0tc29sdmVkXCI7XHJcbmV4cG9ydCBjb25zdCBUSU1FQ0hBTkdFX0VWRU5UID0gXCItLXRpbWVjaGFuZ2VcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVHYW1lID0gKHNpemUgPSA0KSA9PiB7XHJcbiAgY29uc3Qgc3Vic2NyaWJlcnMgPSB7fTtcclxuICBjb25zdCBkaXNwYXRjaCA9ICh0eXBlLCAuLi5wYXlsb2FkKSA9PiB7XHJcbiAgICBzdWJzY3JpYmVyc1t0eXBlXSAmJiBzdWJzY3JpYmVyc1t0eXBlXS5mb3JFYWNoKChmbikgPT4gZm4oLi4ucGF5bG9hZCkpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IG1hdHJpeCA9IEFycmF5LmZyb20oeyBsZW5ndGg6IHNpemUgfSwgKF8sIGkpID0+IHtcclxuICAgIHJldHVybiBBcnJheS5mcm9tKHsgbGVuZ3RoOiBzaXplIH0sIChfLCBqKSA9PiAoe1xyXG4gICAgICBpZHg6IGkgKiBzaXplICsgaixcclxuICAgICAgbmFtZTogaSAqIHNpemUgKyBqICsgMSxcclxuICAgIH0pKTtcclxuICB9KTtcclxuXHJcbiAgY29uc3QgZW1wdHkgPSBtYXRyaXguYXQoLTEpLmF0KC0xKTtcclxuXHJcbiAgbGV0IFtlbXB0eVgsIGVtcHR5WV0gPSBbc2l6ZSAtIDEsIHNpemUgLSAxXTtcclxuXHJcbiAgbGV0IG1vdmVzID0gMDtcclxuICBsZXQgZHVyYXRpb24gPSAwO1xyXG4gIGxldCBpc1BsYXlpbmcgPSBmYWxzZTtcclxuICBsZXQgaXNHYW1lU3RhcnRlZCA9IGZhbHNlO1xyXG4gIGxldCBpbnRlcnZhbElkO1xyXG5cclxuICBjb25zdCBjYW5Nb3ZlID0gKHgsIHkpID0+IHtcclxuICAgIHJldHVybiB4ID49IDAgJiYgeCA8IHNpemUgJiYgeSA+PSAwICYmIHkgPCBzaXplO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHN3YXAgPSAobWF0cml4LCBbeDEsIHkxXSwgW3gyLCB5Ml0pID0+IHtcclxuICAgIFttYXRyaXhbeDFdW3kxXSwgbWF0cml4W3gyXVt5Ml1dID0gW21hdHJpeFt4Ml1beTJdLCBtYXRyaXhbeDFdW3kxXV07XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIG1hdHJpeCxcclxuICAgIGdldCBtb3ZlcygpIHtcclxuICAgICAgcmV0dXJuIG1vdmVzO1xyXG4gICAgfSxcclxuICAgIGdldCBkdXJhdGlvbigpIHtcclxuICAgICAgcmV0dXJuIGR1cmF0aW9uO1xyXG4gICAgfSxcclxuICAgIGdldCBpc1NvbHZlZCgpIHtcclxuICAgICAgcmV0dXJuIG1hdHJpeC5ldmVyeSgocm93LCB4KSA9PlxyXG4gICAgICAgIHJvdy5ldmVyeSgoeyBpZHggfSwgeSkgPT4geCAqIHNpemUgKyB5ID09PSBpZHgpXHJcbiAgICAgICk7XHJcbiAgICB9LFxyXG4gICAgZ2V0IGVtcHR5KCkge1xyXG4gICAgICByZXR1cm4geyAuLi5lbXB0eSwgeDogZW1wdHlYLCB5OiBlbXB0eVkgfTtcclxuICAgIH0sXHJcbiAgICBnZXQgaXNQbGF5aW5nKCkge1xyXG4gICAgICByZXR1cm4gaXNQbGF5aW5nO1xyXG4gICAgfSxcclxuICAgIG1vdmUoeyBkeCwgZHkgfSkge1xyXG4gICAgICBpZiAoIWlzUGxheWluZykgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IG54ID0gZW1wdHlYICsgZHg7XHJcbiAgICAgIGxldCBueSA9IGVtcHR5WSArIGR5O1xyXG5cclxuICAgICAgaWYgKGNhbk1vdmUobngsIG55KSkge1xyXG4gICAgICAgIG1vdmVzKys7XHJcblxyXG4gICAgICAgIHN3YXAobWF0cml4LCBbbngsIG55XSwgW2VtcHR5WCwgZW1wdHlZXSk7XHJcblxyXG4gICAgICAgIFtlbXB0eVgsIGVtcHR5WSwgbngsIG55XSA9IFtueCwgbnksIGVtcHR5WCwgZW1wdHlZXTtcclxuXHJcbiAgICAgICAgZGlzcGF0Y2goTU9WRV9FVkVOVCwgbWF0cml4W254XVtueV0uaWR4LCBbbngsIG55XSwge1xyXG4gICAgICAgICAgZHgsXHJcbiAgICAgICAgICBkeSxcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuaXNTb2x2ZWQpIHtcclxuICAgICAgICBpc1BsYXlpbmcgPSBmYWxzZTtcclxuICAgICAgICBpc0dhbWVTdGFydGVkID0gZmFsc2U7XHJcbiAgICAgICAgZGlzcGF0Y2goU09MVkVEX0VWRU5UKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHBsYXlwYXVzZSgpIHtcclxuICAgICAgaWYgKGlzR2FtZVN0YXJ0ZWQpIHtcclxuICAgICAgICBpc1BsYXlpbmcgPSAhaXNQbGF5aW5nO1xyXG4gICAgICAgIGRpc3BhdGNoKFBMQVlfUEFVU0VfRVZFTlQpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxJZCk7XHJcblxyXG4gICAgICBpc0dhbWVTdGFydGVkID0gdHJ1ZTtcclxuICAgICAgaXNQbGF5aW5nID0gdHJ1ZTtcclxuICAgICAgZHVyYXRpb24gPSAwO1xyXG4gICAgICBtb3ZlcyA9IDA7XHJcblxyXG4gICAgICBpbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgIGlmIChpc1BsYXlpbmcpIHtcclxuICAgICAgICAgIGR1cmF0aW9uKys7XHJcbiAgICAgICAgICBkaXNwYXRjaChUSU1FQ0hBTkdFX0VWRU5ULCBkdXJhdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCAxMDAwKTtcclxuXHJcbiAgICAgIGNvbnN0IG5laWdoYm9ycyA9IFtVUCwgRE9XTiwgUklHSFQsIExFRlRdO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyMDA7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IHsgZHgsIGR5IH0gPSBuZWlnaGJvcnNbXHJcbiAgICAgICAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuZWlnaGJvcnMubGVuZ3RoKVxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIGxldCBueCA9IGVtcHR5WCArIGR4O1xyXG4gICAgICAgIGxldCBueSA9IGVtcHR5WSArIGR5O1xyXG5cclxuICAgICAgICBpZiAoY2FuTW92ZShueCwgbnkpKSB7XHJcbiAgICAgICAgICBzd2FwKG1hdHJpeCwgW254LCBueV0sIFtlbXB0eVgsIGVtcHR5WV0pO1xyXG5cclxuICAgICAgICAgIFtlbXB0eVgsIGVtcHR5WSwgbngsIG55XSA9IFtueCwgbnksIGVtcHR5WCwgZW1wdHlZXTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRpc3BhdGNoKFNUQVJUX0VWRU5ULCBtYXRyaXgpO1xyXG4gICAgICBkaXNwYXRjaChQTEFZX1BBVVNFX0VWRU5ULCBpc1BsYXlpbmcpO1xyXG4gICAgfSxcclxuICAgIHN1YnNjcmliZSh0eXBlLCBmbikge1xyXG4gICAgICBpZiAoIXN1YnNjcmliZXJzW3R5cGVdKSB7XHJcbiAgICAgICAgc3Vic2NyaWJlcnNbdHlwZV0gPSBbXTtcclxuICAgICAgfVxyXG4gICAgICBzdWJzY3JpYmVyc1t0eXBlXS5wdXNoKGZuKTtcclxuICAgIH0sXHJcbiAgfTtcclxufTtcclxuIiwiZXhwb3J0IGNvbnN0IGNyZWF0ZUVsZW1lbnQgPSAodGFnLCBvcHRpb25zKSA9PiB7XHJcbiAgY29uc3Qge1xyXG4gICAgY2xhc3NOYW1lLFxyXG4gICAgdGV4dCxcclxuICAgIGh0bWwsXHJcbiAgICBldmVudHMgPSB7fSxcclxuICAgIGNoaWxkcmVuID0gW10sXHJcbiAgICAuLi5hdHRyc1xyXG4gIH0gPSBvcHRpb25zO1xyXG5cclxuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcclxuXHJcbiAgY2xhc3NOYW1lICYmIGVsLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGNsYXNzTmFtZSk7XHJcbiAgdGV4dCAmJiAoZWwudGV4dENvbnRlbnQgPSB0ZXh0KTtcclxuICBodG1sICYmIChlbC5pbm5lckhUTUwgPSBodG1sKTtcclxuXHJcbiAgT2JqZWN0LmtleXMoZXZlbnRzKS5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgIGV2ZW50c1trZXldICYmIGVsLmFkZEV2ZW50TGlzdGVuZXIoa2V5LCBldmVudHNba2V5XSk7XHJcbiAgfSk7XHJcblxyXG4gIE9iamVjdC5rZXlzKGF0dHJzKS5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgIGF0dHJzW2tleV0gJiYgZWwuc2V0QXR0cmlidXRlKGtleSwgYXR0cnNba2V5XSk7XHJcbiAgfSk7XHJcblxyXG4gIGVsLmFwcGVuZCguLi5jaGlsZHJlbik7XHJcblxyXG4gIHJldHVybiBlbDtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBzZWNUb1N0cmluZ1RpbWUgPSAoZHVyYXRpb24pID0+XHJcbiAgYCR7U3RyaW5nKChkdXJhdGlvbiAvIDYwKSB8IDApLnBhZFN0YXJ0KDIsIFwiMFwiKX06JHtTdHJpbmcoXHJcbiAgICBkdXJhdGlvbiAlIDYwXHJcbiAgKS5wYWRTdGFydCgyLCBcIjBcIil9YDtcclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCJtaW5pcmVzZXQuY3NzXCI7XHJcbmltcG9ydCBcIi4vc3R5bGVzL21haW4uc2Nzc1wiO1xyXG5cclxuaW1wb3J0IHsgY3JlYXRlRWxlbWVudCwgc2VjVG9TdHJpbmdUaW1lIH0gZnJvbSBcIi4vanMvbGliXCI7XHJcblxyXG5pbXBvcnQge1xyXG4gIGNyZWF0ZUdhbWUsXHJcbiAgTEVGVCxcclxuICBSSUdIVCxcclxuICBVUCxcclxuICBET1dOLFxyXG4gIE1PVkVfRVZFTlQsXHJcbiAgU1RBUlRfRVZFTlQsXHJcbiAgUExBWV9QQVVTRV9FVkVOVCxcclxuICBTT0xWRURfRVZFTlQsXHJcbiAgVElNRUNIQU5HRV9FVkVOVCxcclxufSBmcm9tIFwiLi9qcy9jb3JlXCI7XHJcblxyXG5jb25zdCBHX0FfTV9FID0gY3JlYXRlR2FtZSgpO1xyXG5cclxuR19BX01fRS5zdWJzY3JpYmUoTU9WRV9FVkVOVCwgKGlkeCwgW3gsIHldLCB7IGR4LCBkeSB9KSA9PiB7XHJcbiAgY29uc3QgdGlsZSA9IHRpbGVzW2lkeF07XHJcblxyXG4gIGNvbnN0IHRpbGVBbmltYXRpb24gPSB0aWxlLmFuaW1hdGUoXHJcbiAgICBbXHJcbiAgICAgIHtcclxuICAgICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGUoJHstMSAqIGR5ICogMTA1fSUsICR7LTEgKiBkeCAqIDEwNX0lKWAsXHJcbiAgICAgIH0sXHJcbiAgICBdLFxyXG4gICAgMTUwXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgaGFuZGxlRmluaXNoQW5pbWF0aW9uID0gKCkgPT4ge1xyXG4gICAgdGlsZXNbaWR4XS5zdHlsZS5ncmlkQXJlYSA9IGAke3ggKyAxfSAvICR7eSArIDF9YDtcclxuXHJcbiAgICBHX0FfTV9FLmlzU29sdmVkICYmXHJcbiAgICAgIHRpbGVzLmZvckVhY2goKGVsKSA9PiB7XHJcbiAgICAgICAgZWwuYW5pbWF0ZShcclxuICAgICAgICAgIFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogYHJvdGF0ZSgzNjBkZWcpYCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgICAyNTBcclxuICAgICAgICApO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICB0aWxlQW5pbWF0aW9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJmaW5pc2hcIiwgaGFuZGxlRmluaXNoQW5pbWF0aW9uKTtcclxuICB9O1xyXG5cclxuICB0aWxlQW5pbWF0aW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJmaW5pc2hcIiwgaGFuZGxlRmluaXNoQW5pbWF0aW9uKTtcclxuXHJcbiAgbW92ZXNDb250cm9sLnRleHRDb250ZW50ID0gU3RyaW5nKEdfQV9NX0UubW92ZXMpO1xyXG59KTtcclxuXHJcbkdfQV9NX0Uuc3Vic2NyaWJlKFNUQVJUX0VWRU5ULCAoKSA9PiB7XHJcbiAgbW92ZXNDb250cm9sLnRleHRDb250ZW50ID0gU3RyaW5nKEdfQV9NX0UubW92ZXMpO1xyXG4gIHRpbWVDb250cm9sLnRleHRDb250ZW50ID0gc2VjVG9TdHJpbmdUaW1lKEdfQV9NX0UuZHVyYXRpb24pO1xyXG4gIG92ZXJsYXlUaXRsZS50ZXh0Q29udGVudCA9IFwiXCI7XHJcblxyXG4gIEdfQV9NX0UubWF0cml4LmZvckVhY2goKHJvdywgeCkgPT5cclxuICAgIHJvdy5mb3JFYWNoKCh7IGlkeCB9LCB5KSA9PiB7XHJcbiAgICAgIHRpbGVzW2lkeF0uc3R5bGUuZ3JpZEFyZWEgPSBgJHt4ICsgMX0gLyAke3kgKyAxfWA7XHJcblxyXG4gICAgICB0aWxlc1tpZHhdLmFuaW1hdGUoXHJcbiAgICAgICAgW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IGByb3RhdGUoMzYwZGVnKWAsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgMzAwXHJcbiAgICAgICk7XHJcbiAgICB9KVxyXG4gICk7XHJcbn0pO1xyXG5cclxuR19BX01fRS5zdWJzY3JpYmUoUExBWV9QQVVTRV9FVkVOVCwgKCkgPT4ge1xyXG4gIEdfQV9NX0UuaXNQbGF5aW5nXHJcbiAgICA/IG92ZXJsYXkuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKVxyXG4gICAgOiBvdmVybGF5LmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XHJcbn0pO1xyXG5cclxuR19BX01fRS5zdWJzY3JpYmUoVElNRUNIQU5HRV9FVkVOVCwgKCkgPT4ge1xyXG4gIHRpbWVDb250cm9sLnRleHRDb250ZW50ID0gc2VjVG9TdHJpbmdUaW1lKEdfQV9NX0UuZHVyYXRpb24pO1xyXG59KTtcclxuXHJcbkdfQV9NX0Uuc3Vic2NyaWJlKFNPTFZFRF9FVkVOVCwgKCkgPT4ge1xyXG4gIGNvbnNvbGUubG9nKFxyXG4gICAgYFlvdSBXT04hLCBJdCB0YWtlcyB5b3UgJHtHX0FfTV9FLm1vdmVzfSBtb3ZlcyBhbmQgJHtHX0FfTV9FLmR1cmF0aW9ufSBzZWNvbmRzYFxyXG4gICk7XHJcbiAgb3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xyXG4gIG92ZXJsYXlUaXRsZS5pbm5lckhUTUwgPSBgSG9vcmF5ISBZb3Ugc29sdmVkIHRoZSBwdXp6bGUgaW4gPGI+JHtzZWNUb1N0cmluZ1RpbWUoXHJcbiAgICBHX0FfTV9FLmR1cmF0aW9uXHJcbiAgKX08L2I+IGFuZCA8Yj4ke0dfQV9NX0UubW92ZXN9PC9iPiBtb3ZlcyFgO1xyXG59KTtcclxuXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbmNvbnN0IHRpdGxlID0gY3JlYXRlRWxlbWVudChcImgxXCIsIHtcclxuICBjbGFzc05hbWU6IFwiYXBwLXRpdGxlXCIsXHJcbiAgdGV4dDogXCJGaWZ0ZWVuIHB1enpsZVwiLFxyXG59KTtcclxuXHJcbmNvbnN0IG1vdmVzQ29udHJvbCA9IGNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHsgdGV4dDogXCIwXCIgfSk7XHJcbmNvbnN0IHRpbWVDb250cm9sID0gY3JlYXRlRWxlbWVudChcInNwYW5cIiwgeyB0ZXh0OiBcIjAwOjAwXCIgfSk7XHJcblxyXG5jb25zdCBzb3VuZEJ1dHRvbiA9IGNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIiwge1xyXG4gIGNsYXNzTmFtZTogXCJidXR0b24gYnV0dG9uLS1yb3VuZGVkXCIsXHJcbiAgaHRtbDpcclxuICAgICc8c3ZnIHN0eWxlPVwiZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzMiAzMjtcIiBmaWxsPVwiIzNmMzg0NFwiIHZlcnNpb249XCIxLjFcIiB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCI+PHBhdGggZD1cIk0xNCwyYy0wLjc4MSwwLTEuMzEzLDAuNDM4LTIsMS4wMTZMNiw4SDJjLTEuMSwwLTIsMC45LTIsMnYxMmMwLDEuMSwwLjksMiwyLDJoNGw2LDQuOTg0QzEyLjY4OCwyOS41NjMsMTMuMjE5LDMwLDE0LDMwICBjMS4yMTksMCwyLTAuOTg0LDItMlY0QzE2LDIuOTg0LDE1LjIxOSwyLDE0LDJ6IE0xMiwyMy43ODRMNy40NDUsMjBINHYtOGgzLjQ0NUwxMiw4LjIxNlYyMy43ODR6IE0yMCw2Yy0xLjI1LDAtMiwxLjA0Ny0yLDIgIGMwLDEuNDIyLDIsMi43ODEsMiw4cy0yLDYuNTc4LTIsOGMwLDAuOTUzLDAuNzUsMiwyLDJjMS4wMTYsMCwxLjYyNS0wLjU0NywyLjI4MS0yQzIzLjUxLDIxLjI3OSwyNCwxOC42NzIsMjQsMTYgIHMtMC40OS01LjI3OS0xLjcxOS04QzIxLjYyNSw2LjU0NywyMS4wMTYsNiwyMCw2eiBNMjkuMTQ2LDRjLTAuODM4LTEuNzcxLTEuNjMtMi0yLjMzMy0yYy0xLjE4OCwwLTIsMS0yLDIgIEMyNC44MTMsNS42NzIsMjgsOC41MzEsMjgsMTZzLTMuMTg4LDEwLjMyOC0zLjE4OCwxMmMwLDEsMC44MTMsMiwyLDJjMC43MDMsMCwxLjQ5NS0wLjIyOSwyLjMzMy0yQzMwLjA2MywyNi4wNjMsMzIsMjIuMTU2LDMyLDE2ICBTMzAuMDYzLDUuOTM4LDI5LjE0Niw0elwiLz48L3N2Zz4nLFxyXG4gIGV2ZW50czoge1xyXG4gICAgY2xpY2s6ICgpID0+IHtcclxuICAgICAgR19BX01fRS5zdGFydCgpO1xyXG4gICAgICBib2FyZC5mb2N1cygpO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbmNvbnN0IHNldHRpbmdzQnV0dG9uID0gY3JlYXRlRWxlbWVudChcImJ1dHRvblwiLCB7XHJcbiAgY2xhc3NOYW1lOiBcImJ1dHRvbiBidXR0b24tLXJvdW5kZWRcIixcclxuICBodG1sOlxyXG4gICAgJzxzdmcgZW5hYmxlLWJhY2tncm91bmQ9XCJuZXcgMCAwIDMyIDMyXCIgZmlsbD1cIiMzZjM4NDRcIiAgaWQ9XCJHbHlwaFwiIHZlcnNpb249XCIxLjFcIiB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCI+PHBhdGggZD1cIk0yNy41MjYsMTguMDM2TDI3LDE3LjczMmMtMC42MjYtMC4zNjEtMS0xLjAwOS0xLTEuNzMyczAuMzc0LTEuMzcxLDEtMS43MzJsMC41MjYtMC4zMDQgIGMxLjQzNi0wLjgzLDEuOTI3LTIuNjYyLDEuMDk4LTQuMDk4bC0xLTEuNzMyYy0wLjgyNy0xLjQzMy0yLjY2Ni0xLjkyNS00LjA5OC0xLjA5OEwyMyw3LjMzOWMtMC42MjYsMC4zNjItMS4zNzUsMC4zNjItMiwwICBjLTAuNjI2LTAuMzYyLTEtMS4wMDktMS0xLjczMlY1YzAtMS42NTQtMS4zNDYtMy0zLTNoLTJjLTEuNjU0LDAtMywxLjM0Ni0zLDN2MC42MDhjMCwwLjcyMy0wLjM3NCwxLjM3LTEsMS43MzIgIGMtMC42MjYsMC4zNjEtMS4zNzQsMC4zNjItMiwwTDguNDc0LDcuMDM2QzcuMDQyLDYuMjA5LDUuMjAzLDYuNzAxLDQuMzc1LDguMTM0bC0xLDEuNzMyYy0wLjgyOSwxLjQzNi0wLjMzOCwzLjI2OSwxLjA5OCw0LjA5OCAgTDUsMTQuMjY4QzUuNjI2LDE0LjYyOSw2LDE1LjI3Nyw2LDE2cy0wLjM3NCwxLjM3MS0xLDEuNzMybC0wLjUyNiwwLjMwNGMtMS40MzYsMC44MjktMS45MjcsMi42NjItMS4wOTgsNC4wOThsMSwxLjczMiAgYzAuODI4LDEuNDMzLDIuNjY3LDEuOTI1LDQuMDk4LDEuMDk4TDksMjQuNjYxYzAuNjI2LTAuMzYzLDEuMzc0LTAuMzYxLDIsMGMwLjYyNiwwLjM2MiwxLDEuMDA5LDEsMS43MzJWMjdjMCwxLjY1NCwxLjM0NiwzLDMsM2gyICBjMS42NTQsMCwzLTEuMzQ2LDMtM3YtMC42MDhjMC0wLjcyMywwLjM3NC0xLjM3LDEtMS43MzJjMC42MjUtMC4zNjEsMS4zNzQtMC4zNjIsMiwwbDAuNTI2LDAuMzA0ICBjMS40MzIsMC44MjYsMy4yNzEsMC4zMzQsNC4wOTgtMS4wOThsMS0xLjczMkMyOS40NTMsMjAuNjk4LDI4Ljk2MiwxOC44NjUsMjcuNTI2LDE4LjAzNnogTTE2LDIxYy0yLjc1NywwLTUtMi4yNDMtNS01czIuMjQzLTUsNS01ICBzNSwyLjI0Myw1LDVTMTguNzU3LDIxLDE2LDIxelwiIGlkPVwiWE1MSURfMjczX1wiLz48L3N2Zz4nLFxyXG4gIGV2ZW50czoge1xyXG4gICAgY2xpY2s6ICgpID0+IHtcclxuICAgICAgR19BX01fRS5wbGF5cGF1c2UoKTtcclxuICAgICAgYm9hcmQuZm9jdXMoKTtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG4vLyBjb25zdCBzaXplQ29udHJvbHMgPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcclxuLy8gICBjbGFzc05hbWU6XHJcbi8vICAgICBcInN0YWNrIHN0YWNrLS1yb3cgc3RhY2stLXdyYXAgc3RhY2stLWp1c3RpZnktY2VudGVyIHN0YWNrLS1nYXAtMiBoaWRkZW5cIixcclxuLy8gICBjaGlsZHJlbjogWzMsIDQsIDUsIDYsIDcsIDhdLm1hcCgoc2l6ZSkgPT4ge1xyXG4vLyAgICAgcmV0dXJuIGNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIiwge1xyXG4vLyAgICAgICBjbGFzc05hbWU6IFwiYnV0dG9uXCIsXHJcbi8vICAgICAgIHRleHQ6IHNpemUgKyBcInhcIiArIHNpemUsXHJcbi8vICAgICAgIFwiZGF0YS1zaXplXCI6IHNpemUsXHJcbi8vICAgICB9KTtcclxuLy8gICB9KSxcclxuLy8gICBldmVudHM6IHtcclxuLy8gICAgIGNsaWNrOiAoZSkgPT4ge1xyXG4vLyAgICAgICBjb25zdCB7IHNpemUgfSA9IGUudGFyZ2V0Py5kYXRhc2V0O1xyXG4vLyAgICAgICBpZiAoc2l6ZSkge1xyXG4vLyAgICAgICAgIEdfQV9NX0Uuc3RhcnQoTnVtYmVyKHNpemUpKTtcclxuLy8gICAgICAgICBib2FyZC5mb2N1cygpO1xyXG4vLyAgICAgICAgIHNpemVDb250cm9scy5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xyXG4vLyAgICAgICB9XHJcbi8vICAgICB9LFxyXG4vLyAgIH0sXHJcbi8vIH0pO1xyXG5cclxuY29uc3Qgc3RhcnRCdXR0b24gPSBjcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIsIHtcclxuICBjbGFzc05hbWU6IFwiYnV0dG9uXCIsXHJcbiAgdGV4dDogXCJzdGFydCBuZXcgZ2FtZVwiLFxyXG4gIGNoaWxkcmVuOiBbXSxcclxuICBldmVudHM6IHtcclxuICAgIGNsaWNrOiAoKSA9PiB7XHJcbiAgICAgIEdfQV9NX0Uuc3RhcnQoKTtcclxuICAgICAgYm9hcmQuZm9jdXMoKTtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG5jb25zdCB0aWxlcyA9IEdfQV9NX0UubWF0cml4XHJcbiAgLm1hcCgocm93LCB4KSA9PlxyXG4gICAgcm93Lm1hcCgoeyBpZHgsIG5hbWUgfSwgeSkgPT4ge1xyXG4gICAgICBjb25zdCBlbCA9IGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1xyXG4gICAgICAgIGNsYXNzTmFtZTogYHRpbGUgJHtHX0FfTV9FLmVtcHR5LmlkeCA9PT0gaWR4ID8gXCJ0aWxlLS1lbXB0eVwiIDogXCJcIn1gLFxyXG4gICAgICAgIHRleHQ6IG5hbWUsXHJcbiAgICAgICAgZHJhZ2dhYmxlOiB0cnVlLFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGVsLnN0eWxlLmdyaWRBcmVhID0gYCR7eCArIDF9IC8gJHt5ICsgMX1gO1xyXG5cclxuICAgICAgcmV0dXJuIGVsO1xyXG4gICAgfSlcclxuICApXHJcbiAgLmZsYXQoKTtcclxuXHJcbmNvbnN0IG92ZXJsYXlUaXRsZSA9IGNyZWF0ZUVsZW1lbnQoXCJoMlwiLCB7XHJcbiAgY2xhc3NOYW1lOiBcImJvYXJkLW92ZXJsYXktdGl0bGVcIixcclxufSk7XHJcblxyXG5jb25zdCBvdmVybGF5ID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XHJcbiAgY2xhc3NOYW1lOiBcImJvYXJkLW92ZXJsYXlcIixcclxuICBjaGlsZHJlbjogW1xyXG4gICAgb3ZlcmxheVRpdGxlLFxyXG4gICAgY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XHJcbiAgICAgIGNsYXNzTmFtZTogXCJzdGFjayBzdGFjay0tcm93IHN0YWNrLS1nYXAteC0yIHB5LTRcIixcclxuICAgICAgY2hpbGRyZW46IFtzdGFydEJ1dHRvbl0sXHJcbiAgICB9KSxcclxuICBdLFxyXG59KTtcclxuXHJcbmNvbnN0IGJvYXJkID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XHJcbiAgY2xhc3NOYW1lOiBgYm9hcmQgYm9hcmQtLXNpemUtJHtHX0FfTV9FLm1hdHJpeC5sZW5ndGh9YCxcclxuICBjaGlsZHJlbjogWy4uLnRpbGVzLCBvdmVybGF5XSxcclxuICB0YWJpbmRleDogXCIwXCIsXHJcbiAgZXZlbnRzOiB7XHJcbiAgICBjbGljazogKGUpID0+IHtcclxuICAgICAgY29uc3QgZWwgPSB0aWxlcy5maW5kKChlbCkgPT4gZWwuY29udGFpbnMoZS50YXJnZXQpKTtcclxuXHJcbiAgICAgIGlmIChlbCkge1xyXG4gICAgICAgIGNvbnN0IFt4LCB5XSA9IFtcclxuICAgICAgICAgIE51bWJlcihlbC5zdHlsZS5ncmlkUm93U3RhcnQpIC0gMSxcclxuICAgICAgICAgIE51bWJlcihlbC5zdHlsZS5ncmlkQ29sdW1uU3RhcnQpIC0gMSxcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSBbVVAsIERPV04sIFJJR0hULCBMRUZUXS5maW5kKFxyXG4gICAgICAgICAgKHsgZHgsIGR5IH0pID0+XHJcbiAgICAgICAgICAgIGR4ID09PSB4IC0gR19BX01fRS5lbXB0eS54ICYmIGR5ID09PSB5IC0gR19BX01fRS5lbXB0eS55XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgZGlyZWN0aW9uICYmIEdfQV9NX0UubW92ZShkaXJlY3Rpb24pO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAga2V5ZG93bjogKGUpID0+IHtcclxuICAgICAgc3dpdGNoIChlLmNvZGUpIHtcclxuICAgICAgICBjYXNlIFwiQXJyb3dVcFwiOlxyXG4gICAgICAgICAgR19BX01fRS5tb3ZlKFVQKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJBcnJvd0Rvd25cIjpcclxuICAgICAgICAgIEdfQV9NX0UubW92ZShET1dOKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJBcnJvd1JpZ2h0XCI6XHJcbiAgICAgICAgICBHX0FfTV9FLm1vdmUoUklHSFQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIkFycm93TGVmdFwiOlxyXG4gICAgICAgICAgR19BX01fRS5tb3ZlKExFRlQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG5jb25zdCBjb250cm9scyA9IGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1xyXG4gIGNsYXNzTmFtZTogXCJzdGFjayBzdGFjay0tYWxpZ24tY2VudGVyIHN0YWNrLS1yb3cgc3RhY2stLWdhcC14LTJcIixcclxuICBjaGlsZHJlbjogW1xyXG4gICAgc291bmRCdXR0b24sXHJcbiAgICBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcclxuICAgICAgY2xhc3NOYW1lOiBcImluZm8tYm94XCIsXHJcbiAgICAgIGNoaWxkcmVuOiBbY3JlYXRlRWxlbWVudChcInNwYW5cIiwgeyB0ZXh0OiBcIm1vdmVzXCIgfSksIG1vdmVzQ29udHJvbF0sXHJcbiAgICB9KSxcclxuICAgIGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1xyXG4gICAgICBjbGFzc05hbWU6IFwiaW5mby1ib3hcIixcclxuICAgICAgY2hpbGRyZW46IFtjcmVhdGVFbGVtZW50KFwic3BhblwiLCB7IHRleHQ6IFwidGltZVwiIH0pLCB0aW1lQ29udHJvbF0sXHJcbiAgICB9KSxcclxuICAgIHNldHRpbmdzQnV0dG9uLFxyXG4gIF0sXHJcbn0pO1xyXG5cclxuY29uc3QgaW5mbyA9IGNyZWF0ZUVsZW1lbnQoXCJoMlwiLCB7XHJcbiAgY2xhc3NOYW1lOiBcImluZm8tdGV4dFwiLFxyXG4gIGh0bWw6XHJcbiAgICBcIlRvIG1vdmUgYSB0aWxlIHlvdSBjYW4gPGI+Y2xpY2s8L2I+IG9uIGl0IG9yIHVzZSB5b3VyIDxiPmFycm93IGtleXM8L2I+LiBQcmVzcyA8Yj5FU0M8L2I+IHRvIHBhdXNlIGdhbWUuXCIsXHJcbn0pO1xyXG5cclxuY29uc3QgYXBwID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XHJcbiAgY2xhc3NOYW1lOiBcImFwcFwiLFxyXG4gIGNoaWxkcmVuOiBbdGl0bGUsIGNvbnRyb2xzLCBib2FyZCwgaW5mb10sXHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGUpID0+IHtcclxuICBzd2l0Y2ggKGUuY29kZSkge1xyXG4gICAgY2FzZSBcIkVzY2FwZVwiOiB7XHJcbiAgICAgIEdfQV9NX0UucGxheXBhdXNlKCk7XHJcbiAgICAgIGJvYXJkLmZvY3VzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59KTtcclxuXHJcbmRvY3VtZW50LmJvZHkuYXBwZW5kKGFwcCk7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==