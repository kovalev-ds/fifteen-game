

const MATRIX_SIZE = 4;

const createTile = (n) => {
    return {
        title: n
    }
}


const createGame = (size) => {

    const matrix = Array.from({ length: size }, (_, i) => { return Array.from({ length: size }, (_, j) => createTile(i * size + j)) })

    return {
        matrix,
        moves: 10,
        duration: 120,
        shufle() {

        },
        start() {
            // start timer
            // count moves
        },
    }
}

console.log(createGame(MATRIX_SIZE));