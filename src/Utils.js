import {Chess} from "chess.js";

export function historyToFen(history) {
    const game = new Chess();
    history.forEach(move => game.move(move));
    return game.fen()
}

export function fenToHistory(fen) {
    const game = new Chess();
    game.load(fen);
    return game.history();
}

export function computeSquareLocation(square, boardWidth) { //TODO black pieces perspective
    const files = {'a':0, 'b':1, 'c':2, 'd':3, 'e':4, 'f':5, 'g':6, 'h':7}
    const ranks = {'1':7, '2':6, '3':5, '4':4, '5':3, '6':2, '7':1, '8':0}
    let x = files[square[0]];
    let y = ranks[square[1]];
    // return {'top':0, 'left':0};
    return {'top':boardWidth / 8 * (y-0.2), 'left':boardWidth / 8 * (x+1.1) };

}
export function findSquare(move, moveIndex) {
    let specialCases = {};
    if (moveIndex % 2 == 0) {
        specialCases = {'O-O':'g1', 'O-O-O':'c1'};
    } else {
        specialCases = {'O-O':'g8', 'O-O-O':'c8'};
    }
    if (move in specialCases) {
        return specialCases[move];
    }
    const match = move.match(/([a-h][1-8])(?:[+#]?)$/);
    return match ? match[1] : "";
}


export function findMoveType(delta) {
    console.log("finding move for delta", delta)
    const moveDeltas = [['best', 0.05], ['excellent', 0.1], ['good', 0.2], ['inaccuracy',0.4], ['mistake', 1.0], ['blunder', 10]];
    for (let i = 0; i < moveDeltas.length; i++) {
        let d = moveDeltas[i];
        if (delta < d[1]) {
            console.log(d[0])
            return d[0];
        }
    }
    console.log('blunder')
    return 'blunder';
}

export function isValidPgn(input) {
    try {
        new Chess().loadPgn(input);
        return true; 
    } catch (error) {
        return false;
    }
}
