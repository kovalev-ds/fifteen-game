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
/* harmony import */ var _audio_zvuk_mp3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../audio/zvuk.mp3 */ "./src/audio/zvuk.mp3");


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

const audio = new Audio();

audio.src = _audio_zvuk_mp3__WEBPACK_IMPORTED_MODULE_0__;
audio.load();


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
        audio.play();

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
    mute(fn) {
      audio.muted ? (audio.muted = false) : (audio.muted = true); fn(audio.muted)
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


/***/ }),

/***/ "./src/audio/zvuk.mp3":
/*!****************************!*\
  !*** ./src/audio/zvuk.mp3 ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "58df303730cd6b7be85f.mp3";

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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
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
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
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
    '<svg data-name="Layer 2" id="Layer_2" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1{fill:none;stroke:#020202;stroke-linecap:round;stroke-miterlimit:12;stroke-width:32px;}</style></defs><path class="cls-1" d="M239.89,358.6H362a0,0,0,0,1,0,0V641.4a0,0,0,0,1,0,0H239.89a62.81,62.81,0,0,1-62.81-62.81V421.4A62.81,62.81,0,0,1,239.89,358.6Z"/><path class="cls-1" d="M588,408.64V818.16c0,3.19-4.65,5-7.83,3L434.2,699.55"/><path class="cls-1" d="M403.46,672l-42.08-35.52v-273L580.12,178.83c3.18-2,7.83-.18,7.83,3V339.6"/><path class="cls-1" d="M639.3,403.1a91.73,91.73,0,1,1,0,183.46"/><path class="cls-1" d="M639.3,311.21a183.62,183.62,0,0,1,0,367.24"/></svg>'
  , events: {
    click: () => {
      G_A_M_E.mute((isMuted) => {
        soundButton.innerHTML = isMuted ? '<svg data-name="Layer 2" id="Layer_2" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1{fill:none;stroke:#020202;stroke-linecap:round;stroke-miterlimit:12;stroke-width:32px;}</style></defs><line class="cls-1" x1="644.38" x2="831.85" y1="393.76" y2="606.24"/><line class="cls-1" x1="831.85" x2="644.38" y1="393.76" y2="606.24"/><path class="cls-1" d="M231,358.6H353a0,0,0,0,1,0,0V641.4a0,0,0,0,1,0,0H231a62.81,62.81,0,0,1-62.81-62.81V421.4A62.81,62.81,0,0,1,231,358.6Z"/><path class="cls-1" d="M579,408.64V818.16c0,3.19-4.65,5-7.83,3L425.27,699.55"/><path class="cls-1" d="M394.53,672l-42.08-35.52v-273L571.19,178.83c3.18-2,7.83-.18,7.83,3V339.6"/></svg>' : '<svg data-name="Layer 2" id="Layer_2" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1{fill:none;stroke:#020202;stroke-linecap:round;stroke-miterlimit:10;stroke-width:22px;}</style></defs><path class="cls-1" d="M239.89,358.6H362a0,0,0,0,1,0,0V641.4a0,0,0,0,1,0,0H239.89a62.81,62.81,0,0,1-62.81-62.81V421.4A62.81,62.81,0,0,1,239.89,358.6Z"/><path class="cls-1" d="M588,408.64V818.16c0,3.19-4.65,5-7.83,3L434.2,699.55"/><path class="cls-1" d="M403.46,672l-42.08-35.52v-273L580.12,178.83c3.18-2,7.83-.18,7.83,3V339.6"/><path class="cls-1" d="M639.3,403.1a91.73,91.73,0,1,1,0,183.46"/><path class="cls-1" d="M639.3,311.21a183.62,183.62,0,0,1,0,367.24"/></svg>'
      });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RTtBQUN6QjtBQUNBO0FBQ0EsdUJBQXVCLDBDQUFJO0FBQzNCO0FBQ0E7QUFDQSx1QkFBdUIsMkNBQUs7QUFDNUI7QUFDQTtBQUNBLHVCQUF1QiwwQ0FBSTtBQUMzQjtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSCxDQUFDO0FBQ0Q7QUFDQSxpQkFBaUIsc0RBQWE7QUFDOUI7QUFDQTtBQUNBO0FBQ0EsSUFBSSxzREFBYTtBQUNqQjtBQUNBLGlCQUFpQixzREFBYSxXQUFXLGVBQWU7QUFDeEQsS0FBSztBQUNMLElBQUksc0RBQWE7QUFDakI7QUFDQSxpQkFBaUIsc0RBQWEsV0FBVyxjQUFjO0FBQ3ZELEtBQUs7QUFDTDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0EsYUFBYSxzREFBYTtBQUMxQjtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSxZQUFZLHNEQUFhO0FBQ3pCO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmlmdGVlbi1nYW1lLy4vbm9kZV9tb2R1bGVzL21pbmlyZXNldC5jc3MvbWluaXJlc2V0LmNzcz8xY2M0Iiwid2VicGFjazovL2ZpZnRlZW4tZ2FtZS8uL3NyYy9zdHlsZXMvbWFpbi5zY3NzPzJmZjQiLCJ3ZWJwYWNrOi8vZmlmdGVlbi1nYW1lLy4vc3JjL2pzL2NvcmUuanMiLCJ3ZWJwYWNrOi8vZmlmdGVlbi1nYW1lLy4vc3JjL2pzL2xpYi5qcyIsIndlYnBhY2s6Ly9maWZ0ZWVuLWdhbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZmlmdGVlbi1nYW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9maWZ0ZWVuLWdhbWUvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9maWZ0ZWVuLWdhbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9maWZ0ZWVuLWdhbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9maWZ0ZWVuLWdhbWUvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vZmlmdGVlbi1nYW1lLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsImltcG9ydCBtb3ZlU291bmQgZnJvbSAnLi4vYXVkaW8venZ1ay5tcDMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IFJJR0hUID0geyBkeDogMCwgZHk6IC0xIH07XHJcbmV4cG9ydCBjb25zdCBMRUZUID0geyBkeDogMCwgZHk6IDEgfTtcclxuZXhwb3J0IGNvbnN0IFVQID0geyBkeDogMSwgZHk6IDAgfTtcclxuZXhwb3J0IGNvbnN0IERPV04gPSB7IGR4OiAtMSwgZHk6IDAgfTtcclxuXHJcbmV4cG9ydCBjb25zdCBNT1ZFX0VWRU5UID0gXCItLW1vdmVcIjtcclxuZXhwb3J0IGNvbnN0IE1PVkVfQ09VTlRFUl9FVkVOVCA9IFwiLS1jb3VudFwiO1xyXG5leHBvcnQgY29uc3QgU1RBUlRfRVZFTlQgPSBcIi0tc3RhcnRcIjtcclxuZXhwb3J0IGNvbnN0IFBMQVlfUEFVU0VfRVZFTlQgPSBcIi0tcGxheXBhdXNlXCI7XHJcbmV4cG9ydCBjb25zdCBTT0xWRURfRVZFTlQgPSBcIi0tc29sdmVkXCI7XHJcbmV4cG9ydCBjb25zdCBUSU1FQ0hBTkdFX0VWRU5UID0gXCItLXRpbWVjaGFuZ2VcIjtcclxuXHJcbmNvbnN0IGF1ZGlvID0gbmV3IEF1ZGlvKCk7XHJcblxyXG5hdWRpby5zcmMgPSBtb3ZlU291bmQ7XHJcbmF1ZGlvLmxvYWQoKTtcclxuXHJcblxyXG5leHBvcnQgY29uc3QgY3JlYXRlR2FtZSA9IChzaXplID0gNCkgPT4ge1xyXG4gIGNvbnN0IHN1YnNjcmliZXJzID0ge307XHJcbiAgY29uc3QgZGlzcGF0Y2ggPSAodHlwZSwgLi4ucGF5bG9hZCkgPT4ge1xyXG4gICAgc3Vic2NyaWJlcnNbdHlwZV0gJiYgc3Vic2NyaWJlcnNbdHlwZV0uZm9yRWFjaCgoZm4pID0+IGZuKC4uLnBheWxvYWQpKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBtYXRyaXggPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiBzaXplIH0sIChfLCBpKSA9PiB7XHJcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh7IGxlbmd0aDogc2l6ZSB9LCAoXywgaikgPT4gKHtcclxuICAgICAgaWR4OiBpICogc2l6ZSArIGosXHJcbiAgICAgIG5hbWU6IGkgKiBzaXplICsgaiArIDEsXHJcbiAgICB9KSk7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IGVtcHR5ID0gbWF0cml4LmF0KC0xKS5hdCgtMSk7XHJcblxyXG4gIGxldCBbZW1wdHlYLCBlbXB0eVldID0gW3NpemUgLSAxLCBzaXplIC0gMV07XHJcblxyXG4gIGxldCBtb3ZlcyA9IDA7XHJcbiAgbGV0IGR1cmF0aW9uID0gMDtcclxuICBsZXQgaXNQbGF5aW5nID0gZmFsc2U7XHJcbiAgbGV0IGlzR2FtZVN0YXJ0ZWQgPSBmYWxzZTtcclxuICBsZXQgaW50ZXJ2YWxJZDtcclxuXHJcbiAgY29uc3QgY2FuTW92ZSA9ICh4LCB5KSA9PiB7XHJcbiAgICByZXR1cm4geCA+PSAwICYmIHggPCBzaXplICYmIHkgPj0gMCAmJiB5IDwgc2l6ZTtcclxuICB9O1xyXG5cclxuICBjb25zdCBzd2FwID0gKG1hdHJpeCwgW3gxLCB5MV0sIFt4MiwgeTJdKSA9PiB7XHJcbiAgICBbbWF0cml4W3gxXVt5MV0sIG1hdHJpeFt4Ml1beTJdXSA9IFttYXRyaXhbeDJdW3kyXSwgbWF0cml4W3gxXVt5MV1dO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBtYXRyaXgsXHJcbiAgICBnZXQgbW92ZXMoKSB7XHJcbiAgICAgIHJldHVybiBtb3ZlcztcclxuICAgIH0sXHJcbiAgICBnZXQgZHVyYXRpb24oKSB7XHJcbiAgICAgIHJldHVybiBkdXJhdGlvbjtcclxuICAgIH0sXHJcbiAgICBnZXQgaXNTb2x2ZWQoKSB7XHJcbiAgICAgIHJldHVybiBtYXRyaXguZXZlcnkoKHJvdywgeCkgPT5cclxuICAgICAgICByb3cuZXZlcnkoKHsgaWR4IH0sIHkpID0+IHggKiBzaXplICsgeSA9PT0gaWR4KVxyXG4gICAgICApO1xyXG4gICAgfSxcclxuICAgIGdldCBlbXB0eSgpIHtcclxuICAgICAgcmV0dXJuIHsgLi4uZW1wdHksIHg6IGVtcHR5WCwgeTogZW1wdHlZIH07XHJcbiAgICB9LFxyXG4gICAgZ2V0IGlzUGxheWluZygpIHtcclxuICAgICAgcmV0dXJuIGlzUGxheWluZztcclxuICAgIH0sXHJcbiAgICBtb3ZlKHsgZHgsIGR5IH0pIHtcclxuICAgICAgaWYgKCFpc1BsYXlpbmcpIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBueCA9IGVtcHR5WCArIGR4O1xyXG4gICAgICBsZXQgbnkgPSBlbXB0eVkgKyBkeTtcclxuXHJcbiAgICAgIGlmIChjYW5Nb3ZlKG54LCBueSkpIHtcclxuICAgICAgICBtb3ZlcysrO1xyXG4gICAgICAgIGF1ZGlvLnBsYXkoKTtcclxuXHJcbiAgICAgICAgc3dhcChtYXRyaXgsIFtueCwgbnldLCBbZW1wdHlYLCBlbXB0eVldKTtcclxuXHJcbiAgICAgICAgW2VtcHR5WCwgZW1wdHlZLCBueCwgbnldID0gW254LCBueSwgZW1wdHlYLCBlbXB0eVldO1xyXG5cclxuICAgICAgICBkaXNwYXRjaChNT1ZFX0VWRU5ULCBtYXRyaXhbbnhdW255XS5pZHgsIFtueCwgbnldLCB7XHJcbiAgICAgICAgICBkeCxcclxuICAgICAgICAgIGR5LFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5pc1NvbHZlZCkge1xyXG4gICAgICAgIGlzUGxheWluZyA9IGZhbHNlO1xyXG4gICAgICAgIGlzR2FtZVN0YXJ0ZWQgPSBmYWxzZTtcclxuICAgICAgICBkaXNwYXRjaChTT0xWRURfRVZFTlQpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgcGxheXBhdXNlKCkge1xyXG4gICAgICBpZiAoaXNHYW1lU3RhcnRlZCkge1xyXG4gICAgICAgIGlzUGxheWluZyA9ICFpc1BsYXlpbmc7XHJcbiAgICAgICAgZGlzcGF0Y2goUExBWV9QQVVTRV9FVkVOVCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzdGFydCgpIHtcclxuICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbElkKTtcclxuXHJcbiAgICAgIGlzR2FtZVN0YXJ0ZWQgPSB0cnVlO1xyXG4gICAgICBpc1BsYXlpbmcgPSB0cnVlO1xyXG4gICAgICBkdXJhdGlvbiA9IDA7XHJcbiAgICAgIG1vdmVzID0gMDtcclxuXHJcbiAgICAgIGludGVydmFsSWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKGlzUGxheWluZykge1xyXG4gICAgICAgICAgZHVyYXRpb24rKztcclxuICAgICAgICAgIGRpc3BhdGNoKFRJTUVDSEFOR0VfRVZFTlQsIGR1cmF0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIDEwMDApO1xyXG5cclxuICAgICAgY29uc3QgbmVpZ2hib3JzID0gW1VQLCBET1dOLCBSSUdIVCwgTEVGVF07XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDIwMDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgeyBkeCwgZHkgfSA9IG5laWdoYm9yc1tcclxuICAgICAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG5laWdoYm9ycy5sZW5ndGgpXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgbGV0IG54ID0gZW1wdHlYICsgZHg7XHJcbiAgICAgICAgbGV0IG55ID0gZW1wdHlZICsgZHk7XHJcblxyXG4gICAgICAgIGlmIChjYW5Nb3ZlKG54LCBueSkpIHtcclxuICAgICAgICAgIHN3YXAobWF0cml4LCBbbngsIG55XSwgW2VtcHR5WCwgZW1wdHlZXSk7XHJcblxyXG4gICAgICAgICAgW2VtcHR5WCwgZW1wdHlZLCBueCwgbnldID0gW254LCBueSwgZW1wdHlYLCBlbXB0eVldO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZGlzcGF0Y2goU1RBUlRfRVZFTlQsIG1hdHJpeCk7XHJcbiAgICAgIGRpc3BhdGNoKFBMQVlfUEFVU0VfRVZFTlQsIGlzUGxheWluZyk7XHJcbiAgICB9LFxyXG4gICAgbXV0ZShmbikge1xyXG4gICAgICBhdWRpby5tdXRlZCA/IChhdWRpby5tdXRlZCA9IGZhbHNlKSA6IChhdWRpby5tdXRlZCA9IHRydWUpOyBmbihhdWRpby5tdXRlZClcclxuICAgIH0sXHJcbiAgICBzdWJzY3JpYmUodHlwZSwgZm4pIHtcclxuICAgICAgaWYgKCFzdWJzY3JpYmVyc1t0eXBlXSkge1xyXG4gICAgICAgIHN1YnNjcmliZXJzW3R5cGVdID0gW107XHJcbiAgICAgIH1cclxuICAgICAgc3Vic2NyaWJlcnNbdHlwZV0ucHVzaChmbik7XHJcbiAgICB9LFxyXG4gIH07XHJcbn07XHJcbiIsImV4cG9ydCBjb25zdCBjcmVhdGVFbGVtZW50ID0gKHRhZywgb3B0aW9ucykgPT4ge1xyXG4gIGNvbnN0IHtcclxuICAgIGNsYXNzTmFtZSxcclxuICAgIHRleHQsXHJcbiAgICBodG1sLFxyXG4gICAgZXZlbnRzID0ge30sXHJcbiAgICBjaGlsZHJlbiA9IFtdLFxyXG4gICAgLi4uYXR0cnNcclxuICB9ID0gb3B0aW9ucztcclxuXHJcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XHJcblxyXG4gIGNsYXNzTmFtZSAmJiBlbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBjbGFzc05hbWUpO1xyXG4gIHRleHQgJiYgKGVsLnRleHRDb250ZW50ID0gdGV4dCk7XHJcbiAgaHRtbCAmJiAoZWwuaW5uZXJIVE1MID0gaHRtbCk7XHJcblxyXG4gIE9iamVjdC5rZXlzKGV2ZW50cykuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICBldmVudHNba2V5XSAmJiBlbC5hZGRFdmVudExpc3RlbmVyKGtleSwgZXZlbnRzW2tleV0pO1xyXG4gIH0pO1xyXG5cclxuICBPYmplY3Qua2V5cyhhdHRycykuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICBhdHRyc1trZXldICYmIGVsLnNldEF0dHJpYnV0ZShrZXksIGF0dHJzW2tleV0pO1xyXG4gIH0pO1xyXG5cclxuICBlbC5hcHBlbmQoLi4uY2hpbGRyZW4pO1xyXG5cclxuICByZXR1cm4gZWw7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3Qgc2VjVG9TdHJpbmdUaW1lID0gKGR1cmF0aW9uKSA9PlxyXG4gIGAke1N0cmluZygoZHVyYXRpb24gLyA2MCkgfCAwKS5wYWRTdGFydCgyLCBcIjBcIil9OiR7U3RyaW5nKFxyXG4gICAgZHVyYXRpb24gJSA2MFxyXG4gICkucGFkU3RhcnQoMiwgXCIwXCIpfWA7XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgc2NyaXB0VXJsO1xuaWYgKF9fd2VicGFja19yZXF1aXJlX18uZy5pbXBvcnRTY3JpcHRzKSBzY3JpcHRVcmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcubG9jYXRpb24gKyBcIlwiO1xudmFyIGRvY3VtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmRvY3VtZW50O1xuaWYgKCFzY3JpcHRVcmwgJiYgZG9jdW1lbnQpIHtcblx0aWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQpXG5cdFx0c2NyaXB0VXJsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmNcblx0aWYgKCFzY3JpcHRVcmwpIHtcblx0XHR2YXIgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpO1xuXHRcdGlmKHNjcmlwdHMubGVuZ3RoKSBzY3JpcHRVcmwgPSBzY3JpcHRzW3NjcmlwdHMubGVuZ3RoIC0gMV0uc3JjXG5cdH1cbn1cbi8vIFdoZW4gc3VwcG9ydGluZyBicm93c2VycyB3aGVyZSBhbiBhdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIHlvdSBtdXN0IHNwZWNpZnkgYW4gb3V0cHV0LnB1YmxpY1BhdGggbWFudWFsbHkgdmlhIGNvbmZpZ3VyYXRpb25cbi8vIG9yIHBhc3MgYW4gZW1wdHkgc3RyaW5nIChcIlwiKSBhbmQgc2V0IHRoZSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyB2YXJpYWJsZSBmcm9tIHlvdXIgY29kZSB0byB1c2UgeW91ciBvd24gbG9naWMuXG5pZiAoIXNjcmlwdFVybCkgdGhyb3cgbmV3IEVycm9yKFwiQXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXJcIik7XG5zY3JpcHRVcmwgPSBzY3JpcHRVcmwucmVwbGFjZSgvIy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcPy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcL1teXFwvXSskLywgXCIvXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gc2NyaXB0VXJsOyIsImltcG9ydCBcIm1pbmlyZXNldC5jc3NcIjtcclxuaW1wb3J0IFwiLi9zdHlsZXMvbWFpbi5zY3NzXCI7XHJcblxyXG5pbXBvcnQgeyBjcmVhdGVFbGVtZW50LCBzZWNUb1N0cmluZ1RpbWUgfSBmcm9tIFwiLi9qcy9saWJcIjtcclxuXHJcbmltcG9ydCB7XHJcbiAgY3JlYXRlR2FtZSxcclxuICBMRUZULFxyXG4gIFJJR0hULFxyXG4gIFVQLFxyXG4gIERPV04sXHJcbiAgTU9WRV9FVkVOVCxcclxuICBTVEFSVF9FVkVOVCxcclxuICBQTEFZX1BBVVNFX0VWRU5ULFxyXG4gIFNPTFZFRF9FVkVOVCxcclxuICBUSU1FQ0hBTkdFX0VWRU5ULFxyXG59IGZyb20gXCIuL2pzL2NvcmVcIjtcclxuXHJcbmNvbnN0IEdfQV9NX0UgPSBjcmVhdGVHYW1lKCk7XHJcblxyXG5HX0FfTV9FLnN1YnNjcmliZShNT1ZFX0VWRU5ULCAoaWR4LCBbeCwgeV0sIHsgZHgsIGR5IH0pID0+IHtcclxuICBjb25zdCB0aWxlID0gdGlsZXNbaWR4XTtcclxuXHJcbiAgY29uc3QgdGlsZUFuaW1hdGlvbiA9IHRpbGUuYW5pbWF0ZShcclxuICAgIFtcclxuICAgICAge1xyXG4gICAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZSgkey0xICogZHkgKiAxMDV9JSwgJHstMSAqIGR4ICogMTA1fSUpYCxcclxuICAgICAgfSxcclxuICAgIF0sXHJcbiAgICAxNTBcclxuICApO1xyXG5cclxuICBjb25zdCBoYW5kbGVGaW5pc2hBbmltYXRpb24gPSAoKSA9PiB7XHJcbiAgICB0aWxlc1tpZHhdLnN0eWxlLmdyaWRBcmVhID0gYCR7eCArIDF9IC8gJHt5ICsgMX1gO1xyXG5cclxuICAgIEdfQV9NX0UuaXNTb2x2ZWQgJiZcclxuICAgICAgdGlsZXMuZm9yRWFjaCgoZWwpID0+IHtcclxuICAgICAgICBlbC5hbmltYXRlKFxyXG4gICAgICAgICAgW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiBgcm90YXRlKDM2MGRlZylgLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgXSxcclxuICAgICAgICAgIDI1MFxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIHRpbGVBbmltYXRpb24ucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImZpbmlzaFwiLCBoYW5kbGVGaW5pc2hBbmltYXRpb24pO1xyXG4gIH07XHJcblxyXG4gIHRpbGVBbmltYXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcImZpbmlzaFwiLCBoYW5kbGVGaW5pc2hBbmltYXRpb24pO1xyXG5cclxuICBtb3Zlc0NvbnRyb2wudGV4dENvbnRlbnQgPSBTdHJpbmcoR19BX01fRS5tb3Zlcyk7XHJcbn0pO1xyXG5cclxuR19BX01fRS5zdWJzY3JpYmUoU1RBUlRfRVZFTlQsICgpID0+IHtcclxuICBtb3Zlc0NvbnRyb2wudGV4dENvbnRlbnQgPSBTdHJpbmcoR19BX01fRS5tb3Zlcyk7XHJcbiAgdGltZUNvbnRyb2wudGV4dENvbnRlbnQgPSBzZWNUb1N0cmluZ1RpbWUoR19BX01fRS5kdXJhdGlvbik7XHJcbiAgb3ZlcmxheVRpdGxlLnRleHRDb250ZW50ID0gXCJcIjtcclxuXHJcbiAgR19BX01fRS5tYXRyaXguZm9yRWFjaCgocm93LCB4KSA9PlxyXG4gICAgcm93LmZvckVhY2goKHsgaWR4IH0sIHkpID0+IHtcclxuICAgICAgdGlsZXNbaWR4XS5zdHlsZS5ncmlkQXJlYSA9IGAke3ggKyAxfSAvICR7eSArIDF9YDtcclxuXHJcbiAgICAgIHRpbGVzW2lkeF0uYW5pbWF0ZShcclxuICAgICAgICBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybTogYHJvdGF0ZSgzNjBkZWcpYCxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgXSxcclxuICAgICAgICAzMDBcclxuICAgICAgKTtcclxuICAgIH0pXHJcbiAgKTtcclxufSk7XHJcblxyXG5HX0FfTV9FLnN1YnNjcmliZShQTEFZX1BBVVNFX0VWRU5ULCAoKSA9PiB7XHJcbiAgR19BX01fRS5pc1BsYXlpbmdcclxuICAgID8gb3ZlcmxheS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpXHJcbiAgICA6IG92ZXJsYXkuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcclxufSk7XHJcblxyXG5HX0FfTV9FLnN1YnNjcmliZShUSU1FQ0hBTkdFX0VWRU5ULCAoKSA9PiB7XHJcbiAgdGltZUNvbnRyb2wudGV4dENvbnRlbnQgPSBzZWNUb1N0cmluZ1RpbWUoR19BX01fRS5kdXJhdGlvbik7XHJcbn0pO1xyXG5cclxuR19BX01fRS5zdWJzY3JpYmUoU09MVkVEX0VWRU5ULCAoKSA9PiB7XHJcbiAgY29uc29sZS5sb2coXHJcbiAgICBgWW91IFdPTiEsIEl0IHRha2VzIHlvdSAke0dfQV9NX0UubW92ZXN9IG1vdmVzIGFuZCAke0dfQV9NX0UuZHVyYXRpb259IHNlY29uZHNgXHJcbiAgKTtcclxuICBvdmVybGF5LmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XHJcbiAgb3ZlcmxheVRpdGxlLmlubmVySFRNTCA9IGBIb29yYXkhIFlvdSBzb2x2ZWQgdGhlIHB1enpsZSBpbiA8Yj4ke3NlY1RvU3RyaW5nVGltZShcclxuICAgIEdfQV9NX0UuZHVyYXRpb25cclxuICApfTwvYj4gYW5kIDxiPiR7R19BX01fRS5tb3Zlc308L2I+IG1vdmVzIWA7XHJcbn0pO1xyXG5cclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuY29uc3QgdGl0bGUgPSBjcmVhdGVFbGVtZW50KFwiaDFcIiwge1xyXG4gIGNsYXNzTmFtZTogXCJhcHAtdGl0bGVcIixcclxuICB0ZXh0OiBcIkZpZnRlZW4gcHV6emxlXCIsXHJcbn0pO1xyXG5cclxuY29uc3QgbW92ZXNDb250cm9sID0gY3JlYXRlRWxlbWVudChcInNwYW5cIiwgeyB0ZXh0OiBcIjBcIiB9KTtcclxuY29uc3QgdGltZUNvbnRyb2wgPSBjcmVhdGVFbGVtZW50KFwic3BhblwiLCB7IHRleHQ6IFwiMDA6MDBcIiB9KTtcclxuXHJcbmNvbnN0IHNvdW5kQnV0dG9uID0gY3JlYXRlRWxlbWVudChcImJ1dHRvblwiLCB7XHJcbiAgY2xhc3NOYW1lOiBcImJ1dHRvbiBidXR0b24tLXJvdW5kZWRcIixcclxuICBodG1sOlxyXG4gICAgJzxzdmcgZGF0YS1uYW1lPVwiTGF5ZXIgMlwiIGlkPVwiTGF5ZXJfMlwiIHZpZXdCb3g9XCIwIDAgMTAwMCAxMDAwXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjxkZWZzPjxzdHlsZT4uY2xzLTF7ZmlsbDpub25lO3N0cm9rZTojMDIwMjAyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEyO3N0cm9rZS13aWR0aDozMnB4O308L3N0eWxlPjwvZGVmcz48cGF0aCBjbGFzcz1cImNscy0xXCIgZD1cIk0yMzkuODksMzU4LjZIMzYyYTAsMCwwLDAsMSwwLDBWNjQxLjRhMCwwLDAsMCwxLDAsMEgyMzkuODlhNjIuODEsNjIuODEsMCwwLDEtNjIuODEtNjIuODFWNDIxLjRBNjIuODEsNjIuODEsMCwwLDEsMjM5Ljg5LDM1OC42WlwiLz48cGF0aCBjbGFzcz1cImNscy0xXCIgZD1cIk01ODgsNDA4LjY0VjgxOC4xNmMwLDMuMTktNC42NSw1LTcuODMsM0w0MzQuMiw2OTkuNTVcIi8+PHBhdGggY2xhc3M9XCJjbHMtMVwiIGQ9XCJNNDAzLjQ2LDY3MmwtNDIuMDgtMzUuNTJ2LTI3M0w1ODAuMTIsMTc4LjgzYzMuMTgtMiw3LjgzLS4xOCw3LjgzLDNWMzM5LjZcIi8+PHBhdGggY2xhc3M9XCJjbHMtMVwiIGQ9XCJNNjM5LjMsNDAzLjFhOTEuNzMsOTEuNzMsMCwxLDEsMCwxODMuNDZcIi8+PHBhdGggY2xhc3M9XCJjbHMtMVwiIGQ9XCJNNjM5LjMsMzExLjIxYTE4My42MiwxODMuNjIsMCwwLDEsMCwzNjcuMjRcIi8+PC9zdmc+J1xyXG4gICwgZXZlbnRzOiB7XHJcbiAgICBjbGljazogKCkgPT4ge1xyXG4gICAgICBHX0FfTV9FLm11dGUoKGlzTXV0ZWQpID0+IHtcclxuICAgICAgICBzb3VuZEJ1dHRvbi5pbm5lckhUTUwgPSBpc011dGVkID8gJzxzdmcgZGF0YS1uYW1lPVwiTGF5ZXIgMlwiIGlkPVwiTGF5ZXJfMlwiIHZpZXdCb3g9XCIwIDAgMTAwMCAxMDAwXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjxkZWZzPjxzdHlsZT4uY2xzLTF7ZmlsbDpub25lO3N0cm9rZTojMDIwMjAyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEyO3N0cm9rZS13aWR0aDozMnB4O308L3N0eWxlPjwvZGVmcz48bGluZSBjbGFzcz1cImNscy0xXCIgeDE9XCI2NDQuMzhcIiB4Mj1cIjgzMS44NVwiIHkxPVwiMzkzLjc2XCIgeTI9XCI2MDYuMjRcIi8+PGxpbmUgY2xhc3M9XCJjbHMtMVwiIHgxPVwiODMxLjg1XCIgeDI9XCI2NDQuMzhcIiB5MT1cIjM5My43NlwiIHkyPVwiNjA2LjI0XCIvPjxwYXRoIGNsYXNzPVwiY2xzLTFcIiBkPVwiTTIzMSwzNTguNkgzNTNhMCwwLDAsMCwxLDAsMFY2NDEuNGEwLDAsMCwwLDEsMCwwSDIzMWE2Mi44MSw2Mi44MSwwLDAsMS02Mi44MS02Mi44MVY0MjEuNEE2Mi44MSw2Mi44MSwwLDAsMSwyMzEsMzU4LjZaXCIvPjxwYXRoIGNsYXNzPVwiY2xzLTFcIiBkPVwiTTU3OSw0MDguNjRWODE4LjE2YzAsMy4xOS00LjY1LDUtNy44MywzTDQyNS4yNyw2OTkuNTVcIi8+PHBhdGggY2xhc3M9XCJjbHMtMVwiIGQ9XCJNMzk0LjUzLDY3MmwtNDIuMDgtMzUuNTJ2LTI3M0w1NzEuMTksMTc4LjgzYzMuMTgtMiw3LjgzLS4xOCw3LjgzLDNWMzM5LjZcIi8+PC9zdmc+JyA6ICc8c3ZnIGRhdGEtbmFtZT1cIkxheWVyIDJcIiBpZD1cIkxheWVyXzJcIiB2aWV3Qm94PVwiMCAwIDEwMDAgMTAwMFwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6bm9uZTtzdHJva2U6IzAyMDIwMjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2Utd2lkdGg6MjJweDt9PC9zdHlsZT48L2RlZnM+PHBhdGggY2xhc3M9XCJjbHMtMVwiIGQ9XCJNMjM5Ljg5LDM1OC42SDM2MmEwLDAsMCwwLDEsMCwwVjY0MS40YTAsMCwwLDAsMSwwLDBIMjM5Ljg5YTYyLjgxLDYyLjgxLDAsMCwxLTYyLjgxLTYyLjgxVjQyMS40QTYyLjgxLDYyLjgxLDAsMCwxLDIzOS44OSwzNTguNlpcIi8+PHBhdGggY2xhc3M9XCJjbHMtMVwiIGQ9XCJNNTg4LDQwOC42NFY4MTguMTZjMCwzLjE5LTQuNjUsNS03LjgzLDNMNDM0LjIsNjk5LjU1XCIvPjxwYXRoIGNsYXNzPVwiY2xzLTFcIiBkPVwiTTQwMy40Niw2NzJsLTQyLjA4LTM1LjUydi0yNzNMNTgwLjEyLDE3OC44M2MzLjE4LTIsNy44My0uMTgsNy44MywzVjMzOS42XCIvPjxwYXRoIGNsYXNzPVwiY2xzLTFcIiBkPVwiTTYzOS4zLDQwMy4xYTkxLjczLDkxLjczLDAsMSwxLDAsMTgzLjQ2XCIvPjxwYXRoIGNsYXNzPVwiY2xzLTFcIiBkPVwiTTYzOS4zLDMxMS4yMWExODMuNjIsMTgzLjYyLDAsMCwxLDAsMzY3LjI0XCIvPjwvc3ZnPidcclxuICAgICAgfSk7XHJcbiAgICAgIGJvYXJkLmZvY3VzKCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG5cclxuY29uc3Qgc2V0dGluZ3NCdXR0b24gPSBjcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIsIHtcclxuICBjbGFzc05hbWU6IFwiYnV0dG9uIGJ1dHRvbi0tcm91bmRlZFwiLFxyXG4gIGh0bWw6XHJcbiAgICAnPHN2ZyBlbmFibGUtYmFja2dyb3VuZD1cIm5ldyAwIDAgMzIgMzJcIiBmaWxsPVwiIzNmMzg0NFwiICBpZD1cIkdseXBoXCIgdmVyc2lvbj1cIjEuMVwiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIj48cGF0aCBkPVwiTTI3LjUyNiwxOC4wMzZMMjcsMTcuNzMyYy0wLjYyNi0wLjM2MS0xLTEuMDA5LTEtMS43MzJzMC4zNzQtMS4zNzEsMS0xLjczMmwwLjUyNi0wLjMwNCAgYzEuNDM2LTAuODMsMS45MjctMi42NjIsMS4wOTgtNC4wOThsLTEtMS43MzJjLTAuODI3LTEuNDMzLTIuNjY2LTEuOTI1LTQuMDk4LTEuMDk4TDIzLDcuMzM5Yy0wLjYyNiwwLjM2Mi0xLjM3NSwwLjM2Mi0yLDAgIGMtMC42MjYtMC4zNjItMS0xLjAwOS0xLTEuNzMyVjVjMC0xLjY1NC0xLjM0Ni0zLTMtM2gtMmMtMS42NTQsMC0zLDEuMzQ2LTMsM3YwLjYwOGMwLDAuNzIzLTAuMzc0LDEuMzctMSwxLjczMiAgYy0wLjYyNiwwLjM2MS0xLjM3NCwwLjM2Mi0yLDBMOC40NzQsNy4wMzZDNy4wNDIsNi4yMDksNS4yMDMsNi43MDEsNC4zNzUsOC4xMzRsLTEsMS43MzJjLTAuODI5LDEuNDM2LTAuMzM4LDMuMjY5LDEuMDk4LDQuMDk4ICBMNSwxNC4yNjhDNS42MjYsMTQuNjI5LDYsMTUuMjc3LDYsMTZzLTAuMzc0LDEuMzcxLTEsMS43MzJsLTAuNTI2LDAuMzA0Yy0xLjQzNiwwLjgyOS0xLjkyNywyLjY2Mi0xLjA5OCw0LjA5OGwxLDEuNzMyICBjMC44MjgsMS40MzMsMi42NjcsMS45MjUsNC4wOTgsMS4wOThMOSwyNC42NjFjMC42MjYtMC4zNjMsMS4zNzQtMC4zNjEsMiwwYzAuNjI2LDAuMzYyLDEsMS4wMDksMSwxLjczMlYyN2MwLDEuNjU0LDEuMzQ2LDMsMywzaDIgIGMxLjY1NCwwLDMtMS4zNDYsMy0zdi0wLjYwOGMwLTAuNzIzLDAuMzc0LTEuMzcsMS0xLjczMmMwLjYyNS0wLjM2MSwxLjM3NC0wLjM2MiwyLDBsMC41MjYsMC4zMDQgIGMxLjQzMiwwLjgyNiwzLjI3MSwwLjMzNCw0LjA5OC0xLjA5OGwxLTEuNzMyQzI5LjQ1MywyMC42OTgsMjguOTYyLDE4Ljg2NSwyNy41MjYsMTguMDM2eiBNMTYsMjFjLTIuNzU3LDAtNS0yLjI0My01LTVzMi4yNDMtNSw1LTUgIHM1LDIuMjQzLDUsNVMxOC43NTcsMjEsMTYsMjF6XCIgaWQ9XCJYTUxJRF8yNzNfXCIvPjwvc3ZnPicsXHJcbiAgZXZlbnRzOiB7XHJcbiAgICBjbGljazogKCkgPT4ge1xyXG4gICAgICBHX0FfTV9FLnBsYXlwYXVzZSgpO1xyXG4gICAgICBib2FyZC5mb2N1cygpO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbi8vIGNvbnN0IHNpemVDb250cm9scyA9IGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1xyXG4vLyAgIGNsYXNzTmFtZTpcclxuLy8gICAgIFwic3RhY2sgc3RhY2stLXJvdyBzdGFjay0td3JhcCBzdGFjay0tanVzdGlmeS1jZW50ZXIgc3RhY2stLWdhcC0yIGhpZGRlblwiLFxyXG4vLyAgIGNoaWxkcmVuOiBbMywgNCwgNSwgNiwgNywgOF0ubWFwKChzaXplKSA9PiB7XHJcbi8vICAgICByZXR1cm4gY3JlYXRlRWxlbWVudChcImJ1dHRvblwiLCB7XHJcbi8vICAgICAgIGNsYXNzTmFtZTogXCJidXR0b25cIixcclxuLy8gICAgICAgdGV4dDogc2l6ZSArIFwieFwiICsgc2l6ZSxcclxuLy8gICAgICAgXCJkYXRhLXNpemVcIjogc2l6ZSxcclxuLy8gICAgIH0pO1xyXG4vLyAgIH0pLFxyXG4vLyAgIGV2ZW50czoge1xyXG4vLyAgICAgY2xpY2s6IChlKSA9PiB7XHJcbi8vICAgICAgIGNvbnN0IHsgc2l6ZSB9ID0gZS50YXJnZXQ/LmRhdGFzZXQ7XHJcbi8vICAgICAgIGlmIChzaXplKSB7XHJcbi8vICAgICAgICAgR19BX01fRS5zdGFydChOdW1iZXIoc2l6ZSkpO1xyXG4vLyAgICAgICAgIGJvYXJkLmZvY3VzKCk7XHJcbi8vICAgICAgICAgc2l6ZUNvbnRyb2xzLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XHJcbi8vICAgICAgIH1cclxuLy8gICAgIH0sXHJcbi8vICAgfSxcclxuLy8gfSk7XHJcblxyXG5jb25zdCBzdGFydEJ1dHRvbiA9IGNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIiwge1xyXG4gIGNsYXNzTmFtZTogXCJidXR0b25cIixcclxuICB0ZXh0OiBcInN0YXJ0IG5ldyBnYW1lXCIsXHJcbiAgY2hpbGRyZW46IFtdLFxyXG4gIGV2ZW50czoge1xyXG4gICAgY2xpY2s6ICgpID0+IHtcclxuICAgICAgR19BX01fRS5zdGFydCgpO1xyXG4gICAgICBib2FyZC5mb2N1cygpO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbmNvbnN0IHRpbGVzID0gR19BX01fRS5tYXRyaXhcclxuICAubWFwKChyb3csIHgpID0+XHJcbiAgICByb3cubWFwKCh7IGlkeCwgbmFtZSB9LCB5KSA9PiB7XHJcbiAgICAgIGNvbnN0IGVsID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XHJcbiAgICAgICAgY2xhc3NOYW1lOiBgdGlsZSAke0dfQV9NX0UuZW1wdHkuaWR4ID09PSBpZHggPyBcInRpbGUtLWVtcHR5XCIgOiBcIlwifWAsXHJcbiAgICAgICAgdGV4dDogbmFtZSxcclxuICAgICAgICBkcmFnZ2FibGU6IHRydWUsXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZWwuc3R5bGUuZ3JpZEFyZWEgPSBgJHt4ICsgMX0gLyAke3kgKyAxfWA7XHJcblxyXG4gICAgICByZXR1cm4gZWw7XHJcbiAgICB9KVxyXG4gIClcclxuICAuZmxhdCgpO1xyXG5cclxuY29uc3Qgb3ZlcmxheVRpdGxlID0gY3JlYXRlRWxlbWVudChcImgyXCIsIHtcclxuICBjbGFzc05hbWU6IFwiYm9hcmQtb3ZlcmxheS10aXRsZVwiLFxyXG59KTtcclxuXHJcbmNvbnN0IG92ZXJsYXkgPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcclxuICBjbGFzc05hbWU6IFwiYm9hcmQtb3ZlcmxheVwiLFxyXG4gIGNoaWxkcmVuOiBbXHJcbiAgICBvdmVybGF5VGl0bGUsXHJcbiAgICBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcclxuICAgICAgY2xhc3NOYW1lOiBcInN0YWNrIHN0YWNrLS1yb3cgc3RhY2stLWdhcC14LTIgcHktNFwiLFxyXG4gICAgICBjaGlsZHJlbjogW3N0YXJ0QnV0dG9uXSxcclxuICAgIH0pLFxyXG4gIF0sXHJcbn0pO1xyXG5cclxuY29uc3QgYm9hcmQgPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcclxuICBjbGFzc05hbWU6IGBib2FyZCBib2FyZC0tc2l6ZS0ke0dfQV9NX0UubWF0cml4Lmxlbmd0aH1gLFxyXG4gIGNoaWxkcmVuOiBbLi4udGlsZXMsIG92ZXJsYXldLFxyXG4gIHRhYmluZGV4OiBcIjBcIixcclxuICBldmVudHM6IHtcclxuICAgIGNsaWNrOiAoZSkgPT4ge1xyXG4gICAgICBjb25zdCBlbCA9IHRpbGVzLmZpbmQoKGVsKSA9PiBlbC5jb250YWlucyhlLnRhcmdldCkpO1xyXG5cclxuICAgICAgaWYgKGVsKSB7XHJcbiAgICAgICAgY29uc3QgW3gsIHldID0gW1xyXG4gICAgICAgICAgTnVtYmVyKGVsLnN0eWxlLmdyaWRSb3dTdGFydCkgLSAxLFxyXG4gICAgICAgICAgTnVtYmVyKGVsLnN0eWxlLmdyaWRDb2x1bW5TdGFydCkgLSAxLFxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IFtVUCwgRE9XTiwgUklHSFQsIExFRlRdLmZpbmQoXHJcbiAgICAgICAgICAoeyBkeCwgZHkgfSkgPT5cclxuICAgICAgICAgICAgZHggPT09IHggLSBHX0FfTV9FLmVtcHR5LnggJiYgZHkgPT09IHkgLSBHX0FfTV9FLmVtcHR5LnlcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBkaXJlY3Rpb24gJiYgR19BX01fRS5tb3ZlKGRpcmVjdGlvbik7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBrZXlkb3duOiAoZSkgPT4ge1xyXG4gICAgICBzd2l0Y2ggKGUuY29kZSkge1xyXG4gICAgICAgIGNhc2UgXCJBcnJvd1VwXCI6XHJcbiAgICAgICAgICBHX0FfTV9FLm1vdmUoVVApO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIkFycm93RG93blwiOlxyXG4gICAgICAgICAgR19BX01fRS5tb3ZlKERPV04pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIkFycm93UmlnaHRcIjpcclxuICAgICAgICAgIEdfQV9NX0UubW92ZShSSUdIVCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiQXJyb3dMZWZ0XCI6XHJcbiAgICAgICAgICBHX0FfTV9FLm1vdmUoTEVGVCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbmNvbnN0IGNvbnRyb2xzID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XHJcbiAgY2xhc3NOYW1lOiBcInN0YWNrIHN0YWNrLS1hbGlnbi1jZW50ZXIgc3RhY2stLXJvdyBzdGFjay0tZ2FwLXgtMlwiLFxyXG4gIGNoaWxkcmVuOiBbXHJcbiAgICBzb3VuZEJ1dHRvbixcclxuICAgIGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1xyXG4gICAgICBjbGFzc05hbWU6IFwiaW5mby1ib3hcIixcclxuICAgICAgY2hpbGRyZW46IFtjcmVhdGVFbGVtZW50KFwic3BhblwiLCB7IHRleHQ6IFwibW92ZXNcIiB9KSwgbW92ZXNDb250cm9sXSxcclxuICAgIH0pLFxyXG4gICAgY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XHJcbiAgICAgIGNsYXNzTmFtZTogXCJpbmZvLWJveFwiLFxyXG4gICAgICBjaGlsZHJlbjogW2NyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHsgdGV4dDogXCJ0aW1lXCIgfSksIHRpbWVDb250cm9sXSxcclxuICAgIH0pLFxyXG4gICAgc2V0dGluZ3NCdXR0b24sXHJcbiAgXSxcclxufSk7XHJcblxyXG5jb25zdCBpbmZvID0gY3JlYXRlRWxlbWVudChcImgyXCIsIHtcclxuICBjbGFzc05hbWU6IFwiaW5mby10ZXh0XCIsXHJcbiAgaHRtbDpcclxuICAgIFwiVG8gbW92ZSBhIHRpbGUgeW91IGNhbiA8Yj5jbGljazwvYj4gb24gaXQgb3IgdXNlIHlvdXIgPGI+YXJyb3cga2V5czwvYj4uIFByZXNzIDxiPkVTQzwvYj4gdG8gcGF1c2UgZ2FtZS5cIixcclxufSk7XHJcblxyXG5jb25zdCBhcHAgPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcclxuICBjbGFzc05hbWU6IFwiYXBwXCIsXHJcbiAgY2hpbGRyZW46IFt0aXRsZSwgY29udHJvbHMsIGJvYXJkLCBpbmZvXSxcclxufSk7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZSkgPT4ge1xyXG4gIHN3aXRjaCAoZS5jb2RlKSB7XHJcbiAgICBjYXNlIFwiRXNjYXBlXCI6IHtcclxuICAgICAgR19BX01fRS5wbGF5cGF1c2UoKTtcclxuICAgICAgYm9hcmQuZm9jdXMoKTtcclxuICAgIH1cclxuICB9XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuYm9keS5hcHBlbmQoYXBwKTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9