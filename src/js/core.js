import moveSound from '../audio/zvuk.mp3';

export const RIGHT = { dx: 0, dy: -1 };
export const LEFT = { dx: 0, dy: 1 };
export const UP = { dx: 1, dy: 0 };
export const DOWN = { dx: -1, dy: 0 };

export const MOVE_EVENT = "--move";
export const MOVE_COUNTER_EVENT = "--count";
export const START_EVENT = "--start";
export const PLAY_PAUSE_EVENT = "--playpause";
export const SOLVED_EVENT = "--solved";
export const TIMECHANGE_EVENT = "--timechange";

const audio = new Audio();

audio.src = moveSound;
audio.load();


export const createGame = (size = 4) => {
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
