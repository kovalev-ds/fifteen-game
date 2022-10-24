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
  let isStarted = false;
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

        if (this.isSolved) {
          clearInterval(intervalId);
          isPlaying = false;
          dispatch(SOLVED_EVENT)
        }
      }
    },
    playpause() {
      if (isStarted) {
        isPlaying = !isPlaying;
        dispatch(PLAY_PAUSE_EVENT, isPlaying)
      }
    },
    start() {
      clearInterval(intervalId);

      isStarted = true;
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

      dispatch(START_EVENT);
      dispatch(PLAY_PAUSE_EVENT);
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

const secToStringTime = (duration) => `${String((duration / 60) | 0).padStart(2, "0")}:${String(duration % 60).padStart(2, "0")}`


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







const MATRIX_SIZE = 4;

const G_A_M_E = (0,_js_core__WEBPACK_IMPORTED_MODULE_3__.createGame)(MATRIX_SIZE);


G_A_M_E.subscribe(_js_core__WEBPACK_IMPORTED_MODULE_3__.MOVE_EVENT, (idx, [x, y], { dx, dy }) => {
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

G_A_M_E.subscribe(_js_core__WEBPACK_IMPORTED_MODULE_3__.START_EVENT, () => {

  movesControl.textContent = String(G_A_M_E.moves);
  timeControl.textContent = (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.secToStringTime)(G_A_M_E.duration);

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
  G_A_M_E.isPlaying ? overlay.classList.add('hidden') : overlay.classList.remove('hidden')
});


G_A_M_E.subscribe(_js_core__WEBPACK_IMPORTED_MODULE_3__.TIMECHANGE_EVENT, () => {
  timeControl.textContent = (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.secToStringTime)(G_A_M_E.duration);
});


G_A_M_E.subscribe(_js_core__WEBPACK_IMPORTED_MODULE_3__.SOLVED_EVENT, () => {
  console.log(`You WON!, It takes you ${G_A_M_E.moves} moves and ${G_A_M_E.duration} seconds`);
  overlay.classList.remove("hidden")
});

// ==================================

const title = (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("h1", {
  className: "app-title",
  text: "Fifteen puzzle",
});

const movesControl = (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("span", { text: "0" });
const timeControl = (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("span", { text: "00:00" });

const startButton = (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("button", {
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

const overlay = (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)('div', {
  className: 'board-overlay', children: [
    (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
      className: "stack stack--row stack--gap-x-2",
      children: [
        startButton
      ],
    }),
  ]
})

const board = (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
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
        case "Escape": {
          G_A_M_E.playpause();
        }
      }
    },
  },
});

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
  ],
});

const app = (0,_js_lib__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
  className: "app",
  children: [title, controls, board],
});

