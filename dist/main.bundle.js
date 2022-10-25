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

const audio = new Audio(_audio_zvuk_mp3__WEBPACK_IMPORTED_MODULE_0__);

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
        audio.currentTime = 0;
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
      audio.muted ? (audio.muted = false) : (audio.muted = true);
      fn(audio.muted);
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

      const direction = [_js_core__WEBPACK_IMPORTED_MODULE_3__.UP, _js_core__WEBPACK_IMPORTED_MODULE_3__.DOWN, _js_core__WEBPACK_IMPORTED_MODULE_3__.RIGHT, _js_core__WEBPACK_IMPORTED_MODULE_3__.LEFT].find(
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLHdDQUFFLEVBQUUsMENBQUksRUFBRSwyQ0FBSyxFQUFFLDBDQUFJO0FBQ2hELGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qix3Q0FBRTtBQUN6QjtBQUNBO0FBQ0EsdUJBQXVCLDBDQUFJO0FBQzNCO0FBQ0E7QUFDQSx1QkFBdUIsMkNBQUs7QUFDNUI7QUFDQTtBQUNBLHVCQUF1QiwwQ0FBSTtBQUMzQjtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSCxDQUFDO0FBQ0Q7QUFDQSxpQkFBaUIsc0RBQWE7QUFDOUI7QUFDQTtBQUNBO0FBQ0EsSUFBSSxzREFBYTtBQUNqQjtBQUNBLGlCQUFpQixzREFBYSxXQUFXLGVBQWU7QUFDeEQsS0FBSztBQUNMLElBQUksc0RBQWE7QUFDakI7QUFDQSxpQkFBaUIsc0RBQWEsV0FBVyxjQUFjO0FBQ3ZELEtBQUs7QUFDTDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0EsYUFBYSxzREFBYTtBQUMxQjtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSxZQUFZLHNEQUFhO0FBQ3pCO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmlmdGVlbi1nYW1lLy4vbm9kZV9tb2R1bGVzL21pbmlyZXNldC5jc3MvbWluaXJlc2V0LmNzcyIsIndlYnBhY2s6Ly9maWZ0ZWVuLWdhbWUvLi9zcmMvc3R5bGVzL21haW4uc2NzcyIsIndlYnBhY2s6Ly9maWZ0ZWVuLWdhbWUvLi9zcmMvanMvY29yZS5qcyIsIndlYnBhY2s6Ly9maWZ0ZWVuLWdhbWUvLi9zcmMvanMvbGliLmpzIiwid2VicGFjazovL2ZpZnRlZW4tZ2FtZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9maWZ0ZWVuLWdhbWUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2ZpZnRlZW4tZ2FtZS93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2ZpZnRlZW4tZ2FtZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2ZpZnRlZW4tZ2FtZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2ZpZnRlZW4tZ2FtZS93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9maWZ0ZWVuLWdhbWUvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiaW1wb3J0IG1vdmVTb3VuZCBmcm9tIFwiLi4vYXVkaW8venZ1ay5tcDNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBSSUdIVCA9IHsgZHg6IDAsIGR5OiAtMSB9O1xyXG5leHBvcnQgY29uc3QgTEVGVCA9IHsgZHg6IDAsIGR5OiAxIH07XHJcbmV4cG9ydCBjb25zdCBVUCA9IHsgZHg6IDEsIGR5OiAwIH07XHJcbmV4cG9ydCBjb25zdCBET1dOID0geyBkeDogLTEsIGR5OiAwIH07XHJcblxyXG5leHBvcnQgY29uc3QgTU9WRV9FVkVOVCA9IFwiLS1tb3ZlXCI7XHJcbmV4cG9ydCBjb25zdCBNT1ZFX0NPVU5URVJfRVZFTlQgPSBcIi0tY291bnRcIjtcclxuZXhwb3J0IGNvbnN0IFNUQVJUX0VWRU5UID0gXCItLXN0YXJ0XCI7XHJcbmV4cG9ydCBjb25zdCBQTEFZX1BBVVNFX0VWRU5UID0gXCItLXBsYXlwYXVzZVwiO1xyXG5leHBvcnQgY29uc3QgU09MVkVEX0VWRU5UID0gXCItLXNvbHZlZFwiO1xyXG5leHBvcnQgY29uc3QgVElNRUNIQU5HRV9FVkVOVCA9IFwiLS10aW1lY2hhbmdlXCI7XHJcblxyXG5jb25zdCBhdWRpbyA9IG5ldyBBdWRpbyhtb3ZlU291bmQpO1xyXG5cclxuYXVkaW8ubG9hZCgpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGNyZWF0ZUdhbWUgPSAoc2l6ZSA9IDQpID0+IHtcclxuICBjb25zdCBzdWJzY3JpYmVycyA9IHt9O1xyXG4gIGNvbnN0IGRpc3BhdGNoID0gKHR5cGUsIC4uLnBheWxvYWQpID0+IHtcclxuICAgIHN1YnNjcmliZXJzW3R5cGVdICYmIHN1YnNjcmliZXJzW3R5cGVdLmZvckVhY2goKGZuKSA9PiBmbiguLi5wYXlsb2FkKSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgbWF0cml4ID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogc2l6ZSB9LCAoXywgaSkgPT4ge1xyXG4gICAgcmV0dXJuIEFycmF5LmZyb20oeyBsZW5ndGg6IHNpemUgfSwgKF8sIGopID0+ICh7XHJcbiAgICAgIGlkeDogaSAqIHNpemUgKyBqLFxyXG4gICAgICBuYW1lOiBpICogc2l6ZSArIGogKyAxLFxyXG4gICAgfSkpO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBlbXB0eSA9IG1hdHJpeC5hdCgtMSkuYXQoLTEpO1xyXG5cclxuICBsZXQgW2VtcHR5WCwgZW1wdHlZXSA9IFtzaXplIC0gMSwgc2l6ZSAtIDFdO1xyXG5cclxuICBsZXQgbW92ZXMgPSAwO1xyXG4gIGxldCBkdXJhdGlvbiA9IDA7XHJcbiAgbGV0IGlzUGxheWluZyA9IGZhbHNlO1xyXG4gIGxldCBpc0dhbWVTdGFydGVkID0gZmFsc2U7XHJcbiAgbGV0IGludGVydmFsSWQ7XHJcblxyXG4gIGNvbnN0IGNhbk1vdmUgPSAoeCwgeSkgPT4ge1xyXG4gICAgcmV0dXJuIHggPj0gMCAmJiB4IDwgc2l6ZSAmJiB5ID49IDAgJiYgeSA8IHNpemU7XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgc3dhcCA9IChtYXRyaXgsIFt4MSwgeTFdLCBbeDIsIHkyXSkgPT4ge1xyXG4gICAgW21hdHJpeFt4MV1beTFdLCBtYXRyaXhbeDJdW3kyXV0gPSBbbWF0cml4W3gyXVt5Ml0sIG1hdHJpeFt4MV1beTFdXTtcclxuICB9O1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgbWF0cml4LFxyXG4gICAgZ2V0IG1vdmVzKCkge1xyXG4gICAgICByZXR1cm4gbW92ZXM7XHJcbiAgICB9LFxyXG4gICAgZ2V0IGR1cmF0aW9uKCkge1xyXG4gICAgICByZXR1cm4gZHVyYXRpb247XHJcbiAgICB9LFxyXG4gICAgZ2V0IGlzU29sdmVkKCkge1xyXG4gICAgICByZXR1cm4gbWF0cml4LmV2ZXJ5KChyb3csIHgpID0+XHJcbiAgICAgICAgcm93LmV2ZXJ5KCh7IGlkeCB9LCB5KSA9PiB4ICogc2l6ZSArIHkgPT09IGlkeClcclxuICAgICAgKTtcclxuICAgIH0sXHJcbiAgICBnZXQgZW1wdHkoKSB7XHJcbiAgICAgIHJldHVybiB7IC4uLmVtcHR5LCB4OiBlbXB0eVgsIHk6IGVtcHR5WSB9O1xyXG4gICAgfSxcclxuICAgIGdldCBpc1BsYXlpbmcoKSB7XHJcbiAgICAgIHJldHVybiBpc1BsYXlpbmc7XHJcbiAgICB9LFxyXG4gICAgbW92ZSh7IGR4LCBkeSB9KSB7XHJcbiAgICAgIGlmICghaXNQbGF5aW5nKSByZXR1cm47XHJcblxyXG4gICAgICBsZXQgbnggPSBlbXB0eVggKyBkeDtcclxuICAgICAgbGV0IG55ID0gZW1wdHlZICsgZHk7XHJcblxyXG4gICAgICBpZiAoY2FuTW92ZShueCwgbnkpKSB7XHJcbiAgICAgICAgbW92ZXMrKztcclxuICAgICAgICBhdWRpby5jdXJyZW50VGltZSA9IDA7XHJcbiAgICAgICAgYXVkaW8ucGxheSgpO1xyXG5cclxuICAgICAgICBzd2FwKG1hdHJpeCwgW254LCBueV0sIFtlbXB0eVgsIGVtcHR5WV0pO1xyXG5cclxuICAgICAgICBbZW1wdHlYLCBlbXB0eVksIG54LCBueV0gPSBbbngsIG55LCBlbXB0eVgsIGVtcHR5WV07XHJcblxyXG4gICAgICAgIGRpc3BhdGNoKE1PVkVfRVZFTlQsIG1hdHJpeFtueF1bbnldLmlkeCwgW254LCBueV0sIHtcclxuICAgICAgICAgIGR4LFxyXG4gICAgICAgICAgZHksXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLmlzU29sdmVkKSB7XHJcbiAgICAgICAgaXNQbGF5aW5nID0gZmFsc2U7XHJcbiAgICAgICAgaXNHYW1lU3RhcnRlZCA9IGZhbHNlO1xyXG4gICAgICAgIGRpc3BhdGNoKFNPTFZFRF9FVkVOVCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBwbGF5cGF1c2UoKSB7XHJcbiAgICAgIGlmIChpc0dhbWVTdGFydGVkKSB7XHJcbiAgICAgICAgaXNQbGF5aW5nID0gIWlzUGxheWluZztcclxuICAgICAgICBkaXNwYXRjaChQTEFZX1BBVVNFX0VWRU5UKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICBjbGVhckludGVydmFsKGludGVydmFsSWQpO1xyXG5cclxuICAgICAgaXNHYW1lU3RhcnRlZCA9IHRydWU7XHJcbiAgICAgIGlzUGxheWluZyA9IHRydWU7XHJcbiAgICAgIGR1cmF0aW9uID0gMDtcclxuICAgICAgbW92ZXMgPSAwO1xyXG5cclxuICAgICAgaW50ZXJ2YWxJZCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICBpZiAoaXNQbGF5aW5nKSB7XHJcbiAgICAgICAgICBkdXJhdGlvbisrO1xyXG4gICAgICAgICAgZGlzcGF0Y2goVElNRUNIQU5HRV9FVkVOVCwgZHVyYXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgMTAwMCk7XHJcblxyXG4gICAgICBjb25zdCBuZWlnaGJvcnMgPSBbVVAsIERPV04sIFJJR0hULCBMRUZUXTtcclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjAwOyBpKyspIHtcclxuICAgICAgICBjb25zdCB7IGR4LCBkeSB9ID0gbmVpZ2hib3JzW1xyXG4gICAgICAgICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbmVpZ2hib3JzLmxlbmd0aClcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICBsZXQgbnggPSBlbXB0eVggKyBkeDtcclxuICAgICAgICBsZXQgbnkgPSBlbXB0eVkgKyBkeTtcclxuXHJcbiAgICAgICAgaWYgKGNhbk1vdmUobngsIG55KSkge1xyXG4gICAgICAgICAgc3dhcChtYXRyaXgsIFtueCwgbnldLCBbZW1wdHlYLCBlbXB0eVldKTtcclxuXHJcbiAgICAgICAgICBbZW1wdHlYLCBlbXB0eVksIG54LCBueV0gPSBbbngsIG55LCBlbXB0eVgsIGVtcHR5WV07XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBkaXNwYXRjaChTVEFSVF9FVkVOVCwgbWF0cml4KTtcclxuICAgICAgZGlzcGF0Y2goUExBWV9QQVVTRV9FVkVOVCwgaXNQbGF5aW5nKTtcclxuICAgIH0sXHJcbiAgICBtdXRlKGZuKSB7XHJcbiAgICAgIGF1ZGlvLm11dGVkID8gKGF1ZGlvLm11dGVkID0gZmFsc2UpIDogKGF1ZGlvLm11dGVkID0gdHJ1ZSk7XHJcbiAgICAgIGZuKGF1ZGlvLm11dGVkKTtcclxuICAgIH0sXHJcbiAgICBzdWJzY3JpYmUodHlwZSwgZm4pIHtcclxuICAgICAgaWYgKCFzdWJzY3JpYmVyc1t0eXBlXSkge1xyXG4gICAgICAgIHN1YnNjcmliZXJzW3R5cGVdID0gW107XHJcbiAgICAgIH1cclxuICAgICAgc3Vic2NyaWJlcnNbdHlwZV0ucHVzaChmbik7XHJcbiAgICB9LFxyXG4gIH07XHJcbn07XHJcbiIsImV4cG9ydCBjb25zdCBjcmVhdGVFbGVtZW50ID0gKHRhZywgb3B0aW9ucykgPT4ge1xyXG4gIGNvbnN0IHtcclxuICAgIGNsYXNzTmFtZSxcclxuICAgIHRleHQsXHJcbiAgICBodG1sLFxyXG4gICAgZXZlbnRzID0ge30sXHJcbiAgICBjaGlsZHJlbiA9IFtdLFxyXG4gICAgLi4uYXR0cnNcclxuICB9ID0gb3B0aW9ucztcclxuXHJcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XHJcblxyXG4gIGNsYXNzTmFtZSAmJiBlbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBjbGFzc05hbWUpO1xyXG4gIHRleHQgJiYgKGVsLnRleHRDb250ZW50ID0gdGV4dCk7XHJcbiAgaHRtbCAmJiAoZWwuaW5uZXJIVE1MID0gaHRtbCk7XHJcblxyXG4gIE9iamVjdC5rZXlzKGV2ZW50cykuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICBldmVudHNba2V5XSAmJiBlbC5hZGRFdmVudExpc3RlbmVyKGtleSwgZXZlbnRzW2tleV0pO1xyXG4gIH0pO1xyXG5cclxuICBPYmplY3Qua2V5cyhhdHRycykuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICBhdHRyc1trZXldICYmIGVsLnNldEF0dHJpYnV0ZShrZXksIGF0dHJzW2tleV0pO1xyXG4gIH0pO1xyXG5cclxuICBlbC5hcHBlbmQoLi4uY2hpbGRyZW4pO1xyXG5cclxuICByZXR1cm4gZWw7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3Qgc2VjVG9TdHJpbmdUaW1lID0gKGR1cmF0aW9uKSA9PlxyXG4gIGAke1N0cmluZygoZHVyYXRpb24gLyA2MCkgfCAwKS5wYWRTdGFydCgyLCBcIjBcIil9OiR7U3RyaW5nKFxyXG4gICAgZHVyYXRpb24gJSA2MFxyXG4gICkucGFkU3RhcnQoMiwgXCIwXCIpfWA7XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgc2NyaXB0VXJsO1xuaWYgKF9fd2VicGFja19yZXF1aXJlX18uZy5pbXBvcnRTY3JpcHRzKSBzY3JpcHRVcmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcubG9jYXRpb24gKyBcIlwiO1xudmFyIGRvY3VtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmRvY3VtZW50O1xuaWYgKCFzY3JpcHRVcmwgJiYgZG9jdW1lbnQpIHtcblx0aWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQpXG5cdFx0c2NyaXB0VXJsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmNcblx0aWYgKCFzY3JpcHRVcmwpIHtcblx0XHR2YXIgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpO1xuXHRcdGlmKHNjcmlwdHMubGVuZ3RoKSBzY3JpcHRVcmwgPSBzY3JpcHRzW3NjcmlwdHMubGVuZ3RoIC0gMV0uc3JjXG5cdH1cbn1cbi8vIFdoZW4gc3VwcG9ydGluZyBicm93c2VycyB3aGVyZSBhbiBhdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIHlvdSBtdXN0IHNwZWNpZnkgYW4gb3V0cHV0LnB1YmxpY1BhdGggbWFudWFsbHkgdmlhIGNvbmZpZ3VyYXRpb25cbi8vIG9yIHBhc3MgYW4gZW1wdHkgc3RyaW5nIChcIlwiKSBhbmQgc2V0IHRoZSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyB2YXJpYWJsZSBmcm9tIHlvdXIgY29kZSB0byB1c2UgeW91ciBvd24gbG9naWMuXG5pZiAoIXNjcmlwdFVybCkgdGhyb3cgbmV3IEVycm9yKFwiQXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXJcIik7XG5zY3JpcHRVcmwgPSBzY3JpcHRVcmwucmVwbGFjZSgvIy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcPy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcL1teXFwvXSskLywgXCIvXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gc2NyaXB0VXJsOyIsImltcG9ydCBcIm1pbmlyZXNldC5jc3NcIjtcclxuaW1wb3J0IFwiLi9zdHlsZXMvbWFpbi5zY3NzXCI7XHJcblxyXG5pbXBvcnQgeyBjcmVhdGVFbGVtZW50LCBzZWNUb1N0cmluZ1RpbWUgfSBmcm9tIFwiLi9qcy9saWJcIjtcclxuXHJcbmltcG9ydCB7XHJcbiAgY3JlYXRlR2FtZSxcclxuICBMRUZULFxyXG4gIFJJR0hULFxyXG4gIFVQLFxyXG4gIERPV04sXHJcbiAgTU9WRV9FVkVOVCxcclxuICBTVEFSVF9FVkVOVCxcclxuICBQTEFZX1BBVVNFX0VWRU5ULFxyXG4gIFNPTFZFRF9FVkVOVCxcclxuICBUSU1FQ0hBTkdFX0VWRU5ULFxyXG59IGZyb20gXCIuL2pzL2NvcmVcIjtcclxuXHJcbmNvbnN0IEdfQV9NX0UgPSBjcmVhdGVHYW1lKCk7XHJcblxyXG5HX0FfTV9FLnN1YnNjcmliZShNT1ZFX0VWRU5ULCAoaWR4LCBbeCwgeV0sIHsgZHgsIGR5IH0pID0+IHtcclxuICAvLyB0aWxlc1tpZHhdLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHstMSAqIGR5ICogMTA1fSUsICR7XHJcbiAgLy8gICAtMSAqIGR4ICogMTA1XHJcbiAgLy8gfSUpYDtcclxuXHJcbiAgdGlsZXNbaWR4XVxyXG4gICAgLmFuaW1hdGUoXHJcbiAgICAgIFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGUoJHstMSAqIGR5ICogMTA1fSUsICR7LTEgKiBkeCAqIDEwNX0lKWAsXHJcbiAgICAgICAgfSxcclxuICAgICAgXSxcclxuICAgICAgMTUwXHJcbiAgICApXHJcbiAgICAuYWRkRXZlbnRMaXN0ZW5lcihcImZpbmlzaFwiLCAoKSA9PiB7XHJcbiAgICAgIHRpbGVzW2lkeF0uc3R5bGUuZ3JpZEFyZWEgPSBgJHt4ICsgMX0gLyAke3kgKyAxfWA7XHJcblxyXG4gICAgICAvLyBHX0FfTV9FLmlzU29sdmVkICYmXHJcbiAgICB9KTtcclxuXHJcbiAgbW92ZXNDb250cm9sLnRleHRDb250ZW50ID0gU3RyaW5nKEdfQV9NX0UubW92ZXMpO1xyXG59KTtcclxuXHJcbkdfQV9NX0Uuc3Vic2NyaWJlKFNUQVJUX0VWRU5ULCAoKSA9PiB7XHJcbiAgbW92ZXNDb250cm9sLnRleHRDb250ZW50ID0gU3RyaW5nKEdfQV9NX0UubW92ZXMpO1xyXG4gIHRpbWVDb250cm9sLnRleHRDb250ZW50ID0gc2VjVG9TdHJpbmdUaW1lKEdfQV9NX0UuZHVyYXRpb24pO1xyXG4gIG92ZXJsYXlUaXRsZS50ZXh0Q29udGVudCA9IFwiXCI7XHJcblxyXG4gIEdfQV9NX0UubWF0cml4LmZvckVhY2goKHJvdywgeCkgPT5cclxuICAgIHJvdy5mb3JFYWNoKCh7IGlkeCB9LCB5KSA9PiB7XHJcbiAgICAgIHRpbGVzW2lkeF0uc3R5bGUuZ3JpZEFyZWEgPSBgJHt4ICsgMX0gLyAke3kgKyAxfWA7XHJcblxyXG4gICAgICB0aWxlc1tpZHhdLmFuaW1hdGUoXHJcbiAgICAgICAgW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IGByb3RhdGUoMzYwZGVnKWAsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgMzAwXHJcbiAgICAgICk7XHJcbiAgICB9KVxyXG4gICk7XHJcbn0pO1xyXG5cclxuR19BX01fRS5zdWJzY3JpYmUoUExBWV9QQVVTRV9FVkVOVCwgKCkgPT4ge1xyXG4gIEdfQV9NX0UuaXNQbGF5aW5nXHJcbiAgICA/IG92ZXJsYXkuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKVxyXG4gICAgOiBvdmVybGF5LmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XHJcbn0pO1xyXG5cclxuR19BX01fRS5zdWJzY3JpYmUoVElNRUNIQU5HRV9FVkVOVCwgKCkgPT4ge1xyXG4gIHRpbWVDb250cm9sLnRleHRDb250ZW50ID0gc2VjVG9TdHJpbmdUaW1lKEdfQV9NX0UuZHVyYXRpb24pO1xyXG59KTtcclxuXHJcbkdfQV9NX0Uuc3Vic2NyaWJlKFNPTFZFRF9FVkVOVCwgKCkgPT4ge1xyXG4gIGNvbnNvbGUubG9nKFxyXG4gICAgYFlvdSBXT04hLCBJdCB0YWtlcyB5b3UgJHtHX0FfTV9FLm1vdmVzfSBtb3ZlcyBhbmQgJHtHX0FfTV9FLmR1cmF0aW9ufSBzZWNvbmRzYFxyXG4gICk7XHJcblxyXG4gIHRpbGVzLmZvckVhY2goKGVsKSA9PiB7XHJcbiAgICBlbC5hbmltYXRlKFxyXG4gICAgICBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHJhbnNmb3JtOiBgcm90YXRlKDM2MGRlZylgLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF0sXHJcbiAgICAgIDI1MFxyXG4gICAgKTtcclxuICB9KTtcclxuXHJcbiAgb3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xyXG4gIG92ZXJsYXlUaXRsZS5pbm5lckhUTUwgPSBgSG9vcmF5ISBZb3Ugc29sdmVkIHRoZSBwdXp6bGUgaW4gPGI+JHtzZWNUb1N0cmluZ1RpbWUoXHJcbiAgICBHX0FfTV9FLmR1cmF0aW9uXHJcbiAgKX08L2I+IGFuZCA8Yj4ke0dfQV9NX0UubW92ZXN9PC9iPiBtb3ZlcyFgO1xyXG59KTtcclxuXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbmNvbnN0IHRpdGxlID0gY3JlYXRlRWxlbWVudChcImgxXCIsIHtcclxuICBjbGFzc05hbWU6IFwiYXBwLXRpdGxlXCIsXHJcbiAgdGV4dDogXCJGaWZ0ZWVuIHB1enpsZVwiLFxyXG59KTtcclxuXHJcbmNvbnN0IG1vdmVzQ29udHJvbCA9IGNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHsgdGV4dDogXCIwXCIgfSk7XHJcbmNvbnN0IHRpbWVDb250cm9sID0gY3JlYXRlRWxlbWVudChcInNwYW5cIiwgeyB0ZXh0OiBcIjAwOjAwXCIgfSk7XHJcblxyXG5jb25zdCBzb3VuZEJ1dHRvbiA9IGNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIiwge1xyXG4gIGNsYXNzTmFtZTogXCJidXR0b24gYnV0dG9uLS1yb3VuZGVkXCIsXHJcbiAgaHRtbDpcclxuICAgICc8c3ZnIGRhdGEtbmFtZT1cIkxheWVyIDJcIiBpZD1cIkxheWVyXzJcIiB2aWV3Qm94PVwiMCAwIDEwMDAgMTAwMFwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6bm9uZTtzdHJva2U6IzAyMDIwMjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMjtzdHJva2Utd2lkdGg6MzJweDt9PC9zdHlsZT48L2RlZnM+PHBhdGggY2xhc3M9XCJjbHMtMVwiIGQ9XCJNMjM5Ljg5LDM1OC42SDM2MmEwLDAsMCwwLDEsMCwwVjY0MS40YTAsMCwwLDAsMSwwLDBIMjM5Ljg5YTYyLjgxLDYyLjgxLDAsMCwxLTYyLjgxLTYyLjgxVjQyMS40QTYyLjgxLDYyLjgxLDAsMCwxLDIzOS44OSwzNTguNlpcIi8+PHBhdGggY2xhc3M9XCJjbHMtMVwiIGQ9XCJNNTg4LDQwOC42NFY4MTguMTZjMCwzLjE5LTQuNjUsNS03LjgzLDNMNDM0LjIsNjk5LjU1XCIvPjxwYXRoIGNsYXNzPVwiY2xzLTFcIiBkPVwiTTQwMy40Niw2NzJsLTQyLjA4LTM1LjUydi0yNzNMNTgwLjEyLDE3OC44M2MzLjE4LTIsNy44My0uMTgsNy44MywzVjMzOS42XCIvPjxwYXRoIGNsYXNzPVwiY2xzLTFcIiBkPVwiTTYzOS4zLDQwMy4xYTkxLjczLDkxLjczLDAsMSwxLDAsMTgzLjQ2XCIvPjxwYXRoIGNsYXNzPVwiY2xzLTFcIiBkPVwiTTYzOS4zLDMxMS4yMWExODMuNjIsMTgzLjYyLDAsMCwxLDAsMzY3LjI0XCIvPjwvc3ZnPicsXHJcbiAgZXZlbnRzOiB7XHJcbiAgICBjbGljazogKCkgPT4ge1xyXG4gICAgICBHX0FfTV9FLm11dGUoKGlzTXV0ZWQpID0+IHtcclxuICAgICAgICBzb3VuZEJ1dHRvbi5pbm5lckhUTUwgPSBpc011dGVkXHJcbiAgICAgICAgICA/ICc8c3ZnIGRhdGEtbmFtZT1cIkxheWVyIDJcIiBpZD1cIkxheWVyXzJcIiB2aWV3Qm94PVwiMCAwIDEwMDAgMTAwMFwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6bm9uZTtzdHJva2U6IzAyMDIwMjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMjtzdHJva2Utd2lkdGg6MzJweDt9PC9zdHlsZT48L2RlZnM+PGxpbmUgY2xhc3M9XCJjbHMtMVwiIHgxPVwiNjQ0LjM4XCIgeDI9XCI4MzEuODVcIiB5MT1cIjM5My43NlwiIHkyPVwiNjA2LjI0XCIvPjxsaW5lIGNsYXNzPVwiY2xzLTFcIiB4MT1cIjgzMS44NVwiIHgyPVwiNjQ0LjM4XCIgeTE9XCIzOTMuNzZcIiB5Mj1cIjYwNi4yNFwiLz48cGF0aCBjbGFzcz1cImNscy0xXCIgZD1cIk0yMzEsMzU4LjZIMzUzYTAsMCwwLDAsMSwwLDBWNjQxLjRhMCwwLDAsMCwxLDAsMEgyMzFhNjIuODEsNjIuODEsMCwwLDEtNjIuODEtNjIuODFWNDIxLjRBNjIuODEsNjIuODEsMCwwLDEsMjMxLDM1OC42WlwiLz48cGF0aCBjbGFzcz1cImNscy0xXCIgZD1cIk01NzksNDA4LjY0VjgxOC4xNmMwLDMuMTktNC42NSw1LTcuODMsM0w0MjUuMjcsNjk5LjU1XCIvPjxwYXRoIGNsYXNzPVwiY2xzLTFcIiBkPVwiTTM5NC41Myw2NzJsLTQyLjA4LTM1LjUydi0yNzNMNTcxLjE5LDE3OC44M2MzLjE4LTIsNy44My0uMTgsNy44MywzVjMzOS42XCIvPjwvc3ZnPidcclxuICAgICAgICAgIDogJzxzdmcgZGF0YS1uYW1lPVwiTGF5ZXIgMlwiIGlkPVwiTGF5ZXJfMlwiIHZpZXdCb3g9XCIwIDAgMTAwMCAxMDAwXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjxkZWZzPjxzdHlsZT4uY2xzLTF7ZmlsbDpub25lO3N0cm9rZTojMDIwMjAyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO3N0cm9rZS13aWR0aDoyMnB4O308L3N0eWxlPjwvZGVmcz48cGF0aCBjbGFzcz1cImNscy0xXCIgZD1cIk0yMzkuODksMzU4LjZIMzYyYTAsMCwwLDAsMSwwLDBWNjQxLjRhMCwwLDAsMCwxLDAsMEgyMzkuODlhNjIuODEsNjIuODEsMCwwLDEtNjIuODEtNjIuODFWNDIxLjRBNjIuODEsNjIuODEsMCwwLDEsMjM5Ljg5LDM1OC42WlwiLz48cGF0aCBjbGFzcz1cImNscy0xXCIgZD1cIk01ODgsNDA4LjY0VjgxOC4xNmMwLDMuMTktNC42NSw1LTcuODMsM0w0MzQuMiw2OTkuNTVcIi8+PHBhdGggY2xhc3M9XCJjbHMtMVwiIGQ9XCJNNDAzLjQ2LDY3MmwtNDIuMDgtMzUuNTJ2LTI3M0w1ODAuMTIsMTc4LjgzYzMuMTgtMiw3LjgzLS4xOCw3LjgzLDNWMzM5LjZcIi8+PHBhdGggY2xhc3M9XCJjbHMtMVwiIGQ9XCJNNjM5LjMsNDAzLjFhOTEuNzMsOTEuNzMsMCwxLDEsMCwxODMuNDZcIi8+PHBhdGggY2xhc3M9XCJjbHMtMVwiIGQ9XCJNNjM5LjMsMzExLjIxYTE4My42MiwxODMuNjIsMCwwLDEsMCwzNjcuMjRcIi8+PC9zdmc+JztcclxuICAgICAgfSk7XHJcbiAgICAgIGJvYXJkLmZvY3VzKCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG5cclxuY29uc3Qgc2V0dGluZ3NCdXR0b24gPSBjcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIsIHtcclxuICBjbGFzc05hbWU6IFwiYnV0dG9uIGJ1dHRvbi0tcm91bmRlZFwiLFxyXG4gIGh0bWw6XHJcbiAgICAnPHN2ZyBlbmFibGUtYmFja2dyb3VuZD1cIm5ldyAwIDAgMzIgMzJcIiBmaWxsPVwiIzNmMzg0NFwiICBpZD1cIkdseXBoXCIgdmVyc2lvbj1cIjEuMVwiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIj48cGF0aCBkPVwiTTI3LjUyNiwxOC4wMzZMMjcsMTcuNzMyYy0wLjYyNi0wLjM2MS0xLTEuMDA5LTEtMS43MzJzMC4zNzQtMS4zNzEsMS0xLjczMmwwLjUyNi0wLjMwNCAgYzEuNDM2LTAuODMsMS45MjctMi42NjIsMS4wOTgtNC4wOThsLTEtMS43MzJjLTAuODI3LTEuNDMzLTIuNjY2LTEuOTI1LTQuMDk4LTEuMDk4TDIzLDcuMzM5Yy0wLjYyNiwwLjM2Mi0xLjM3NSwwLjM2Mi0yLDAgIGMtMC42MjYtMC4zNjItMS0xLjAwOS0xLTEuNzMyVjVjMC0xLjY1NC0xLjM0Ni0zLTMtM2gtMmMtMS42NTQsMC0zLDEuMzQ2LTMsM3YwLjYwOGMwLDAuNzIzLTAuMzc0LDEuMzctMSwxLjczMiAgYy0wLjYyNiwwLjM2MS0xLjM3NCwwLjM2Mi0yLDBMOC40NzQsNy4wMzZDNy4wNDIsNi4yMDksNS4yMDMsNi43MDEsNC4zNzUsOC4xMzRsLTEsMS43MzJjLTAuODI5LDEuNDM2LTAuMzM4LDMuMjY5LDEuMDk4LDQuMDk4ICBMNSwxNC4yNjhDNS42MjYsMTQuNjI5LDYsMTUuMjc3LDYsMTZzLTAuMzc0LDEuMzcxLTEsMS43MzJsLTAuNTI2LDAuMzA0Yy0xLjQzNiwwLjgyOS0xLjkyNywyLjY2Mi0xLjA5OCw0LjA5OGwxLDEuNzMyICBjMC44MjgsMS40MzMsMi42NjcsMS45MjUsNC4wOTgsMS4wOThMOSwyNC42NjFjMC42MjYtMC4zNjMsMS4zNzQtMC4zNjEsMiwwYzAuNjI2LDAuMzYyLDEsMS4wMDksMSwxLjczMlYyN2MwLDEuNjU0LDEuMzQ2LDMsMywzaDIgIGMxLjY1NCwwLDMtMS4zNDYsMy0zdi0wLjYwOGMwLTAuNzIzLDAuMzc0LTEuMzcsMS0xLjczMmMwLjYyNS0wLjM2MSwxLjM3NC0wLjM2MiwyLDBsMC41MjYsMC4zMDQgIGMxLjQzMiwwLjgyNiwzLjI3MSwwLjMzNCw0LjA5OC0xLjA5OGwxLTEuNzMyQzI5LjQ1MywyMC42OTgsMjguOTYyLDE4Ljg2NSwyNy41MjYsMTguMDM2eiBNMTYsMjFjLTIuNzU3LDAtNS0yLjI0My01LTVzMi4yNDMtNSw1LTUgIHM1LDIuMjQzLDUsNVMxOC43NTcsMjEsMTYsMjF6XCIgaWQ9XCJYTUxJRF8yNzNfXCIvPjwvc3ZnPicsXHJcbiAgZXZlbnRzOiB7XHJcbiAgICBjbGljazogKCkgPT4ge1xyXG4gICAgICBHX0FfTV9FLnBsYXlwYXVzZSgpO1xyXG4gICAgICBib2FyZC5mb2N1cygpO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbi8vIGNvbnN0IHNpemVDb250cm9scyA9IGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1xyXG4vLyAgIGNsYXNzTmFtZTpcclxuLy8gICAgIFwic3RhY2sgc3RhY2stLXJvdyBzdGFjay0td3JhcCBzdGFjay0tanVzdGlmeS1jZW50ZXIgc3RhY2stLWdhcC0yIGhpZGRlblwiLFxyXG4vLyAgIGNoaWxkcmVuOiBbMywgNCwgNSwgNiwgNywgOF0ubWFwKChzaXplKSA9PiB7XHJcbi8vICAgICByZXR1cm4gY3JlYXRlRWxlbWVudChcImJ1dHRvblwiLCB7XHJcbi8vICAgICAgIGNsYXNzTmFtZTogXCJidXR0b25cIixcclxuLy8gICAgICAgdGV4dDogc2l6ZSArIFwieFwiICsgc2l6ZSxcclxuLy8gICAgICAgXCJkYXRhLXNpemVcIjogc2l6ZSxcclxuLy8gICAgIH0pO1xyXG4vLyAgIH0pLFxyXG4vLyAgIGV2ZW50czoge1xyXG4vLyAgICAgY2xpY2s6IChlKSA9PiB7XHJcbi8vICAgICAgIGNvbnN0IHsgc2l6ZSB9ID0gZS50YXJnZXQ/LmRhdGFzZXQ7XHJcbi8vICAgICAgIGlmIChzaXplKSB7XHJcbi8vICAgICAgICAgR19BX01fRS5zdGFydChOdW1iZXIoc2l6ZSkpO1xyXG4vLyAgICAgICAgIGJvYXJkLmZvY3VzKCk7XHJcbi8vICAgICAgICAgc2l6ZUNvbnRyb2xzLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XHJcbi8vICAgICAgIH1cclxuLy8gICAgIH0sXHJcbi8vICAgfSxcclxuLy8gfSk7XHJcblxyXG5jb25zdCBzdGFydEJ1dHRvbiA9IGNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIiwge1xyXG4gIGNsYXNzTmFtZTogXCJidXR0b25cIixcclxuICB0ZXh0OiBcInN0YXJ0IG5ldyBnYW1lXCIsXHJcbiAgY2hpbGRyZW46IFtdLFxyXG4gIGV2ZW50czoge1xyXG4gICAgY2xpY2s6ICgpID0+IHtcclxuICAgICAgR19BX01fRS5zdGFydCgpO1xyXG4gICAgICBib2FyZC5mb2N1cygpO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbmNvbnN0IHRpbGVzID0gR19BX01fRS5tYXRyaXhcclxuICAubWFwKChyb3csIHgpID0+XHJcbiAgICByb3cubWFwKCh7IGlkeCwgbmFtZSB9LCB5KSA9PiB7XHJcbiAgICAgIGNvbnN0IGVsID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XHJcbiAgICAgICAgY2xhc3NOYW1lOiBgdGlsZSAke0dfQV9NX0UuZW1wdHkuaWR4ID09PSBpZHggPyBcInRpbGUtLWVtcHR5XCIgOiBcIlwifWAsXHJcbiAgICAgICAgdGV4dDogbmFtZSxcclxuICAgICAgICBkcmFnZ2FibGU6IHRydWUsXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZWwuc3R5bGUuZ3JpZEFyZWEgPSBgJHt4ICsgMX0gLyAke3kgKyAxfWA7XHJcblxyXG4gICAgICByZXR1cm4gZWw7XHJcbiAgICB9KVxyXG4gIClcclxuICAuZmxhdCgpO1xyXG5cclxuY29uc3Qgb3ZlcmxheVRpdGxlID0gY3JlYXRlRWxlbWVudChcImgyXCIsIHtcclxuICBjbGFzc05hbWU6IFwiYm9hcmQtb3ZlcmxheS10aXRsZVwiLFxyXG59KTtcclxuXHJcbmNvbnN0IG92ZXJsYXkgPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcclxuICBjbGFzc05hbWU6IFwiYm9hcmQtb3ZlcmxheVwiLFxyXG4gIGNoaWxkcmVuOiBbXHJcbiAgICBvdmVybGF5VGl0bGUsXHJcbiAgICBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcclxuICAgICAgY2xhc3NOYW1lOiBcInN0YWNrIHN0YWNrLS1yb3cgc3RhY2stLWdhcC14LTIgcHktNFwiLFxyXG4gICAgICBjaGlsZHJlbjogW3N0YXJ0QnV0dG9uXSxcclxuICAgIH0pLFxyXG4gIF0sXHJcbn0pO1xyXG5cclxuY29uc3QgYm9hcmQgPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcclxuICBjbGFzc05hbWU6IGBib2FyZCBib2FyZC0tc2l6ZS0ke0dfQV9NX0UubWF0cml4Lmxlbmd0aH1gLFxyXG4gIGNoaWxkcmVuOiBbLi4udGlsZXMsIG92ZXJsYXldLFxyXG4gIHRhYmluZGV4OiBcIjBcIixcclxuICBldmVudHM6IHtcclxuICAgIGRyYWdzdGFydDogKGUpID0+IHtcclxuICAgICAgY29uc3QgZWwgPSB0aWxlcy5maW5kKChlbCkgPT4gZWwuY29udGFpbnMoZS50YXJnZXQpKTtcclxuXHJcbiAgICAgIGlmIChlbCkge1xyXG4gICAgICAgIGNvbnN0IFt4LCB5XSA9IFtcclxuICAgICAgICAgIE51bWJlcihlbC5zdHlsZS5ncmlkUm93U3RhcnQpIC0gMSxcclxuICAgICAgICAgIE51bWJlcihlbC5zdHlsZS5ncmlkQ29sdW1uU3RhcnQpIC0gMSxcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICBlLmRhdGFUcmFuc2Zlci5zZXREYXRhKFwieFwiLCB4KTtcclxuICAgICAgICBlLmRhdGFUcmFuc2Zlci5zZXREYXRhKFwieVwiLCB5KTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGRyYWdvdmVyOiAoZSkgPT4gZS5wcmV2ZW50RGVmYXVsdCgpLFxyXG4gICAgZHJvcDogKGUpID0+IHtcclxuICAgICAgY29uc3QgeCA9IGUuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJ4XCIpO1xyXG4gICAgICBjb25zdCB5ID0gZS5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcInlcIik7XHJcblxyXG4gICAgICBjb25zdCBkaXJlY3Rpb24gPSBbVVAsIERPV04sIFJJR0hULCBMRUZUXS5maW5kKFxyXG4gICAgICAgICh7IGR4LCBkeSB9KSA9PiBkeCA9PT0geCAtIEdfQV9NX0UuZW1wdHkueCAmJiBkeSA9PT0geSAtIEdfQV9NX0UuZW1wdHkueVxyXG4gICAgICApO1xyXG5cclxuICAgICAgZGlyZWN0aW9uICYmIEdfQV9NX0UubW92ZShkaXJlY3Rpb24pO1xyXG4gICAgfSxcclxuICAgIGNsaWNrOiAoZSkgPT4ge1xyXG4gICAgICBjb25zdCBlbCA9IHRpbGVzLmZpbmQoKGVsKSA9PiBlbC5jb250YWlucyhlLnRhcmdldCkpO1xyXG5cclxuICAgICAgaWYgKGVsKSB7XHJcbiAgICAgICAgY29uc3QgW3gsIHldID0gW1xyXG4gICAgICAgICAgTnVtYmVyKGVsLnN0eWxlLmdyaWRSb3dTdGFydCkgLSAxLFxyXG4gICAgICAgICAgTnVtYmVyKGVsLnN0eWxlLmdyaWRDb2x1bW5TdGFydCkgLSAxLFxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IFtVUCwgRE9XTiwgUklHSFQsIExFRlRdLmZpbmQoXHJcbiAgICAgICAgICAoeyBkeCwgZHkgfSkgPT5cclxuICAgICAgICAgICAgZHggPT09IHggLSBHX0FfTV9FLmVtcHR5LnggJiYgZHkgPT09IHkgLSBHX0FfTV9FLmVtcHR5LnlcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBkaXJlY3Rpb24gJiYgR19BX01fRS5tb3ZlKGRpcmVjdGlvbik7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBrZXlkb3duOiAoZSkgPT4ge1xyXG4gICAgICBzd2l0Y2ggKGUuY29kZSkge1xyXG4gICAgICAgIGNhc2UgXCJBcnJvd1VwXCI6XHJcbiAgICAgICAgICBHX0FfTV9FLm1vdmUoVVApO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIkFycm93RG93blwiOlxyXG4gICAgICAgICAgR19BX01fRS5tb3ZlKERPV04pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIkFycm93UmlnaHRcIjpcclxuICAgICAgICAgIEdfQV9NX0UubW92ZShSSUdIVCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiQXJyb3dMZWZ0XCI6XHJcbiAgICAgICAgICBHX0FfTV9FLm1vdmUoTEVGVCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbmNvbnN0IGNvbnRyb2xzID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XHJcbiAgY2xhc3NOYW1lOiBcInN0YWNrIHN0YWNrLS1hbGlnbi1jZW50ZXIgc3RhY2stLXJvdyBzdGFjay0tZ2FwLXgtMlwiLFxyXG4gIGNoaWxkcmVuOiBbXHJcbiAgICBzb3VuZEJ1dHRvbixcclxuICAgIGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1xyXG4gICAgICBjbGFzc05hbWU6IFwiaW5mby1ib3hcIixcclxuICAgICAgY2hpbGRyZW46IFtjcmVhdGVFbGVtZW50KFwic3BhblwiLCB7IHRleHQ6IFwibW92ZXNcIiB9KSwgbW92ZXNDb250cm9sXSxcclxuICAgIH0pLFxyXG4gICAgY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XHJcbiAgICAgIGNsYXNzTmFtZTogXCJpbmZvLWJveFwiLFxyXG4gICAgICBjaGlsZHJlbjogW2NyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHsgdGV4dDogXCJ0aW1lXCIgfSksIHRpbWVDb250cm9sXSxcclxuICAgIH0pLFxyXG4gICAgc2V0dGluZ3NCdXR0b24sXHJcbiAgXSxcclxufSk7XHJcblxyXG5jb25zdCBpbmZvID0gY3JlYXRlRWxlbWVudChcImgyXCIsIHtcclxuICBjbGFzc05hbWU6IFwiaW5mby10ZXh0XCIsXHJcbiAgaHRtbDpcclxuICAgIFwiVG8gbW92ZSBhIHRpbGUgeW91IGNhbiA8Yj5jbGljazwvYj4gb24gaXQgb3IgdXNlIHlvdXIgPGI+YXJyb3cga2V5czwvYj4uIFByZXNzIDxiPkVTQzwvYj4gdG8gcGF1c2UgZ2FtZS5cIixcclxufSk7XHJcblxyXG5jb25zdCBhcHAgPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcclxuICBjbGFzc05hbWU6IFwiYXBwXCIsXHJcbiAgY2hpbGRyZW46IFt0aXRsZSwgY29udHJvbHMsIGJvYXJkLCBpbmZvXSxcclxufSk7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZSkgPT4ge1xyXG4gIHN3aXRjaCAoZS5jb2RlKSB7XHJcbiAgICBjYXNlIFwiRXNjYXBlXCI6IHtcclxuICAgICAgR19BX01fRS5wbGF5cGF1c2UoKTtcclxuICAgICAgYm9hcmQuZm9jdXMoKTtcclxuICAgIH1cclxuICB9XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuYm9keS5hcHBlbmQoYXBwKTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9