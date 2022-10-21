const createTile = ({ idx, name }) => {
  return {
    idx,
    name,
  };
};

export const createGame = (size, onStateChange) => {
  const matrix = Array.from({ length: size }, (_, i) => {
    return Array.from({ length: size }, (_, j) =>
      createTile({
        idx: i * size + j,
        name: i * size + j + 1,
      })
    );
  });

  const empty = matrix.at(-1).at(-1);

  const canMove = ([x1, y1], [x2, y2]) => {
    return (
      (Math.abs(x1 - x2) === 1 || Math.abs(y1 - y2) === 1) &&
      (x1 === x2 || y1 === y2)
    );
  };

  const findCoords = (idx) => {
    for (let x = 0; x < matrix.length; x++) {
      for (let y = 0; y < matrix[x].length; y++) {
        if (matrix[x][y].idx === idx) return [x, y];
      }
    }
  };

  const swap = ([x1, y1], [x2, y2]) => {
    [matrix[x1][y1], matrix[x2][y2]] = [matrix[x2][y2], matrix[x1][y1]];
  };

  const shuffle = (fn) => {
    const neighbors = [
      [0, -1],
      [1, 0],
      [0, 1],
      [-1, 0],
    ];

    let [ex, ey] = findCoords(empty.idx);

    for (let i = 0; i < 100; i++) {
      const [dx, dy] = neighbors[Math.floor(Math.random() * neighbors.length)];
      const [nx, ny] = [ex + dx, ey + dy];

      if (matrix[nx]?.[ny]) {
        fn(matrix[nx][ny].idx, [ex, ey]);
        swap([nx, ny], [ex, ey]);
        [ex, ey] = [nx, ny];
      }
    }
  };

  const info = new Proxy(
    {
      moves: 0,
      duration: 0,
      isPaused: false,
      isSolved: false,
    },
    {
      set(target, prop, val, receiver) {
        onStateChange(target);
        return Reflect.set(target, prop, val, receiver);
      },
    }
  );

  const isSolved = (matrix) => {
    return matrix.every((row, x) =>
      row.every(({ idx }, y) => idx === x * size + y)
    );
  };

  return {
    matrix,
    empty,
    move(idx, fn) {
      const pair1 = findCoords(idx);
      const pair2 = findCoords(empty.idx);

      if (canMove(pair1, pair2)) {
        swap(pair1, pair2);

        info.moves++;

        fn(pair2, {
          dx: pair2[0] - pair1[0],
          dy: pair2[1] - pair1[1],
        });
      }
    },
    start(fn) {
      shuffle(fn);
      setInterval(() => {
        if (info.isPaused) return;
        info.duration++;
      }, 1000);
    },
    playpause() {
      info.isPaused = !info.isPaused;
    },
  };
};