document.body.append(app);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RCxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qix3Q0FBRTtBQUN6QjtBQUNBO0FBQ0EsdUJBQXVCLDBDQUFJO0FBQzNCO0FBQ0E7QUFDQSx1QkFBdUIsMkNBQUs7QUFDNUI7QUFDQTtBQUNBLHVCQUF1QiwwQ0FBSTtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSCxDQUFDO0FBQ0Q7QUFDQSxpQkFBaUIsc0RBQWE7QUFDOUI7QUFDQTtBQUNBLElBQUksc0RBQWE7QUFDakI7QUFDQTtBQUNBLFFBQVEsc0RBQWE7QUFDckI7QUFDQSxxQkFBcUIsc0RBQWEsV0FBVyxlQUFlO0FBQzVELFNBQVM7QUFDVCxRQUFRLHNEQUFhO0FBQ3JCO0FBQ0EscUJBQXFCLHNEQUFhLFdBQVcsY0FBYztBQUMzRCxTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0w7QUFDQSxDQUFDO0FBQ0Q7QUFDQSxZQUFZLHNEQUFhO0FBQ3pCO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2ZpZnRlZW4tZ2FtZS8uL25vZGVfbW9kdWxlcy9taW5pcmVzZXQuY3NzL21pbmlyZXNldC5jc3MiLCJ3ZWJwYWNrOi8vZmlmdGVlbi1nYW1lLy4vc3JjL3N0eWxlcy9tYWluLnNjc3MiLCJ3ZWJwYWNrOi8vZmlmdGVlbi1nYW1lLy4vc3JjL2pzL2NvcmUuanMiLCJ3ZWJwYWNrOi8vZmlmdGVlbi1nYW1lLy4vc3JjL2pzL2xpYi5qcyIsIndlYnBhY2s6Ly9maWZ0ZWVuLWdhbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZmlmdGVlbi1nYW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9maWZ0ZWVuLWdhbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9maWZ0ZWVuLWdhbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9maWZ0ZWVuLWdhbWUvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiZXhwb3J0IGNvbnN0IFJJR0hUID0geyBkeDogMCwgZHk6IC0xIH07XHJcbmV4cG9ydCBjb25zdCBMRUZUID0geyBkeDogMCwgZHk6IDEgfTtcclxuZXhwb3J0IGNvbnN0IFVQID0geyBkeDogMSwgZHk6IDAgfTtcclxuZXhwb3J0IGNvbnN0IERPV04gPSB7IGR4OiAtMSwgZHk6IDAgfTtcclxuXHJcbmV4cG9ydCBjb25zdCBNT1ZFX0VWRU5UID0gXCItLW1vdmVcIjtcclxuZXhwb3J0IGNvbnN0IE1PVkVfQ09VTlRFUl9FVkVOVCA9IFwiLS1jb3VudFwiO1xyXG5leHBvcnQgY29uc3QgU1RBUlRfRVZFTlQgPSBcIi0tc3RhcnRcIjtcclxuZXhwb3J0IGNvbnN0IFBMQVlfUEFVU0VfRVZFTlQgPSBcIi0tcGxheXBhdXNlXCI7XHJcbmV4cG9ydCBjb25zdCBTT0xWRURfRVZFTlQgPSBcIi0tc29sdmVkXCI7XHJcbmV4cG9ydCBjb25zdCBUSU1FQ0hBTkdFX0VWRU5UID0gXCItLXRpbWVjaGFuZ2VcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVHYW1lID0gKHNpemUgPSA0KSA9PiB7XHJcbiAgY29uc3Qgc3Vic2NyaWJlcnMgPSB7fTtcclxuICBjb25zdCBkaXNwYXRjaCA9ICh0eXBlLCAuLi5wYXlsb2FkKSA9PiB7XHJcbiAgICBzdWJzY3JpYmVyc1t0eXBlXSAmJiBzdWJzY3JpYmVyc1t0eXBlXS5mb3JFYWNoKChmbikgPT4gZm4oLi4ucGF5bG9hZCkpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IG1hdHJpeCA9IEFycmF5LmZyb20oeyBsZW5ndGg6IHNpemUgfSwgKF8sIGkpID0+IHtcclxuICAgIHJldHVybiBBcnJheS5mcm9tKHsgbGVuZ3RoOiBzaXplIH0sIChfLCBqKSA9PiAoe1xyXG4gICAgICBpZHg6IGkgKiBzaXplICsgaixcclxuICAgICAgbmFtZTogaSAqIHNpemUgKyBqICsgMSxcclxuICAgIH0pKTtcclxuICB9KTtcclxuXHJcbiAgY29uc3QgZW1wdHkgPSBtYXRyaXguYXQoLTEpLmF0KC0xKTtcclxuXHJcbiAgbGV0IFtlbXB0eVgsIGVtcHR5WV0gPSBbc2l6ZSAtIDEsIHNpemUgLSAxXTtcclxuXHJcbiAgbGV0IG1vdmVzID0gMDtcclxuICBsZXQgZHVyYXRpb24gPSAwO1xyXG4gIGxldCBpc1BsYXlpbmcgPSBmYWxzZTtcclxuICBsZXQgaXNTdGFydGVkID0gZmFsc2U7XHJcbiAgbGV0IGludGVydmFsSWQ7XHJcblxyXG4gIGNvbnN0IGNhbk1vdmUgPSAoeCwgeSkgPT4ge1xyXG4gICAgcmV0dXJuIHggPj0gMCAmJiB4IDwgc2l6ZSAmJiB5ID49IDAgJiYgeSA8IHNpemU7XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgc3dhcCA9IChtYXRyaXgsIFt4MSwgeTFdLCBbeDIsIHkyXSkgPT4ge1xyXG4gICAgW21hdHJpeFt4MV1beTFdLCBtYXRyaXhbeDJdW3kyXV0gPSBbbWF0cml4W3gyXVt5Ml0sIG1hdHJpeFt4MV1beTFdXTtcclxuICB9O1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgbWF0cml4LFxyXG4gICAgZ2V0IG1vdmVzKCkge1xyXG4gICAgICByZXR1cm4gbW92ZXM7XHJcbiAgICB9LFxyXG4gICAgZ2V0IGR1cmF0aW9uKCkge1xyXG4gICAgICByZXR1cm4gZHVyYXRpb247XHJcbiAgICB9LFxyXG4gICAgZ2V0IGlzU29sdmVkKCkge1xyXG4gICAgICByZXR1cm4gbWF0cml4LmV2ZXJ5KChyb3csIHgpID0+XHJcbiAgICAgICAgcm93LmV2ZXJ5KCh7IGlkeCB9LCB5KSA9PiB4ICogc2l6ZSArIHkgPT09IGlkeClcclxuICAgICAgKTtcclxuICAgIH0sXHJcbiAgICBnZXQgZW1wdHkoKSB7XHJcbiAgICAgIHJldHVybiB7IC4uLmVtcHR5LCB4OiBlbXB0eVgsIHk6IGVtcHR5WSB9O1xyXG4gICAgfSxcclxuICAgIGdldCBpc1BsYXlpbmcoKSB7XHJcbiAgICAgIHJldHVybiBpc1BsYXlpbmc7XHJcbiAgICB9LFxyXG4gICAgbW92ZSh7IGR4LCBkeSB9KSB7XHJcbiAgICAgIGlmICghaXNQbGF5aW5nKSByZXR1cm47XHJcblxyXG4gICAgICBsZXQgbnggPSBlbXB0eVggKyBkeDtcclxuICAgICAgbGV0IG55ID0gZW1wdHlZICsgZHk7XHJcblxyXG4gICAgICBpZiAoY2FuTW92ZShueCwgbnkpKSB7XHJcbiAgICAgICAgbW92ZXMrKztcclxuXHJcbiAgICAgICAgc3dhcChtYXRyaXgsIFtueCwgbnldLCBbZW1wdHlYLCBlbXB0eVldKTtcclxuXHJcbiAgICAgICAgW2VtcHR5WCwgZW1wdHlZLCBueCwgbnldID0gW254LCBueSwgZW1wdHlYLCBlbXB0eVldO1xyXG5cclxuICAgICAgICBkaXNwYXRjaChNT1ZFX0VWRU5ULCBtYXRyaXhbbnhdW255XS5pZHgsIFtueCwgbnldLCB7XHJcbiAgICAgICAgICBkeCxcclxuICAgICAgICAgIGR5LFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc1NvbHZlZCkge1xyXG4gICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbElkKTtcclxuICAgICAgICAgIGlzUGxheWluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgZGlzcGF0Y2goU09MVkVEX0VWRU5UKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHBsYXlwYXVzZSgpIHtcclxuICAgICAgaWYgKGlzU3RhcnRlZCkge1xyXG4gICAgICAgIGlzUGxheWluZyA9ICFpc1BsYXlpbmc7XHJcbiAgICAgICAgZGlzcGF0Y2goUExBWV9QQVVTRV9FVkVOVCwgaXNQbGF5aW5nKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxJZCk7XHJcblxyXG4gICAgICBpc1N0YXJ0ZWQgPSB0cnVlO1xyXG4gICAgICBpc1BsYXlpbmcgPSB0cnVlO1xyXG4gICAgICBkdXJhdGlvbiA9IDA7XHJcbiAgICAgIG1vdmVzID0gMDtcclxuXHJcbiAgICAgIGludGVydmFsSWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKGlzUGxheWluZykge1xyXG4gICAgICAgICAgZHVyYXRpb24rKztcclxuICAgICAgICAgIGRpc3BhdGNoKFRJTUVDSEFOR0VfRVZFTlQsIGR1cmF0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIDEwMDApO1xyXG5cclxuICAgICAgY29uc3QgbmVpZ2hib3JzID0gW1VQLCBET1dOLCBSSUdIVCwgTEVGVF07XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDIwMDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgeyBkeCwgZHkgfSA9IG5laWdoYm9yc1tcclxuICAgICAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG5laWdoYm9ycy5sZW5ndGgpXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgbGV0IG54ID0gZW1wdHlYICsgZHg7XHJcbiAgICAgICAgbGV0IG55ID0gZW1wdHlZICsgZHk7XHJcblxyXG4gICAgICAgIGlmIChjYW5Nb3ZlKG54LCBueSkpIHtcclxuICAgICAgICAgIHN3YXAobWF0cml4LCBbbngsIG55XSwgW2VtcHR5WCwgZW1wdHlZXSk7XHJcblxyXG4gICAgICAgICAgW2VtcHR5WCwgZW1wdHlZLCBueCwgbnldID0gW254LCBueSwgZW1wdHlYLCBlbXB0eVldO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZGlzcGF0Y2goU1RBUlRfRVZFTlQpO1xyXG4gICAgICBkaXNwYXRjaChQTEFZX1BBVVNFX0VWRU5UKTtcclxuICAgIH0sXHJcbiAgICBzdWJzY3JpYmUodHlwZSwgZm4pIHtcclxuICAgICAgaWYgKCFzdWJzY3JpYmVyc1t0eXBlXSkge1xyXG4gICAgICAgIHN1YnNjcmliZXJzW3R5cGVdID0gW107XHJcbiAgICAgIH1cclxuICAgICAgc3Vic2NyaWJlcnNbdHlwZV0ucHVzaChmbik7XHJcbiAgICB9LFxyXG4gIH07XHJcbn07XHJcbiIsImV4cG9ydCBjb25zdCBjcmVhdGVFbGVtZW50ID0gKHRhZywgb3B0aW9ucykgPT4ge1xyXG4gIGNvbnN0IHsgY2xhc3NOYW1lLCB0ZXh0LCBldmVudHMgPSB7fSwgY2hpbGRyZW4gPSBbXSwgLi4uYXR0cnMgfSA9IG9wdGlvbnM7XHJcblxyXG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xyXG5cclxuICBjbGFzc05hbWUgJiYgZWwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgY2xhc3NOYW1lKTtcclxuICB0ZXh0ICYmIChlbC50ZXh0Q29udGVudCA9IHRleHQpO1xyXG5cclxuICBPYmplY3Qua2V5cyhldmVudHMpLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgZXZlbnRzW2tleV0gJiYgZWwuYWRkRXZlbnRMaXN0ZW5lcihrZXksIGV2ZW50c1trZXldKTtcclxuICB9KTtcclxuXHJcbiAgT2JqZWN0LmtleXMoYXR0cnMpLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgYXR0cnNba2V5XSAmJiBlbC5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyc1trZXldKTtcclxuICB9KTtcclxuXHJcbiAgZWwuYXBwZW5kKC4uLmNoaWxkcmVuKTtcclxuXHJcbiAgcmV0dXJuIGVsO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHNlY1RvU3RyaW5nVGltZSA9IChkdXJhdGlvbikgPT4gYCR7U3RyaW5nKChkdXJhdGlvbiAvIDYwKSB8IDApLnBhZFN0YXJ0KDIsIFwiMFwiKX06JHtTdHJpbmcoZHVyYXRpb24gJSA2MCkucGFkU3RhcnQoMiwgXCIwXCIpfWBcclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCJtaW5pcmVzZXQuY3NzXCI7XHJcbmltcG9ydCBcIi4vc3R5bGVzL21haW4uc2Nzc1wiO1xyXG5cclxuaW1wb3J0IHsgY3JlYXRlRWxlbWVudCwgc2VjVG9TdHJpbmdUaW1lIH0gZnJvbSBcIi4vanMvbGliXCI7XHJcblxyXG5pbXBvcnQge1xyXG4gIGNyZWF0ZUdhbWUsXHJcbiAgTEVGVCxcclxuICBSSUdIVCxcclxuICBVUCxcclxuICBET1dOLFxyXG4gIE1PVkVfRVZFTlQsXHJcbiAgU1RBUlRfRVZFTlQsXHJcbiAgUExBWV9QQVVTRV9FVkVOVCxcclxuICBTT0xWRURfRVZFTlQsXHJcbiAgVElNRUNIQU5HRV9FVkVOVCxcclxufSBmcm9tIFwiLi9qcy9jb3JlXCI7XHJcblxyXG5jb25zdCBNQVRSSVhfU0laRSA9IDQ7XHJcblxyXG5jb25zdCBHX0FfTV9FID0gY3JlYXRlR2FtZShNQVRSSVhfU0laRSk7XHJcblxyXG5cclxuR19BX01fRS5zdWJzY3JpYmUoTU9WRV9FVkVOVCwgKGlkeCwgW3gsIHldLCB7IGR4LCBkeSB9KSA9PiB7XHJcbiAgY29uc3QgdGlsZSA9IHRpbGVzW2lkeF1cclxuXHJcbiAgY29uc3QgdGlsZUFuaW1hdGlvbiA9IHRpbGUuYW5pbWF0ZShcclxuICAgIFtcclxuICAgICAge1xyXG4gICAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZSgkey0xICogZHkgKiAxMDV9JSwgJHstMSAqIGR4ICogMTA1fSUpYCxcclxuICAgICAgfSxcclxuICAgIF0sXHJcbiAgICAxNTBcclxuICApXHJcblxyXG4gIGNvbnN0IGhhbmRsZUZpbmlzaEFuaW1hdGlvbiA9ICgpID0+IHtcclxuICAgIHRpbGVzW2lkeF0uc3R5bGUuZ3JpZEFyZWEgPSBgJHt4ICsgMX0gLyAke3kgKyAxfWA7XHJcblxyXG4gICAgR19BX01fRS5pc1NvbHZlZCAmJlxyXG4gICAgICB0aWxlcy5mb3JFYWNoKChlbCkgPT4ge1xyXG4gICAgICAgIGVsLmFuaW1hdGUoXHJcbiAgICAgICAgICBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICB0cmFuc2Zvcm06IGByb3RhdGUoMzYwZGVnKWAsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgMjUwXHJcbiAgICAgICAgKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgdGlsZUFuaW1hdGlvbi5yZW1vdmVFdmVudExpc3RlbmVyKFwiZmluaXNoXCIsIGhhbmRsZUZpbmlzaEFuaW1hdGlvbilcclxuICB9XHJcblxyXG4gIHRpbGVBbmltYXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcImZpbmlzaFwiLCBoYW5kbGVGaW5pc2hBbmltYXRpb24pO1xyXG5cclxuICBtb3Zlc0NvbnRyb2wudGV4dENvbnRlbnQgPSBTdHJpbmcoR19BX01fRS5tb3Zlcyk7XHJcbn0pO1xyXG5cclxuR19BX01fRS5zdWJzY3JpYmUoU1RBUlRfRVZFTlQsICgpID0+IHtcclxuXHJcbiAgbW92ZXNDb250cm9sLnRleHRDb250ZW50ID0gU3RyaW5nKEdfQV9NX0UubW92ZXMpO1xyXG4gIHRpbWVDb250cm9sLnRleHRDb250ZW50ID0gc2VjVG9TdHJpbmdUaW1lKEdfQV9NX0UuZHVyYXRpb24pO1xyXG5cclxuICBHX0FfTV9FLm1hdHJpeC5mb3JFYWNoKChyb3csIHgpID0+XHJcbiAgICByb3cuZm9yRWFjaCgoeyBpZHggfSwgeSkgPT4ge1xyXG4gICAgICB0aWxlc1tpZHhdLnN0eWxlLmdyaWRBcmVhID0gYCR7eCArIDF9IC8gJHt5ICsgMX1gO1xyXG5cclxuICAgICAgdGlsZXNbaWR4XS5hbmltYXRlKFxyXG4gICAgICAgIFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiBgcm90YXRlKDM2MGRlZylgLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICBdLFxyXG4gICAgICAgIDMwMFxyXG4gICAgICApO1xyXG4gICAgfSlcclxuICApO1xyXG59KTtcclxuXHJcbkdfQV9NX0Uuc3Vic2NyaWJlKFBMQVlfUEFVU0VfRVZFTlQsICgpID0+IHtcclxuICBHX0FfTV9FLmlzUGxheWluZyA/IG92ZXJsYXkuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJykgOiBvdmVybGF5LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXHJcbn0pO1xyXG5cclxuXHJcbkdfQV9NX0Uuc3Vic2NyaWJlKFRJTUVDSEFOR0VfRVZFTlQsICgpID0+IHtcclxuICB0aW1lQ29udHJvbC50ZXh0Q29udGVudCA9IHNlY1RvU3RyaW5nVGltZShHX0FfTV9FLmR1cmF0aW9uKTtcclxufSk7XHJcblxyXG5cclxuR19BX01fRS5zdWJzY3JpYmUoU09MVkVEX0VWRU5ULCAoKSA9PiB7XHJcbiAgY29uc29sZS5sb2coYFlvdSBXT04hLCBJdCB0YWtlcyB5b3UgJHtHX0FfTV9FLm1vdmVzfSBtb3ZlcyBhbmQgJHtHX0FfTV9FLmR1cmF0aW9ufSBzZWNvbmRzYCk7XHJcbiAgb3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpXHJcbn0pO1xyXG5cclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuY29uc3QgdGl0bGUgPSBjcmVhdGVFbGVtZW50KFwiaDFcIiwge1xyXG4gIGNsYXNzTmFtZTogXCJhcHAtdGl0bGVcIixcclxuICB0ZXh0OiBcIkZpZnRlZW4gcHV6emxlXCIsXHJcbn0pO1xyXG5cclxuY29uc3QgbW92ZXNDb250cm9sID0gY3JlYXRlRWxlbWVudChcInNwYW5cIiwgeyB0ZXh0OiBcIjBcIiB9KTtcclxuY29uc3QgdGltZUNvbnRyb2wgPSBjcmVhdGVFbGVtZW50KFwic3BhblwiLCB7IHRleHQ6IFwiMDA6MDBcIiB9KTtcclxuXHJcbmNvbnN0IHN0YXJ0QnV0dG9uID0gY3JlYXRlRWxlbWVudChcImJ1dHRvblwiLCB7XHJcbiAgY2xhc3NOYW1lOiBcImJ1dHRvblwiLFxyXG4gIHRleHQ6IFwic3RhcnQgbmV3IGdhbWVcIixcclxuICBldmVudHM6IHtcclxuICAgIGNsaWNrOiAoKSA9PiB7XHJcbiAgICAgIEdfQV9NX0Uuc3RhcnQoKTtcclxuICAgICAgYm9hcmQuZm9jdXMoKTtcclxuICAgIH0sXHJcbiAgfSxcclxufSlcclxuXHJcblxyXG5jb25zdCB0aWxlcyA9IEdfQV9NX0UubWF0cml4XHJcbiAgLm1hcCgocm93LCB4KSA9PlxyXG4gICAgcm93Lm1hcCgoeyBpZHgsIG5hbWUgfSwgeSkgPT4ge1xyXG4gICAgICBjb25zdCBlbCA9IGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1xyXG4gICAgICAgIGNsYXNzTmFtZTogYHRpbGUgJHtHX0FfTV9FLmVtcHR5LmlkeCA9PT0gaWR4ID8gXCJ0aWxlLS1lbXB0eVwiIDogXCJcIn1gLFxyXG4gICAgICAgIHRleHQ6IG5hbWUsXHJcbiAgICAgICAgXCJkYXRhLWlkeFwiOiBTdHJpbmcoaWR4KSxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBlbC5zdHlsZS5ncmlkQXJlYSA9IGAke3ggKyAxfSAvICR7eSArIDF9YDtcclxuXHJcbiAgICAgIHJldHVybiBlbDtcclxuICAgIH0pXHJcbiAgKVxyXG4gIC5mbGF0KCk7XHJcblxyXG5jb25zdCBvdmVybGF5ID0gY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gIGNsYXNzTmFtZTogJ2JvYXJkLW92ZXJsYXknLCBjaGlsZHJlbjogW1xyXG4gICAgY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XHJcbiAgICAgIGNsYXNzTmFtZTogXCJzdGFjayBzdGFjay0tcm93IHN0YWNrLS1nYXAteC0yXCIsXHJcbiAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgc3RhcnRCdXR0b25cclxuICAgICAgXSxcclxuICAgIH0pLFxyXG4gIF1cclxufSlcclxuXHJcbmNvbnN0IGJvYXJkID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XHJcbiAgY2xhc3NOYW1lOiBgYm9hcmQgYm9hcmQtLXNpemUtJHtNQVRSSVhfU0laRX1gLFxyXG4gIGNoaWxkcmVuOiBbLi4udGlsZXMsIG92ZXJsYXldLFxyXG4gIHRhYmluZGV4OiBcIjBcIixcclxuICBldmVudHM6IHtcclxuICAgIGNsaWNrOiAoZSkgPT4ge1xyXG4gICAgICBjb25zdCBlbCA9IHRpbGVzLmZpbmQoKGVsKSA9PiBlbC5jb250YWlucyhlLnRhcmdldCkpO1xyXG5cclxuICAgICAgaWYgKGVsKSB7XHJcbiAgICAgICAgY29uc3QgW3gsIHldID0gW1xyXG4gICAgICAgICAgTnVtYmVyKGVsLnN0eWxlLmdyaWRSb3dTdGFydCkgLSAxLFxyXG4gICAgICAgICAgTnVtYmVyKGVsLnN0eWxlLmdyaWRDb2x1bW5TdGFydCkgLSAxLFxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IFtVUCwgRE9XTiwgUklHSFQsIExFRlRdLmZpbmQoXHJcbiAgICAgICAgICAoeyBkeCwgZHkgfSkgPT5cclxuICAgICAgICAgICAgZHggPT09IHggLSBHX0FfTV9FLmVtcHR5LnggJiYgZHkgPT09IHkgLSBHX0FfTV9FLmVtcHR5LnlcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBkaXJlY3Rpb24gJiYgR19BX01fRS5tb3ZlKGRpcmVjdGlvbik7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBrZXlkb3duOiAoZSkgPT4ge1xyXG5cclxuICAgICAgc3dpdGNoIChlLmNvZGUpIHtcclxuICAgICAgICBjYXNlIFwiQXJyb3dVcFwiOlxyXG4gICAgICAgICAgR19BX01fRS5tb3ZlKFVQKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJBcnJvd0Rvd25cIjpcclxuICAgICAgICAgIEdfQV9NX0UubW92ZShET1dOKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJBcnJvd1JpZ2h0XCI6XHJcbiAgICAgICAgICBHX0FfTV9FLm1vdmUoUklHSFQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIkFycm93TGVmdFwiOlxyXG4gICAgICAgICAgR19BX01fRS5tb3ZlKExFRlQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIkVzY2FwZVwiOiB7XHJcbiAgICAgICAgICBHX0FfTV9FLnBsYXlwYXVzZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbmNvbnN0IGNvbnRyb2xzID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XHJcbiAgY2xhc3NOYW1lOiBcInN0YWNrIHN0YWNrLS1hbGlnbi1jZW50ZXIgc3RhY2stLWdhcC15LTJcIixcclxuICBjaGlsZHJlbjogW1xyXG4gICAgY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XHJcbiAgICAgIGNsYXNzTmFtZTogXCJzdGFjayBzdGFjay0tcm93IHN0YWNrLS1nYXAteC0yXCIsXHJcbiAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XHJcbiAgICAgICAgICBjbGFzc05hbWU6IFwiaW5mby1ib3hcIixcclxuICAgICAgICAgIGNoaWxkcmVuOiBbY3JlYXRlRWxlbWVudChcInNwYW5cIiwgeyB0ZXh0OiBcIm1vdmVzXCIgfSksIG1vdmVzQ29udHJvbF0sXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XHJcbiAgICAgICAgICBjbGFzc05hbWU6IFwiaW5mby1ib3hcIixcclxuICAgICAgICAgIGNoaWxkcmVuOiBbY3JlYXRlRWxlbWVudChcInNwYW5cIiwgeyB0ZXh0OiBcInRpbWVcIiB9KSwgdGltZUNvbnRyb2xdLFxyXG4gICAgICAgIH0pLFxyXG4gICAgICBdLFxyXG4gICAgfSksXHJcbiAgXSxcclxufSk7XHJcblxyXG5jb25zdCBhcHAgPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcclxuICBjbGFzc05hbWU6IFwiYXBwXCIsXHJcbiAgY2hpbGRyZW46IFt0aXRsZSwgY29udHJvbHMsIGJvYXJkXSxcclxufSk7XHJcblxyXG5kb2N1bWVudC5ib2R5LmFwcGVuZChhcHApO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=